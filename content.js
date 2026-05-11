// Content script for detecting login forms and password saving
class PasswordManager {
    constructor() {
        this.init();
    }

    init() {
        // Monitor form submissions
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Monitor input changes for password fields
        document.addEventListener('input', this.handleInputChange.bind(this));
        
        // Monitor focus for password/username fields
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        
        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'triggerAutoFill') {
                this.checkForExistingPasswords(true);
            } else if (message.action === 'autoFill') {
                this.autoFill(message.data.username, 0);
            }
        });

        // Check for existing passwords on page load
        this.checkForExistingPasswords();
    }

    handleFocusIn(event) {
        const target = event.target;
        if (target.type === 'password' || target.type === 'email' || target.type === 'text') {
            const form = target.closest('form');
            if (form && (target.type === 'password' || this.isLoginField(target))) {
                this.showFieldPopup(target);
            }
        }
    }

    isLoginField(field) {
        const loginIndicators = ['user', 'email', 'login', 'account'];
        const name = (field.name || '').toLowerCase();
        const id = (field.id || '').toLowerCase();
        const placeholder = (field.placeholder || '').toLowerCase();
        
        return loginIndicators.some(indicator => 
            name.includes(indicator) || id.includes(indicator) || placeholder.includes(indicator)
        );
    }

    async showFieldPopup(field) {
        // Remove existing field popup if any
        const existing = document.getElementById('centil-field-popup');
        if (existing) existing.remove();

        try {
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    action: 'getPasswords',
                    data: { url: window.location.hostname }
                }, (response) => {
                    if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                    else resolve(response);
                });
            });
            
            if (!response.passwords || response.passwords.length === 0) return;

            const popup = document.createElement('div');
            popup.id = 'centil-field-popup';
            
            const rect = field.getBoundingClientRect();
            popup.style.cssText = `
                position: absolute;
                top: ${rect.bottom + window.scrollY + 5}px;
                left: ${rect.left + window.scrollX}px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 2147483647;
                width: ${Math.max(rect.width, 200)}px;
                padding: 4px;
                font-family: 'Inter', sans-serif;
            `;

            popup.innerHTML = `
                <div style="padding: 6px 10px; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; margin-bottom: 4px;">
                    Centil - Kayıtlı Şifreler
                </div>
                ${result.passwords.map((pwd, index) => `
                    <div class="centil-popup-item" style="padding: 8px 10px; cursor: pointer; border-radius: 4px; transition: background 0.2s; display: flex; align-items: center; gap: 8px;" data-username="${pwd.username}" data-index="${index}">
                        <div style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">C</div>
                        <div style="flex: 1;">
                            <div style="font-size: 13px; font-weight: 500; color: #1e293b;">${pwd.username}</div>
                        </div>
                    </div>
                `).join('')}
            `;

            document.body.appendChild(popup);

            // Add hover effect with JS because we're in content script
            const items = popup.querySelectorAll('.centil-popup-item');
            items.forEach(item => {
                item.onmouseover = () => item.style.background = '#f1f5f9';
                item.onmouseout = () => item.style.background = 'transparent';
                item.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.autoFill(item.dataset.username, parseInt(item.dataset.index));
                    popup.remove();
                };
            });

            // Close popup when clicking elsewhere
            const closePopup = (e) => {
                if (!popup.contains(e.target) && e.target !== field) {
                    popup.remove();
                    document.removeEventListener('click', closePopup);
                }
            };
            setTimeout(() => document.addEventListener('click', closePopup), 10);

        } catch (error) {
            console.error('Centil popup error:', error);
        }
    }

    handleInputChange(event) {
        if (event.target.type === 'password') {
            const form = event.target.closest('form');
            if (form) {
                const usernameField = this.findUsernameField(form);
                if (usernameField && usernameField.value && event.target.value) {
                    // Store credentials temporarily
                    this.tempCredentials = {
                        username: usernameField.value,
                        password: event.target.value,
                        form: form
                    };
                }
            }
        }
    }

    handleFormSubmit(event) {
        const form = event.target;
        const passwordField = form.querySelector('input[type="password"]');
        
        if (passwordField && this.tempCredentials) {
            event.preventDefault();
            
            // Ask user if they want to save the password
            this.showSavePasswordDialog();
        }
    }

    findUsernameField(form) {
        // Common selectors for username/email fields
        const selectors = [
            'input[type="email"]',
            'input[type="text"]',
            'input[name*="user"]',
            'input[name*="email"]',
            'input[name*="login"]',
            'input[id*="user"]',
            'input[id*="email"]',
            'input[id*="login"]',
            'input[placeholder*="email"]',
            'input[placeholder*="user"]',
            'input[placeholder*="login"]'
        ];

        for (const selector of selectors) {
            const field = form.querySelector(selector);
            if (field && field !== form.querySelector('input[type="password"]')) {
                return field;
            }
        }
        return null;
    }

    showSavePasswordDialog() {
        // Create modal dialog
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
        `;

        dialog.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">Şifreyi Kaydet</h3>
            <p style="margin: 0 0 20px 0; color: #666;">
                ${window.location.hostname} için bu şifreyi kaydetmek istiyor musunuz?
            </p>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="cancel-save" style="
                    padding: 8px 16px;
                    border: 1px solid #ccc;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                ">Vazgeç</button>
                <button id="confirm-save" style="
                    padding: 8px 16px;
                    background: #007cba;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Kaydet</button>
            </div>
        `;

        modal.appendChild(dialog);
        document.body.appendChild(modal);

        // Handle button clicks
        document.getElementById('cancel-save').onclick = () => {
            document.body.removeChild(modal);
            this.tempCredentials.form.submit();
        };

        document.getElementById('confirm-save').onclick = () => {
            this.savePassword();
            document.body.removeChild(modal);
            this.tempCredentials.form.submit();
        };
    }

    async savePassword() {
        try {
            const response = await fetch('http://localhost:5000/api/save-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site_url: window.location.href,
                    site_name: window.location.hostname,
                    username: this.tempCredentials.username,
                    password: this.tempCredentials.password
                })
            });

            const result = await response.json();
            if (result.success) {
                this.showNotification('Şifre başarıyla kaydedildi!', 'success');
            } else {
                this.showNotification('Şifre kaydedilemedi: ' + result.error, 'error');
            }
        } catch (error) {
            this.showNotification('Hata: ' + error.message, 'error');
        }
    }

    async checkForExistingPasswords(isManualTrigger = false) {
        try {
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    action: 'getPasswords',
                    data: { url: window.location.hostname }
                }, (response) => {
                    if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                    else resolve(response);
                });
            });
            
            if (response.passwords && response.passwords.length > 0) {
                if (isManualTrigger) {
                    // If manually triggered (shortcut), fill the first one
                    this.autoFill(response.passwords[0].username, 0);
                } else {
                    this.showAutoFillOption(response.passwords);
                }
            } else if (isManualTrigger) {
                this.showNotification('Bu site için kayıtlı şifre bulunamadı.', 'info');
            }
        } catch (error) {
            console.log('Password check failed:', error);
        }
    }

    showAutoFillOption(passwords) {
        // Create auto-fill notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007cba;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 300px;
        `;

        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">
                Kayıtlı Şifreler (${passwords.length})
            </div>
            ${passwords.map((pwd, index) => `
                <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer;" 
                     onclick="window.passwordManager.autoFill('${pwd.username}', ${index})">
                    ${pwd.username}
                </div>
            `).join('')}
            <div style="margin-top: 10px; font-size: 12px; cursor: pointer;" onclick="this.parentElement.remove()">
                Kapat
            </div>
        `;

        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 10000);
    }

    async autoFill(username, index) {
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            const passwordField = form.querySelector('input[type="password"]');
            const usernameField = this.findUsernameField(form);
            
            if (passwordField && usernameField) {
                try {
                    // Send message to background to fetch decrypted password
                    const response = await new Promise((resolve, reject) => {
                        chrome.runtime.sendMessage({
                            action: 'getPasswords',
                            data: { url: window.location.hostname, includePassword: true }
                        }, (response) => {
                            if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                            else resolve(response);
                        });
                    });
                    
                    if (response.passwords && response.passwords[index]) {
                        usernameField.value = username;
                        passwordField.value = response.passwords[index].password;
                        passwordField.focus();
                        this.showNotification('Giriş bilgileri otomatik dolduruldu.', 'success');
                    }
                } catch (error) {
                    console.error('Auto-fill failed:', error);
                    this.showNotification('Otomatik doldurma hatası!', 'error');
                }
                break;
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 14px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize the password manager
window.passwordManager = new PasswordManager();
