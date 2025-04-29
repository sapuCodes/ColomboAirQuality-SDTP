document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const messageField = document.getElementById('message');
    const wordCountDisplay = document.getElementById('wordCount');
    const successAlert = document.getElementById('successMessage');
    const errorAlert = document.getElementById('errorMessage');
    
    // Update word count dynamically
    messageField.addEventListener('input', function() {
        const words = messageField.value.trim().split(/\s+/);
        const count = messageField.value.trim() === '' ? 0 : words.length;
        wordCountDisplay.textContent = count;
        
        if (count > 100) {
            wordCountDisplay.style.color = 'red';
        } else {
            wordCountDisplay.style.color = 'inherit';
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Validate message word count
        const words = messageField.value.trim().split(/\s+/);
        const wordCount = messageField.value.trim() === '' ? 0 : words.length;
        
        if (wordCount > 100) {
            alert('Your message must not exceed 100 words.');
            return;
        }
        
        // Gather form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            message: messageField.value
        };
        
        try {
            // Send the form data to the server
            const response = await fetch('https://localhost:7073/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const responseError = await response.json();
                throw new Error(responseError.message || 'Unable to submit the form');
            }
            
            // Display success message
            form.style.display = 'none';
            successAlert.style.display = 'block';
            errorAlert.style.display = 'none';
            
            // Reset the form
            form.reset();
            wordCountDisplay.textContent = '0';
        } catch (error) {
            console.error('Error:', error);
            errorAlert.style.display = 'block';
            errorAlert.textContent = error.message || 'An error occurred while submitting the form. Please try again later.';
        }
    });
});
