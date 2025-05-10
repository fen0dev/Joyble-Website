// form.js - Handles form submissions and validation
const FormModule = (function() {
    // Private variables
    const firebaseConfig = {
        apiKey: "AIzaSyDOTzFdMBdcnkCEKV1Gr_N2sKvQkipfiaI",
        authDomain: "joyble-app.firebaseapp.com",
        projectId: "joyble-app",
        storageBucket: "joyble-app.firebasestorage.app",
        messagingSenderId: "180938141733",
        appId: "1:180938141733:web:d5c0050892b9849870cfcc",
        measurementId: "G-9SBNXNB5E2"
    };
    
    // Private methods
    function setupFormSubmission() {
        const form = document.getElementById('signup-form');
        if (!form) return;
        
        // Add visual feedback elements for validation
        addValidationFeedback();
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            // Reset previous error messages
            resetValidation();
            
            // Validate inputs
            let isValid = true;
            
            // Validate name (required, min 2 chars)
            if (!name || name.length < 2) {
                showError(nameInput, 'Please enter a valid name (at least 2 characters)');
                isValid = false;
            }
            
            // Validate email with a robust regex pattern
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!email || !emailRegex.test(email)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // If validation passes, submit the form
            if (isValid) {
                // Show loading state
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
                
                submitToFirebase(name, email, message)
                    .then(() => {
                        showSuccess('Thanks for signing up! We\'ll be in touch soon.');
                        form.reset();
                    })
                    .catch(error => {
                        showError(null, 'Something went wrong. Please try again later.');
                        console.error('Error:', error);
                    })
                    .finally(() => {
                        // Reset button state
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    });
            }
        });
        
        // Add live validation as user types
        setupLiveValidation();
    }

    function setupLiveValidation() {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const email = this.value.trim();
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (email && !emailRegex.test(email)) {
                    showError(this, 'Please enter a valid email address');
                } else if (email) {
                    clearError(this);
                }
            });
        }

        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                const name = this.value.trim();
                if (name && name.length < 2) {
                    showError(this, 'Name must be at least 2 characters long');
                } else if (name) {
                    clearError(this);
                }
            });
        }
    }

    function addValidationFeedback() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            if (!group.querySelector('.error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                group.appendChild(errorDiv);
            }
        });
        
        // Add global message container if it doesn't exist
        if (!document.getElementById('form-message')) {
            const formContainer = document.querySelector('.signup-form');
            if (formContainer) {
                const messageDiv = document.createElement('div');
                messageDiv.id = 'form-message';
                messageDiv.className = 'form-message';
                formContainer.prepend(messageDiv);
            }
        }
        
        // Add styles if not already in the CSS
        if (!document.getElementById('validation-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'validation-styles';
            styleEl.textContent = `
                .error-message {
                    color: #ff4444;
                    font-size: 0.9rem;
                    margin-top: 5px;
                    min-height: 18px;
                    transition: all 0.3s ease;
                }
                .form-message {
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-weight: 500;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    text-align: center;
                }
                .form-message.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .form-message.success {
                    background-color: rgba(39, 174, 96, 0.2);
                    color: #2ecc71;
                }
                .form-message.error {
                    background-color: rgba(231, 76, 60, 0.2);
                    color: #e74c3c;
                }
                .input-error {
                    border: 1px solid rgba(231, 76, 60, 0.5) !important;
                    background-color: rgba(231, 76, 60, 0.05) !important;
                }
                .input-success {
                    border: 1px solid rgba(39, 174, 96, 0.5) !important;
                }
            `;
            document.head.appendChild(styleEl);
        }
    }

    function showError(inputElement, message) {
        if (inputElement) {
            inputElement.classList.add('input-error');
            const errorMessage = inputElement.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = message;
            }
        } else {
            const messageEl = document.getElementById('form-message');
            if (messageEl) {
                messageEl.textContent = message;
                messageEl.className = 'form-message error visible';

                // hide after 3.5 sec
                setTimeout(() => {
                    messageEl.className = 'form-message';
                }, 3500);
            }
        }
    }

    function clearError(inputElement) {
        inputElement.classList.remove('input-error');
        inputElement.classList.add('input-success');
        const errorMessage = inputElement.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    function resetValidation() {
        const inputs = document.querySelectorAll('#signup-form input, #signup-form textarea');
        inputs.forEach(input => {
            input.classList.remove('input-error', 'input-success');
        });

        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => {
            el.textContent = '';
        });

        const formMessage = document.getElementById('form-message');
        if (formMessage) {
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }
    }

    function showSuccess(message) {
        const messageEl = document.getElementById('form-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = 'form-message success visible';

            setTimeout(() => {
                messageEl.className = 'form-message';
            }, 3500);
        }
    }
    
    function submitToFirebase(name, email, message) {
        return fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Server error');
                });
            }
            return response.json();
        });
    }
    
    // Public methods
    return {
        init: function() {
            setupFormSubmission();
        }
    };
})();