/* ДомГость — favorites.js */
(function () {
  'use strict';

  function init() {
    render();
    document.addEventListener('click', e => {
      const btn = e.target.closest('.listing-card__fav');
      if (btn) setTimeout(render, 50);
    });
  }

  function render() {
    const ids = window.DG.getFavorites();
    const grid = document.getElementById('favsGrid');
    const sub = document.getElementById('favsSubtitle');
    if (!grid) return;

    if (ids.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon">♡</div>
        <h3>В избранном пока пусто</h3>
        <p>Нажмите на сердечко на карточке объекта, чтобы сохранить его</p>
        <a href="catalog.html" class="btn btn--primary" style="margin-top:20px">Перейти в каталог</a>
      </div>`;
      sub.textContent = '0 сохранённых объектов';
      return;
    }

    const listings = ids.map(id => window.DATA.listings.find(l => l.id === id)).filter(Boolean);
    grid.innerHTML = listings.map(l => window.DG.renderListingCard(l)).join('');
    sub.textContent = listings.length + ' сохранённых объектов';

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }});
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => obs.observe(el));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
