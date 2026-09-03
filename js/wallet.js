/* Frontend-demo wallet. Balances are stored as integer kobo per signed-in user. */
(function (window) {
    'use strict';
    var STORAGE_KEY = 'eduneeds_wallets';
    function currentUser() { return window.EduneedsAuth && window.EduneedsAuth.getCurrentUser(); }
    function readAll() { try { var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return data && typeof data === 'object' ? data : {}; } catch (error) { return {}; } }
    function writeAll(wallets) { localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets)); }
    function walletForUser() {
        var user = currentUser(); if (!user) return null;
        var wallets = readAll();
        if (!wallets[user.id]) { wallets[user.id] = { balanceKobo: 0, transactions: [] }; writeAll(wallets); }
        var wallet = wallets[user.id];
        if (!Array.isArray(wallet.transactions)) wallet.transactions = [];
        if (!Number.isInteger(wallet.balanceKobo)) wallet.balanceKobo = Math.round(Number(wallet.balance || 0) * 100) || 0;
        return { wallets: wallets, userId: user.id, wallet: wallet };
    }
    function persist(record) { record.wallets[record.userId] = record.wallet; writeAll(record.wallets); }
    function format(kobo) { return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format((Number(kobo) || 0) / 100); }
    function amountToKobo(value) { var amount = typeof value === 'number' ? value : Number(String(value).trim()); return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : 0; }
    function transactionId() { return 'WAL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(); }
    function getWallet() { var record = walletForUser(); return record ? { balanceKobo: record.wallet.balanceKobo, transactions: record.wallet.transactions.slice() } : null; }
    function fund(amount, method) {
        var kobo = amountToKobo(amount); if (!kobo || !method) return { ok: false, reason: 'invalid' };
        var record = walletForUser(); if (!record) return { ok: false, reason: 'login' };
        record.wallet.balanceKobo += kobo;
        record.wallet.transactions.unshift({ id: transactionId(), type: 'credit', category: 'funding', method: method, amountKobo: kobo, description: 'Wallet funding via ' + method, date: new Date().toISOString(), balanceAfterKobo: record.wallet.balanceKobo });
        persist(record);
        if (window.EduneedsNotifications) window.EduneedsNotifications.add({ type: 'wallet_funding', title: 'Wallet funded successfully', message: format(kobo) + ' was added to your wallet via ' + method + '.', amount: kobo / 100 });
        return { ok: true, balanceKobo: record.wallet.balanceKobo };
    }
    function purchase(amount, description) {
        var kobo = amountToKobo(amount); if (!kobo) return { ok: false, reason: 'invalid' };
        var record = walletForUser(); if (!record) return { ok: false, reason: 'login' };
        if (record.wallet.balanceKobo < kobo) { if (window.EduneedsNotifications) window.EduneedsNotifications.add({ type: 'insufficient_balance', title: 'Insufficient balance', message: 'You do not have enough wallet balance to complete this purchase.', amount: kobo / 100 }); return { ok: false, reason: 'insufficient' }; }
        record.wallet.balanceKobo -= kobo;
        record.wallet.transactions.unshift({ id: transactionId(), type: 'debit', category: 'purchase', amountKobo: kobo, description: 'Purchase: ' + description, date: new Date().toISOString(), balanceAfterKobo: record.wallet.balanceKobo });
        persist(record);
        if (window.EduneedsNotifications) window.EduneedsNotifications.add({ type: 'purchase', title: 'Purchase successful', message: 'Your purchase of ' + description + ' for ' + format(kobo) + ' was successful.', amount: kobo / 100 });
        return { ok: true, balanceKobo: record.wallet.balanceKobo };
    }
    function notify(message, type) {
        var toast = document.createElement('div'); toast.className = 'eduneeds-toast ' + (type || 'success'); toast.textContent = message; document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('show'); }, 10); setTimeout(function () { toast.classList.remove('show'); setTimeout(function () { toast.remove(); }, 250); }, 3500);
    }
    function renderBalance(root) { var wallet = getWallet(); if (!wallet) return; (root || document).querySelectorAll('.balance-amount, .balance-card .amount').forEach(function (el) { el.textContent = format(wallet.balanceKobo); }); var select = document.getElementById('paymentMethod'); if (select) { var option = select.querySelector('option[value="wallet"]'); if (option) option.textContent = 'Pay from Wallet (Balance: ' + format(wallet.balanceKobo) + ')'; } }
    function renderTransactions(container, limit) {
        var wallet = getWallet(); if (!wallet || !container) return;
        var list = container.querySelector('.wallet-transactions-list');
        if (!list) { list = document.createElement('div'); list.className = 'wallet-transactions-list'; container.querySelectorAll('.tx-item').forEach(function (item) { item.remove(); }); container.appendChild(list); }
        var transactions = wallet.transactions.slice(0, limit || wallet.transactions.length);
        if (!transactions.length) { list.innerHTML = '<div class="wallet-empty">No wallet transactions yet.</div>'; return; }
        list.innerHTML = transactions.map(function (tx) { var date = new Date(tx.date); return '<div class="tx-item"><div class="icon"><span class="material-symbols-outlined">' + (tx.type === 'credit' ? 'add' : 'shopping_bag') + '</span></div><div class="info"><div class="name">' + escapeHtml(tx.description) + '</div><div class="ref">' + (tx.method ? escapeHtml(tx.method) + ' • ' : '') + 'Ref: ' + tx.id + ' • ' + date.toLocaleString() + '</div></div><div class="amount ' + (tx.type === 'credit' ? 'credit' : 'debit') + '">' + (tx.type === 'credit' ? '+' : '-') + format(tx.amountKobo) + '</div><span class="status completed">Completed</span></div>'; }).join('');
    }
    function renderTransactionTable(body) {
        var wallet = getWallet(); if (!wallet || !body) return; body.innerHTML = wallet.transactions.map(function (tx) { var date = new Date(tx.date); return '<tr><td><div class="tx-icon"><span class="material-symbols-outlined">' + (tx.type === 'credit' ? 'add' : 'shopping_bag') + '</span></div></td><td><div class="tx-service-name">' + escapeHtml(tx.description) + '</div><div class="tx-service-type">' + (tx.category === 'funding' ? 'Wallet Funding' : 'Wallet Purchase') + '</div></td><td><div class="tx-ref">' + (tx.method ? escapeHtml(tx.method) + ' • ' : '') + 'Ref: ' + tx.id + '</div></td><td><div style="font-weight: 500; color: #191b23;">' + date.toLocaleDateString() + '</div><div style="font-size: 12px; color: #6b7280;">' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</div></td><td class="tx-amount">' + (tx.type === 'credit' ? '+' : '-') + format(tx.amountKobo) + '</td><td style="text-align: center;"><span class="status-badge completed">Completed</span></td><td></td></tr>'; }).join('') || '<tr><td colspan="7" style="text-align:center; padding:24px;">No wallet transactions yet.</td></tr>';
    }
    function escapeHtml(value) { var div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
    function addStyles() { if (document.getElementById('wallet-toast-styles')) return; var style = document.createElement('style'); style.id = 'wallet-toast-styles'; style.textContent = '.eduneeds-toast{position:fixed;right:20px;bottom:20px;z-index:9999;max-width:calc(100vw - 40px);padding:13px 18px;border-radius:8px;background:#166534;color:#fff;font:600 14px Inter,Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.2);opacity:0;transform:translateY(12px);transition:.25s}.eduneeds-toast.error{background:#b91c1c}.eduneeds-toast.show{opacity:1;transform:translateY(0)}.wallet-empty{padding:24px;text-align:center;color:#6b7280}'; document.head.appendChild(style); }
    document.addEventListener('DOMContentLoaded', addStyles);
    window.EduneedsWallet = { getWallet: getWallet, fund: fund, purchase: purchase, format: format, amountToKobo: amountToKobo, notify: notify, renderBalance: renderBalance, renderTransactions: renderTransactions, renderTransactionTable: renderTransactionTable };
}(window));
