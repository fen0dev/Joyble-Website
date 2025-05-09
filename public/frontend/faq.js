// faq.js - Handles FAQ accordion functionality
const FaqModule = (function() {
    // Private methods
    function setupAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // If clicking on a closed item, open it
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Public methods
    return {
        init: function() {
            setupAccordion();
        }
    };
})();