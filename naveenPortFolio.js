document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded');

    const popup = document.createElement('div');
    popup.id = 'custom-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px 30px';
    popup.style.backgroundColor = '#fff';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    popup.style.zIndex = '10000';
    popup.style.display = 'none';
    popup.style.maxWidth = '80%';
    popup.style.textAlign = 'center';
    
    const popupMessage = document.createElement('p');
    popupMessage.style.marginBottom = '20px';
    
    const popupButton = document.createElement('button');
    popupButton.textContent = 'OK';
    popupButton.style.padding = '8px 20px';
    popupButton.style.backgroundColor = '#2563eb';
    popupButton.style.color = 'white';
    popupButton.style.border = 'none';
    popupButton.style.borderRadius = '4px';
    popupButton.style.cursor = 'pointer';
    popupButton.style.transition = 'background-color 0.3s';
    
    popupButton.addEventListener('mouseover', function() {
        popupButton.style.backgroundColor = '#1e3a8a';
    });
    
    popupButton.addEventListener('mouseout', function() {
        popupButton.style.backgroundColor = '#2563eb';
    });
    
    popup.appendChild(popupMessage);
    popup.appendChild(popupButton);
    document.body.appendChild(popup);
    
    // Function to show popup
    function showPopup(message, isSuccess) {
        popupMessage.textContent = message;
        popup.style.display = 'block';
        popup.style.backgroundColor = isSuccess ? '#f0fff0' : '#fff0f0';
        popupMessage.style.color = isSuccess ? '#2e7d32' : '#c62828';
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);
    }
    
    // Close popup function
    function closePopup() {
        popup.style.display = 'none';
        const overlay = document.getElementById('popup-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    popupButton.addEventListener('click', closePopup);

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Display loading state
            const submitBtn = document.querySelector('#contactForm button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Make the service call
            fetch('https://naveenportfolio-ukt4.onrender.com/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success || data.message) {
                    showPopup(data.message || 'Message sent successfully!', true);
                    // Clear form fields
                    contactForm.reset();
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }
            })
            .catch(error => {
                showPopup('Failed to send message. Please try again later.', false);
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        clearErrors();
        
        // Validate name
        if (name === '') {
            showError('name', 'Name is required');
            isValid = false;
        }
        
        // Validate email
        if (email === '') {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        if (subject === '') {
            showError('subject', 'Subject is required');
            isValid = false;
        }
        
        // Validate message
        if (message === '') {
            showError('message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message should be at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
    }
    
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
});