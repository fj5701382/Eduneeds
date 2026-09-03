/* =========================================================
   Eduneeds — GLOBAL SERVICE SEARCH
   One searchable catalog shared by the dashboard and services.
   ========================================================= */
(function () {
    'use strict';

    var SEARCH_STYLE_ID = 'global-search-styles';
    var catalog;

    function normalise(value) {
        return String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function pageUrl(path) {
        return new URL(path, window.location.href).href;
    }

    function destinationFor(slug) {
        var paths = {
            'jamb-olevel': '../services/jamb-olevel-confirmation.html', 'jamb-original-result': '../services/jamb-original-result.html',
            'jamb-admission-letter': '../services/jamb-admission-letter.html', 'jamb-reg-number': '../services/jamb-reg-number.html',
            'jamb-profile-code': '../services/jamb-profile-code.html', 'jamb-admission-status': '../services/jamb-admission-status.html',
            'jamb-reprinting': '../services/jamb-reprinting.html', 'jamb-change-course': '../services/jamb-change-course.html',
            'jamb-admission-picture': '../services/jamb-admission-picture.html', 'de-pin': '../services/jamb-pins.html',
            'mock-pin': '../services/jamb-pins.html', 'utme-pin': '../services/jamb-pins.html', 'utme-mock-pin': '../services/jamb-pins.html',
            'nin-verification': '../services/nin-bvn.html', 'bvn-verification': '../services/nin-bvn.html',
            'buy-airtime': '../services/buy-airtime.html', 'buy-data': '../services/buy-data.html',
            'electricity': '../services/electricity.html', 'tv-subscription': '../services/tv-subscription.html',
            'transaction-history': '../services/transaction-history.html'
        };
        if (window.SERVICES_DATA && window.SERVICES_DATA[slug]) {
            return '../services/product-detail.html?service=' + encodeURIComponent(slug);
        }
        return paths[slug] || '';
    }

    function categoryFor(link) {
        var dropdown = link.closest('.nav-dropdown');
        var label = dropdown && dropdown.querySelector('.nav-dropdown-label span:last-child');
        return label ? label.textContent.trim() : 'Service';
    }

    function buildCatalog() {
        var products = [];
        var seen = {};
        function add(item) {
            var key = item.slug || item.name;
            if (!item.name || seen[key]) return;
            seen[key] = true;
            item.searchText = normalise([item.name, item.category, item.brand, item.model, item.description, item.keywords].join(' '));
            products.push(item);
        }

        if (window.SERVICES_DATA) {
            Object.keys(window.SERVICES_DATA).forEach(function (slug) {
                var service = window.SERVICES_DATA[slug];
                add({ slug: slug, name: service.name, category: 'Scratch Cards / Result Services', brand: (service.name.match(/^[A-Z]+/) || [''])[0], description: service.desc, price: service.price, url: destinationFor(slug) });
            });
        }

        document.querySelectorAll('.nav-dropdown-menu a').forEach(function (link) {
            var name = link.textContent.trim();
            var slug = link.getAttribute('data-service') || '';
            var href = link.getAttribute('href') || '';
            if (slug === 'transaction-history' || /customer support/i.test(name)) return;
            add({
                slug: slug || name,
                name: name,
                category: categoryFor(link),
                description: '',
                url: href && href !== '#' ? href : destinationFor(slug)
            });
        });
        return products;
    }

    function rank(item, query) {
        var name = normalise(item.name);
        if (name === query) return 0;
        if (name.indexOf(query) === 0) return 1;
        if (name.indexOf(query) !== -1) return 2;
        if (normalise(item.brand).indexOf(query) !== -1) return 3;
        if (normalise(item.category).indexOf(query) !== -1) return 4;
        return 5;
    }

    function resultsFor(query) {
        var terms = normalise(query).split(' ').filter(Boolean);
        if (!terms.length) return [];
        return catalog.filter(function (item) {
            return terms.every(function (term) { return item.searchText.indexOf(term) !== -1; });
        }).sort(function (a, b) { return rank(a, normalise(query)) - rank(b, normalise(query)) || a.name.localeCompare(b.name); }).slice(0, 8);
    }

    function addStyles() {
        if (document.getElementById(SEARCH_STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = SEARCH_STYLE_ID;
        style.textContent = '.search-wrapper{position:relative}.global-search-button{border:0;background:transparent;color:inherit;cursor:pointer;padding:0;display:flex;align-items:center}.global-search-results{position:absolute;z-index:1200;top:calc(100% + 8px);left:0;width:min(440px,calc(100vw - 24px));max-height:min(440px,60vh);overflow:auto;background:var(--card-bg,#fff);border:1px solid var(--border-color,#e5e7eb);border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.16);padding:6px}.global-search-results[hidden]{display:none}.global-search-result{display:block;color:inherit;text-decoration:none;padding:11px 12px;border-radius:7px}.global-search-result:hover,.global-search-result.is-active{background:rgba(0,64,161,.09)}.global-search-result-name{display:block;font-weight:700}.global-search-result-meta{display:block;margin-top:3px;font-size:12px;color:#6b7280}.global-search-empty{padding:14px 12px;color:#6b7280;font-size:14px}.global-search-clear{float:right;border:0;background:transparent;color:inherit;cursor:pointer;font-size:13px;text-decoration:underline}body.dark-mode .global-search-results{background:#141e2f;border-color:#1e2a3d;color:#e8edf5}body.dark-mode .global-search-result-meta,body.dark-mode .global-search-empty{color:#9aabc0}@media(max-width:575px){.global-search-results{position:fixed;top:64px;left:12px;width:calc(100vw - 24px);max-height:calc(100vh - 82px)}}';
        document.head.appendChild(style);
    }

    function initSearch() {
        var wrapper = document.querySelector('.search-wrapper');
        var input = wrapper && wrapper.querySelector('.search-input');
        if (!wrapper || !input || wrapper.dataset.globalSearchReady) return;
        wrapper.dataset.globalSearchReady = 'true';
        catalog = catalog || buildCatalog();
        addStyles();

        var icon = wrapper.querySelector('.search-icon');
        if (icon) { icon.setAttribute('role', 'button'); icon.setAttribute('tabindex', '0'); icon.setAttribute('aria-label', 'Search services'); }
        var panel = document.createElement('div');
        panel.className = 'global-search-results'; panel.hidden = true; panel.setAttribute('role', 'listbox');
        wrapper.appendChild(panel);
        var active = -1;

        function close() { panel.hidden = true; active = -1; }
        function render() {
            var query = normalise(input.value);
            panel.replaceChildren();
            if (!query) { close(); return; }
            var results = resultsFor(query);
            if (!results.length) {
                var empty = document.createElement('div'); empty.className = 'global-search-empty';
                empty.textContent = 'No products found for your search. ';
                var clear = document.createElement('button'); clear.className = 'global-search-clear'; clear.type = 'button'; clear.textContent = 'Clear'; clear.addEventListener('click', function () { input.value = ''; close(); input.focus(); });
                empty.appendChild(clear); panel.appendChild(empty);
            } else results.forEach(function (item) {
                var result = document.createElement('a'); result.className = 'global-search-result'; result.href = pageUrl(item.url); result.setAttribute('role', 'option');
                var name = document.createElement('span'); name.className = 'global-search-result-name'; name.textContent = item.name;
                var meta = document.createElement('span'); meta.className = 'global-search-result-meta'; meta.textContent = item.category + (item.price ? ' · ₦' + Number(item.price).toLocaleString() : '');
                result.append(name, meta); panel.appendChild(result);
            });
            panel.hidden = false;
        }
        function selectActive() { var items = panel.querySelectorAll('.global-search-result'); if (items[active]) items[active].click(); }
        input.addEventListener('input', render);
        input.addEventListener('keydown', function (event) {
            var items = panel.querySelectorAll('.global-search-result');
            if (event.key === 'Escape') { close(); input.blur(); }
            else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { if (!items.length) return; event.preventDefault(); active = event.key === 'ArrowDown' ? (active + 1) % items.length : (active - 1 + items.length) % items.length; items.forEach(function (item, index) { item.classList.toggle('is-active', index === active); }); }
            else if (event.key === 'Enter') { event.preventDefault(); if (items.length) { if (active < 0) active = 0; selectActive(); } else render(); }
        });
        if (icon) { icon.addEventListener('click', render); icon.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); render(); input.focus(); } }); }
        document.addEventListener('click', function (event) { if (!wrapper.contains(event.target)) close(); });
    }

    window.initEduneedsGlobalSearch = initSearch;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSearch); else initSearch();
    document.addEventListener('componentsLoaded', function () { setTimeout(initSearch, 0); });
}());
