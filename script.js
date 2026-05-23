/**
 * LUMIÈRE - Luxury Restaurant Website
 * Agency-Level JavaScript - Premium Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules in order
    initPageLoader();
    initNavigation();
    initChefSignature();
    initMagneticButtons();
    initScrollAnimations();
    initMenuFiltering();
    initMenuAccordion();
    initSmoothScroll();
    initGalleryFilter();
    initParallaxEffect();
    initTextReveal();
    initHeroAnimations();
    initHeroAmbience();
    initStickyReserve();
    initStatCounters();
    initSweepLabels();
});

/**
 * ========================================
 * PAGE LOADER
 * ========================================
 */
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    // Prevent scroll while the loader is showing. Uses the existing
    // .is-scroll-locked class (defined in style.css and already used
    // by the mobile menu) so we share one scroll-lock system instead
    // of writing inline styles. The class applies overflow:hidden to
    // both <html> and <body>, plus touch-action:none — which is what
    // iOS Safari actually needs (body-only overflow doesn't block
    // scrolling on iOS).
    document.documentElement.classList.add('is-scroll-locked');
    document.body.classList.add('is-scroll-locked');

    // Hide loader after content loads, then trigger hero animations
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');

            // Release the scroll lock once the loader starts fading.
            document.documentElement.classList.remove('is-scroll-locked');
            document.body.classList.remove('is-scroll-locked');

            // Match the loader's CSS fade-out duration before starting
            // hero animations, so they begin as the loader disappears.
            setTimeout(() => {
                document.body.classList.add('hero-loaded');
            }, 400);
        }, 1800);
    });
}

/**
 * ========================================
 * CHEF SIGNATURE DRAW ANIMATION
 * Adds .sig-active to .chef-showcase when
 * it enters the viewport, triggering the
 * SVG stroke-dashoffset animation.
 * ========================================
 */
function initChefSignature() {
    const showcase = document.querySelector('.about');
    if (!showcase) return;

    // Respect reduced-motion preference — paths are already visible via CSS
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showcase.classList.add('sig-active');
                    observer.unobserve(showcase);
                }
            });
        },
        { threshold: 0.25 }
    );

    observer.observe(showcase);
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
                // Skip updates while the mobile menu is open — the body's
                // fixed-position scroll-lock fakes a scrollY of 0, which
                // would otherwise wrongly remove the .scrolled class.
                if (navMenu && navMenu.classList.contains('active')) {
                    ticking = false;
                    return;
                }

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
            const opening = !navMenu.classList.contains('active');
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Lock scroll using a class-based approach (no position:fixed,
            // no body style writes — avoids iOS WebKit's layout-reflow blink).
            document.documentElement.classList.toggle('is-scroll-locked', opening);
            document.body.classList.toggle('is-scroll-locked', opening);
        });
    
        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.documentElement.classList.remove('is-scroll-locked');
                document.body.classList.remove('is-scroll-locked');

                // Resync the sticky reserve button after the anchor jump.
                // The IntersectionObserver watching the hero can miss the
                // state change because scroll-lock removal + anchor scroll
                // happen in the same frame, leaving the button stuck hidden.
                // We re-check the hero's position once the browser has
                // settled into the new scroll position.
                setTimeout(() => {
                    const stickyBtn = document.getElementById('stickyReserve');
                    const hero = document.getElementById('home');
                    if (!stickyBtn || !hero) return;
                    const heroBottom = hero.getBoundingClientRect().bottom;
                    if (heroBottom <= 0) {
                        // Hero is fully scrolled past — show the button
                        stickyBtn.classList.remove('hidden');
                        stickyBtn.classList.add('visible');
                    } else {
                        // Hero still visible — keep button hidden
                        stickyBtn.classList.remove('visible');
                        stickyBtn.classList.add('hidden');
                    }
                    // Also clear the menu-open class in case it lingered
                    stickyBtn.classList.remove('menu-open');
                }, 600); // 600ms covers smooth-scroll anchor jumps comfortably
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

    // Reset nav on resize — only act when the mobile menu is actually open
    // and the user has resized past the desktop breakpoint. Avoids spurious
    // scroll jumps and flashes when resizing the window normally.
    let resizeTimer;
    let resizeFlashTimer;
    window.addEventListener('resize', () => {
        // Suppress the menu's transform transition during resize so the menu
        // doesn't slide visibly when crossing the desktop breakpoint
        navMenu.classList.add('no-transition');
        clearTimeout(resizeFlashTimer);
        resizeFlashTimer = setTimeout(() => {
            navMenu.classList.remove('no-transition');
        }, 250);

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Only intervene if the menu is currently open AND we're now on desktop
            if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
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
        }, 100);
    });
}

/**
 * ========================================
 * MAGNETIC BUTTONS
 * ========================================
 */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Exclude hero CTA buttons from magnetic effect
    // so inline transform doesn't override CSS animation
    const magneticBtns = document.querySelectorAll('.magnetic-btn:not(.hero-cta-primary):not(.hero-cta-secondary)');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
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
                    // Only stagger non-menu items
                    if (!entry.target.classList.contains('menu-item')) {
                        entry.target.style.transitionDelay = `${index * 0.08}s`;
                    } else {
                        entry.target.style.transitionDelay = '0s';
                    }
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

    // Observe The Visionary and Find Us
    // whose parents aren't in the main selector
    const extraTargets = [
        document.querySelector('.chef-editorial-header'),
        document.querySelector('.contact-panel-header')
    ];

    extraTargets.forEach(el => {
        if (!el) return;
        observer.observe(el);
    });
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
            span.style.animationDelay = `${index * 0.05}s`;
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
    const heroElements = document.querySelectorAll('.hero-subtitle span, .hero-title .char, .hero-tagline');
    heroElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = '';
    });
}

/**
 * ========================================
 * MENU FILTERING - ENHANCED
 * ========================================
 */
function initMenuFiltering() {
    const categoryBtns = document.querySelectorAll('.menu-categories:not(.gallery-categories) .category-btn');
    const menuItems    = document.querySelectorAll('.menu-item');
    const menuHeadings = document.querySelectorAll('.menu-heading');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            // Tell accordion which section to expand on mobile
            if (typeof window.__menuAccordionSetCategory === 'function') {
                window.__menuAccordionSetCategory(category);
            }

            // Headings
            menuHeadings.forEach(heading => {
                heading.classList.toggle('hidden', category !== 'all');
            });

            const outgoing = [];
            const incoming = [];

            menuItems.forEach(item => {
                const matches = category === 'all' || item.dataset.category === category;
                if (matches) incoming.push(item);
                else outgoing.push(item);
            });

            // Fade out non-matching
            outgoing.forEach(item => {
                item.style.transitionDelay = '0s';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.classList.add('hidden');
                    item.style.opacity = '';
                    item.style.transform = '';
                }, 350);
            });

            // Stagger in matching after outgoing leave
            setTimeout(() => {
                incoming.forEach((item, i) => {
                    // Unhide and reset to start state
                    item.classList.remove('hidden');
                    item.style.transitionDelay = '0s';
                    item.style.transition = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    // Force reflow so the browser registers the start state
                    void item.offsetHeight;

                    // Re-enable transition and animate to end state
                    item.style.transition = '';
                    requestAnimationFrame(() => {
                        item.style.transitionDelay = `${i * 50}ms`;
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                });
            }, (outgoing.length && window.matchMedia('(min-width: 769px)').matches) ? 300 : 0);
        });
    });
}

/**
 * ========================================
 * MOBILE MENU ACCORDION
 * ========================================
 */
function initMenuAccordion() {
    const grid = document.querySelector('.menu-grid');
    if (!grid) return;

    const headings = Array.from(grid.querySelectorAll('.menu-heading'));
    if (!headings.length) return;

    const showAllBtn = document.getElementById('menuShowAll');

    // Build a map: heading -> [items belonging to it]
    const sections = headings.map((heading, i) => {
        const next = headings[i + 1] || null;
        const items = [];
        let node = heading.nextElementSibling;
        while (node && node !== next) {
            if (node.classList.contains('menu-item')) items.push(node);
            node = node.nextElementSibling;
        }
        return { heading, items, key: heading.dataset.heading };
    });

    let showAllMode = false;

    // Set of currently-open section keys. Multiple sections can be open
    // simultaneously — tapping a heading toggles its own state without
    // affecting others. No auto-scroll: the user stays exactly where they
    // are, the tapped section expands/collapses in place.
    const openKeys = new Set();

    // Apply collapsed/open state based on which keys are open
    function applyState() {
        sections.forEach(sec => {
            const open = showAllMode || openKeys.has(sec.key);
            sec.heading.classList.toggle('is-open', open);
            sec.items.forEach(item => {
                item.classList.toggle('is-collapsed', !open);
            });
        });
    }

    // Default: first section open
    openKeys.add(sections[0].key);
    applyState();

    // Heading click → toggle that section's open state independently
    // No closing of others, no scrolling — pure local toggle.
    headings.forEach(heading => {
        heading.addEventListener('click', () => {
            if (window.matchMedia('(min-width: 769px)').matches) return;

            const key = heading.dataset.heading;

            // If currently in show-all mode, tapping any heading exits show-all
            // and captures the current "all open" state minus the tapped one.
            if (showAllMode) {
                showAllMode = false;
                if (showAllBtn) {
                    showAllBtn.classList.remove('is-active');
                    // Fade-swap the text to match
                    showAllBtn.classList.add('is-fading');
                    setTimeout(() => {
                        showAllBtn.textContent = 'Show All Sections';
                        showAllBtn.classList.remove('is-fading');
                    }, 150);
                }
                // Pre-fill openKeys with every section (since they were all visually open)
                openKeys.clear();
                sections.forEach(sec => openKeys.add(sec.key));
                // Then remove the tapped one (since the tap means "close this")
                openKeys.delete(key);
                applyState();
                return;
            }

            // Normal toggle when not in show-all mode
            if (openKeys.has(key)) {
                openKeys.delete(key);
            } else {
                openKeys.add(key);
            }
            applyState();
        });
    });

    // Show All toggle
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            showAllMode = !showAllMode;
            showAllBtn.classList.toggle('is-active', showAllMode);

            // Fade text out, swap, fade back in
            showAllBtn.classList.add('is-fading');
            setTimeout(() => {
                showAllBtn.textContent = showAllMode ? 'Collapse Sections' : 'Show All Sections';
                showAllBtn.classList.remove('is-fading');
            }, 200);

            openKeys.clear();
            if (!showAllMode) {
                openKeys.add(sections[0].key);
            }
            applyState();
        });
    }

    // Hook for the existing category filter to control accordion.
    // Filter UX is "focus on this category" — close everything else, open
    // just the filtered one. (When filter says 'all', reset to default of
    // first-section-open.)
    window.__menuAccordionSetCategory = function(category) {
        if (window.matchMedia('(min-width: 769px)').matches) return;
        showAllMode = false;
        if (showAllBtn) {
            showAllBtn.classList.remove('is-active');
            showAllBtn.textContent = 'Show All Sections';
        }
        openKeys.clear();
        if (category === 'all') {
            openKeys.add(sections[0].key);
        } else {
            openKeys.add(category);
        }
        applyState();
    };
}

/**
 * ========================================
 * GALLERY FILTER
 * ========================================
 */
function initGalleryFilter() {
    const galleryBtns  = document.querySelectorAll('[data-gallery]');
    const filterBtns   = document.querySelectorAll('.gallery-categories .category-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.gallery;

            // Split items into outgoing and incoming based on the new filter
            const outgoing = [];
            const incoming = [];
            galleryItems.forEach(item => {
                const itemCat = item.dataset.gallery;
                const matches = filter === 'all' || itemCat === filter;
                const isCurrentlyVisible = !item.classList.contains('gallery-hidden');

                if (matches && !isCurrentlyVisible)      incoming.push(item);
                else if (!matches && isCurrentlyVisible) outgoing.push(item);
                else if (matches && isCurrentlyVisible)  incoming.push(item); // re-stagger
            });

            // Phase 1 — fade out everything that doesn't belong
            outgoing.forEach(item => {
                item.style.transitionDelay = '0s';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.97)';
            });

            // Phase 2 — after outgoing is gone, hide them and fade incoming in
            setTimeout(() => {
                outgoing.forEach(item => {
                    item.classList.add('gallery-hidden');
                });

                incoming.forEach((item, index) => {
                    item.classList.remove('gallery-hidden');
                    // Force start state instantly (no animation to the start)
                    item.style.transitionDelay = '0s';
                    item.style.transition = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.97)';

                    // Force reflow so the start state is registered
                    void item.offsetHeight;

                    // Re-enable transition and animate in with stagger
                    item.style.transition = '';
                    requestAnimationFrame(() => {
                        item.style.transitionDelay = `${index * 0.04}s`;
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                });
            }, outgoing.length ? 350 : 0);
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
    const heroImage = document.querySelector('.hero-video') || document.querySelector('.hero-image');
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
                const heroImage = document.querySelector('.hero-image');
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
 * AUDIO PLAY
 * ========================================
 */
function initHeroAmbience() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const tracks = [
        'audio/ambient-1.mp3',
        'audio/ambient-2.mp3',
        'audio/ambient-3.mp3'
    ];

    const MAX_VOLUME = 0.2;

    let currentTrackIndex = 0;
    let lastTrackIndex = 0;
    let audio = new Audio(tracks[0]);

    // Quietly disable the feature if audio files don't exist
    audio.addEventListener('error', () => {
        const toggle = document.getElementById('audioToggle');
        if (toggle) toggle.style.display = 'none';
    }, { once: true });

    audio.loop = false;
    audio.volume = 0;

    let fadeInterval = null;
    let audioUnlocked = false;
    let heroVisible = false;
    let isPlaying = false;
    let isManuallyStopped = false; // track if user manually muted

    // Auto advance when track ends
    audio.addEventListener('ended', () => {
        if (heroVisible && audioUnlocked && isPlaying) {
            switchTrack();
            setTimeout(() => {
                audio.play().then(() => {
                    fadeVolume(MAX_VOLUME, 1200);
                }).catch(() => {});
            }, 300);
        }
    });

    function fadeVolume(targetVolume, duration, onComplete) {
        if (fadeInterval) {
            cancelAnimationFrame(fadeInterval);
            fadeInterval = null;
        }
    
        const startVolume = audio.volume;
        const startTime = performance.now();
    
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
    
            // Ease out for smooth fade
            const eased = 1 - Math.pow(1 - progress, 3);
            audio.volume = Math.min(1, Math.max(0,
                startVolume + (targetVolume - startVolume) * eased
            ));
    
            if (progress < 1) {
                fadeInterval = requestAnimationFrame(step);
            } else {
                audio.volume = Math.min(1, Math.max(0, targetVolume));
                fadeInterval = null;
                if (onComplete) onComplete();
            }
        }
    
        fadeInterval = requestAnimationFrame(step);
    }

    function switchTrack() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * tracks.length);
        } while (newIndex === lastTrackIndex);

        lastTrackIndex = currentTrackIndex;
        currentTrackIndex = newIndex;
        audio.src = tracks[currentTrackIndex];
        audio.load();
    }

    function playHero() {
        if (!isPlaying || isManuallyStopped) return;
        audio.play().then(() => {
            fadeVolume(MAX_VOLUME, 1200);
        }).catch(() => {});
    }

    function pauseHero() {
        // Fade out then pause and switch track for next return
        fadeVolume(0, 900, () => {
            audio.pause();
            audio.currentTime = 0;
            switchTrack();
        });
    }

    function muteHero() {
        // Fade out then pause — keep position, no track switch
        fadeVolume(0, 500, () => {
            audio.pause();
        });
    }

    // IntersectionObserver — use threshold 0 for reliable mobile detection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            heroVisible = entry.isIntersecting;
            if (!audioUnlocked) return;

            if (heroVisible && isPlaying && !isManuallyStopped) {
                // Resume audio
                audio.play().then(() => {
                    fadeVolume(MAX_VOLUME, 1200);
                }).catch(() => {});
            } else if (!heroVisible && isPlaying) {
                pauseHero();
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px'
    });

    observer.observe(heroSection);

    // Audio toggle button
    const audioToggle = document.getElementById('audioToggle');
    const audioIconOn = document.getElementById('audioIconOn');
    const audioIconOff = document.getElementById('audioIconOff');

    function showPlayingIcon() {
        if (audioIconOff) audioIconOff.style.display = 'none';
        if (audioIconOn) audioIconOn.style.display = 'block';
    }

    function showMutedIcon() {
        if (audioIconOn) audioIconOn.style.display = 'none';
        if (audioIconOff) audioIconOff.style.display = 'block';
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!audioUnlocked) {
                // First ever click — unlock audio
                audioUnlocked = true;
                isPlaying = true;
                isManuallyStopped = false;

                audio.volume = 0;
                audio.play().then(() => {
                    fadeVolume(MAX_VOLUME, 1200);
                    showPlayingIcon();
                }).catch((err) => {
                    console.error('Play failed:', err);
                    audioUnlocked = false;
                    isPlaying = false;
                });
                return;
            }

            // Toggle after unlock
            if (isPlaying && !isManuallyStopped) {
                // Currently playing — mute it
                isManuallyStopped = true;
                muteHero();
                showMutedIcon();
            } else {
                // Currently muted — resume
                isManuallyStopped = false;
                isPlaying = true;
                audio.play().then(() => {
                    fadeVolume(MAX_VOLUME, 800);
                    showPlayingIcon();
                }).catch(() => {});
            }
        });
    }
    
}

/**
 * ========================================
 * STICKY MOBILE RESERVE BUTTON
 * ========================================
 */
function initStickyReserve() {
    const btn       = document.getElementById('stickyReserve');
    const hero      = document.getElementById('home');
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');
    const footer    = document.querySelector('.footer');

    if (!btn || !hero) return;

    // Show button only after the entire hero section
    // has completely scrolled out of view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Hero still visible — keep button hidden
                btn.classList.remove('visible');
                btn.classList.add('hidden');
            } else {
                // Hero completely gone — show button
                btn.classList.remove('hidden');
                btn.classList.add('visible');
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px'   // fires exactly when last pixel leaves viewport
    });

    heroObserver.observe(hero);

    // Hide when mobile menu is open
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                btn.classList.add('menu-open');
            } else {
                btn.classList.remove('menu-open');
            }
        });
    }

    // Hide when footer comes into view to avoid overlap
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    btn.classList.remove('visible');
                    btn.classList.add('hidden');
                } else {
                    // Footer gone — restore button if hero is also out of view
                    // (i.e. hero's bottom edge is at or above viewport top)
                    if (hero.getBoundingClientRect().bottom <= 0) {
                        btn.classList.remove('hidden');
                        btn.classList.add('visible');
                    }
                }
            });
        }, { threshold: 0.1 });

        footerObserver.observe(footer);
    }
}

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

/**
 * ========================================
 * STAT COUNTER ANIMATION
 * ========================================
 */
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const parseStatValue = (text) => {
        // Returns { target, suffix }
        // e.g. "15K+" → { target: 15, suffix: 'K+' }
        // e.g. "37"   → { target: 37, suffix: '' }
        const match = text.trim().match(/^(\d+\.?\d*)(.*)/);
        if (!match) return { target: 0, suffix: '' };
        return {
            target: parseFloat(match[1]),
            suffix: match[2] || ''
        };
    };

    const animateCounter = (el, target, suffix, duration = 2000) => {
        const start     = performance.now();
        const isDecimal = target % 1 !== 0;

        const tick = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic — fast start, slow finish
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = eased * target;
            el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el              = entry.target;
            const originalText    = el.dataset.statOriginal || el.textContent;
            // Store original so re-entry doesn't break it
            el.dataset.statOriginal = originalText;

            const { target, suffix } = parseStatValue(originalText);
            animateCounter(el, target, suffix, 2000);

            // Only animate once
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
}


function initSweepLabels() {
    const allMeasured = document.querySelectorAll('.section-label--sweep, .section-label--breathe');
    if (!allMeasured.length) return;

    // Measurement function — called when page is ready
    const measureWidths = () => {
        allMeasured.forEach(label => {
            const width = label.getBoundingClientRect().width;
            if (width > 0) {
                label.style.setProperty('--label-width', `${width}px`);
            }
        });
    };

    // Measure on window load (after fonts and layout settle)
    if (document.readyState === 'complete') {
        measureWidths();
    } else {
        window.addEventListener('load', measureWidths);
    }

    // Re-measure on resize so widths stay accurate
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(measureWidths, 200);
    });

    // Sweep observer
    const sweepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const label = entry.target.querySelector('.section-label--sweep');
            if (label) {
                // Ensure measurement is fresh before triggering
                if (!label.style.getPropertyValue('--label-width')) {
                    const w = label.getBoundingClientRect().width;
                    if (w > 0) label.style.setProperty('--label-width', `${w}px`);
                }
                label.classList.add('sweep-active');
            }
            sweepObserver.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    [
        document.querySelector('.about-content'),
        document.querySelector('.special-content'),
        document.querySelector('.chef-editorial-header'),
        document.querySelector('.contact-panel-header')
    ].forEach(el => { if (el) sweepObserver.observe(el); });

    // Breathe observer
    const breatheObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const label = entry.target.querySelector('.section-label--breathe');
            if (label) {
                // Ensure measurement is fresh before triggering
                if (!label.style.getPropertyValue('--label-width')) {
                    const w = label.getBoundingClientRect().width;
                    if (w > 0) label.style.setProperty('--label-width', `${w}px`);
                }
                label.classList.add('breathe-active');
            }
            breatheObserver.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section-header, .reservation-content').forEach(el => {
        if (el.querySelector('.section-label--breathe')) {
            breatheObserver.observe(el);
        }
    });
}

// ── Allergen tag tap-to-toggle (touch devices only) ─────────
(function() {
    // Detect touch capability
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (!isTouch) return;

    let activeTag = null;

    document.addEventListener('click', (e) => {
        const tag = e.target.closest('.allergen-tag');

        // Tapped a tag
        if (tag) {
            e.stopPropagation();
            // Same tag → toggle off
            if (tag === activeTag) {
                tag.classList.remove('is-active');
                activeTag = null;
                return;
            }
            // Different tag → close previous, open new
            if (activeTag) activeTag.classList.remove('is-active');
            tag.classList.add('is-active');
            activeTag = tag;
            return;
        }

        // Tapped outside any tag → close active one
        if (activeTag) {
            activeTag.classList.remove('is-active');
            activeTag = null;
        }
    });
})();

/**
 * ========================================
 * CUSTOM DATE PICKER
 * Replaces a native <input type="date"> with a custom calendar UI
 * that behaves identically across all devices (especially iOS).
 *
 * Usage: initDatePicker(inputElement)
 *
 * The native input stays in the DOM (hidden) as the backing store.
 * When the user picks a date, the input's value is set and a
 * 'change' event is dispatched — existing listeners keep working.
 * ========================================
 */
function initDatePicker(input) {
    if (!input) return;

    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const WEEKDAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    // ── Helpers ───────────────────────────────────────────
    const pad = n => String(n).padStart(2, '0');
    const toISO = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const fromISO = str => {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d);
    };
    const sameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);

    // ── Build DOM ──────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'date-picker-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    input.classList.add('native-date');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'date-picker-trigger is-placeholder';
    trigger.innerHTML = `
        <span class="date-picker-display">Select a date</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    `;
    wrapper.appendChild(trigger);

    const backdrop = document.createElement('div');
    backdrop.className = 'date-picker-backdrop';
    document.body.appendChild(backdrop);

    const panel = document.createElement('div');
    panel.className = 'date-picker-panel';
    panel.innerHTML = `
        <div class="date-picker-header">
            <button type="button" class="date-picker-nav date-picker-prev" aria-label="Previous month">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <div class="date-picker-monthyear"></div>
            <button type="button" class="date-picker-nav date-picker-next" aria-label="Next month">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
        </div>
        <div class="date-picker-weekdays">
            ${WEEKDAYS_SHORT.map(d => `<div class="date-picker-weekday">${d}</div>`).join('')}
        </div>
        <div class="date-picker-grid"></div>
        <div class="date-picker-footnote"></div>
    `;

    // Panel always lives in <body> to avoid stacking-context issues with parents.
    // Position is set on open() based on trigger's bounding rect (desktop) or
    // pure CSS centering (mobile).
    document.body.appendChild(panel);

    const monthYearEl = panel.querySelector('.date-picker-monthyear');
    const prevBtn     = panel.querySelector('.date-picker-prev');
    const nextBtn     = panel.querySelector('.date-picker-next');
    const gridEl      = panel.querySelector('.date-picker-grid');
    const footnoteEl  = panel.querySelector('.date-picker-footnote');
    const displayEl   = trigger.querySelector('.date-picker-display');

    // Build the closed-days footnote from config
    if (window.LUMIERE_CONFIG && window.LUMIERE_CONFIG.openingHours) {
        const closedDays = Object.entries(window.LUMIERE_CONFIG.openingHours)
            .filter(([, entry]) => entry.closed)
            .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));
        if (closedDays.length > 0) {
            const closedText = closedDays.length === 1
                ? `Closed ${closedDays[0]}s`
                : `Closed ${closedDays.join(', ')}`;
            footnoteEl.textContent = closedText;
        }
    }

    // ── State ──────────────────────────────────────────────
    let viewYear  = today.getFullYear();
    let viewMonth = today.getMonth();
    let selectedDate = null;

    // Initialize from input's current value, if any
    if (input.value) {
        selectedDate = fromISO(input.value);
        viewYear = selectedDate.getFullYear();
        viewMonth = selectedDate.getMonth();
        updateTriggerDisplay();
    }

    // ── Rendering ──────────────────────────────────────────
    function render() {
        monthYearEl.textContent = `${MONTHS[viewMonth]} ${viewYear}`;

        // Disable prev if showing today's month, next if showing max month
        const viewFirst = new Date(viewYear, viewMonth, 1);
        const todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
        const maxFirst = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        
        prevBtn.classList.toggle('is-disabled', viewFirst <= todayFirst);
        nextBtn.classList.toggle('is-disabled', viewFirst >= maxFirst);

        // Calculate grid: 6 rows × 7 cols, starting from Monday
        // JS getDay() returns 0=Sun..6=Sat, we want 0=Mon..6=Sun
        const firstOfMonth = new Date(viewYear, viewMonth, 1);
        const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // shift Sun=0 → Mon=0
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

        gridEl.innerHTML = '';
        const totalCells = 42; // 6 × 7

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'date-picker-cell';

            let cellDate;
            let dayNum;
            let isOtherMonth = false;

            if (i < firstWeekday) {
                // Previous month tail
                dayNum = daysInPrevMonth - firstWeekday + 1 + i;
                cellDate = new Date(viewYear, viewMonth - 1, dayNum);
                isOtherMonth = true;
            } else if (i >= firstWeekday + daysInMonth) {
                // Next month head
                dayNum = i - firstWeekday - daysInMonth + 1;
                cellDate = new Date(viewYear, viewMonth + 1, dayNum);
                isOtherMonth = true;
            } else {
                // Current month
                dayNum = i - firstWeekday + 1;
                cellDate = new Date(viewYear, viewMonth, dayNum);
            }

            cell.textContent = dayNum;

            if (isOtherMonth) cell.classList.add('is-other-month');
            if (sameDay(cellDate, today)) cell.classList.add('is-today');
            if (selectedDate && sameDay(cellDate, selectedDate)) cell.classList.add('is-selected');

            // Past dates and dates beyond max range → fully disabled
            if (cellDate < today || cellDate > maxDate) {
                cell.disabled = true;
            }
            // Closed days → NOT disabled, but click-blocked + tooltip
            else if (window.LumiereHours && window.LumiereHours.isClosedDay(toISO(cellDate))) {
                cell.classList.add('is-closed-day');
                const tooltip = document.createElement('span');
                tooltip.className = 'date-picker-tooltip';
                tooltip.textContent = 'Closed on Mondays';
                cell.appendChild(tooltip);
            }

            cell.addEventListener('click', (e) => {
                if (cell.disabled) return;

                // Closed day: show tooltip momentarily, don't select.
                // Stop propagation so the outside-click listener doesn't close the panel.
                if (cell.classList.contains('is-closed-day')) {
                    e.stopPropagation();
                    const tooltip = cell.querySelector('.date-picker-tooltip');
                    if (tooltip) {
                        // Hide any other tooltips currently visible
                        gridEl.querySelectorAll('.date-picker-tooltip.is-visible').forEach(t => {
                            if (t !== tooltip) t.classList.remove('is-visible');
                        });
                        tooltip.classList.add('is-visible');
                        clearTimeout(cell._tooltipTimer);
                        cell._tooltipTimer = setTimeout(() => {
                            tooltip.classList.remove('is-visible');
                        }, 2500);
                    }
                    return;
                }

                selectedDate = cellDate;
                viewYear = cellDate.getFullYear();
                viewMonth = cellDate.getMonth();
                input.value = toISO(cellDate);
                input.dispatchEvent(new Event('change', { bubbles: true }));
                updateTriggerDisplay();
                render();
                close();
            });

            gridEl.appendChild(cell);
        }
    }

    function updateTriggerDisplay() {
        if (!selectedDate) {
            displayEl.textContent = 'Select a date';
            trigger.classList.add('is-placeholder');
            return;
        }
        const dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][selectedDate.getDay()];
        const monthName = MONTHS[selectedDate.getMonth()];
        displayEl.textContent = `${dayName}, ${selectedDate.getDate()} ${monthName} ${selectedDate.getFullYear()}`;
        trigger.classList.remove('is-placeholder');
    }

    // Listen for external clears / resets — when other code sets
    // input.value = '' and dispatches 'change', the picker should
    // forget its internal selectedDate and revert to the placeholder.
    // Without this, the trigger keeps showing the stale date label.
    input.addEventListener('change', () => {
        if (input.value === '' && selectedDate !== null) {
            selectedDate = null;
            updateTriggerDisplay();
        }
    });

    // ── Open / close ───────────────────────────────────────
    // Holds scroll position when picker opens on mobile (for lock/restore)
    let lockedScrollY = 0;

    function open() {
        // If input was changed externally (e.g. quick-pick buttons), re-sync
        if (input.value) {
            const externalDate = fromISO(input.value);
            if (!selectedDate || !sameDay(externalDate, selectedDate)) {
                selectedDate = externalDate;
                viewYear = externalDate.getFullYear();
                viewMonth = externalDate.getMonth();
                updateTriggerDisplay();
            }
        }
        render();

        const isMobile = !window.matchMedia('(min-width: 769px)').matches;

        // Position panel below trigger (desktop only — mobile uses CSS centering)
        if (!isMobile) {
            const rect = trigger.getBoundingClientRect();
            panel.style.top = `${rect.bottom + window.scrollY + 8}px`;
            panel.style.left = `${rect.left + window.scrollX}px`;
        } else {
            // Clear desktop styles in case window was resized
            panel.style.top = '';
            panel.style.left = '';

            // Lock page scroll on mobile while picker is open (matches nav-menu pattern)
            lockedScrollY = window.scrollY;
            document.body.style.top = `-${lockedScrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
        }

        panel.classList.add('is-open');
        backdrop.classList.add('is-open');
        trigger.classList.add('is-open');
    }

    function close() {
        const wasMobileLocked = document.body.style.position === 'fixed';

        panel.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        trigger.classList.remove('is-open');

        if (wasMobileLocked) {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, lockedScrollY);
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = '';
            }, 0);
        }
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.classList.contains('is-open')) close();
        else open();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (prevBtn.classList.contains('is-disabled')) return;
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        render();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (nextBtn.classList.contains('is-disabled')) return;
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        render();
    });

    backdrop.addEventListener('click', close);

    // Click outside (desktop)
    document.addEventListener('click', (e) => {
        if (!panel.classList.contains('is-open')) return;
        if (panel.contains(e.target) || trigger.contains(e.target)) return;
        close();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
    });

    // Close on scroll (desktop only — mobile uses fixed centering, no problem)
    window.addEventListener('scroll', () => {
        if (panel.classList.contains('is-open') && window.matchMedia('(min-width: 769px)').matches) {
            close();
        }
    }, { passive: true });

    // Listen for external value changes (e.g. quick-pick buttons setting input.value)
    input.addEventListener('change', () => {
        if (!input.value) return;
        const externalDate = fromISO(input.value);
        if (!selectedDate || !sameDay(externalDate, selectedDate)) {
            selectedDate = externalDate;
            updateTriggerDisplay();
        }
    });
}

/**
 * ========================================
 * OPENING HOURS HELPERS
 * Shared utilities that read from config.openingHours and produce
 * date-specific slot lists. Used by the date picker and by the
 * reservation/modify booking pages.
 * ========================================
 */
(function() {
    if (!window.LUMIERE_CONFIG) return;

    const DAY_KEYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

    // Parse 'HH:MM' to minutes since midnight
    function toMinutes(hhmm) {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    }

    // Convert minutes since midnight back to 'HH:MM'
    function toHHMM(minutes) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    }

    /**
     * Returns the schedule entry for a given ISO date string (YYYY-MM-DD).
     * Output: { closed: true, dayName } OR { closed: false, dayName, services }
     */
    function getScheduleForDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        const dayKey = DAY_KEYS[d.getDay()];
        const dayName = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
        const entry = window.LUMIERE_CONFIG.openingHours[dayKey];

        if (!entry || entry.closed) {
            return { closed: true, dayName };
        }
        return { closed: false, dayName, services: entry.services };
    }

    /**
     * Whether the restaurant is closed on a given date.
     */
    function isClosedDay(dateStr) {
        return getScheduleForDate(dateStr).closed;
    }

    /**
     * Returns the list of bookable 30-min time slots for a given date,
     * factoring in the per-service last-seat buffer.
     *
     * Output: [] (closed) or ['12:00', '12:30', ..., '20:00']
     */
    function getSlotsForDate(dateStr) {
        const schedule = getScheduleForDate(dateStr);
        if (schedule.closed) return [];

        const buffer = window.LUMIERE_CONFIG.lastSeatBuffer;
        const slots = [];

        for (const service of schedule.services) {
            const startMin = toMinutes(service.start);
            const endMin   = toMinutes(service.end);
            const durationMin = endMin - startMin;

            // Use long buffer for services 4+ hours, short for shorter
            const bufferMin = durationMin >= 240 ? buffer.long : buffer.short;
            const lastSlotMin = endMin - bufferMin;

            for (let m = startMin; m <= lastSlotMin; m += 30) {
                slots.push(toHHMM(m));
            }
        }

        return slots;
    }

    /**
     * Like getSlotsForDate, but returns slots grouped by service window.
     * Each group has a label (e.g. 'Lunch', 'Dinner') derived from start time.
     * Used by the UI to render visually-separated service blocks on
     * split-service days like Sunday.
     *
     * Output: [
     *   { label: 'Lunch',  slots: ['12:00', '12:30', ...] },
     *   { label: 'Dinner', slots: ['18:00', '18:30', ...] }
     * ]
     */
    function getSlotGroupsForDate(dateStr) {
        const schedule = getScheduleForDate(dateStr);
        if (schedule.closed) return [];

        const buffer = window.LUMIERE_CONFIG.lastSeatBuffer;
        const groups = [];

        for (const service of schedule.services) {
            const startMin = toMinutes(service.start);
            const endMin   = toMinutes(service.end);
            const durationMin = endMin - startMin;
            const bufferMin = durationMin >= 240 ? buffer.long : buffer.short;
            const lastSlotMin = endMin - bufferMin;

            const slots = [];
            for (let m = startMin; m <= lastSlotMin; m += 30) {
                slots.push(toHHMM(m));
            }

            // Label by start hour: <17:00 → Lunch, ≥17:00 → Dinner
            // (For most fine dining this binary works; can be extended later)
            const label = startMin < 17 * 60 ? 'Lunch' : 'Dinner';

            groups.push({ label, slots });
        }

        return groups;
    }

    /**
     * Find the closest open day after a given date (exclusive).
     * Stops searching after 14 days to avoid infinite loops on a
     * misconfigured schedule.
     *
     * Returns ISO date string or null.
     */
    function findNextOpenDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        for (let i = 1; i <= 14; i++) {
            const next = new Date(d);
            next.setDate(d.getDate() + i);
            const iso = next.toISOString().slice(0, 10);
            if (!isClosedDay(iso)) return iso;
        }
        return null;
    }

    // Expose as a clean namespace
    window.LumiereHours = {
        getScheduleForDate,
        isClosedDay,
        getSlotsForDate,
        getSlotGroupsForDate,
        findNextOpenDate
    };
})();

/**
 * ========================================
 * AUTO-SEASON
 * Updates the "Current Season — Spring 2026" line on the menu section
 * based on today's date, using meteorological seasons (calendar-aligned).
 * Spring: Mar–May, Summer: Jun–Aug, Autumn: Sep–Nov, Winter: Dec–Feb.
 * Winter uses the year of its Jan/Feb portion (e.g. Dec 2026 → Winter 2027).
 * ========================================
 */
(function() {
    const seasonNameEl = document.getElementById('seasonName');
    const seasonUpdatedEl = document.getElementById('seasonUpdated');
    if (!seasonNameEl && !seasonUpdatedEl) return;

    const SEASONS = [
        { name: 'Winter', startMonth: 12, firstMonth: 'December' }, // Dec → Winter (year + 1)
        { name: 'Spring', startMonth: 3,  firstMonth: 'March' },
        { name: 'Summer', startMonth: 6,  firstMonth: 'June' },
        { name: 'Autumn', startMonth: 9,  firstMonth: 'September' },
        { name: 'Winter', startMonth: 1,  firstMonth: 'December' }, // Jan-Feb → still Winter, same year
    ];

    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear();

    let season, displayYear, firstMonth;

    if (month === 12) {
        season = 'Winter';
        displayYear = year + 1;
        firstMonth = 'December';
    } else if (month <= 2) {
        season = 'Winter';
        displayYear = year;
        firstMonth = 'December';
    } else if (month <= 5) {
        season = 'Spring';
        displayYear = year;
        firstMonth = 'March';
    } else if (month <= 8) {
        season = 'Summer';
        displayYear = year;
        firstMonth = 'June';
    } else { // 9, 10, 11
        season = 'Autumn';
        displayYear = year;
        firstMonth = 'September';
    }

    // For "Menu updated", the year is the year the season started — usually
    // the same as displayYear, except for winter started in December.
    const updatedYear = (season === 'Winter' && month === 12) ? year : (season === 'Winter' ? year - 1 : year);

    if (seasonNameEl) {
        seasonNameEl.textContent = `${season} ${displayYear}`;
    }
    if (seasonUpdatedEl) {
        seasonUpdatedEl.textContent = `Menu updated ${firstMonth} ${updatedYear}`;
    }
})();

/**
 * ========================================
 * TOUCH TAP FEEDBACK
 * iOS Safari's :active pseudo-class doesn't always fire visibly on quick
 * taps. This script adds an .is-tapping class to interactive elements via
 * touch events, guaranteeing the scale-down feedback is seen.
 *
 * CSS rules in style.css target .is-tapping with the same transform
 * values that :active uses.
 * ========================================
 */
(function() {
    const TAP_SELECTOR = [
        // Homepage
        '.magnetic-btn',
        '.menu-show-all',
        '.experience-card',
        '.sticky-reserve',
        // Reservation flow — primary CTAs (Continue / Save / Yes)
        '.btn-next',
        '.btn-submit-modify',
        '.btn-yes',
        // Reservation flow — secondary / ghost buttons
        '.btn-back',
        '.btn-cancel-modify',
        '.btn-cancel-confirm',
        '.btn-keep',
        '.btn-retry',
        '.btn-no',
        // Success / post-action buttons
        '.success-btn',
        '.post-btn',
        // Party-size stepper
        '.party-btn',
        // 404 page
        '.error-btn-primary',
        '.error-btn-ghost',
        // Nav "Reserve" button (every page)
        '.nav-cta',
        // Reservation page — experience picker cards
        '.experience-option'
    ].join(', ');
    const HOLD_MS = 200; // minimum time the .is-tapping class stays on (so quick taps remain visible)

    function addTapping(e) {
        const el = e.target.closest(TAP_SELECTOR);
        if (!el) return;
        el.classList.add('is-tapping');
    }

    function clear(e) {
        const el = e.target.closest(TAP_SELECTOR);
        if (!el) return;
        // Keep the class for at least HOLD_MS to ensure the scale-down is visible
        setTimeout(() => el.classList.remove('is-tapping'), HOLD_MS);
    }

    // Listen to BOTH touch and pointer events. iOS Safari swallows
    // touchstart on <label> elements that wrap hidden radio/checkbox
    // inputs (the reservation page's .experience-option uses this
    // pattern), but pointerdown still fires reliably. Listening to both
    // covers every device + element-type combination without firing
    // twice — addTapping is idempotent: adding an already-present class
    // is a no-op.
    document.addEventListener('pointerdown', addTapping, { passive: true });
    document.addEventListener('touchstart',  addTapping, { passive: true });

    document.addEventListener('pointerup',     clear, { passive: true });
    document.addEventListener('pointercancel', clear, { passive: true });
    document.addEventListener('touchend',      clear, { passive: true });
    document.addEventListener('touchcancel',   clear, { passive: true });
})();

/**
 * ======================================== ;
 * CONSOLE WELCOME
 * (Optional brand signature shown when developers open the browser
 * console. Customize the text below or delete this entire block.)
 * ========================================
 */
console.log('%c🍽️ Lumière Fine Dining', 'font-size: 24px; font-weight: bold; color: #C6A769;');
console.log('%cA culinary experience crafted with passion.', 'font-size: 14px; color: #C9C3B8;');