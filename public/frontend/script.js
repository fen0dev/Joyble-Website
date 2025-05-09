// main.js - Entry point for all JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Call AnimationModule.init() explicitly if it wasn't auto-executed
    if (typeof AnimationModule !== 'undefined') {
        AnimationModule.init();
    }
    
    if (typeof ModalModule !== 'undefined') {
        ModalModule.init();
    }
    
    if (typeof FaqModule !== 'undefined') {
        FaqModule.init();
    }
    
    if (typeof FormModule !== 'undefined') {
        FormModule.init();
    }
});