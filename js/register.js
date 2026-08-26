/* =========================================================
   Eduneeds REGISTRATION PAGE — JAVASCRIPT
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
    // 2. PASSWORD STRENGTH INDICATOR
    // =========================================

    var passwordInput = document.getElementById('password');
    var strengthFill = document.getElementById('strengthFill');
    var strengthText = document.getElementById('strengthText');

    if (passwordInput && strengthFill && strengthText) {

        passwordInput.addEventListener('input', function() {
            var password = this.value;
            var strength = checkPasswordStrength(password);

            // Update strength bar
            strengthFill.className = 'strength-fill';
            if (password.length === 0) {
                strengthFill.style.width = '0%';
                strengthText.textContent = 'Enter a password';
                strengthText.className = 'strength-text';
                return;
            }

            strengthFill.classList.add(strength.level);
            strengthFill.style.width = strength.percentage + '%';
            strengthText.textContent = strength.label;
            strengthText.className = 'strength-text ' + strength.level;
        });

        function checkPasswordStrength(password) {
            var score = 0;
            var level = 'weak';
            var label = 'Weak';
            var percentage = 25;

            if (password.length === 0) {
                return { level: '', label: 'Enter a password', percentage: 0 };
            }

            // Length check
            if (password.length >= 8) score++;
            if (password.length >= 12) score++;

            // Character variety
            if (/[a-z]/.test(password)) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^a-zA-Z0-9]/.test(password)) score++;

            // Determine strength
            if (score <= 2) {
                level = 'weak';
                label = 'Weak';
                percentage = 25;
            } else if (score <= 4) {
                level = 'fair';
                label = 'Fair';
                percentage = 50;
            } else if (score <= 6) {
                level = 'good';
                label = 'Good';
                percentage = 75;
            } else {
                level = 'strong';
                label = 'Strong';
                percentage = 100;
            }

            return { level: level, label: label, percentage: percentage };
        }
    }

    // =========================================
    // 3. FORM VALIDATION & SUBMISSION
    // =========================================

    var form = document.getElementById('registerForm');

    if (form) {

        // Real-time validation on blur
        var inputs = form.querySelectorAll('input');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Clear error state while typing
                var field = this.closest('.form-group');
                if (field) {
                    field.classList.remove('error');
                }

                // If password or confirm password, check match
                if (this.id === 'password' || this.id === 'confirmPassword') {
                    validatePasswordMatch();
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

            // Validate password match
            if (!validatePasswordMatch()) {
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // If valid, show success (simulate)
            var submitBtn = this.querySelector('.btn-submit');
            var originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.textContent = 'Account created!';
                submitBtn.style.background = '#16a34a';

                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();

                    // Reset strength
                    if (strengthFill) {
                        strengthFill.style.width = '0%';
                        strengthFill.className = 'strength-fill';
                    }
                    if (strengthText) {
                        strengthText.textContent = 'Enter a password';
                        strengthText.className = 'strength-text';
                    }

                    // Show success message
                    alert('Account created successfully! Redirecting to login...');
                    window.location.href = 'login.html';
                }, 1500);
            }, 1500);
        });

        // =========================================
        // 4. VALIDATION FUNCTIONS
        // =========================================

        function validateField(input) {
            var field = input.closest('.form-group');
            if (!field) return true;

            var value = input.value.trim();
            var isValid = true;

            switch (input.id) {
                case 'fullName':
                    isValid = value.length >= 2;
                    break;
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                case 'phone':
                    isValid = value.length >= 10 && /^[0-9+\-() ]+$/.test(value);
                    break;
                case 'password':
                    isValid = value.length >= 6;
                    break;
                case 'confirmPassword':
                    var password = document.getElementById('password');
                    isValid = value === password.value && value.length > 0;
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

        function validatePasswordMatch() {
            var password = document.getElementById('password');
            var confirm = document.getElementById('confirmPassword');
            var field = confirm ? confirm.closest('.form-group') : null;

            if (!password || !confirm || !field) return true;

            var isValid = confirm.value === password.value && confirm.value.length > 0;

            if (!isValid && confirm.value.length > 0) {
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }

            return isValid;
        }
    }

    // =========================================
    // 5. LOG CONFIRMATION
    // =========================================

    console.log('Registration page loaded successfully.');
});