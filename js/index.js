/* =========================================================
   Eduneeds HOMEPAGE — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. ACADEMIC MATERIALS SLIDER
    // =========================================

    var track = document.getElementById('academicSlider');
    var slides = document.querySelectorAll('.slide');
    var dots = document.querySelectorAll('.dot');
    var prevBtn = document.getElementById('prevSlide');
    var nextBtn = document.getElementById('nextSlide');
    var section = document.querySelector('.slider-section');

    var currentIndex = 0;
    var interval;

    // Get all product items from all slides (flatten into one array)
    var allProducts = [];
    slides.forEach(function(slide) {
        var items = slide.querySelectorAll('.product-card');
        items.forEach(function(item) {
            allProducts.push(item);
        });
    });

    var totalProducts = allProducts.length;

    // Get total number of slides needed (based on products per view)
    function getTotalSlides() {
        var perView = getProductsPerView();
        return Math.ceil(totalProducts / perView);
    }

    // Products per view based on screen size
    function getProductsPerView() {
        if (window.innerWidth < 480) return 1;
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    // Build slides from products
    function buildSlides() {
        var perView = getProductsPerView();
        var totalSlides = getTotalSlides();

        // Clear existing slides
        track.innerHTML = '';

        for (var i = 0; i < totalSlides; i++) {
            var start = i * perView;
            var end = Math.min(start + perView, totalProducts);

            var slideDiv = document.createElement('div');
            slideDiv.className = 'slide';

            var gridDiv = document.createElement('div');
            gridDiv.className = 'slide-grid';

            for (var j = start; j < end; j++) {
                var productClone = allProducts[j].cloneNode(true);
                gridDiv.appendChild(productClone);
            }

            slideDiv.appendChild(gridDiv);
            track.appendChild(slideDiv);
        }

        slides = track.querySelectorAll('.slide');
        updateDots(totalSlides);
        currentIndex = 0;
        updateSlider();
    }

    // Update dots
    function updateDots(total) {
        var dotsContainer = document.querySelector('.slider-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';

        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-index', i);

            dot.addEventListener('click', function(e) {
                var index = parseInt(this.getAttribute('data-index'));
                goToSlide(index);
                stopAutoPlay();
                setTimeout(startAutoPlay, 5000);
            });

            dotsContainer.appendChild(dot);
        }

        dots = document.querySelectorAll('.dot');
    }

    // Update slider position
    function updateSlider() {
        var totalSlides = slides.length;
        if (totalSlides === 0) return;

        var offset = currentIndex * (100 / totalSlides);
        track.style.transform = 'translateX(-' + offset + '%)';

        dots.forEach(function(dot, index) {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        var totalSlides = slides.length;
        if (totalSlides === 0) return;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        if (interval) clearInterval(interval);
        var delay = window.innerWidth < 768 ? 5000 : 4000;
        interval = setInterval(nextSlide, delay);
    }

    function stopAutoPlay() {
        clearInterval(interval);
        interval = null;
    }

    // Handle responsive
    function handleResponsive() {
        buildSlides();
        var newDots = document.querySelectorAll('.dot');
        newDots.forEach(function(dot) {
            dot.addEventListener('click', function(e) {
                var index = parseInt(this.getAttribute('data-index'));
                goToSlide(index);
                stopAutoPlay();
                setTimeout(startAutoPlay, 5000);
            });
        });
        dots = newDots;
        updateSlider();
        startAutoPlay();
    }

    // =========================================
    // EVENT LISTENERS
    // =========================================

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 5000);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 5000);
        });
    }

    // Touch swipe
    var touchStartX = 0;
    var touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopAutoPlay();
                setTimeout(startAutoPlay, 5000);
            }
        }, { passive: true });
    }

    // Hover pause
    if (section) {
        section.addEventListener('mouseenter', stopAutoPlay);
        section.addEventListener('mouseleave', function() {
            startAutoPlay();
        });
    }

    // Resize
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResponsive();
        }, 300);
    });

    // =========================================
    // INIT
    // =========================================

    buildSlides();

    window.sliderControls = {
        next: nextSlide,
        prev: prevSlide,
        goTo: goToSlide,
        getProductsPerView: getProductsPerView,
        totalProducts: totalProducts
    };

    // =========================================
    // 2. ACTIVE NAVIGATION LINKS
    // =========================================

    var navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            navLinks.forEach(function(nav) {
                nav.classList.remove('active');
            });
            this.classList.add('active');

            var targetId = this.getAttribute('data-target');
            if (targetId) {
                var targetSection = document.getElementById(targetId);
                if (targetSection) {
                    setTimeout(function() {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            }
        });
    });

    console.log('Eduneeds loaded. Products:', totalProducts, 'Per view:', getProductsPerView());
});

/* =========================================================
   3. BUY NOW / PROCEED -> AUTH LOGIN REDIRECT (index.html only)
   - Event delegation: also covers slider-cloned cards
   - Single listener = no duplicate handlers
   - Same-tab navigation to the existing login page
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
    var loginUrl = '../pages/login.html';

    document.addEventListener('click', function (event) {
        var button = event.target.closest('.btn-buy, .btn-proceed');
        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        // Frontend-safe: pass selected service name to the auth page
        var card = button.closest('.product-card, .pin-card, .bill-card, .service-card') || button.parentElement;
        var serviceName = '';
        if (card) {
            var title = card.querySelector('h3, h4, .pin-title, .service-title');
            serviceName = title ? title.textContent.trim() : '';
        }

        var url = serviceName
            ? loginUrl + '?service=' + encodeURIComponent(serviceName)
            : loginUrl;

        window.location.href = url;
    });
});
