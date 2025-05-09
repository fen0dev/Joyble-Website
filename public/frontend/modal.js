// modal.js - Handles modal dialog functionality
const ModalModule = (function() {
    // Private methods
    function openModal(modalId, buttonElement) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            buttonElement.textContent = 'Close';
        }
    }
    
    function closeModal(modal, buttonId) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        const modalId = modal.id;
        const readMoreBtn = document.querySelector(`.read-more-btn[data-modal="${modalId}"]`);
        if (readMoreBtn) {
            readMoreBtn.textContent = 'Read More';
        }
    }
    
    function setupEventListeners() {
        // Button click handlers
        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                openModal(modalId, this);
            });
        });
        
        // Close button handlers
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal-sheet');
                if (modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Click outside to close
        const modals = document.querySelectorAll('.modal-sheet');
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });
    }
    
    // Public methods
    return {
        init: function() {
            setupEventListeners();
        }
    };
})();