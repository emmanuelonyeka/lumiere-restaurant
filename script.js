/**
 * LUMIÈRE - Luxury Restaurant Website
 * Agency-Level JavaScript - Premium Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules in order
    initPageLoader();
    initCustomCursor();
    initNavigation();
    initMagneticButtons();
    initScrollAnimations();
    initMenuFiltering();
    initSmoothScroll();
    initParallaxEffect();
    initTextReveal();
    initHeroAnimations();
});

/**
 * ========================================
 * PAGE LOADER
 * ========================================
 */
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;
    
    // Hide loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Trigger hero animations after loader
            setTimeout(() => {
                triggerHeroAnimations();
            }, 200);
        }, 1800);
    });
    
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
}

/**
 * ========================================
 * CUSTOM CURSOR
 * ========================================
 */
function initCustomCursor() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    let isActive = true;
    let inactivityTimeout;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Reset inactivity
        isActive = true;
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            isActive = false;
        }, 100);
    });
    
    // Smooth cursor animation
    function animateCursor() {
        if (isActive) {
            // Cursor ring follows with delay
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // Dot follows closely
            dotX += (mouseX - dotX) * 0.35;
            dotY += (mouseY - dotY) * 0.35;
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .menu-card, .gallery-item, .experience-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
}

/**
 * ========================================
 * NAVIGATION - ENHANCED
 * ========================================
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    let scrollY = 0;
    
    if (!navbar) return;
    
    // Navbar scroll effect with throttle
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
    
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
    
            if (navMenu.classList.contains('active')) {
                scrollY = window.scrollY;
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.top = `-${scrollY}px`;
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
                document.documentElement.style.scrollBehavior = 'auto';
                window.scrollTo(0, scrollY);
                setTimeout(() => {
                    document.documentElement.style.scrollBehavior = '';
                }, 0);
            }
        });
    
        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
                document.documentElement.style.scrollBehavior = 'auto';
                window.scrollTo(0, scrollY);
                setTimeout(() => {
                    document.documentElement.style.scrollBehavior = '';
                }, 0);
            });
        });
    }
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (pageYOffset >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });
        }
    }, { passive: true });

    // Reset nav on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
                document.documentElement.style.scrollBehavior = 'auto';
                window.scrollTo(0, scrollY);
                setTimeout(() => {
                    document.documentElement.style.scrollBehavior = '';
                }, 0);
            }
        }, 150);
    });
}

/**
 * ========================================
 * MAGNETIC BUTTONS
 * ========================================
 */
function initMagneticButtons() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Magnetic pull strength
            const strength = 0.3;
            
            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * ========================================
 * SCROLL ANIMATIONS - ENHANCED
 * ========================================
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-content, .about-image-wrapper, ' +
        '.menu-item, .special-content, .special-image, ' +
        '.experience-card, .gallery-item, .reservation-content, ' +
        '.footer-grid > div'
    );
    
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Stagger effect for grid items
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.08}s`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    
    // Directional reveals
    const aboutContent = document.querySelector('.about-content');
    const aboutImage = document.querySelector('.about-image-wrapper');
    const specialContent = document.querySelector('.special-content');
    const specialImage = document.querySelector('.special-image');
    
    if (aboutContent) {
        aboutContent.classList.add('reveal-left');
        observer.observe(aboutContent);
    }
    
    if (aboutImage) {
        aboutImage.classList.add('reveal-right');
        observer.observe(aboutImage);
    }
    
    if (specialContent) {
        specialContent.classList.add('reveal-left');
        observer.observe(specialContent);
    }
    
    if (specialImage) {
        specialImage.classList.add('reveal-right');
        observer.observe(specialImage);
    }
}

/**
 * ========================================
 * TEXT REVEAL ANIMATION
 * ========================================
 */
function initTextReveal() {
    const textRevealElements = document.querySelectorAll('.text-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    textRevealElements.forEach(el => observer.observe(el));
}

/**
 * ========================================
 * HERO ANIMATIONS
 * ========================================
 */
function initHeroAnimations() {
    // Split hero title into characters
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${1 + index * 0.05}s`;
            heroTitle.appendChild(span);
        });
    }
    
    // Split hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.innerHTML = `<span>${text}</span>`;
    }
}

function triggerHeroAnimations() {
    // Re-trigger animations if needed
    const heroElements = document.querySelectorAll('.hero-subtitle span, .hero-title .char, .hero-tagline, .hero-cta');
    heroElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = '';
    });
}

/**
 * ========================================
 * MENU FILTERING - ENHANCED
 * ========================================
 */
function initMenuFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuHeadings = document.querySelectorAll('.menu-heading');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            // Handle headings
            menuHeadings.forEach(heading => {
                if (category === 'all') {
                    heading.classList.remove('hidden');
                } else {
                    heading.classList.add('hidden');
                }
            });

            // Handle items
            menuItems.forEach((item, index) => {
                const itemCategory = item.dataset.category;

                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                    item.classList.remove('fade-out');
                    item.style.transitionDelay = `${index * 0.05}s`;

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.classList.add('fade-out');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';

                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 500);
                }
            });
        });
    });
}

/**
 * ========================================
 * SMOOTH SCROLL - ENHANCED
 * ========================================
 */
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbar = document.getElementById('navbar');
                const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - -10;
                
                // Smooth scroll with custom easing
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function easeOutCubic(t) {
                    return 1 - Math.pow(1 - t, 3);
                }
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const ease = easeOutCubic(progress);
                    
                    window.scrollTo(0, startPosition + distance * ease);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
}

/**
 * ========================================
 * PARALLAX EFFECT - ENHANCED
 * ========================================
 */
function initParallaxEffect() {
    const heroImage = document.querySelector('.hero-image');
    const reservationBg = document.querySelector('.reservation-bg img');
    const aboutImage = document.querySelector('.about-image img');
    
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    let ticking = false;
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                // Hero parallax
                if (heroImage && lastScrollY < window.innerHeight) {
                    const parallaxValue = lastScrollY * 0.4;
                    heroImage.style.transform = `translateY(${parallaxValue}px) scale(1)`;
                }
                
                // About image parallax
                if (aboutImage) {
                    const aboutSection = document.querySelector('.about');
                    if (aboutSection) {
                        const rect = aboutSection.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const parallaxValue = (window.innerHeight - rect.top) * 0.05;
                            aboutImage.style.transform = `translateY(${parallaxValue}px)`;
                        }
                    }
                }
                
                // Reservation background parallax
                if (reservationBg) {
                    const reservationSection = document.querySelector('.reservation');
                    if (reservationSection) {
                        const rect = reservationSection.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const parallaxValue = (window.innerHeight - rect.top) * 0.08;
                            reservationBg.style.transform = `translateY(${parallaxValue}px)`;
                        }
                    }
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
}

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Preload images
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
}

window.addEventListener('load', preloadImages);

/**
 * ========================================
 * ACCESSIBILITY - REDUCED MOTION
 * ========================================
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-base', '0.01ms');
    document.documentElement.style.setProperty('--transition-smooth', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-base', '0.01ms');
        document.documentElement.style.setProperty('--transition-smooth', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    } else {
        document.documentElement.style.setProperty('--transition-fast', '0.15s cubic-bezier(0.4, 0, 0.2, 1)');
        document.documentElement.style.setProperty('--transition-base', '0.3s cubic-bezier(0.4, 0, 0.2, 1)');
        document.documentElement.style.setProperty('--transition-smooth', '0.5s cubic-bezier(0.16, 1, 0.3, 1)');
        document.documentElement.style.setProperty('--transition-slow', '0.8s cubic-bezier(0.16, 1, 0.3, 1)');
    }
});

/**
 * ========================================
 * LAZY LOADING
 * ========================================
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img:not([loading])');
    
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

/**
 * ========================================
 * CONSOLE WELCOME
 * ========================================
 */
console.log('%c🍽️ Lumière Fine Dining', 'font-size: 24px; font-weight: bold; color: #C6A769;');
console.log('%cA culinary experience crafted with passion.', 'font-size: 14px; color: #C9C3B8;');
console.log('%cFor reservations: +33 1 23 45 67 89', 'font-size: 12px; color: #9A958A;');
