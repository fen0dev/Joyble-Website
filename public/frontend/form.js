// form.js - Handles form submissions and validation
const FormModule = (function() {
    // Private variables
    const firebaseConfig = {
        // Your Firebase config will go here when you connect it
    };
    
    // Private methods
    function setupFormSubmission() {
        const form = document.getElementById('signup-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // We'll replace this with actual Firebase submission later
            console.log('Form submitted:', { name, email, message });
            
            // For now, just show a simple confirmation
            alert('Thanks for signing up! We\'ll be in touch soon.');
            form.reset();
            
            // When Firebase is connected, call submitToFirebase(name, email, message);
        });
    }
    
    function submitToFirebase(name, email, message) {
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thanks for signing up! We will be in touch soon');
                document.getElementById('signup-form').reset();
            } else {
                alert('Something went wrong. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again later.');
        });
    }
    
    // Public methods
    return {
        init: function() {
            setupFormSubmission();
        }
    };
})();