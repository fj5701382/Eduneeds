/* =========================================================
   Eduneeds LOGIN PAGE — JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. PASSWORD VISIBILITY TOGGLE
    // =========================================

    var toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var input = this.parentElement.querySelector('input');
            if (!input) return;

            var isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');

            var icon = this.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = isPassword ? 'visibility' : 'visibility_off';
            }
        });
    });

    // =========================================
    // 2. FORM VALIDATION & SUBMISSION
    // =========================================

    var form = document.getElementById('loginForm');

    if (form) {

        // Real-time validation on blur
        var inputs = form.querySelectorAll('input');
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

            // Validate all fields
            var allInputs = this.querySelectorAll('input[required]');
            allInputs.forEach(function(input) {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                return;
            }

            // If valid, simulate login
            var submitBtn = this.querySelector('.btn-submit');
            var originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.textContent = 'Success!';
                submitBtn.style.background = '#16a34a';

                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();

                    // Show success and redirect
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = 'dashboard.html';
                }, 1200);
            }, 1500);
        });

        // =========================================
        // 3. VALIDATION FUNCTIONS
        // =========================================

        function validateField(input) {
            var field = input.closest('.form-group');
            if (!field) return true;

            var value = input.value.trim();
            var isValid = true;

            switch (input.id) {
                case 'email':
                    // Check if it's a valid email or phone number
                    var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    var isPhone = value.length >= 10 && /^[0-9+\-() ]+$/.test(value);
                    isValid = isEmail || isPhone;
                    break;
                case 'password':
                    isValid = value.length >= 6;
                    break;
                default:
                    isValid = value.length > 0;
            }

            if (!isValid) {
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }

            return isValid;
        }
    }

    // =========================================
    // 4. LOG CONFIRMATION
    // =========================================

    console.log('Login page loaded successfully.');
});