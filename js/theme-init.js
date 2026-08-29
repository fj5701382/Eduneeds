(function() {
    var savedTheme = localStorage.getItem('theme') || localStorage.getItem('Eduneeds-theme') || 'light';
    var theme = savedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
    document.write('<style>html[data-theme="dark"] body{background:#0f1724;color:#e8edf5}</style>');
})();
