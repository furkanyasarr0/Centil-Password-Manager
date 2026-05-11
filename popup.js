class PopupManager {
    constructor() {
        this.currentTab = null;
        this.passwords = [];
        this.currentLang = 'tr';
        this.translations = {
            tr: {
                setup_title: 'Centil Kurulum',
                step_1_of_2: 'Aşama 1 / 2',
                create_master_pass: 'Ana Şifre Oluşturun',
                master_pass_desc: 'Verilerinizi koruyacak ana anahtardır. Lütfen güvenli bir şifre seçin.',
                new_master_pass: 'Yeni Ana Şifre',
                confirm_pass: 'Şifre Tekrar',
                continue: 'Devam Et ➔',
                step_2_of_2: 'Aşama 2 / 2',
                security_questions: 'Güvenlik Soruları',
                security_questions_desc: 'Şifrenizi unutursanız hesabınızı kurtarmak için kullanılacaktır.',
                finish_setup: 'Kurulumu Tamamla ✓',
                login_title: 'Giriş Yap',
                vault_locked: 'Kasa Kilitli',
                login_desc: 'Devam etmek için lütfen ana şifrenizi girin.',
                master_pass: 'Ana Şifre',
                unlock: 'Kilidi Aç 🔓',
                forgot_pass: 'Şifremi Unuttum',
                recovery_title: 'Kurtarma',
                password_recovery: 'Şifre Kurtarma',
                recovery_desc: 'Hesabınızı kurtarmak için güvenlik sorularını yanıtlayın.',
                verify_answers: 'Yanıtları Doğrula',
                back: 'Geri Dön',
                current_site: 'Şu Anki Site',
                add_password: 'Şifre Ekle',
                scan_site: 'Siteyi Tara',
                search_placeholder: 'Şifrelerde ara...',
                recovery_btn: '🛡️ Kurtarma',
                version: 'Centil Password Manager v1.0',
                new_password_title: 'Yeni Şifre Ekle',
                edit_password_title: 'Şifreyi Düzenle',
                site_name: 'Site Adı',
                username: 'Kullanıcı Adı',
                password: 'Şifre',
                cancel: 'İptal',
                save: 'Kaydet',
                update_security_questions: 'Güvenlik Sorularını Güncelle',
                verify_to_change: 'Güvenlik sorularını değiştirmek için ana şifrenizi girin.',
                verify: 'Doğrula',
                set_new_questions: 'Yeni güvenlik sorularınızı ve yanıtlarınızı belirleyin.',
                update: 'Güncelle',
                select_question: 'Soru seçin...',
                answer_placeholder: 'Cevabınız',
                error_all_fields: 'Tüm alanları doldurun',
                error_min_pass: 'Şifre en az 8 karakter olmalıdır',
                error_pass_mismatch: 'Şifreler eşleşmiyor',
                error_3_questions: 'Lütfen 3 soruyu da yanıtlayın',
                success_saved: 'Şifre başarıyla kaydedildi',
                success_updated: 'Şifre güncellendi',
                success_verified: 'Sorular doğrulandı!',
                error_wrong_answers: 'Yanıtlar hatalı!',
                lock_confirm: 'Eklentiyi kilitlemek istiyor musunuz?',
                no_passwords: 'Kayıtlı şifre bulunamadı',
                auto_filling: 'Şifre otomatik dolduruluyor...',
                copy_success: 'Şifre kopyalandı!',
                app_name: 'Centil Password Manager',
                app_desc: 'Güvenli ve açık kaynaklı şifre yöneticisi.',
                version_label: 'Versiyon:',
                github_label: 'GitHub:',
                view_repo: "Repo'yu Görüntüle",
                close: 'Kapat'
            },
            en: {
                setup_title: 'Centil Setup',
                step_1_of_2: 'Step 1 / 2',
                create_master_pass: 'Create Master Password',
                master_pass_desc: 'This is the master key that protects your data. Please choose a secure password.',
                new_master_pass: 'New Master Password',
                confirm_pass: 'Confirm Password',
                continue: 'Continue ➔',
                step_2_of_2: 'Step 2 / 2',
                security_questions: 'Security Questions',
                security_questions_desc: 'These will be used to recover your account if you forget your password.',
                finish_setup: 'Finish Setup ✓',
                login_title: 'Login',
                vault_locked: 'Vault Locked',
                login_desc: 'Please enter your master password to continue.',
                master_pass: 'Master Password',
                unlock: 'Unlock 🔓',
                forgot_pass: 'Forgot Password',
                recovery_title: 'Recovery',
                password_recovery: 'Password Recovery',
                recovery_desc: 'Answer security questions to recover your account.',
                verify_answers: 'Verify Answers',
                back: 'Back',
                current_site: 'Current Site',
                add_password: 'Add Password',
                scan_site: 'Scan Site',
                search_placeholder: 'Search passwords...',
                recovery_btn: '🛡️ Recovery',
                version: 'Centil Password Manager v1.0',
                new_password_title: 'Add New Password',
                edit_password_title: 'Edit Password',
                site_name: 'Site Name',
                username: 'Username',
                password: 'Password',
                cancel: 'Cancel',
                save: 'Save',
                update_security_questions: 'Update Security Questions',
                verify_to_change: 'Enter your master password to change security questions.',
                verify: 'Verify',
                set_new_questions: 'Set your new security questions and answers.',
                update: 'Update',
                select_question: 'Select a question...',
                answer_placeholder: 'Your answer',
                error_all_fields: 'Please fill all fields',
                error_min_pass: 'Password must be at least 8 characters',
                error_pass_mismatch: 'Passwords do not match',
                error_3_questions: 'Please answer all 3 questions',
                success_saved: 'Password saved successfully',
                success_updated: 'Password updated',
                success_verified: 'Questions verified!',
                error_wrong_answers: 'Wrong answers!',
                lock_confirm: 'Do you want to lock the vault?',
                no_passwords: 'No passwords found',
                auto_filling: 'Auto-filling password...',
                copy_success: 'Password copied!',
                app_name: 'Centil Password Manager',
                app_desc: 'Secure and open source password manager.',
                version_label: 'Version:',
                github_label: 'GitHub:',
                view_repo: 'View Repo',
                close: 'Close'
            }
        };
        this.init();
    }

    async init() {
        // Load language preference
        const { lang } = await chrome.storage.local.get(['lang']);
        this.currentLang = lang || 'tr';
        this.applyTranslations();

        // Check setup status first
        await this.checkSetupStatus();
        
        // Get current tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        this.currentTab = tabs[0];
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial data
        await this.loadCurrentSiteInfo();
        await this.loadAllPasswords();
    }

    applyTranslations() {
        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[this.currentLang][key]) {
                if (el.tagName === 'INPUT') {
                    el.placeholder = this.translations[this.currentLang][key];
                } else {
                    el.textContent = this.translations[this.currentLang][key];
                }
            }
        });
        
        // Update all language button texts
        document.querySelectorAll('#lang-switch-btn').forEach(btn => {
            btn.textContent = this.currentLang === 'tr' ? 'EN' : 'TR';
        });
    }

    async switchLanguage() {
        this.currentLang = this.currentLang === 'tr' ? 'en' : 'tr';
        await chrome.storage.local.set({ lang: this.currentLang });
        this.applyTranslations();
        // UI listelerini tekrar yükle ki dinamik içerikler de çevrilsin
        if (this.passwords.length > 0) this.displayPasswords(this.passwords);
        await this.loadCurrentSiteInfo();
    }

    async checkSetupStatus() {
        try {
            const response = await fetch('http://localhost:5000/api/setup-status');
            const data = await response.json();
            
            if (data.is_setup_complete) {
                // Check if session is locked
                const { isLocked } = await chrome.storage.local.get(['isLocked']);
                if (isLocked) {
                    this.showLoginView();
                } else {
                    document.getElementById('main-view').style.display = 'block';
                    document.getElementById('setup-view').style.display = 'none';
                    document.getElementById('login-view').style.display = 'none';
                }
            } else {
                document.getElementById('main-view').style.display = 'none';
                document.getElementById('setup-view').style.display = 'block';
                document.getElementById('login-view').style.display = 'none';
                this.initSetupWizard(data);
            }
        } catch (error) {
            console.error('Setup status check failed:', error);
            document.getElementById('main-view').style.display = 'block';
        }
    }

    showLoginView() {
        document.getElementById('main-view').style.display = 'none';
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('login-view').style.display = 'block';
        
        const loginSubmit = document.getElementById('login-submit');
        const loginPassword = document.getElementById('login-password');
        const forgotBtn = document.getElementById('forgot-password-btn');
        
        forgotBtn.onclick = () => this.showRecoveryView();

        loginSubmit.onclick = async () => {
            const pass = loginPassword.value;
            if (!pass) return;
            
            try {
                const response = await fetch('http://localhost:5000/api/verify-master-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ master_password: pass })
                });
                const result = await response.json();
                
                if (result.success) {
                    await chrome.storage.local.set({ isLocked: false, sessionPassword: pass });
                    this.showSuccess('Hoş geldiniz!');
                    location.reload();
                } else {
                    this.showError('Hatalı ana şifre!');
                }
            } catch (e) {
                this.showError('Giriş hatası');
            }
        };
    }

    async showRecoveryView() {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('recovery-view').style.display = 'block';
        
        const container = document.getElementById('recovery-questions-container');
        const submitBtn = document.getElementById('recovery-submit');
        const backBtn = document.getElementById('recovery-back');
        const newPassContainer = document.getElementById('new-password-container');
        
        backBtn.onclick = () => {
            document.getElementById('recovery-view').style.display = 'none';
            document.getElementById('login-view').style.display = 'block';
        };

        try {
            const response = await fetch('http://localhost:5000/api/get-security-questions');
            const data = await response.json();
            
            if (data.questions) {
                container.innerHTML = data.questions.map(q => `
                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 4px;">${q.question}</label>
                        <input type="text" id="recovery-ans-${q.id}" class="recovery-answer" placeholder="Yanıtınız" style="width: 100%;">
                    </div>
                `).join('');
                
                let isVerified = false;
                
                submitBtn.onclick = async () => {
                    if (!isVerified) {
                        const answers = data.questions.map(q => ({
                            question_id: q.id,
                            answer: document.getElementById(`recovery-ans-${q.id}`).value.trim()
                        }));
                        
                        const verifyRes = await fetch('http://localhost:5000/api/verify-security-questions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ answers })
                        });
                        const verifyData = await verifyRes.json();
                        
                        if (verifyData.success) {
                            isVerified = true;
                            container.style.display = 'none';
                            newPassContainer.style.display = 'block';
                            submitBtn.textContent = 'Şifreyi Güncelle';
                            this.showSuccess('Sorular doğrulandı!');
                        } else {
                            this.showError('Yanıtlar hatalı!');
                        }
                    } else {
                        const newPass = document.getElementById('recovery-new-password').value;
                        const confirmPass = document.getElementById('recovery-new-password-confirm').value;
                        
                        if (newPass.length < 8) {
                            this.showError('Şifre en az 8 karakter olmalıdır');
                            return;
                        }
                        if (newPass !== confirmPass) {
                            this.showError('Şifreler eşleşmiyor');
                            return;
                        }
                        
                        const recoverRes = await fetch('http://localhost:5000/api/recover-passwords', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ new_master_password: newPass })
                        });
                        const recoverData = await recoverRes.json();
                        
                        if (recoverData.success) {
                            await chrome.storage.local.set({ isLocked: false, sessionPassword: newPass });
                            this.showSuccess('Şifre güncellendi. Giriş yapıldı.');
                            setTimeout(() => location.reload(), 1000);
                        } else {
                            this.showError(recoverData.error);
                        }
                    }
                };
            }
        } catch (e) {
            this.showError('Kurtarma bilgileri alınamadı');
        }
    }
    initSetupWizard(status) {
        if (!status.has_master_password) {
            document.getElementById('setup-step-1').style.display = 'block';
            document.getElementById('setup-step-2').style.display = 'none';
            
            document.getElementById('setup-next-1').onclick = async () => {
                const pass = document.getElementById('setup-master-password').value;
                const confirm = document.getElementById('setup-master-password-confirm').value;
                
                if (pass.length < 8) {
                    this.showError('Şifre en az 8 karakter olmalıdır');
                    return;
                }
                if (pass !== confirm) {
                    this.showError('Şifreler eşleşmiyor');
                    return;
                }
                
                try {
                    const response = await fetch('http://localhost:5000/api/setup-master-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ master_password: pass })
                    });
                    const result = await response.json();
                    if (result.success) {
                        this.showSuccess('Ana şifre oluşturuldu');
                        this.showSetupStep2();
                    } else {
                        this.showError(result.error);
                    }
                } catch (e) {
                    this.showError('Hata oluştu');
                }
            };
        } else if (!status.has_security_questions) {
            this.showSetupStep2();
        }
    }

    showSetupStep2() {
        document.getElementById('setup-step-1').style.display = 'none';
        document.getElementById('setup-step-2').style.display = 'block';
        
        const container = document.getElementById('setup-questions-container');
        const predefinedQuestions = [
            'En Sevdiğiniz Oyuncu?',
            'En Sevdiğiniz Şarkıcı?',
            'Okul Numaranız?',
            'İlk evcil hayvanınızın adı neydi?',
            'Doğduğunuz şehir neresidir?'
        ];
        
        container.innerHTML = [0, 1, 2].map(i => `
            <div style="margin-bottom: 12px;">
                <select id="setup-q-${i}" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border); margin-bottom: 5px; font-size: 12px;">
                    <option value="" data-i18n="select_question">${this.translations[this.currentLang].select_question}</option>
                    ${predefinedQuestions.map(q => `<option value="${q}">${q}</option>`).join('')}
                </select>
                <input type="text" id="setup-a-${i}" data-i18n="answer_placeholder" placeholder="${this.translations[this.currentLang].answer_placeholder}" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border); font-size: 12px;">
            </div>
        `).join('');
        
        document.getElementById('setup-finish').onclick = async () => {
            const questions = [];
            for (let i = 0; i < 3; i++) {
                const q = document.getElementById(`setup-q-${i}`).value;
                const a = document.getElementById(`setup-a-${i}`).value.trim();
                if (q && a) questions.push({ question: q, answer: a });
            }
            
            if (questions.length < 3) {
                this.showError('Lütfen 3 soruyu da yanıtlayın');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5000/api/setup-security-questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: 'default_user', questions })
                });
                const result = await response.json();
                if (result.success) {
                    this.showSuccess('Kurulum tamamlandı!');
                    location.reload();
                } else {
                    this.showError(result.error);
                }
            } catch (e) {
                this.showError('Hata oluştu');
            }
        };
    }

    setupEventListeners() {
        // Main View Buttons
        document.getElementById('check-site-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.checkCurrentSite();
        });

        document.getElementById('add-password-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAddPasswordModal();
        });

        document.getElementById('recovery-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRecoveryUpdateDialog();
        });

        document.getElementById('settings-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAbout();
        });

        document.getElementById('lock-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.lockVault();
        });

        document.querySelectorAll('#lang-switch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchLanguage();
            });
        });

        document.getElementById('about-close').addEventListener('click', () => {
            document.getElementById('about-modal').style.display = 'none';
        });

        document.getElementById('recovery-dialog-close').addEventListener('click', () => {
            document.getElementById('recovery-dialog-modal').style.display = 'none';
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterPasswords(e.target.value);
        });

        // Modal Buttons
        document.getElementById('modal-cancel').addEventListener('click', () => {
            this.closeAddPasswordModal();
        });

        document.getElementById('modal-save').addEventListener('click', () => {
            this.addPassword();
        });

        // Close modal on overlay click
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeAddPasswordModal();
            }
        });
    }

    showAddPasswordModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.style.display = 'flex';
        
        if (this.currentTab) {
            try {
                document.getElementById('new-site-name').value = new URL(this.currentTab.url).hostname;
            } catch(e) {}
        }
    }

    closeAddPasswordModal() {
        document.getElementById('modal-overlay').style.display = 'none';
        document.getElementById('new-site-name').value = '';
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
    }

    async addPassword() {
        const siteName = document.getElementById('new-site-name').value;
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;

        if (!siteName || !username || !password) {
            this.showError('Tüm alanları doldurun');
            return;
        }

        try {
            const response = await this.sendMessage({
                action: 'savePassword',
                data: {
                    site_url: this.currentTab ? this.currentTab.url : siteName,
                    site_name: siteName,
                    username: username,
                    password: password,
                    master_password: 'default_master'
                }
            });

            if (response.success) {
                this.showSuccess('Şifre başarıyla kaydedildi');
                this.closeAddPasswordModal();
                await this.loadAllPasswords();
            } else {
                this.showError('Kayıt başarısız: ' + response.error);
            }
        } catch (error) {
            this.showError('Hata: ' + error.message);
        }
    }

    async loadCurrentSiteInfo() {
        if (this.currentTab && this.currentTab.url) {
            try {
                const url = new URL(this.currentTab.url);
                document.getElementById('current-site-name').textContent = url.hostname;
            } catch (error) {
                document.getElementById('current-site-name').textContent = 'Geçersiz URL';
            }
        }
    }

    async loadAllPasswords() {
        try {
            const response = await this.sendMessage({
                action: 'getPasswords',
                data: { url: '' } // Request all passwords
            });

            if (response.passwords) {
                this.passwords = response.passwords;
                this.displayPasswords(this.passwords);
            } else {
                this.showError('Şifreler yüklenemedi: ' + response.error);
            }
        } catch (error) {
            this.showError('Bağlantı hatası: ' + error.message);
        }
    }

    async checkCurrentSite() {
        if (!this.currentTab || !this.currentTab.url) {
            this.showError('Geçerli bir site bulunamadı');
            return;
        }

        try {
            const response = await this.sendMessage({
                action: 'checkSite',
                data: { url: this.currentTab.url }
            });

            if (response.has_passwords) {
                this.showSuccess(`Bu site için ${response.count} kayıtlı şifre bulundu`);
                await this.loadAllPasswords();
            } else {
                this.showInfo('Bu site için kayıtlı şifre bulunamadı');
            }
        } catch (error) {
            this.showError('Kontrol sırasında hata: ' + error.message);
        }
    }

    displayPasswords(passwords) {
        const container = document.getElementById('passwords-list');
        
        if (passwords.length === 0) {
            container.innerHTML = `<div class="no-passwords" data-i18n="no_passwords">${this.translations[this.currentLang].no_passwords}</div>`;
            return;
        }

        container.innerHTML = passwords.map((pwd, index) => `
            <div class="password-item" data-index="${index}">
                <div class="password-info">
                    <div class="site-name">${pwd.site_name || pwd.site_url}</div>
                    <div class="username">${pwd.username}</div>
                    <div class="password-display-inline" style="display: none; font-size: 12px; color: var(--primary); margin-top: 4px; font-weight: 500; font-family: monospace;"></div>
                </div>
                <div class="password-actions">
                    <button class="icon-btn view-btn" title="Şifreyi Gör">
                        👁️
                    </button>
                    <button class="icon-btn copy-btn" title="Kopyala">
                        📋
                    </button>
                    <button class="icon-btn edit-btn" title="Düzenle">
                        ✏️
                    </button>
                </div>
            </div>
        `).join('');

        // Attach event listeners manually instead of using onclick attribute
        container.querySelectorAll('.password-item').forEach((item, index) => {
            const info = item.querySelector('.password-info');
            const viewBtn = item.querySelector('.view-btn');
            const copyBtn = item.querySelector('.copy-btn');
            const editBtn = item.querySelector('.edit-btn');

            info.addEventListener('click', () => this.selectPassword(index));
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePasswordVisibility(index, viewBtn);
            });
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyToClipboard(index);
            });
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEditPasswordModal(index);
            });
        });
    }

    async showEditPasswordModal(index) {
        const pwd = this.passwords[index];
        const overlay = document.getElementById('modal-overlay');
        const title = overlay.querySelector('.site-card-header');
        const saveBtn = document.getElementById('modal-save');
        
        // Modal içeriğini düzenleme moduna göre güncelle
        title.textContent = this.translations[this.currentLang].edit_password_title;
        title.setAttribute('data-i18n', 'edit_password_title');
        document.getElementById('new-site-name').value = pwd.site_name || pwd.site_url;
        document.getElementById('new-username').value = pwd.username;
        
        // Şifreyi getir
        try {
            const response = await this.sendMessage({
                action: 'getPasswords',
                data: { url: pwd.site_url || pwd.site_name, includePassword: true }
            });
            if (response.passwords && response.passwords[0]) {
                document.getElementById('new-password').value = response.passwords[0].password;
            }
        } catch (e) {
            console.error('Şifre getirme hatası:', e);
        }

        overlay.style.display = 'flex';
        
        // Save butonunu güncelle
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        newSaveBtn.addEventListener('click', async () => {
            await this.updatePassword(pwd.id || index); // backend ID kullanmalı
        });
    }

    async updatePassword(oldId) {
        // Backend'de update endpoint'i henüz yoksa eklenmesi gerekecek
        // Şimdilik savePassword mantığıyla benzer ama update işlevi görecek
        const siteName = document.getElementById('new-site-name').value;
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;

        try {
            const response = await this.sendMessage({
                action: 'updatePassword',
                data: {
                    id: oldId,
                    site_name: siteName,
                    username: username,
                    password: password
                }
            });

            if (response.success) {
                this.showSuccess('Şifre güncellendi');
                this.closeAddPasswordModal();
                await this.loadAllPasswords();
            } else {
                this.showError('Güncelleme başarısız: ' + response.error);
            }
        } catch (error) {
            this.showError('Hata: ' + error.message);
        }
    }

    filterPasswords(searchTerm) {
        const filtered = this.passwords.filter(pwd => 
            (pwd.site_name && pwd.site_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (pwd.site_url && pwd.site_url.toLowerCase().includes(searchTerm.toLowerCase())) ||
            pwd.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayPasswords(filtered);
    }

    selectPassword(index) {
        const password = this.passwords[index];
        if (this.currentTab) {
            chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'autoFill',
                data: {
                    username: password.username,
                    siteName: password.site_name || password.site_url
                }
            });
            this.showSuccess('Şifre otomatik dolduruluyor...');
            setTimeout(() => window.close(), 500);
        }
    }

    async sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Runtime message error:', chrome.runtime.lastError);
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (!response) {
                    reject(new Error('No response from background script'));
                } else {
                    resolve(response);
                }
            });
        });
    }

    async togglePasswordVisibility(index, button) {
        const passwordItem = this.passwords[index];
        const siteUrl = passwordItem.site_url || passwordItem.site_name;
        const itemElement = button.closest('.password-item');
        const displayElement = itemElement.querySelector('.password-display-inline');

        try {
            if (button.textContent.includes('👁️')) {
                const response = await this.sendMessage({
                    action: 'getPasswords',
                    data: { url: siteUrl, includePassword: true }
                });
                
                if (response.passwords && response.passwords[0]) {
                    const realPassword = response.passwords[0].password;
                    button.textContent = '🙈';
                    displayElement.textContent = realPassword;
                    displayElement.style.display = 'block';
                }
            } else {
                button.textContent = '👁️';
                displayElement.style.display = 'none';
                displayElement.textContent = '';
            }
        } catch (error) {
            console.error('Toggle visibility error:', error);
            this.showError('Şifre gösterilemedi: ' + error.message);
        }
    }

    async copyToClipboard(index) {
        const passwordItem = this.passwords[index];
        const siteUrl = passwordItem.site_url || passwordItem.site_name;

        try {
            const response = await this.sendMessage({
                action: 'getPasswords',
                data: { url: siteUrl, includePassword: true }
            });
            
            if (response.passwords && response.passwords[0]) {
                const realPassword = response.passwords[0].password;
                await navigator.clipboard.writeText(realPassword);
                this.showSuccess('Şifre kopyalandı!');
            }
        } catch (error) {
            this.showError('Kopyalama hatası: ' + error.message);
        }
    }

    showRecoveryUpdateDialog() {
        const modal = document.getElementById('recovery-dialog-modal');
        const authSection = document.getElementById('recovery-auth-section');
        const updateSection = document.getElementById('recovery-update-section');
        const passwordInput = document.getElementById('recovery-auth-password');
        const authSubmit = document.getElementById('recovery-auth-submit');
        
        passwordInput.value = '';
        authSection.style.display = 'block';
        updateSection.style.display = 'none';
        modal.style.display = 'flex';

        authSubmit.onclick = async () => {
            const pass = passwordInput.value;
            if (!pass) return;

            try {
                const response = await fetch('http://localhost:5000/api/verify-master-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ master_password: pass })
                });
                const result = await response.json();

                if (result.success) {
                    this.showRecoveryQuestionsUpdate();
                } else {
                    this.showError('Hatalı ana şifre!');
                }
            } catch (e) {
                this.showError('Doğrulama hatası');
            }
        };
    }

    showRecoveryQuestionsUpdate() {
        document.getElementById('recovery-auth-section').style.display = 'none';
        document.getElementById('recovery-update-section').style.display = 'block';
        
        const container = document.getElementById('recovery-update-container');
        const saveBtn = document.getElementById('recovery-update-save');
        
        const predefinedQuestions = [
            'En Sevdiğiniz Oyuncu?',
            'En Sevdiğiniz Şarkıcı?',
            'Okul Numaranız?',
            'İlk evcil hayvanınızın adı neydi?',
            'Doğduğunuz şehir neresidir?'
        ];
        
        container.innerHTML = [0, 1, 2].map(i => `
            <div style="margin-bottom: 12px;">
                <select id="update-q-${i}" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border); margin-bottom: 5px; font-size: 12px;">
                    <option value="" data-i18n="select_question">${this.translations[this.currentLang].select_question}</option>
                    ${predefinedQuestions.map(q => `<option value="${q}">${q}</option>`).join('')}
                </select>
                <input type="text" id="update-a-${i}" data-i18n="answer_placeholder" placeholder="${this.translations[this.currentLang].answer_placeholder}" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border); font-size: 12px;">
            </div>
        `).join('');

        saveBtn.onclick = async () => {
            const questions = [];
            for (let i = 0; i < 3; i++) {
                const q = document.getElementById(`update-q-${i}`).value;
                const a = document.getElementById(`update-a-${i}`).value.trim();
                if (q && a) questions.push({ question: q, answer: a });
            }
            
            if (questions.length < 3) {
                this.showError('Lütfen 3 soruyu da yanıtlayın');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5000/api/setup-security-questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: 'default_user', questions })
                });
                const result = await response.json();
                if (result.success) {
                    this.showSuccess('Güvenlik soruları güncellendi!');
                    document.getElementById('recovery-dialog-modal').style.display = 'none';
                } else {
                    this.showError(result.error);
                }
            } catch (e) {
                this.showError('Hata oluştu');
            }
        };
    }

    showRecoveryDialog() {
        this.showInfo('Kurtarma yakında eklenecek');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showAbout() {
        document.getElementById('about-modal').style.display = 'flex';
    }

    async lockVault() {
        if (confirm(this.translations[this.currentLang].lock_confirm)) {
            try {
                await chrome.storage.local.set({ isLocked: true });
                await chrome.storage.local.remove(['sessionPassword']);
                this.showSuccess('Kasa kilitlendi');
                setTimeout(() => {
                    location.reload();
                }, 500);
            } catch (e) {
                this.showError('Kilitleme hatası');
            }
        }
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification-bar');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

let popupManager;
document.addEventListener('DOMContentLoaded', () => {
    popupManager = new PopupManager();
});
