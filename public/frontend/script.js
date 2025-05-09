// main.js - Entry point for all JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Call AnimationModule.init() explicitly if it wasn't auto-executed
    if (typeof AnimationModule !== 'undefined') {
        setTimeout(function() {
            AnimationModule.init();
        }, 1200);
    }
    
    if (typeof SliderModule !== 'undefined') {
        SliderModule.init();
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