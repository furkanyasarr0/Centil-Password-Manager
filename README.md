# Centil Password Manager 🛡️

Centil is a secure, open-source, and user-friendly browser extension designed to help you manage your passwords locally with ease. It features a modern UI, high-security encryption, and multi-language support.

## Features ✨

- **Local Storage:** Your passwords are saved in a local SQLite database, giving you full control over your data.
- **AES Encryption:** Sensitive information is protected using industry-standard AES encryption.
- **Modern UI:** A clean, responsive, and intuitive interface built with Inter font and Tailwind-inspired CSS.
- **Multi-language Support:** Full support for English and Turkish.
- **Security Questions:** Recover your master password using customizable security questions.
- **Auto-fill Support:** Quickly fill in your credentials on saved websites.
- **Dark/Light Mode Ready:** Designed with a professional color palette.

## Tech Stack 🛠️

- **Frontend:** HTML5, CSS3 (Custom Variables), JavaScript (ES6+), Chrome Extension APIs.
- **Backend:** Python (Flask), SQLite, Cryptography (AES-CFB).
- **Security:** PBKDF2 for key derivation, SHA-256 for hashing.

## Getting Started 🚀

### Prerequisites

- Google Chrome or any Chromium-based browser.
- Python 3.8 or higher.

### Installation (Detailed Guide)

If you are new to browser extensions, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/furkanyasarr0/Centil-Password-Manager.git
    cd Centil-Password-Manager
    ```
    *(If you don't have Git, you can download the project as a ZIP file from GitHub and extract it).*

2.  **Setup the Backend (Python):**
    - Open your terminal or command prompt.
    - Navigate to the `backend` folder: `cd backend`
    - Install required libraries: `pip install -r requirements.txt`
    - Start the server: `python app.py`
    - **Keep this window open** while using the extension.

3.  **Add the Extension to Chrome:**
    - Open Google Chrome.
    - Type `chrome://extensions/` in the address bar and press Enter.
    - Enable **Developer mode** by clicking the switch in the top-right corner.
    - Click the **Load unpacked** (Paketlenmemiş öğe yükle) button.
    - Select the **Centil-Password-Manager** folder (the main folder containing `manifest.json`).
    - The Centil icon should now appear in your extension list!

4.  **Pin the Extension:**
    - Click the puzzle piece icon 🧩 next to your profile picture in Chrome.
    - Find **Centil Password Manager** and click the pin icon 📌 to keep it visible.

## Usage 📖

1.  **Initial Setup:** On the first run, you will be prompted to create a Master Password and set up 3 security questions.
2.  **Adding Passwords:** Click the "+" button to save a new password. If you are on a website, Centil will automatically suggest the domain name.
3.  **Managing:** You can view, copy, edit, or search through your saved passwords.
4.  **Language:** Switch between English and Turkish using the toggle in the top right.

## Security 🔒

Centil uses a master password to encrypt your vault. 
- **Encryption:** AES-CFB mode with a unique IV and salt for every entry.
- **Key Derivation:** PBKDF2HMAC with 100,000 iterations.
- **Hashing:** SHA-256 for password verification and security question answers.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Developed by [Furkan Yasar](https://github.com/furkanyasarr0)
