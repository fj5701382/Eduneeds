/* =========================================================
   Eduneeds — GLOBAL FUNCTIONS
   Shared across all pages
   ========================================================= */

// =========================================
// 1. DARK MODE TOGGLE
// =========================================

function initThemeToggle() {
    var themeToggle = document.querySelector('.theme-toggle');
    var themeIcon = document.querySelector('.theme-icon');

    if (themeToggle) {
        var savedTheme = localStorage.getItem('Eduneeds-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.textContent = 'light_mode';
        }

        themeToggle.removeEventListener('click', handleThemeToggle);
        themeToggle.addEventListener('click', handleThemeToggle);
    }
}

function handleThemeToggle() {
    document.body.classList.toggle('dark-mode');
    var isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('Eduneeds-theme', isDark ? 'dark' : 'light');
    var themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }
}

// =========================================
// 2. USER DROPDOWN
// =========================================

function initUserDropdown() {
    var userBtn = document.getElementById('userBtn');
    var userDropdown = document.getElementById('userDropdown');

    if (userBtn && userDropdown) {
        userBtn.removeEventListener('click', handleUserToggle);
        userBtn.addEventListener('click', handleUserToggle);
    }

    document.removeEventListener('click', closeUserDropdown);
    document.addEventListener('click', closeUserDropdown);
}

function handleUserToggle(e) {
    e.stopPropagation();
    var dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

function closeUserDropdown(e) {
    if (!e.target.closest('.user-menu')) {
        var dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('open');
        }
    }
}

// =========================================
// 3. SIDEBAR DROPDOWNS
// =========================================

function initSidebarDropdowns() {
    var dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    dropdownToggles.forEach(function(toggle) {
        toggle.removeEventListener('click', handleSidebarToggle);
        toggle.addEventListener('click', handleSidebarToggle);
    });

    document.removeEventListener('click', closeSidebarDropdowns);
    document.addEventListener('click', closeSidebarDropdowns);
}

function handleSidebarToggle(e) {
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
}

function closeSidebarDropdowns(e) {
    var isDropdown = e.target.closest('.nav-dropdown');
    if (!isDropdown) {
        document.querySelectorAll('.nav-dropdown').forEach(function(item) {
            item.classList.remove('open');
        });
    }
}

// =========================================
// 4. MOBILE HAMBURGER MENU
// =========================================

function initMobileMenu() {
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var sidebar = document.getElementById('sidebar');
    var sidebarClose = document.getElementById('sidebarClose');
    var mobileOverlay = document.getElementById('mobileOverlay');

    if (hamburgerBtn) {
        hamburgerBtn.removeEventListener('click', openMobileSidebar);
        hamburgerBtn.addEventListener('click', openMobileSidebar);
    }

    if (sidebarClose) {
        sidebarClose.removeEventListener('click', closeMobileSidebar);
        sidebarClose.addEventListener('click', closeMobileSidebar);
    }

    if (mobileOverlay) {
        mobileOverlay.removeEventListener('click', closeMobileSidebar);
        mobileOverlay.addEventListener('click', closeMobileSidebar);
    }

    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);
}

function openMobileSidebar(e) {
    e.preventDefault();
    var sidebarEl = document.getElementById('sidebar');
    var overlay = document.getElementById('mobileOverlay');
    if (sidebarEl) sidebarEl.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
    var sidebarEl = document.getElementById('sidebar');
    var overlay = document.getElementById('mobileOverlay');
    if (sidebarEl) sidebarEl.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeMobileSidebar();
    }
}

// =========================================
// 5. INIT EVERYTHING
// =========================================

function initAll() {
    initThemeToggle();
    initUserDropdown();
    initSidebarDropdowns();
    initMobileMenu();
}

// =========================================
// 6. RE-INIT (For when components are reloaded)
// =========================================

function reInitAll() {
    setTimeout(function() {
        initThemeToggle();
        initUserDropdown();
        initSidebarDropdowns();
        initMobileMenu();
    }, 50);
}

// Expose re-init globally
window.reInitEduneeds = reInitAll;

// =========================================
// 7. AUTO-INIT
// =========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Listen for components loaded event (from components.js)
document.addEventListener('componentsLoaded', function() {
    reInitAll();
});