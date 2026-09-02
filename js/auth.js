/* Frontend demo authentication only. Browser storage can be changed by users,
   so this is not a replacement for server-side authentication. */
(function (window) {
    'use strict';
    var USERS_KEY = 'eduneeds_users';
    var CURRENT_USER_KEY = 'eduneeds_current_user';
    function getUsers() { try { var users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); return Array.isArray(users) ? users : []; } catch (error) { return []; } }
    function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
    function normalisePhone(phone) { return String(phone || '').replace(/[^0-9]/g, ''); }
    async function hashPassword(value) {
        if (!window.crypto || !window.crypto.subtle) throw new Error('Password hashing is unavailable in this browser.');
        var bytes = new TextEncoder().encode(value);
        var digest = await window.crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(digest)).map(function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
    }
    function publicUser(user) { return { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone }; }
    async function registerUser(details, rawPassword) {
        var email = details.email.trim().toLowerCase(); var phone = normalisePhone(details.phone); var users = getUsers();
        if (users.some(function (user) { return user.email === email; })) return { ok: false, reason: 'duplicate-email' };
        if (users.some(function (user) { return normalisePhone(user.phone) === phone; })) return { ok: false, reason: 'duplicate-phone' };
        var user = { id: window.crypto.randomUUID ? window.crypto.randomUUID() : 'user-' + Date.now() + '-' + Math.random().toString(16).slice(2), fullName: details.fullName.trim(), email: email, phone: details.phone.trim(), passwordHash: await hashPassword(rawPassword), createdAt: new Date().toISOString() };
        users.push(user); saveUsers(users); return { ok: true, user: publicUser(user) };
    }
    async function loginUser(credential, password) {
        var value = credential.trim(); var email = value.toLowerCase(); var phone = normalisePhone(value);
        var user = getUsers().find(function (candidate) { return candidate.email === email || normalisePhone(candidate.phone) === phone; });
        if (!user) return { ok: false, reason: 'not-found' };
        if (await hashPassword(password) !== user.passwordHash) return { ok: false, reason: 'incorrect-password' };
        var sessionUser = publicUser(user); sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser)); return { ok: true, user: sessionUser };
    }
    function getCurrentUser() { try { var user = JSON.parse(sessionStorage.getItem(CURRENT_USER_KEY) || 'null'); return user && user.id && user.email ? user : null; } catch (error) { return null; } }
    function logoutUser() { sessionStorage.removeItem(CURRENT_USER_KEY); }
    window.EduneedsAuth = { getUsers: getUsers, hashPassword: hashPassword, registerUser: registerUser, loginUser: loginUser, getCurrentUser: getCurrentUser, isLoggedIn: function () { return !!getCurrentUser(); }, logoutUser: logoutUser };
}(window));
