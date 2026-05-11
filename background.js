// Background script for handling extension logic
class BackgroundService {
    constructor() {
        this.init();
    }

    init() {
        // Listen for tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.checkSiteForPasswords(tab.url, tabId);
            }
        });

        // Listen for keyboard shortcuts
        chrome.commands.onCommand.addListener((command) => {
            if (command === "auto_fill_password") {
                this.handleAutoFillShortcut();
            }
        });

        // Listen for messages from content script and popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep the message channel open for async response
        });
    }

    async handleAutoFillShortcut() {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'triggerAutoFill' });
        }
    }

    async checkSiteForPasswords(url, tabId) {
        try {
            const response = await fetch('http://localhost:5000/api/check-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site_url: new URL(url).hostname
                })
            });

            const result = await response.json();
            
            if (result.has_passwords) {
                // Inject content script to show auto-fill options
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                });
            }
        } catch (error) {
            console.log('Password check failed:', error);
        }
    }

    async handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'savePassword':
                await this.savePassword(request.data, sendResponse);
                break;
            case 'getPasswords':
                await this.getPasswords(request.data, sendResponse);
                break;
            case 'checkSite':
                await this.checkSite(request.data, sendResponse);
                break;
            case 'updatePassword':
                await this.updatePassword(request.data, sendResponse);
                break;
            default:
                sendResponse({ error: 'Unknown action' });
        }
    }

    async savePassword(data, sendResponse) {
        try {
            const response = await fetch('http://localhost:5000/api/save-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            sendResponse(result);
        } catch (error) {
            sendResponse({ error: error.message });
        }
    }

    async getPasswords(data, sendResponse) {
        try {
            let urlParam = '';
            if (data.url) {
                // If it's already a hostname, use it, otherwise parse URL
                try {
                    const urlObj = new URL(data.url.startsWith('http') ? data.url : `http://${data.url}`);
                    urlParam = urlObj.hostname;
                } catch(e) {
                    urlParam = data.url;
                }
            }
            
            let fetchUrl = `http://localhost:5000/api/get-passwords?site_url=${urlParam}`;
            if (data.includePassword) {
                fetchUrl += '&master_password=default_master';
            }
            
            const response = await fetch(fetchUrl);
            const result = await response.json();
            sendResponse(result);
        } catch (error) {
            sendResponse({ error: error.message });
        }
    }

    async updatePassword(data, sendResponse) {
        try {
            const response = await fetch('http://localhost:5000/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            sendResponse(result);
        } catch (error) {
            sendResponse({ error: error.message });
        }
    }

    async checkSite(data, sendResponse) {
        try {
            const url = new URL(data.url);
            const response = await fetch('http://localhost:5000/api/check-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site_url: url.hostname
                })
            });

            const result = await response.json();
            sendResponse(result);
        } catch (error) {
            sendResponse({ error: error.message });
        }
    }
}

// Initialize the background service
new BackgroundService();
