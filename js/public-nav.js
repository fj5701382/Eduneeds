/* =========================================================
   Eduneeds — PUBLIC NAVIGATION
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    var header = document.querySelector('.header');
    var toggle = document.querySelector('.mobile-nav-toggle');
    var menu = document.querySelector('.mobile-nav-menu');

    if (!header || !toggle || !menu) return;

    function closeMenu() {
        header.classList.remove('mobile-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        toggle.querySelector('.material-symbols-outlined').textContent = 'menu';
    }

    toggle.addEventListener('click', function() {
        var isOpen = header.classList.toggle('mobile-menu-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        toggle.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'menu';
    });

    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) closeMenu();
    });
});
