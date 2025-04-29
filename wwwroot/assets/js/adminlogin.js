document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM content is fully loaded');

    const form = document.getElementById('loginForm');
    const userField = document.getElementById('username');
    const passField = document.getElementById('password');
    const userHelpText = document.getElementById('usernameHelp');
    const passHelpText = document.getElementById('passwordHelp');

    // Initialize click count from localStorage, default to 0
    let loginAttempts = parseInt(localStorage.getItem('clickCount')) || 0;

    form.addEventListener('submit', function (e) {
        e.preventDefault();  // Prevent the default form submission

        console.log('Form has been submitted');
        const usernameValue = userField.value.trim();
        const passwordValue = passField.value.trim();
        let formValid = true;

        // Validate username input
        const usernamePattern = /^(?=.*[A-Za-z])[A-Za-z\d]{4,}$/;
        if (!usernamePattern.test(usernameValue)) {
            userHelpText.textContent = 'Username must be at least 4 characters and include at least one letter.';
            formValid = false;
        } else {
            userHelpText.textContent = '';
        }

        // Validate password input
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(passwordValue)) {
            passHelpText.textContent = 'Password must contain at least 8 characters, including uppercase, lowercase, and a number.';
            formValid = false;
        } else {
            passHelpText.textContent = '';
        }

        // Track login attempts specifically for the "admin123" user
        if (usernameValue === 'admin123') {
            loginAttempts++;
            localStorage.setItem('clickCount', loginAttempts);
            console.log(`Current click count: ${loginAttempts}`);

            if (loginAttempts >= 5) {
                console.log('Redirecting to adminregister.html');
                localStorage.removeItem('clickCount');
                window.location.href = 'adminregister.html';  // Redirect after 5 attempts
                return;
            }
        } else {
            localStorage.removeItem('clickCount');  // Reset click count for other usernames
        }

        // Proceed with login if validation passes
        if (formValid) {
            localStorage.setItem('isAdminLoggedIn', 'true');  // Store the login status
            window.location.href = 'admin-panel.html';  // Redirect to admin panel
        }
    });
});
