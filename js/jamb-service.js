/* =========================================================
   JAMB SERVICE — JAVASCRIPT
   Shared logic for JAMB service pages
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. PAYMENT METHOD SELECTION
    // =========================================

    var paymentMethods = document.querySelectorAll('.payment-method');

    paymentMethods.forEach(function(method) {
        method.addEventListener('click', function() {
            paymentMethods.forEach(function(m) {
                m.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // =========================================
    // 2. FORM VALIDATION & SUBMISSION
    // =========================================

    var form = document.getElementById('serviceForm');

    if (form) {

        // Real-time validation on blur
        var inputs = form.querySelectorAll('input[required]');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                var field = this.closest('.form-group');
                if (field) {
                    field.classList.remove('error');
                }
            });
        });

        // Form submit
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var isValid = true;

            // Validate required fields
            var requiredInputs = this.querySelectorAll('input[required]');
            requiredInputs.forEach(function(input) {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            // Validate select if exists
            var jambYear = document.getElementById('jambYear');
            if (jambYear && !jambYear.value) {
                jambYear.classList.add('error');
                isValid = false;
            } else if (jambYear) {
                jambYear.classList.remove('error');
            }

            if (!isValid) {
                return;
            }

            // If valid, simulate submission
            var submitBtn = this.querySelector('.btn-submit');
            var originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="material-symbols-outlined">progress_activity</span> Submitting...';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Request Submitted!';
                submitBtn.style.background = '#16a34a';

                // Add a new row to the table
                addRequestRow();

                setTimeout(function() {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();

                    // Reset select if exists
                    if (jambYear) jambYear.value = '';

                    alert('Your request has been submitted successfully!');
                }, 1500);
            }, 1500);
        });
    }

    // =========================================
    // 3. VALIDATE FIELD
    // =========================================

    function validateField(input) {
        var field = input.closest('.form-group');
        if (!field) return true;

        var value = input.value.trim();
        var isValid = true;

        switch (input.id) {
            case 'email':
                if (value.length > 0) {
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                } else if (input.hasAttribute('required')) {
                    isValid = false;
                }
                break;
            case 'phone':
                if (value.length > 0) {
                    isValid = value.length >= 10 && /^[0-9+\-() ]+$/.test(value);
                } else if (input.hasAttribute('required')) {
                    isValid = false;
                }
                break;
            case 'regNumber':
                isValid = value.length >= 6;
                break;
            default:
                if (input.hasAttribute('required')) {
                    isValid = value.length > 0;
                }
        }

        if (!isValid) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    // =========================================
    // 4. ADD REQUEST ROW
    // =========================================

    function addRequestRow() {
        var tbody = document.getElementById('requestsBody');

        // Remove empty state if present
        var emptyState = tbody.querySelector('.empty-state');
        if (emptyState) {
            tbody.innerHTML = '';
        }

        var transactionId = 'REQ-' + Date.now().toString().slice(-8);
        var email = document.getElementById('email') ? document.getElementById('email').value || 'user@example.com' : 'user@example.com';
        var phone = document.getElementById('phone') ? document.getElementById('phone').value || '08012345678' : '08012345678';
        var candidateName = document.getElementById('candidateName') ? document.getElementById('candidateName').value || 'John Doe' : 'John Doe';

        var row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${transactionId}</strong></td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${candidateName}</td>
            <td><span class="status-badge pending">Pending</span></td>
            <td><button class="btn-view">View</button></td>
        `;

        tbody.prepend(row);

        // Add view button handler
        var viewBtn = row.querySelector('.btn-view');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                alert('Viewing request: ' + transactionId);
            });
        }
    }

    // =========================================
    // 5. SEARCH FUNCTIONALITY
    // =========================================

    var searchInput = document.getElementById('searchTransaction');
    var applyBtn = document.querySelector('.btn-apply');

    if (applyBtn && searchInput) {
        applyBtn.addEventListener('click', function() {
            var term = searchInput.value.trim().toLowerCase();
            var rows = document.querySelectorAll('#requestsBody tr');

            if (!term) {
                rows.forEach(function(row) {
                    row.style.display = '';
                });
                return;
            }

            var found = false;
            rows.forEach(function(row) {
                var idCell = row.querySelector('td:first-child');
                if (idCell && idCell.textContent.toLowerCase().includes(term)) {
                    row.style.display = '';
                    found = true;
                    row.style.background = 'rgba(0, 64, 161, 0.05)';
                    setTimeout(function() {
                        row.style.background = '';
                    }, 3000);
                } else {
                    row.style.display = 'none';
                }
            });

            if (!found) {
                alert('No request found with ID: ' + term);
                rows.forEach(function(row) {
                    row.style.display = '';
                });
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyBtn.click();
            }
        });
    }

    // =========================================
    // 6. FUND WALLET BUTTON
    // =========================================

    var fundBtn = document.querySelector('.btn-fund-wallet');
    if (fundBtn) {
        fundBtn.addEventListener('click', function() {
            var amount = prompt('Enter amount to fund (₦):', '1000');
            if (amount && !isNaN(amount) && parseInt(amount) > 0) {
                alert('Wallet funded with ₦' + parseInt(amount).toLocaleString() + ' (Simulated)');
                var walletSpan = document.querySelector('.wallet-bar strong');
                if (walletSpan) {
                    var current = parseInt(walletSpan.textContent.replace(/[₦,.]/g, ''));
                    var newBalance = current + parseInt(amount);
                    walletSpan.textContent = '₦' + newBalance.toLocaleString() + '.00';
                }
            }
        });
    }
});