/* =========================================================
   Eduneeds DASHBOARD — JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. DARK MODE TOGGLE
    // =========================================

    var themeToggle = document.querySelector('.theme-toggle');
    var themeIcon = document.querySelector('.theme-icon');

    if (themeToggle) {
        var savedTheme = localStorage.getItem('theme') || localStorage.getItem('Eduneeds-theme') || 'light';
        applyDashboardTheme(savedTheme);

        themeToggle.addEventListener('click', function() {
            applyDashboardTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
        });
    }

    function applyDashboardTheme(theme) {
        var normalizedTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', normalizedTheme);
        document.documentElement.classList.toggle('dark-mode', normalizedTheme === 'dark');
        document.body.classList.toggle('dark-mode', normalizedTheme === 'dark');
        localStorage.setItem('theme', normalizedTheme);
        localStorage.setItem('Eduneeds-theme', normalizedTheme);
        if (themeIcon) themeIcon.textContent = normalizedTheme === 'dark' ? 'light_mode' : 'dark_mode';
        themeToggle.setAttribute('aria-label', normalizedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('title', normalizedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // =========================================
    // 2. USER DROPDOWN
    // =========================================

    var userBtn = document.getElementById('userBtn');
    var userDropdown = document.getElementById('userDropdown');

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('open');
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.user-menu')) {
                userDropdown.classList.remove('open');
            }
        });
    }

    // =========================================
    // 3. MOBILE HAMBURGER MENU
    // =========================================

    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var sidebar = document.getElementById('sidebar');
    var sidebarClose = document.getElementById('sidebarClose');
    var mobileOverlay = document.getElementById('mobileOverlay');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (mobileOverlay) mobileOverlay.classList.add('show');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('show');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.addEventListener('click', openSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // =========================================
    // 4. SIDEBAR DROPDOWNS
    // =========================================

    var dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var parent = this.closest('.nav-dropdown');
            var isOpen = parent.classList.contains('open');

            document.querySelectorAll('.nav-dropdown').forEach(function(item) {
                item.classList.remove('open');
            });

            if (!isOpen) {
                parent.classList.add('open');
            }
        });
    });

    document.addEventListener('click', function(e) {
        var isDropdown = e.target.closest('.nav-dropdown');
        if (!isDropdown) {
            document.querySelectorAll('.nav-dropdown').forEach(function(item) {
                item.classList.remove('open');
            });
        }
    });

    // =========================================
    // 5. SERVICE CARD "BUY NOW" BUTTONS
    // =========================================

    var buyButtons = document.querySelectorAll('.btn-buy:not(.disabled)');

    buyButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            var service = this.getAttribute('data-service');
            var serviceName = this.closest('.service-card').querySelector('h3').textContent;

            if (!service) {
                alert('Service not found');
                return;
            }

            var priceEl = this.closest('.service-card').querySelector('.service-price');
            var isFree = priceEl && priceEl.textContent.trim() === 'Free';

            if (isFree) {
                var url = getServiceUrl(service);
                if (url) {
                    window.location.href = url;
                } else {
                    alert('This service is coming soon.');
                }
                return;
            }

            var confirmMsg = 'Buy "' + serviceName + '" now?';
            if (confirm(confirmMsg)) {
                var originalText = this.textContent;
                this.textContent = 'Processing...';
                this.disabled = true;

                setTimeout(function() {
                    btn.textContent = '✓ Added';
                    btn.style.background = '#16a34a';
                    btn.style.color = '#ffffff';
                    btn.style.borderColor = '#16a34a';

                    setTimeout(function() {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.style.color = '';
                        btn.style.borderColor = '';
                        btn.disabled = false;

                        var url = getServiceUrl(service);
                        if (url) {
                            window.location.href = url;
                        }
                    }, 1200);
                }, 1500);
            }
        });
    });

    // =========================================
    // 6. SIDEBAR NAVIGATION LINKS
    // =========================================

    var sidebarLinks = document.querySelectorAll('.nav-dropdown-menu a');

    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            closeSidebar();
            e.preventDefault();

            var service = this.getAttribute('data-service');
            if (service) {
                var url = getServiceUrl(service);
                if (url) {
                    window.location.href = url;
                } else {
                    alert('This service is coming soon.');
                }
            }
        });
    });

    var supportLink = document.querySelector('.sidebar-footer a');
    if (supportLink) {
        supportLink.addEventListener('click', function(e) {
            closeSidebar();
            e.preventDefault();
            var service = this.getAttribute('data-service');
            if (service) {
                var url = getServiceUrl(service);
                if (url) {
                    window.location.href = url;
                }
            }
        });
    }

    // =========================================
    // 7. GET SERVICE URL HELPER
    // =========================================

    function getServiceUrl(slug) {
        var urlMap = {
            // Scratch Cards
            'waec-scratch': '../services/product-detail.html?service=waec-scratch',
            'neco-token': '../services/product-detail.html?service=neco-token',
            'nabteb-scratch': '../services/product-detail.html?service=nabteb-scratch',
            'nbais-scratch': '../services/product-detail.html?service=nbais-scratch',
            'waec-gce': '../services/product-detail.html?service=waec-gce',
            'neco-verification': '../services/product-detail.html?service=neco-verification',
            'waec-verification': '../services/product-detail.html?service=waec-verification',
            'nabteb-olevel': '../services/product-detail.html?service=nabteb-olevel',
            'nabteb-alevel': '../services/product-detail.html?service=nabteb-alevel',

            // JAMB Services
            'jamb-olevel': '../services/jamb-olevel-confirmation.html',
            'jamb-original-result': '../services/jamb-original-result.html',
            'jamb-admission-letter': '../services/jamb-admission-letter.html',
            'jamb-reg-number': '../services/jamb-reg-number.html',
            'jamb-profile-code': '../services/jamb-profile-code.html',
            'jamb-admission-status': '../services/jamb-admission-status.html',
            'jamb-reprinting': '../services/jamb-reprinting.html',
            'jamb-change-course': '../services/jamb-change-course.html',
            'jamb-admission-picture': '../services/jamb-admission-picture.html',

            // JAMB PIN Vending
            'de-pin': '../services/jamb-pins.html',
            'mock-pin': '../services/jamb-pins.html',
            'utme-pin': '../services/jamb-pins.html',
            'utme-mock-pin': '../services/jamb-pins.html',

            // NIN / BVN
            'nin-verification': '../services/nin-bvn.html',
            'bvn-verification': '../services/nin-bvn.html',

            // Utilities
            'buy-airtime': '../services/buy-airtime.html',
            'buy-data': '../services/buy-data.html',
            'electricity': '../services/electricity.html',
            'tv-subscription': '../services/tv-subscription.html',

            // Other
            'transaction-history': '../services/transaction-history.html',
            'customer-support': '../contact.html'
        };

        return urlMap[slug] || null;
    }

    // =========================================
    // 8. VIEW ALL BUTTON
    // =========================================

    var viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../services/transaction-history.html';
        });
    }

    // =========================================
    // 9. ADD FUNDS BUTTON
    // =========================================

    var addFundsBtn = document.querySelector('.btn-add-funds');
    if (addFundsBtn) {
        addFundsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var amount = prompt('Enter amount to fund (₦):', '1000');
            if (amount && !isNaN(amount) && parseInt(amount) > 0) {
                alert('Wallet funded with ₦' + parseInt(amount).toLocaleString() + ' (Simulated)');
                var balanceEl = document.querySelector('.balance-amount');
                if (balanceEl) {
                    var current = parseInt(balanceEl.textContent.replace(/[₦,.]/g, ''));
                    var newBalance = current + parseInt(amount);
                    balanceEl.textContent = '₦' + newBalance.toLocaleString() + '.00';
                }
            }
        });
    }

    // =========================================
    // 10. TRANSFER BUTTON
    // =========================================

    var transferBtn = document.querySelector('.btn-transfer');
    if (transferBtn) {
        transferBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Transfer feature coming soon.');
        });
    }

    // =========================================
    // 11. LOG CONFIRMATION
    // =========================================

    console.log('Eduneeds dashboard loaded successfully.');
});