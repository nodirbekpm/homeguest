/* ДомГость — owners.js */
(function () {
  'use strict';

  function validate(id, condition, errId) {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    const ok = el && condition(el.value.trim());
    if (el) el.classList.toggle('error', !ok);
    if (err) err.classList.toggle('show', !ok);
    return ok;
  }

  function init() {
    window.DG.initAccordions();

    const form = document.getElementById('ownerForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();

      const checks = [
        validate('ofType',  v => v !== '', 'ofTypeError'),
        validate('ofCity',  v => v.length >= 2, 'ofCityError'),
        validate('ofTitle', v => v.length >= 10, 'ofTitleError'),
        validate('ofPrice', v => +v >= 100, 'ofPriceError'),
        validate('ofGuests',v => +v >= 1, 'ofGuestsError'),
        validate('ofDesc',  v => v.length >= 30, 'ofDescError'),
        validate('ofName',  v => v.length >= 2, 'ofNameError'),
        validate('ofPhone', v => v.length >= 7, 'ofPhoneError'),
        validate('ofEmail', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'ofEmailError'),
        (() => {
          const cb = document.getElementById('ofAgree');
          const err = document.getElementById('ofAgreeError');
          const ok = cb && cb.checked;
          if (err) err.classList.toggle('show', !ok);
          return ok;
        })()
      ];

      if (!checks.every(Boolean)) return;

      const submission = {
        id: 'ls_' + Date.now(),
        type: document.getElementById('ofType').value,
        city: document.getElementById('ofCity').value.trim(),
        title: document.getElementById('ofTitle').value.trim(),
        price: document.getElementById('ofPrice').value,
        guests: document.getElementById('ofGuests').value,
        description: document.getElementById('ofDesc').value.trim(),
        name: document.getElementById('ofName').value.trim(),
        phone: document.getElementById('ofPhone').value.trim(),
        email: document.getElementById('ofEmail').value.trim(),
        createdAt: new Date().toISOString()
      };

      try {
        const arr = JSON.parse(localStorage.getItem('dg_listings_submitted') || '[]');
        arr.push(submission);
        localStorage.setItem('dg_listings_submitted', JSON.stringify(arr));
      } catch {}

      document.getElementById('ownerFormWrap').innerHTML = `
        <div class="modal-success" style="padding:40px 0;">
          <div class="modal-success__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 class="modal-success__title">Заявка принята!</h2>
          <p class="modal-success__text" style="max-width:440px;margin:0 auto;">
            Наш менеджер свяжется с вами по номеру <strong>${window.DG.escapeHtml(submission.phone)}</strong> в течение 24 часов для уточнения деталей и публикации объявления.
          </p>
          <a href="index.html" class="btn btn--primary" style="margin-top:28px">На главную</a>
        </div>`;

      window.DG.showToast('Заявка на размещение принята! Модератор свяжется с вами.', 'success');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
