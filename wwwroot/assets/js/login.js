document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Validate username: only letters, max 10 characters
    const usernameRegex = /^[A-Za-z]{1,10}$/;
    if (!usernameRegex.test(username)) {
        errorMessage.textContent = "Username must be English letters only and no more than 10 characters.";
        return;
    }

    // Validate password: min 8 characters with uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = "Password must be 8+ characters with uppercase, lowercase, number, and special character.";
        return;
    }

    // Clear any previous error messages
    errorMessage.textContent = "";

    const payload = {
        name: username,
        password: password
    };

    console.log("Sending login payload:", payload);

    try {
        const response = await fetch('https://localhost:7073/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("Received response:", result);

        if (response.ok) {
            alert('Login successful!');
            window.location.href = "home.html";
        } else {
            errorMessage.textContent = result.message || 'Invalid username or password.';
        }
    } catch (err) {
        console.error("Login request failed:", err);
        errorMessage.textContent = "Something went wrong. Please try again.";
    }
});

// Track input and update background progress
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const maxLength = 16;

usernameInput.addEventListener('input', () => updateProgress(usernameInput));
passwordInput.addEventListener('input', () => updateProgress(passwordInput));

function updateProgress(inputElement) {
    const length = inputElement.value.length;
    const fill = (length / maxLength) * 100;
    inputElement.style.backgroundSize = `${fill}% 100%`;
}
