/* =========================================================
   Eduneeds - ANIMATIONS JAVASCRIPT
   Handles:
   - Scroll-based entrance animations
   - Theme icon rotation on toggle
   - Hamburger icon state on dashboard
   ========================================================= */

(function () {
    'use strict';

    // =========================================================
    // 1. SCROLL-BASED ENTRANCE ANIMATIONS (IntersectionObserver)
    // =========================================================
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.section, .slide-header, .product-card, .pin-card, .bill-card, .jamb-pin-card, .jamb-service-card');

        if (!elements.length) return;
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all immediately
            elements.forEach(function (el) {
                el.classList.add('animate-on-scroll', 'visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -30px 0px'
        });

        elements.forEach(function (el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // =========================================================
    // 2. THEME TOGGLE ICON ANIMATION
    // =========================================================
    function initThemeIconAnimation() {
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var icon = btn.querySelector('.theme-icon');
                if (!icon) return;

                // Briefly add the switching class for rotate+fade effect
                icon.classList.add('switching');
                setTimeout(function () {
                    icon.classList.remove('switching');
                }, 350);
            });
        });
    }

    // =========================================================
    // 3. DASHBOARD HAMBURGER ICON STATE (active class)
    // =========================================================
    function initHamburgerState() {
        var hamburgerBtn = document.getElementById('hamburgerBtn');
        var sidebarClose = document.getElementById('sidebarClose');

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', function () {
                hamburgerBtn.classList.toggle('active');
            });
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', function () {
                if (hamburgerBtn) hamburgerBtn.classList.remove('active');
            });
        }

        // Also remove on overlay click
        var mobileOverlay = document.getElementById('mobileOverlay');
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function () {
                if (hamburgerBtn) hamburgerBtn.classList.remove('active');
            });
        }

        // Remove on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && hamburgerBtn) {
                hamburgerBtn.classList.remove('active');
            }
        });
    }

    // =========================================================
    // 4. INIT ALL
    // =========================================================
    function initAnimations() {
        initScrollAnimations();
        initThemeIconAnimation();
        initHamburgerState();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }

    // Re-init when components load (e.g., nav injected dynamically)
    document.addEventListener('componentsLoaded', function () {
        setTimeout(function () {
            initThemeIconAnimation();
            initHamburgerState();
        }, 60);
    });

    // Expose re-init
    window.reinitAnimations = initAnimations;

}());
