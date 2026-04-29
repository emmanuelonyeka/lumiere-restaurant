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
    initSmoothScroll();
    initGalleryFilter();
    initParallaxEffect();
    initTextReveal();
    initHeroAnimations();
    initGalleryTap();
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
    
    // Hide loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            
            
        }, 1800);
    });
    
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
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
            span.style.animationDelay = `${2 + index * 0.05}s`;
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
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems    = document.querySelectorAll('.menu-item');
    const menuHeadings = document.querySelectorAll('.menu-heading');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

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
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    // Two frames to ensure start state is painted
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            item.style.transitionDelay = `${i * 50}ms`;
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        });
                    });
                });
            }, outgoing.length ? 300 : 0);
        });
    });
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

            galleryItems.forEach((item, index) => {
                const itemCat = item.dataset.gallery;
                const matches = filter === 'all' || itemCat === filter;

                if (matches) {
                    item.classList.remove('gallery-hidden');
                    item.style.transitionDelay = `${index * 0.04}s`;
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.97)';
                    setTimeout(() => {
                        item.classList.add('gallery-hidden');
                        item.style.transitionDelay = '0s';
                    }, 350);
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

// Gallery tap effect for mobile
function initGalleryTap() {
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('touchstart', () => {
            // Close any other open items first
            galleryItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('tapped');
                }
            });
            // Show this item
            item.classList.add('tapped');
        }, { passive: true });

        item.addEventListener('touchend', () => {
            // Small delay before hiding so user sees it
            setTimeout(() => {
                item.classList.remove('tapped');
            }, 800);
        }, { passive: true });
    });
}

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
                    // Footer gone — restore if hero is also gone
                    if (!hero.getBoundingClientRect().bottom > 0) {
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

/**
 * ========================================
 * CONSOLE WELCOME
 * ========================================
 */
console.log('%c🍽️ Lumière Fine Dining', 'font-size: 24px; font-weight: bold; color: #C6A769;');
console.log('%cA culinary experience crafted with passion.', 'font-size: 14px; color: #C9C3B8;');
console.log('%cFor reservations: +33 1 23 45 67 89', 'font-size: 12px; color: #9A958A;');
