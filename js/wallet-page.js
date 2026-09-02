document.addEventListener('DOMContentLoaded', function () {
    if (!EduneedsWallet.getWallet()) { window.location.replace('../pages/login.html'); return; }
    var modal = document.getElementById('walletModal'); var form = document.getElementById('walletForm'); var amount = document.getElementById('walletAmount');
    function openModal() { modal.classList.add('show'); document.body.style.overflow = 'hidden'; amount.focus(); }
    function closeModal() { modal.classList.remove('show'); document.body.style.overflow = ''; }
    EduneedsWallet.renderBalance(); EduneedsWallet.renderTransactions(document.querySelector('.transactions-section'), 5);
    document.getElementById('fundWalletBtn').addEventListener('click', openModal);
    document.querySelectorAll('[data-close-modal]').forEach(function (button) { button.addEventListener('click', closeModal); });
    modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); });
    document.querySelectorAll('.quick-fund .amounts button').forEach(function (button) { button.addEventListener('click', function () { document.querySelectorAll('.quick-fund .amounts button').forEach(function (item) { item.classList.remove('active'); }); button.classList.add('active'); amount.value = button.dataset.amount; openModal(); }); });
    form.addEventListener('submit', function (event) { event.preventDefault(); var method = document.getElementById('fundingMethod').value; if (!method) { EduneedsWallet.notify('Please choose a funding method.', 'error'); return; } var kobo = EduneedsWallet.amountToKobo(amount.value); if (!kobo) { EduneedsWallet.notify('Please enter a valid amount.', 'error'); return; } var result = EduneedsWallet.fund(amount.value, method); if (!result.ok) { EduneedsWallet.notify('Please enter a valid amount.', 'error'); return; } EduneedsWallet.renderBalance(); EduneedsWallet.renderTransactions(document.querySelector('.transactions-section'), 5); closeModal(); EduneedsWallet.notify(EduneedsWallet.format(kobo) + ' has been added to your wallet.'); form.reset(); });
});
