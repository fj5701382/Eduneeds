/* =========================================================
   Eduneeds HOMEPAGE — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. ACADEMIC MATERIALS SLIDER
    // =========================================

    var track = document.getElementById('academicSlider');
    if (!track) return;

    var initialSlides = track.querySelectorAll('.slide');
    var productData = []; // Store original products with their category headers

    initialSlides.forEach(function(slide) {
        var headerEl = slide.querySelector('.slide-header');
        var catTitle = headerEl ? (headerEl.querySelector('h2') ? headerEl.querySelector('h2').innerHTML : 'Academic Resources') : 'Academic Resources';
        var catIcon = headerEl ? (headerEl.querySelector('.slide-icon') ? headerEl.querySelector('.slide-icon').textContent : 'library_books') : 'library_books';

        var cards = slide.querySelectorAll('.product-card');
        cards.forEach(function(card) {
            productData.push({
                headerTitle: catTitle,
                headerIcon: catIcon,
                cardNode: card.cloneNode(true)
            });
        });
    });

    var totalProducts = productData.length;
    var currentIndex = 0;
    var slides = [];
    var autoPlayInterval = null;
    var autoPlayDelay = 5000;

    // Determine products per view based on viewport width
    function getProductsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    var currentPerView = getProductsPerView();

    // Build slides dynamically for the current breakpoint
    function buildSlides() {
        var perView = getProductsPerView();
        var totalSlides = Math.ceil(totalProducts / perView);

        // Clear existing slides in the track
        track.innerHTML = '';

        for (var i = 0; i < totalSlides; i++) {
            var start = i * perView;
            var end = Math.min(start + perView, totalProducts);

            var slideDiv = document.createElement('div');
            slideDiv.className = 'slide';

            // Category header from first item in this slide
            var slideHeader = document.createElement('div');
            slideHeader.className = 'slide-header';
            slideHeader.innerHTML = '<span class="material-symbols-outlined slide-icon">' + productData[start].headerIcon + '</span><h2>' + productData[start].headerTitle + '</h2>';
            slideDiv.appendChild(slideHeader);

            // Grid for product cards
            var gridDiv = document.createElement('div');
            gridDiv.className = 'slide-grid';

            for (var j = start; j < end; j++) {
                gridDiv.appendChild(productData[j].cardNode.cloneNode(true));
            }

            slideDiv.appendChild(gridDiv);
            track.appendChild(slideDiv);
        }

        slides = track.querySelectorAll('.slide');
        buildDots(totalSlides);

        // Clamp index within bounds
        if (currentIndex >= totalSlides) {
            currentIndex = totalSlides - 1;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        updateSlider(false);
    }

    // Build dot buttons
    function buildDots(total) {
        var dotsContainer = document.querySelector('.slider-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';

        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.setAttribute('type', 'button');
            dotsContainer.appendChild(dot);
        }
    }

    // Update slider position & active dot
    function updateSlider(animate) {
        var totalSlides = slides.length;
        if (totalSlides === 0) return;

        if (animate === false) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        }

        // Each slide is 100% width of the slider container, so translateX is simply currentIndex * 100%
        var offset = currentIndex * 100;
        track.style.transform = 'translateX(-' + offset + '%)';

        if (animate === false) {
            void track.offsetHeight; // Force reflow
            track.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
        }

        // Update active dot class
        var allDots = document.querySelectorAll('.slider-dots .dot');
        allDots.forEach(function(dot, idx) {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Navigation functions
    function goToSlide(index) {
        var totalSlides = slides.length;
        if (totalSlides === 0) return;

        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }

        currentIndex = index;
        updateSlider(true);
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Autoplay controllers
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(function() {
            nextSlide();
        }, autoPlayDelay);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // =========================================
    // EVENT LISTENERS
    // =========================================

    // Prev / Next button listeners
    var prevBtn = document.getElementById('prevSlide');
    var nextBtn = document.getElementById('nextSlide');

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            resetAutoPlay();
        });
    }

    // Dot click listener (Event delegation)
    var dotsContainer = document.querySelector('.slider-dots');
    if (dotsContainer) {
        dotsContainer.addEventListener('click', function(e) {
            var dot = e.target.closest('.dot');
            if (!dot) return;
            var idx = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(idx)) {
                goToSlide(idx);
                resetAutoPlay();
            }
        });
    }

    // Touch / Swipe support with vertical scrolling protection
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;
    var isSwiping = false;

    track.addEventListener('touchstart', function(e) {
        if (!e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
        isSwiping = true;
    }, { passive: true });

    track.addEventListener('touchmove', function(e) {
        if (!isSwiping || !e.touches || e.touches.length === 0) return;
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;

        var deltaX = touchStartX - touchEndX;
        var deltaY = touchStartY - touchEndY;
        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);

        // Only trigger horizontal slide navigation if horizontal delta clearly exceeds vertical delta
        if (absX > absY && absX > 35) {
            if (deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoPlay();
        }
    }, { passive: true });

    // Desktop hover pause
    var section = document.querySelector('.slider-section');
    if (section) {
        section.addEventListener('mouseenter', stopAutoPlay);
        section.addEventListener('mouseleave', startAutoPlay);
    }

    // Responsive resize handler (debounced)
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            var newPerView = getProductsPerView();
            if (newPerView !== currentPerView) {
                currentPerView = newPerView;
                buildSlides();
            } else {
                updateSlider(false);
            }
        }, 150);
    });

    // Initialize slider
    buildSlides();
    startAutoPlay();

    // Expose controls for testing / debugging
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
