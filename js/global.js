/* =========================================================
   Eduneeds — GLOBAL FUNCTIONS
   Shared across all pages
   ========================================================= */

// =========================================
// 1. DARK MODE TOGGLE
// =========================================

function initThemeToggle() {
    var themeToggles = document.querySelectorAll('.theme-toggle');

    applyTheme(localStorage.getItem('theme') || localStorage.getItem('Eduneeds-theme') || 'light');
    themeToggles.forEach(function(themeToggle) {
        themeToggle.removeEventListener('click', handleThemeToggle);
        themeToggle.addEventListener('click', handleThemeToggle);
    });
}

function handleThemeToggle() {
    var nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(nextTheme);
}

function applyTheme(theme) {
    var normalizedTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', normalizedTheme);
    document.documentElement.classList.toggle('dark-mode', normalizedTheme === 'dark');
    document.body.classList.toggle('dark-mode', normalizedTheme === 'dark');
    localStorage.setItem('theme', normalizedTheme);
    localStorage.setItem('Eduneeds-theme', normalizedTheme);

    document.querySelectorAll('.theme-icon').forEach(function(themeIcon) {
        themeIcon.textContent = normalizedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    });

    document.querySelectorAll('.theme-toggle').forEach(function(themeToggle) {
        var isDark = normalizedTheme === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
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