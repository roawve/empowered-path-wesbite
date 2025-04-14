// ==================================================
// ==========        SCRIPT.JS CODE        ==========
// ==================================================

// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            const isActive = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active', isActive); // Sync hamburger state
            document.body.classList.toggle('no-scroll', isActive); // Prevent body scroll
        });

        // Close menu if a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                 // Don't close if it's not a real navigation link (e.g., #)
                 // or if the menu isn't active
                 if (!navLinks.classList.contains('active')) return;

                 // Check if it's an anchor link on the same page
                 const href = link.getAttribute('href');
                 const isSamePageAnchor = href && href.startsWith('#');

                 if (!isSamePageAnchor || e.target.closest('.nav-links')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                 }
            });
        });
         // Close menu on escape key
         document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                 navLinks.classList.remove('active');
                 hamburger.classList.remove('active');
                 document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Testimonial Slider ---
    const testimonialsContainer = document.querySelector('.testimonial-slider');

    if (testimonialsContainer) {
        const testimonials = testimonialsContainer.querySelectorAll('.testimonial-item');
        const dotsContainer = document.querySelector('.testimonial-dots');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        const prevBtn = document.querySelector('.prev-testimonial');
        const nextBtn = document.querySelector('.next-testimonial');
        // Get transition duration from CSS variable or set default
        // Note: Ensure --transition-slider is defined in CSS :root or fallback works
        const transitionDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-slider') || '0.6s') * 1000;

        let currentIndex = 0;
        let slideInterval;
        let isTransitioning = false;

        function showTestimonial(index, direction = 'next') {
            if (isTransitioning || index === currentIndex || testimonials.length <= 1) {
                return;
            }
            isTransitioning = true;

            const oldIndex = currentIndex;
            const oldSlide = testimonials[oldIndex];
            const newIndex = (index + testimonials.length) % testimonials.length;
            const newSlide = testimonials[newIndex];

            // Add exiting class to old slide
            oldSlide.classList.add(direction === 'next' ? 'is-exiting-left' : 'is-exiting-right');

            // Prepare new slide: remove old classes, set starting position
            newSlide.classList.remove('is-exiting-left', 'is-exiting-right');
            newSlide.style.transform = `translateX(${direction === 'next' ? '100%' : '-100%'})`;
            newSlide.style.opacity = '0'; // Start transparent
            void newSlide.offsetWidth; // Force reflow

            // Add active class to start transition
            newSlide.classList.add('active');
            // Explicitly set target state for transition
            newSlide.style.transform = 'translateX(0)';
            newSlide.style.opacity = '1';

            // Update dots
            if (dots.length > 0) {
                if (dots[oldIndex]) dots[oldIndex].classList.remove('active');
                if (dots[newIndex]) dots[newIndex].classList.add('active');
            }

            currentIndex = newIndex;

            // Clean up after transition
            setTimeout(() => {
                oldSlide.classList.remove('active', 'is-exiting-left', 'is-exiting-right');
                oldSlide.style.transform = ''; // Reset transform
                oldSlide.style.opacity = '';   // Reset opacity
                isTransitioning = false;
            }, transitionDuration);
        }

        function nextTestimonial() {
            showTestimonial(currentIndex + 1, 'next');
        }

        function prevTestimonial() {
            showTestimonial(currentIndex - 1, 'prev');
        }

        // Initialize Slider
        if (testimonials.length > 0) {
             // Set initial state correctly
             testimonials.forEach((slide, i) => {
                 slide.classList.remove('active', 'is-exiting-left', 'is-exiting-right');
                 slide.style.transform = '';
                 slide.style.opacity = '';
                 if (i === 0) {
                     slide.classList.add('active');
                     slide.style.transform = 'translateX(0)'; // Ensure initial slide is positioned correctly
                     slide.style.opacity = '1';
                 } else {
                      slide.style.transform = 'translateX(100%)'; // Position non-active slides off-screen
                 }
             });
             if(dots.length > 0 && dots[0]) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[0].classList.add('active');
             }


            // Event Listeners
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    const clickableElement = dot.tagName === 'BUTTON' ? dot : dot;
                    clickableElement.addEventListener('click', () => {
                        if (!isTransitioning && index !== currentIndex) {
                             const direction = index > currentIndex ? 'next' : 'prev';
                             showTestimonial(index, direction);
                             resetInterval();
                        }
                    });
                     if (clickableElement.tagName !== 'BUTTON') {
                         clickableElement.setAttribute('role', 'button');
                         clickableElement.setAttribute('tabindex', '0');
                         clickableElement.addEventListener('keydown', (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  if (!isTransitioning && index !== currentIndex) {
                                       const direction = index > currentIndex ? 'next' : 'prev';
                                       showTestimonial(index, direction);
                                       resetInterval();
                                  }
                              }
                         });
                     }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevTestimonial();
                    resetInterval();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextTestimonial();
                    resetInterval();
                });
            }

            // Autoplay
            function startInterval() {
                clearInterval(slideInterval);
                if (testimonials.length > 1) {
                     slideInterval = setInterval(nextTestimonial, 6000); // 6 second interval
                }
            }

            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }

            startInterval();

            // Pause/Resume on hover/focus
            const focusableElements = [testimonialsContainer, prevBtn, nextBtn, ...dots];
            focusableElements.forEach(el => {
                 if(el) {
                    el.addEventListener('mouseenter', () => clearInterval(slideInterval));
                    el.addEventListener('focus', () => clearInterval(slideInterval));
                    el.addEventListener('mouseleave', () => resetInterval());
                    el.addEventListener('blur', () => resetInterval());
                 }
            });


        } else {
            // Hide controls if no testimonials
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
            if(dotsContainer) dotsContainer.style.display = 'none';
        }
    } // End if (testimonialsContainer)


    // --- Scroll Animation Trigger (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% visible
            // rootMargin: '0px 0px -50px 0px' // Optional offset
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });

    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => {
            el.classList.add('is-visible');
        });
        console.log("IntersectionObserver not supported, scroll animations disabled.");
    }

}); // End DOMContentLoaded