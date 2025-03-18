document.addEventListener('DOMContentLoaded', function() {
    const adminIdSpan = document.getElementById('adminId');
    const usernameSpan = document.getElementById('username');
    const emailSpan = document.getElementById('email');
    const lastLoginSpan = document.getElementById('lastLogin');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const passwordChangeMessage = document.getElementById('passwordChangeMessage');
    const activityLogList = document.getElementById('activityLogList');
    const loadMoreActivityBtn = document.getElementById('loadMoreActivity');

    // --- Fetch Admin Profile Data ---
    function fetchAdminProfile() {
        fetch('/api/admin/profile') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => {
                if (adminIdSpan) adminIdSpan.textContent = data.id || 'N/A';
                if (usernameSpan) usernameSpan.textContent = data.username || 'N/A';
                if (emailSpan) emailSpan.textContent = data.email || 'N/A';
                if (lastLoginSpan) lastLoginSpan.textContent = data.lastLogin || 'N/A';
                // Update other profile details as needed
            })
            .catch(error => {
                console.error('Error fetching admin profile:', error);
                // Optionally display an error message to the user
            });
    }

    // --- Handle Change Password Form Submission ---
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;

            if (newPassword !== confirmNewPassword) {
                passwordChangeMessage.textContent = 'New passwords do not match.';
                passwordChangeMessage.className = 'form-message error';
                return;
            }

            const passwordData = { currentPassword, newPassword };

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
                    passwordChangeMessage.textContent = 'Password changed successfully!';
                    passwordChangeMessage.className = 'form-message success';
                    changePasswordForm.reset();
                } else {
                    passwordChangeMessage.textContent = data.error || 'Error changing password.';
                    passwordChangeMessage.className = 'form-message error';
                }
            })
            .catch(error => {
                console.error('Error changing password:', error);
                passwordChangeMessage.textContent = 'Network error while changing password.';
                passwordChangeMessage.className = 'form-message error';
            });
        });
    }

    // --- Fetch Recent Activity (Example - You'll need to implement backend logic) ---
    function fetchRecentActivity(limit = 5, offset = 0) {
        fetch(`/api/admin/activity?limit=${limit}&offset=${offset}`) // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    if (offset === 0) {
                        activityLogList.innerHTML = ''; // Clear initial list
                    }
                    data.forEach(activity => {
                        const listItem = document.createElement('li');
                        listItem.textContent = activity.description + ' at ' + new Date(activity.timestamp).toLocaleString();
                        activityLogList.appendChild(listItem);
                    });
                    if (data.length >= limit) {
                        loadMoreActivityBtn.style.display = 'block';
                        loadMoreActivityBtn.dataset.offset = offset + limit;
                    } else {
                        loadMoreActivityBtn.style.display = 'none';
                    }
                } else if (offset === 0) {
                    activityLogList.innerHTML = '<li>No recent activity.</li>';
                    loadMoreActivityBtn.style.display = 'none';
                } else {
                    loadMoreActivityBtn.style.display = 'none'; // No more activity
                }
            })
            .catch(error => {
                console.error('Error fetching recent activity:', error);
                activityLogList.innerHTML = '<li>Error loading recent activity.</li>';
                loadMoreActivityBtn.style.display = 'none';
            });
    }

    if (loadMoreActivityBtn) {
        loadMoreActivityBtn.addEventListener('click', function() {
            const offset = parseInt(this.dataset.offset) || 0;
            fetchRecentActivity(5, offset);
        });
    }

    // Call functions to load data on page load
    fetchAdminProfile();
    fetchRecentActivity();
});