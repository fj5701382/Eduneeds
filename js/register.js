/* Eduneeds registration form behaviour. */
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('registerForm'); if (!form) return;
    var passwordInput = document.getElementById('password'); var strengthFill = document.getElementById('strengthFill'); var strengthText = document.getElementById('strengthText');
    function setError(input, message) { var field = input.closest('.form-group'); field.classList.add('error'); var error = field.querySelector('.error-message'); if (error && message) error.textContent = message; }
    function clearError(input) { input.closest('.form-group').classList.remove('error'); }
    function isPhone(value) { return value.length >= 10 && /^[0-9+\-() ]+$/.test(value); }
    function validate(input) { var value = input.value.trim(), valid = true, message = ''; if (input.id === 'fullName') { valid = value.length >= 2; message = 'Please enter your full name'; } if (input.id === 'email') { valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); message = 'Please enter a valid email address'; } if (input.id === 'phone') { valid = isPhone(value); message = 'Please enter a valid phone number'; } if (input.id === 'password') { valid = input.value.length >= 6; message = 'Password must be at least 6 characters'; } if (input.id === 'confirmPassword') { valid = input.value.length > 0 && input.value === passwordInput.value; message = 'Passwords do not match'; } if (!valid) setError(input, message); else clearError(input); return valid; }
    function updateStrength() { var value = passwordInput.value; var score = (value.length >= 8) + (value.length >= 12) + /[a-z]/.test(value) + /[A-Z]/.test(value) + /[0-9]/.test(value) + /[^a-zA-Z0-9]/.test(value); var levels = score <= 2 ? ['weak', 'Weak', 25] : score <= 4 ? ['fair', 'Fair', 50] : score <= 6 ? ['good', 'Good', 75] : ['strong', 'Strong', 100]; strengthFill.className = 'strength-fill' + (value ? ' ' + levels[0] : ''); strengthFill.style.width = value ? levels[2] + '%' : '0%'; strengthText.textContent = value ? levels[1] : 'Enter a password'; strengthText.className = 'strength-text' + (value ? ' ' + levels[0] : ''); }
    form.querySelectorAll('.toggle-password').forEach(function (button) { button.addEventListener('click', function () { var input = button.parentElement.querySelector('input'), hidden = input.type === 'password'; input.type = hidden ? 'text' : 'password'; button.querySelector('.material-symbols-outlined').textContent = hidden ? 'visibility' : 'visibility_off'; }); });
    form.querySelectorAll('input').forEach(function (input) { input.addEventListener('blur', function () { validate(input); }); input.addEventListener('input', function () { clearError(input); if (input === passwordInput) updateStrength(); var confirm = document.getElementById('confirmPassword'); if ((input.id === 'password' || input.id === 'confirmPassword') && confirm.value) validate(confirm); }); });
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); var inputs = Array.from(form.querySelectorAll('input[required]')); if (!inputs.every(validate)) return;
        var button = form.querySelector('.btn-submit'), originalText = button.textContent; button.disabled = true; button.textContent = 'Creating account...';
        try {
            var result = await EduneedsAuth.registerUser({ fullName: document.getElementById('fullName').value, email: document.getElementById('email').value, phone: document.getElementById('phone').value }, passwordInput.value); passwordInput.value = ''; document.getElementById('confirmPassword').value = '';
            if (!result.ok) { setError(document.getElementById(result.reason === 'duplicate-email' ? 'email' : 'phone'), result.reason === 'duplicate-email' ? 'An account with this email already exists. Please log in.' : 'An account with this phone number already exists.'); return; }
            alert('Your account has been created successfully.'); window.location.href = 'login.html';
        } catch (error) { setError(passwordInput, error.message || 'Unable to create your account. Please try again.'); }
        finally { button.disabled = false; button.textContent = originalText; }
    });
});
