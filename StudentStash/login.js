document.getElementById('login-button').addEventListener('click', function() {
    const storedEmail = "user@example.com"; // Hard-coded email for demonstration
    const storedPassword = "password123";   // Hard-coded password for demonstration

    const emailInput = document.getElementById('emailInput').value;
    const passwordInput = document.getElementById('passwordInput').value;

    if (emailInput === storedEmail && passwordInput === storedPassword) {
        alert('Login Successful! Redirecting to dashboard...');

        // Redirects to the 'dashboard.html' after a short delay
        setTimeout(function() {
            window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        alert('Error: Incorrect email or password.'); // Error message for wrong credentials
    }
});
