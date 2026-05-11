from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import secrets
from datetime import datetime
import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64

app = Flask(__name__)
CORS(app)

# Encryption Helpers
def derive_key(master_password, salt):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt.encode() if isinstance(salt, str) else salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(master_password.encode())

def encrypt_data(data, master_password):
    salt = os.urandom(16)
    key = derive_key(master_password, salt)
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(data.encode()) + encryptor.finalize()
    
    # Return everything needed to decrypt as a single string
    return {
        'encrypted': base64.b64encode(encrypted_data).decode('utf-8'),
        'salt': base64.b64encode(salt).decode('utf-8'),
        'iv': base64.b64encode(iv).decode('utf-8')
    }

def decrypt_data(encrypted_data_b64, salt_b64, iv_b64, master_password):
    try:
        salt = base64.b64decode(salt_b64)
        iv = base64.b64decode(iv_b64)
        encrypted_data = base64.b64decode(encrypted_data_b64)
        
        key = derive_key(master_password, salt)
        cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()
        return decrypted_data.decode('utf-8')
    except Exception as e:
        print(f"Decryption error: {e}")
        return None

# Database setup - Merkezi dosya yolu
def get_db_path():
    # Kullanıcının belgeler klasöründe 'Centil' klasörü oluştur
    home = os.path.expanduser("~")
    base_dir = os.path.join(home, "Documents", "Centil")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
    return os.path.join(base_dir, "passwords.db")

DB_PATH = get_db_path()

def init_db():
    print(f"Veritabanı kontrol ediliyor: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site_url TEXT NOT NULL,
            site_name TEXT NOT NULL,
            username TEXT NOT NULL,
            encrypted_password TEXT NOT NULL,
            salt TEXT NOT NULL,
            iv TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            question TEXT NOT NULL,
            answer_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            master_password_hash TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/save-password', methods=['POST'])
def save_password():
    try:
        data = request.json
        site_url = data.get('site_url')
        site_name = data.get('site_name')
        username = data.get('username')
        password = data.get('password')
        master_password = data.get('master_password', 'default_master')
        
        if not all([site_url, site_name, username, password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        encryption_result = encrypt_data(password, master_password)
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO passwords (site_url, site_name, username, encrypted_password, salt, iv)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (site_url, site_name, username, encryption_result['encrypted'], encryption_result['salt'], encryption_result['iv']))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Password saved successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-passwords', methods=['GET'])
def get_passwords():
    try:
        site_url = request.args.get('site_url')
        master_password = request.args.get('master_password', 'default_master')
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        if site_url:
            cursor.execute('''
                SELECT site_name, username, created_at, encrypted_password, salt, iv, id FROM passwords 
                WHERE site_url LIKE ? ORDER BY created_at DESC
            ''', (f'%{site_url}%',))
        else:
            cursor.execute('''
                SELECT site_url, site_name, username, created_at, encrypted_password, salt, iv, id FROM passwords 
                ORDER BY created_at DESC
            ''')
        
        results = cursor.fetchall()
        conn.close()
        
        passwords = []
        for row in results:
            if site_url:
                decrypted = decrypt_data(row[3], row[4], row[5], master_password)
                passwords.append({
                    'site_name': row[0],
                    'username': row[1],
                    'created_at': row[2],
                    'password': decrypted,
                    'id': row[6]
                })
            else:
                passwords.append({
                    'site_url': row[0],
                    'site_name': row[1],
                    'username': row[2],
                    'created_at': row[3],
                    'has_password': True, # Don't decrypt all at once for list view
                    'id': row[7]
                })
        
        return jsonify({'passwords': passwords})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/setup-status', methods=['GET'])
def setup_status():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if master user exists
        cursor.execute('SELECT COUNT(*) FROM users')
        user_count = cursor.fetchone()[0]
        
        # Check if security questions exist
        cursor.execute('SELECT COUNT(*) FROM security_questions')
        questions_count = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'is_setup_complete': user_count > 0 and questions_count >= 3,
            'has_master_password': user_count > 0,
            'has_security_questions': questions_count >= 3
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/setup-master-password', methods=['POST'])
def setup_master_password():
    try:
        data = request.json
        master_password = data.get('master_password')
        
        if not master_password or len(master_password) < 8:
            return jsonify({'error': 'Şifre en az 8 karakter olmalıdır'}), 400
            
        master_password_hash = hashlib.sha256(master_password.encode()).hexdigest()
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('INSERT OR REPLACE INTO users (id, master_password_hash) VALUES (?, ?)', ('default_user', master_password_hash))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    try:
        data = request.json
        site_url = data.get('site_url')
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT COUNT(*) FROM passwords WHERE site_url LIKE ?
        ''', (f'%{site_url}%',))
        
        count = cursor.fetchone()[0]
        conn.close()
        
        return jsonify({'has_passwords': count > 0, 'count': count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/setup-security-questions', methods=['POST'])
def setup_security_questions():
    try:
        data = request.json
        user_id = data.get('user_id', 'default_user')
        questions = data.get('questions', [])
        
        if not questions or len(questions) < 3:
            return jsonify({'error': 'En az 3 güvenlik sorusu gereklidir'}), 400
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Delete existing questions for this user
        cursor.execute('DELETE FROM security_questions WHERE user_id = ?', (user_id,))
        
        # Insert new questions
        for q in questions:
            question = q.get('question')
            answer = q.get('answer')
            if question and answer:
                answer_hash = hashlib.sha256(answer.encode()).hexdigest()
                cursor.execute('''
                    INSERT INTO security_questions (user_id, question, answer_hash)
                    VALUES (?, ?, ?)
                ''', (user_id, question, answer_hash))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Güvenlik soruları ayarlandı'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-security-questions', methods=['POST'])
def verify_security_questions():
    try:
        data = request.json
        user_id = data.get('user_id', 'default_user')
        answers = data.get('answers', [])
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        correct_answers = 0
        for answer_data in answers:
            question_id = answer_data.get('question_id')
            answer = answer_data.get('answer')
            
            cursor.execute('''
                SELECT answer_hash FROM security_questions 
                WHERE id = ? AND user_id = ?
            ''', (question_id, user_id))
            
            result = cursor.fetchone()
            if result:
                stored_hash = result[0]
                provided_hash = hashlib.sha256(answer.encode()).hexdigest()
                if stored_hash == provided_hash:
                    correct_answers += 1
        
        conn.close()
        
        if correct_answers >= 2:  # Require at least 2 correct answers
            return jsonify({'success': True, 'message': 'Doğrulama başarılı'})
        else:
            return jsonify({'success': False, 'message': 'Yeterli doğru cevap verilmedi'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-security-questions', methods=['GET'])
def get_security_questions():
    try:
        user_id = request.args.get('user_id', 'default_user')
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, question FROM security_questions 
            WHERE user_id = ? ORDER BY id
        ''', (user_id,))
        
        results = cursor.fetchall()
        conn.close()
        
        questions = [{'id': row[0], 'question': row[1]} for row in results]
        
        return jsonify({'questions': questions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recover-passwords', methods=['POST'])
def recover_passwords():
    try:
        data = request.json
        user_id = data.get('user_id', 'default_user')
        new_master_password = data.get('new_master_password')
        
        if not new_master_password:
            return jsonify({'error': 'Yeni ana şifre gereklidir'}), 400
        
        # In a real implementation, you would re-encrypt all passwords with the new master password
        # For now, we'll just update the master password hash
        master_password_hash = hashlib.sha256(new_master_password.encode()).hexdigest()
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Update or create user record
        cursor.execute('''
            INSERT OR REPLACE INTO users (id, master_password_hash)
            VALUES (?, ?)
        ''', (user_id, master_password_hash))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Şifre kurtarma başarılı'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-master-password', methods=['POST'])
def verify_master_password():
    try:
        data = request.json
        master_password = data.get('master_password')
        
        if not master_password:
            return jsonify({'success': False, 'error': 'Şifre gereklidir'}), 400
            
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT master_password_hash FROM users WHERE id = ?', ('default_user',))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            stored_hash = result[0]
            provided_hash = hashlib.sha256(master_password.encode()).hexdigest()
            if stored_hash == provided_hash:
                return jsonify({'success': True})
        
        return jsonify({'success': False, 'error': 'Hatalı şifre'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/update-password', methods=['POST'])
def update_password():
    try:
        data = request.json
        password_id = data.get('id')
        site_name = data.get('site_name')
        username = data.get('username')
        password = data.get('password')
        master_password = data.get('master_password', 'default_master')

        if not all([password_id, site_name, username, password]):
            return jsonify({'error': 'Missing required fields'}), 400

        encryption_result = encrypt_data(password, master_password)

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Eğer password_id bir string ise (JS index gibi), site ve username'e göre bulmaya çalışabiliriz
        # Ama en iyisi gerçek database ID'sini kullanmak. 
        # Mevcut veritabanı yapısında 'id' INTEGER PRIMARY KEY.
        
        cursor.execute('''
            UPDATE passwords 
            SET site_name = ?, username = ?, encrypted_password = ?, salt = ?, iv = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? OR (site_name = ? AND username = ?)
        ''', (site_name, username, encryption_result['encrypted'], encryption_result['salt'], encryption_result['iv'], 
              password_id, site_name, username))
        
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Password updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
