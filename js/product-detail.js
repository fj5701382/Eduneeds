/* =========================================================
   PRODUCT DETAIL — JAVASCRIPT
   Handles all 9 scratch card services dynamically
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. GET SERVICE FROM URL
    // =========================================

    var urlParams = new URLSearchParams(window.location.search);
    var serviceSlug = urlParams.get('service');

    // If no service slug, redirect to dashboard
    if (!serviceSlug) {
        window.location.href = '../pages/dashboard.html';
        return;
    }

    // =========================================
    // 2. LOOK UP SERVICE DATA
    // =========================================

    var service = getServiceData(serviceSlug);

    if (!service) {
        alert('Service not found. Redirecting to dashboard...');
        window.location.href = '../pages/dashboard.html';
        return;
    }

    // =========================================
    // 3. POPULATE THE PAGE
    // =========================================

    populatePage(service);

    // =========================================
    // 4. SETUP QUANTITY AND TOTAL
    // =========================================

    setupQuantityAndTotal(service);

    // =========================================
    // 5. BUY NOW BUTTON
    // =========================================

    setupBuyNow(service);

    // =========================================
    // 6. LOG
    // =========================================

    console.log('Product page loaded:', serviceSlug);
});

// =========================================
// GET SERVICE DATA
// =========================================

function getServiceData(slug) {
    // Use the global SERVICES_DATA from services-data.js
    if (typeof SERVICES_DATA !== 'undefined') {
        return SERVICES_DATA[slug] || null;
    }
    return null;
}

// =========================================
// POPULATE PAGE
// =========================================

function populatePage(service) {
    // Page Title
    var titleEl = document.getElementById('pageTitle');
    if (titleEl) {
        titleEl.textContent = service.name + ' - Eduneeds';
    }

    // Breadcrumb
    var breadcrumbName = document.querySelector('.breadcrumb-name');
    if (breadcrumbName) {
        breadcrumbName.textContent = service.name;
    }

    // Product Name
    var nameEl = document.getElementById('productName');
    if (nameEl) {
        nameEl.textContent = service.name;
    }

    // Stock Badge
    var badgeEl = document.getElementById('stockBadge');
    if (badgeEl) {
        if (service.inStock) {
            badgeEl.textContent = 'In Stock';
            badgeEl.className = 'stock-badge in-stock';
        } else {
            badgeEl.textContent = 'Out of Stock';
            badgeEl.className = 'stock-badge out-of-stock';
        }
    }

    // Description
    var descEl = document.getElementById('productDescription');
    if (descEl) {
        descEl.textContent = service.desc;
    }

    // Price Tiers
    var tbody = document.getElementById('priceTiersBody');
    if (tbody && service.priceTiers) {
        var html = '';
        service.priceTiers.forEach(function(tier) {
            html += '<tr>' +
                '<td>' + tier.min + (tier.max > tier.min ? ' - ' + tier.max : '+') + '</td>' +
                '<td>₦' + Number(tier.price).toLocaleString() + '.00</td>' +
            '</tr>';
        });
        tbody.innerHTML = html;
    }

    // Instructions
    var instructionsList = document.getElementById('instructionsList');
    if (instructionsList && service.instructions) {
        var html = '';
        service.instructions.forEach(function(step) {
            html += '<li>' + step + '</li>';
        });
        instructionsList.innerHTML = html;
    }

    // Unit Price
    var unitPriceEl = document.getElementById('unitPrice');
    if (unitPriceEl) {
        unitPriceEl.textContent = '₦' + Number(service.price).toLocaleString() + '.00';
    }

    // Total
    var totalEl = document.getElementById('totalAmount');
    if (totalEl) {
        totalEl.textContent = '₦' + Number(service.price).toLocaleString() + '.00';
    }

    // Store service for later use
    window._currentService = service;
}

// =========================================
// SETUP QUANTITY AND TOTAL
// =========================================

function setupQuantityAndTotal(service) {
    var qtyInput = document.getElementById('qtyInput');
    var qtyMinus = document.getElementById('qtyMinus');
    var qtyPlus = document.getElementById('qtyPlus');
    var totalEl = document.getElementById('totalAmount');
    var unitPriceEl = document.getElementById('unitPrice');

    if (!qtyInput || !totalEl) return;

    function updateTotal() {
        var qty = parseInt(qtyInput.value) || 1;
        if (qty < 1) qty = 1;
        qtyInput.value = qty;

        // Find price tier
        var price = service.price;
        if (service.priceTiers) {
            for (var i = 0; i < service.priceTiers.length; i++) {
                var tier = service.priceTiers[i];
                if (qty >= tier.min && (tier.max === null || qty <= tier.max)) {
                    price = tier.price;
                    break;
                }
                // Last tier (max = null means unlimited)
                if (tier.max === null && qty >= tier.min) {
                    price = tier.price;
                    break;
                }
            }
        }

        var total = price * qty;
        var formattedTotal = '₦' + Number(total).toLocaleString() + '.00';

        if (totalEl) totalEl.textContent = formattedTotal;
        if (unitPriceEl) unitPriceEl.textContent = '₦' + Number(price).toLocaleString() + '.00';
    }

    // Minus
    if (qtyMinus) {
        qtyMinus.addEventListener('click', function() {
            var val = parseInt(qtyInput.value) || 1;
            if (val > 1) {
                qtyInput.value = val - 1;
                updateTotal();
            }
        });
    }

    // Plus
    if (qtyPlus) {
        qtyPlus.addEventListener('click', function() {
            var val = parseInt(qtyInput.value) || 1;
            if (val < 100) {
                qtyInput.value = val + 1;
                updateTotal();
            }
        });
    }

    // Input change
    qtyInput.addEventListener('change', updateTotal);
    qtyInput.addEventListener('input', updateTotal);

    // Initial update
    updateTotal();
}

// =========================================
// SETUP BUY NOW
// =========================================

function setupBuyNow(service) {
    var buyBtn = document.getElementById('buyNowBtn');
    var qtyInput = document.getElementById('qtyInput');
    var paymentMethod = document.getElementById('paymentMethod');

    if (!buyBtn) return;

    buyBtn.addEventListener('click', function() {
        var qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
        var method = paymentMethod ? paymentMethod.value : '';

        if (!method || method === '-- Select Payment Method --') {
            alert('Please select a payment method.');
            return;
        }

        var price = service.price;
        if (service.priceTiers) {
            for (var i = 0; i < service.priceTiers.length; i++) {
                var tier = service.priceTiers[i];
                if (qty >= tier.min && (tier.max === null || qty <= tier.max)) {
                    price = tier.price;
                    break;
                }
                if (tier.max === null && qty >= tier.min) {
                    price = tier.price;
                    break;
                }
            }
        }

        var total = price * qty;
        var confirmMsg = 'Buy ' + qty + ' x "' + service.name + '" for ₦' + Number(total).toLocaleString() + '?\nPayment Method: ' + method;

        if (confirm(confirmMsg)) {
            var originalText = buyBtn.innerHTML;
            buyBtn.innerHTML = '<span class="material-symbols-outlined">progress_activity</span> Processing...';
            buyBtn.disabled = true;

            setTimeout(function() {
                buyBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Success!';
                buyBtn.style.background = '#16a34a';

                setTimeout(function() {
                    buyBtn.innerHTML = originalText;
                    buyBtn.style.background = '';
                    buyBtn.disabled = false;
                    alert('Purchase successful! Your PIN will be delivered to your email.');
                }, 1500);
            }, 2000);
        }
    });
}