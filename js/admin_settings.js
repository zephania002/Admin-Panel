document.addEventListener('DOMContentLoaded', function() {
    const settingsSections = document.querySelectorAll('.animated-section');
    const siteThemeSelect = document.getElementById('siteTheme');
    const notificationSoundCheckbox = document.getElementById('notificationSound');
    const defaultLanguageSelect = document.getElementById('defaultLanguage');
    const generalSettingsSaveBtn = document.querySelector('.general-settings .save-settings-btn');
    const generalSettingsMessage = document.getElementById('generalSettingsMessage');

    const openChangePasswordModalBtn = document.getElementById('openChangePasswordModal');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closeModalBtn = document.querySelector('.close-button');
    const changePasswordFormModal = document.getElementById('changePasswordFormModal');
    const passwordChangeMessageModal = document.getElementById('passwordChangeMessageModal');
    const securitySettingsSaveBtn = document.querySelector('.security-settings .save-settings-btn');
    const securitySettingsMessage = document.getElementById('securitySettingsMessage');
    const twoFactorAuthCheckbox = document.getElementById('twoFactorAuth');

    const emailNotificationsCheckbox = document.getElementById('emailNotifications');
    const smsNotificationsCheckbox = document.getElementById('smsNotifications');
    const notificationSettingsSaveBtn = document.querySelector('.notifications-settings .save-settings-btn');
    const notificationSettingsMessage = document.getElementById('notificationSettingsMessage');

    // --- Function to trigger section animations ---
    function animateSections() {
        settingsSections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('active');
            }, 100 + index * 200); // Staggered animation
        });
    }

    // --- Load Saved Settings (Simulated) ---
    function loadSettings() {
        // In a real application, you would fetch these from the server
        const savedTheme = localStorage.getItem('siteTheme') || 'light';
        const savedNotificationSound = localStorage.getItem('notificationSound') === 'true';
        const savedLanguage = localStorage.getItem('defaultLanguage') || 'en';
        const savedTwoFactorAuth = localStorage.getItem('twoFactorAuth') === 'true';
        const savedEmailNotifications = localStorage.getItem('emailNotifications') === 'true';
        const savedSmsNotifications = localStorage.getItem('smsNotifications') === 'true';

        siteThemeSelect.value = savedTheme;
        notificationSoundCheckbox.checked = savedNotificationSound;
        defaultLanguageSelect.value = savedLanguage;
        twoFactorAuthCheckbox.checked = savedTwoFactorAuth;
        emailNotificationsCheckbox.checked = savedEmailNotifications;
        smsNotificationsCheckbox.checked = savedSmsNotifications;
    }

    // --- Save General Settings (Simulated) ---
    if (generalSettingsSaveBtn) {
        generalSettingsSaveBtn.addEventListener('click', function() {
            localStorage.setItem('siteTheme', siteThemeSelect.value);
            localStorage.setItem('notificationSound', notificationSoundCheckbox.checked);
            localStorage.setItem('defaultLanguage', defaultLanguageSelect.value);
            generalSettingsMessage.textContent = 'General settings saved!';
            generalSettingsMessage.className = 'form-message success';
            setTimeout(() => {
                generalSettingsMessage.textContent = '';
                generalSettingsMessage.className = 'form-message';
            }, 3000);
            // In a real application, you would send these to the server
        });
    }

    // --- Save Security Settings (Simulated for Two-Factor Auth) ---
    if (securitySettingsSaveBtn) {
        securitySettingsSaveBtn.addEventListener('click', function() {
            localStorage.setItem('twoFactorAuth', twoFactorAuthCheckbox.checked);
            securitySettingsMessage.textContent = 'Security settings saved!';
            securitySettingsMessage.className = 'form-message success';
            setTimeout(() => {
                securitySettingsMessage.textContent = '';
                securitySettingsMessage.className = 'form-message';
            }, 3000);
            // Password change is handled by the modal
            // In a real application, you might send other security settings to the server
        });
    }

    // --- Save Notification Settings (Simulated) ---
    if (notificationSettingsSaveBtn) {
        notificationSettingsSaveBtn.addEventListener('click', function() {
            localStorage.setItem('emailNotifications', emailNotificationsCheckbox.checked);
            localStorage.setItem('smsNotifications', smsNotificationsCheckbox.checked);
            notificationSettingsMessage.textContent = 'Notification settings saved!';
            notificationSettingsMessage.className = 'form-message success';
            setTimeout(() => {
                notificationSettingsMessage.textContent = '';
                notificationSettingsMessage.className = 'form-message';
            }, 3000);
            // In a real application, you would send these to the server
        });
    }

    // --- Modal for Change Password ---
    if (openChangePasswordModalBtn && changePasswordModal && closeModalBtn && changePasswordFormModal && passwordChangeMessageModal) {
        openChangePasswordModalBtn.addEventListener('click', function() {
            changePasswordModal.style.display = 'block';
        });

        closeModalBtn.addEventListener('click', function() {
            changePasswordModal.style.display = 'none';
            passwordChangeMessageModal.textContent = '';
            passwordChangeMessageModal.className = 'form-message';
            changePasswordFormModal.reset();
        });

        window.addEventListener('click', function(event) {
            if (event.target === changePasswordModal) {
                changePasswordModal.style.display = 'none';
                passwordChangeMessageModal.textContent = '';
                passwordChangeMessageModal.className = 'form-message';
                changePasswordFormModal.reset();
            }
        });

        changePasswordFormModal.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPasswordModal = document.getElementById('currentPasswordModal').value;
            const newPasswordModal = document.getElementById('newPasswordModal').value;
            const confirmNewPasswordModal = document.getElementById('confirmNewPasswordModal').value;

            if (newPasswordModal !== confirmNewPasswordModal) {
                passwordChangeMessageModal.textContent = 'New passwords do not match.';
                passwordChangeMessageModal.className = 'form-message error';
                return;
            }

            const passwordData = { currentPassword: currentPasswordModal, newPassword: newPasswordModal };

            fetch('/api/admin/change-password', { // Replace with your actual API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    passwordChangeMessageModal.textContent = 'Password changed successfully!';
                    passwordChangeMessageModal.className = 'form-message success';
                    setTimeout(() => {
                        changePasswordModal.style.display = 'none';
                        passwordChangeMessageModal.textContent = '';
                        passwordChangeMessageModal.className = 'form-message';
                        changePasswordFormModal.reset();
                    }, 2000);
                } else {
                    passwordChangeMessageModal.textContent = data.error || 'Error changing password.';
                    passwordChangeMessageModal.className = 'form-message error';
                }
            })
            .catch(error => {
                console.error('Error changing password:', error);
                passwordChangeMessageModal.textContent = 'Network error while changing password.';
                passwordChangeMessageModal.className = 'form-message error';
            });
        });
    }

    // --- Initialize ---
    loadSettings();
    animateSections();
});