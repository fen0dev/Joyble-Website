// animations.js - Handles all animation-related functionality
const AnimationModule = (function() {
    // Private variables
    let ticking = false;
    let lastScrollY = 0;

    // detect browser for safari rendering
    function detectBrowser() {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        if (isSafari || isIOS) {
            document.body.classList.add('is-safari');
            
            // Fix smooth scrolling for Safari
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }
    
    // Private methods
    function updateLogoOnScroll() {
        const logo = document.querySelector('.logo');
        if (!logo) return;
        
        const scrollPercent = Math.min(window.scrollY / (window.innerHeight * 0.3), 1);
        const easeOutQuad = t => t * (2 - t);
        const transformedPercent = easeOutQuad(scrollPercent);
        
        if (scrollPercent > 0.05) {
            logo.classList.add('scrolled');
            logo.style.opacity = Math.max(0.2, 1 - transformedPercent);
        } else {
            logo.classList.remove('scrolled');
            logo.style.opacity = '';
        }
        
        ticking = false;
    }
    
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('animated');
            }
        });
    }
    
    function handleScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateLogoOnScroll();
                animateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    function setupMagneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const maxMove = 5;
                
                const moveX = (x - centerX) / centerX * maxMove;
                const moveY = (y - centerY) / centerY * maxMove;
                
                this.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    function addAnimationClasses() {
        const sections = document.querySelectorAll('.mission, .feature, .team-heading, .team-member, .faq-heading, .signup');
        sections.forEach(section => {
            section.classList.add('animate-on-scroll');
        });
    }

    function initScrollAnimations() {
        // Select elements to animate
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // Create observer with threshold
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If element is in viewport
                if (entry.isIntersecting) {
                    // Add staggered animation based on data attribute
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        // Observe all animated elements
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    function setupParallaxImages() {
        const parallaxImages = document.querySelectorAll('.feature-image');
        const isSafari = document.body.classList.contains('is-safari');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            
            parallaxImages.forEach(image => {
                const rect = image.getBoundingClientRect();
                // Only apply parallax when in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Use reduced motion for Safari for better performance
                    const speed = isSafari ? 0.03 : 0.05;
                    const yPos = -(rect.top * speed);
                    
                    // Apply hardware acceleration for Safari
                    if (isSafari) {
                        image.style.transform = `translate3d(0, ${yPos}px, 0)`;
                    } else {
                        image.style.transform = `translateY(${yPos}px)`;
                    }
                }
            });
        }, { passive: true }); // Add passive flag for better scroll performance
    }

    function formInteractions() {
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
        
        formInputs.forEach(input => {
            // Add focus effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Add floating label effect
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.classList.add('floating-label');
            }
        });
        
        // Add submit button animation
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });
            
            submitBtn.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        }
    }
    
    // Public methods
    return {
        init: function() {
            detectBrowser();
            addAnimationClasses();
            setupMagneticButtons();
            initScrollAnimations();
            setupParallaxImages();
            formInteractions();
            
            // Add character animation to headings
            document.querySelectorAll('.hero-content h1, .hero-content h2, .feature-content h2, .team-heading h2, .signup h2').forEach(el => {
                el.classList.add('char-animation');
            });
            
            // Apply scale-text to highlight spans
            document.querySelectorAll('.highlight').forEach(el => {
                el.classList.add('scale-text');
            });
            
            window.addEventListener('scroll', handleScroll);
            updateLogoOnScroll();
            animateOnScroll();
        }
    };
})();