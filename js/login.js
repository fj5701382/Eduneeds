/* Eduneeds login form behaviour. */
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('loginForm'); if (!form) return;
    function setError(input, message) { var field = input.closest('.form-group'); field.classList.add('error'); var error = field.querySelector('.error-message'); if (error && message) error.textContent = message; }
    function clearError(input) { input.closest('.form-group').classList.remove('error'); }
    function validCredential(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || (value.length >= 10 && /^[0-9+\-() ]+$/.test(value)); }
    function validate(input) { var value = input.value.trim(); if (input.id === 'email' && !validCredential(value)) { setError(input, 'Please enter a valid email or phone number'); return false; } if (input.id === 'password' && value.length < 6) { setError(input, 'Password must be at least 6 characters'); return false; } clearError(input); return true; }
    form.querySelectorAll('input').forEach(function (input) { input.addEventListener('blur', function () { validate(input); }); input.addEventListener('input', function () { clearError(input); }); });
    form.querySelectorAll('.toggle-password').forEach(function (button) { button.addEventListener('click', function () { var input = button.parentElement.querySelector('input'); var hidden = input.type === 'password'; input.type = hidden ? 'text' : 'password'; button.querySelector('.material-symbols-outlined').textContent = hidden ? 'visibility' : 'visibility_off'; }); });
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); var credential = form.querySelector('#email'); var password = form.querySelector('#password');
        if (!validate(credential) || !validate(password)) return;
        var button = form.querySelector('.btn-submit'); var originalText = button.textContent; button.disabled = true; button.textContent = 'Logging in...';
        try {
            var result = await EduneedsAuth.loginUser(credential.value, password.value); password.value = '';
            if (!result.ok) { if (result.reason === 'not-found') setError(credential, 'Account not found. Please check your details or create an account.'); else setError(password, 'Incorrect password. Please try again.'); return; }
            window.location.href = 'dashboard.html';
        } catch (error) { setError(password, error.message || 'Unable to log in. Please try again.'); }
        finally { button.disabled = false; button.textContent = originalText; }
    });
});
