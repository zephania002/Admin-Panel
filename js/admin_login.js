document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginMessage = document.getElementById('loginMessage');

    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = adminLoginForm.adminEmail.value;
        const password = adminLoginForm.adminPassword.value;

        console.log('Admin Login Attempt:', email, password);

        // --- This is where you would typically send the login data to your server-side authentication API ---
        // Example using fetch API:
        /*
        fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.token) {
                // Store the token (e.g., in localStorage or a cookie)
                localStorage.setItem('adminToken', data.token);
                // Redirect to the admin dashboard
                window.location.href = 'admin_dashboard.html';
            } else {
                loginMessage.textContent = 'Login failed: ' + (data.error || 'Invalid credentials');
                loginMessage.className = 'form-message error';
            }
        })
        .catch(error => {
            loginMessage.textContent = 'Network error: ' + error.message;
            loginMessage.className = 'form-message error';
        });
        */

        // For this front-end example, just a message
        if (email === 'zephany001@gmail.com' && password === 'password123') {
            loginMessage.textContent = 'Login successful (simulated). Redirecting...';
            loginMessage.className = 'form-message success';
            setTimeout(() => {
                window.location.href = 'admin.html'; // Redirect after a delay
            }, 1500);
        } else {
            loginMessage.textContent = 'Login failed: Invalid credentials.';
            loginMessage.className = 'form-message error';
        }
    });
});