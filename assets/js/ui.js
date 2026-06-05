/* ДомГость — ui.js — shared utilities, header, footer, favorites, cards */

/* ── PROTECTION ── */
(function () {
  // Block right-click
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // Block keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+U (view source), Ctrl+S (save), Ctrl+Shift+I/J/C (devtools)
    if (e.ctrlKey && (
      e.key === 'u' || e.key === 'U' ||
      e.key === 's' || e.key === 'S' ||
      e.key === 'p' || e.key === 'P'
    )) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (
      e.key === 'I' || e.key === 'i' ||
      e.key === 'J' || e.key === 'j' ||
      e.key === 'C' || e.key === 'c' ||
      e.key === 'K' || e.key === 'k'
    )) { e.preventDefault(); return false; }
    // Cmd+Option+I (Mac)
    if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I')) { e.preventDefault(); return false; }
  });

  // DevTools size detection — blur overlay when devtools is open
  var _threshold = 160;
  var _overlay = null;

  function showProtectOverlay() {
    if (_overlay) return;
    _overlay = document.createElement('div');
    _overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'background:#1b2a4a',
      'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center',
      'color:#fff', 'font-family:Manrope,sans-serif',
      'text-align:center', 'padding:40px'
    ].join(';');
    _overlay.innerHTML =
      '<div style="margin-bottom:20px"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>' +
      '<div style="font-family:Unbounded,sans-serif;font-size:1.25rem;font-weight:700;margin-bottom:12px">Демо-версия защищена</div>' +
      '<div style="color:rgba(255,255,255,0.65);max-width:360px;line-height:1.6">Инструменты разработчика недоступны в демо-режиме.<br>Закройте DevTools для продолжения просмотра.</div>';
    document.body.appendChild(_overlay);
  }

  function hideProtectOverlay() {
    if (_overlay) { _overlay.remove(); _overlay = null; }
  }

  function checkDevTools() {
    var widthDiff  = window.outerWidth  - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > _threshold || heightDiff > _threshold) {
      showProtectOverlay();
    } else {
      hideProtectOverlay();
    }
  }

  // Poll every 800ms
  setInterval(checkDevTools, 800);
  window.addEventListener('resize', checkDevTools);

  // Console warning + clear
  var _consoleMsg = [
    '%c[ СТОП ]',
    'color:#ff6b6b;font-size:32px;font-weight:bold;'
  ];
  var _consoleMsg2 = [
    '%cЭто демо-версия сайта ДомГость. Копирование кода запрещено.\nДля получения исходного кода обратитесь к разработчику.',
    'color:#1b2a4a;font-size:14px;font-weight:600;'
  ];
  setInterval(function () {
    console.clear();
    console.log.apply(console, _consoleMsg);
    console.log.apply(console, _consoleMsg2);
  }, 1500);
})();

(function () {
  'use strict';

  /* ── SVG ICONS ── */
  const ICONS = {
    home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 22V12h6v10"/></svg>`,
    heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    heartFilled: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    wifi: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>`,
    parking: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>`,
    kitchen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v4M6 10v12M18 2v12M18 18v4M2 6h4M10 6h12M2 18h16"/></svg>`,
    ac: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="22" height="8" rx="2"/><path d="M7 11v8M12 11v4M17 11v8M7 19h10"/></svg>`,
    guests: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    bed: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13V7a2 2 0 012-2h14a2 2 0 012 2v6M3 13h18M3 13v5M21 13v5M3 18h18"/></svg>`,
    bath: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M4 12V6a2 2 0 012-2h.5M4 12v5a2 2 0 002 2h12a2 2 0 002-2v-5"/><path d="M8 12V7"/></svg>`,
    area: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h5v5H3zM16 3h5v5h-5zM3 16h5v5H3zM16 16h5v5h-5zM8 5.5h8M5.5 8v8M18.5 8v8M8 18.5h8"/></svg>`,
    location: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.5 1a2 2 0 012-2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 6.37a16 16 0 006.72 6.72l1.73-1.74a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 13.92z"/></svg>`,
    mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    arrowLeft: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    arrowRight: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    share: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    chevronDown: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    filter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
    burger: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    logoBG: `<svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#ff6b6b"/><path d="M5 16L16 7l11 9v11H5V16z" fill="white" opacity="0.9"/><rect x="12" y="20" width="8" height="7" rx="1" fill="#ff6b6b"/></svg>`,
    superhost: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    vk: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 6.8c.1-.4 0-.7-.6-.7h-2c-.5 0-.8.3-.9.6 0 0-1 2.5-2.5 4.2-.5.5-.7.6-1 .6-.1 0-.3-.1-.3-.5V6.8c0-.5-.1-.7-.6-.7H11c-.4 0-.6.3-.6.6 0 .6.9.7.9 2.4v3.6c0 .6-.1.7-.4.7-.7 0-2.5-2.6-3.5-5.6-.2-.6-.4-.8-1-.8H4.4c-.6 0-.7.3-.7.6 0 .6.7 3.4 3.1 7.2 1.6 2.5 3.9 3.8 6 3.8 1.2 0 1.4-.3 1.4-.8v-1.8c0-.6.1-.7.5-.7.3 0 .8.2 2 1.3 1.4 1.4 1.6 2 2.4 2h2c.6 0 .9-.3.7-.8-.2-.5-.9-1.4-1.8-2.3-.5-.6-1.3-1.2-1.5-1.6-.3-.4-.2-.6 0-.9 0 0 2.3-3.2 2.5-4.3z"/></svg>`,
    tg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.18l-2.02 9.51c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.29.29-.6.29l.21-3.06 5.5-4.96c.24-.21-.05-.33-.37-.12l-6.8 4.28-2.93-.91c-.64-.2-.65-.64.13-.95l11.43-4.41c.53-.19 1 .13.99.64z"/></svg>`,
    ok: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm.02 4.5c2.07 0 3.75 1.68 3.75 3.75S14.09 12 12.02 12s-3.75-1.68-3.75-3.75S9.95 4.5 12.02 4.5zm0 16.5c-3.31 0-6.27-1.59-8.14-4.07.79-2.4 4.23-3.93 8.14-3.93s7.35 1.53 8.14 3.93A9.95 9.95 0 0112.02 21z"/></svg>`
  };
  window.ICONS = ICONS;

  /* ── UTILITIES ── */
  function formatPrice(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
  }
  function nightsBetween(a, b) {
    if (!a || !b) return 0;
    const ms = new Date(b) - new Date(a);
    return Math.max(0, Math.floor(ms / 86400000));
  }
  function getParam(key) {
    return new URLSearchParams(window.location.search).get(key) || '';
  }
  function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function imgFallback(el, id) {
    el.onerror = function(){
      this.onerror = null;
      this.src = 'https://picsum.photos/seed/' + id + '/900/600';
    };
  }

  window.DG = { ICONS, formatPrice, nightsBetween, getParam, escapeHtml, imgFallback };

  /* ── TOAST ── */
  let toastContainer;
  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
  function showToast(msg, type) {
    ensureToastContainer();
    const t = document.createElement('div');
    t.className = 'toast' + (type === 'success' ? ' toast--success' : type === 'error' ? ' toast--error' : '');
    t.innerHTML = (type === 'success' ? ICONS.check.replace('32','18').replace('32','18') : '') + escapeHtml(msg);
    toastContainer.appendChild(t);
    setTimeout(() => {
      t.classList.add('removing');
      setTimeout(() => t.remove(), 280);
    }, 3200);
  }
  window.DG.showToast = showToast;

  /* ── FAVORITES ── */
  const FAV_KEY = 'dg_favorites';
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
  }
  function saveFavorites(arr) {
    localStorage.setItem(FAV_KEY, JSON.stringify(arr));
  }
  function isFavorite(id) { return getFavorites().includes(id); }
  function toggleFavorite(id) {
    const arr = getFavorites();
    const idx = arr.indexOf(id);
    if (idx === -1) { arr.push(id); showToast('Добавлено в избранное', 'success'); }
    else { arr.splice(idx, 1); showToast('Удалено из избранного'); }
    saveFavorites(arr);
    updateFavCount();
    document.querySelectorAll('.listing-card__fav[data-id="'+id+'"]').forEach(btn => {
      btn.classList.toggle('active', isFavorite(id));
      btn.querySelector('svg').outerHTML; // force repaint via class
      btn.innerHTML = isFavorite(id) ? ICONS.heartFilled : ICONS.heart;
    });
    return isFavorite(id);
  }
  function updateFavCount() {
    const count = getFavorites().length;
    document.querySelectorAll('.fav-count').forEach(el => {
      el.textContent = count;
      el.setAttribute('data-count', count);
    });
  }
  window.DG = Object.assign(window.DG, { getFavorites, isFavorite, toggleFavorite, updateFavCount });

  /* ── LISTING CARD ── */
  function renderListingCard(listing) {
    const img = listing.images[0] || 'https://picsum.photos/seed/' + listing.id + '/900/600';
    const fav = isFavorite(listing.id);
    const badgesHtml = (listing.badges || []).map(b =>
      `<span class="badge ${b === 'Топ-выбор' ? 'badge--navy' : b === 'Без комиссии' ? 'badge--success' : ''}">${escapeHtml(b)}</span>`
    ).join('');
    return `<article class="card listing-card reveal">
      <a href="property.html?id=${listing.id}" class="listing-card__img-wrap">
        <img class="listing-card__img" src="${img}" alt="${escapeHtml(listing.title)}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${listing.id}/900/600'">
        <div class="listing-card__badges">${badgesHtml}</div>
      </a>
      <button class="listing-card__fav ${fav ? 'active' : ''}" data-id="${listing.id}" aria-label="В избранное" title="${fav ? 'Убрать из избранного' : 'В избранное'}">
        ${fav ? ICONS.heartFilled : ICONS.heart}
      </button>
      <div class="listing-card__body">
        <div class="listing-card__meta">
          <span>${escapeHtml(listing.type)}</span>
          <span class="listing-card__dot">·</span>
          ${ICONS.location}
          <span>${escapeHtml(listing.city)}</span>
        </div>
        <a href="property.html?id=${listing.id}" class="listing-card__title">${escapeHtml(listing.title)}</a>
        <div class="listing-card__footer">
          <div class="rating">
            <span class="rating__star">${ICONS.star}</span>
            <span>${listing.rating.toFixed(1)}</span>
            <span class="rating__count">(${listing.reviewsCount})</span>
          </div>
          <div class="listing-card__price">от ${formatPrice(listing.price)} <span>/ ночь</span></div>
        </div>
      </div>
    </article>`;
  }
  window.DG.renderListingCard = renderListingCard;

  /* ── HEADER ── */
  const NAV_LINKS = [
    { href: 'index.html', label: 'Главная' },
    { href: 'catalog.html', label: 'Каталог' },
    { href: 'owners.html', label: 'Сдать жильё' },
    { href: 'about.html', label: 'О сервисе' }
  ];

  function renderHeader() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const navHtml = NAV_LINKS.map(l =>
      `<a href="${l.href}" class="nav__link ${path === l.href || (path === '' && l.href === 'index.html') ? 'active' : ''}">${l.label}</a>`
    ).join('');
    const mobileNavHtml = NAV_LINKS.map(l =>
      `<a href="${l.href}" class="nav__link ${path === l.href ? 'active' : ''}">${l.label}</a>`
    ).join('');
    const favCount = getFavorites().length;

    const headerEl = document.createElement('header');
    headerEl.className = 'header';
    headerEl.setAttribute('role', 'banner');
    headerEl.innerHTML = `
      <div class="container">
        <div class="header__inner">
          <a href="index.html" class="logo" aria-label="ДомГость — на главную">
            <span class="logo__icon">${ICONS.logoBG}</span>
            <span class="logo__text"><span class="logo-dom">Дом</span><span class="logo-guest">Гость</span></span>
          </a>
          <nav class="nav" aria-label="Основная навигация">${navHtml}</nav>
          <div class="header__actions">
            <a href="favorites.html" class="fav-link" aria-label="Избранное">
              ${ICONS.heart}
              Избранное
              <span class="fav-count" data-count="${favCount}">${favCount}</span>
            </a>
            <a href="owners.html" class="btn btn--primary">Сдать жильё</a>
            <button class="burger" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </div>
      <nav class="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация">
        ${mobileNavHtml}
        <a href="favorites.html" class="nav__link">♥ Избранное</a>
        <a href="owners.html" class="btn btn--primary" style="margin-top:8px;justify-content:center;">Сдать жильё</a>
      </nav>`;

    document.body.insertBefore(headerEl, document.body.firstChild);

    const burger = headerEl.querySelector('.burger');
    const mobileMenu = headerEl.querySelector('.mobile-menu');
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    window.addEventListener('scroll', () => {
      headerEl.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── FOOTER ── */
  function renderFooter() {
    const footerEl = document.createElement('footer');
    footerEl.className = 'footer';
    footerEl.setAttribute('role', 'contentinfo');
    footerEl.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="footer__logo">
              <a href="index.html" class="logo" aria-label="ДомГость">
                <span class="logo__icon">${ICONS.logoBG}</span>
                <span class="logo__text"><span class="logo-dom">Дом</span><span class="logo-guest">Гость</span></span>
              </a>
            </div>
            <p class="footer__desc">Жильё для отдыха напрямую от хозяев. Без комиссии, без посредников — только выгодные цены и проверенные объекты по всей России.</p>
            <div class="footer__socials">
              <a href="#" class="footer__social" aria-label="ВКонтакте">${ICONS.vk}</a>
              <a href="#" class="footer__social" aria-label="Telegram">${ICONS.tg}</a>
              <a href="#" class="footer__social" aria-label="Одноклассники">${ICONS.ok}</a>
            </div>
          </div>
          <div>
            <div class="footer__col-title">Направления</div>
            <ul class="footer__links">
              <li><a href="catalog.html?category=Море" class="footer__link">Отдых у моря</a></li>
              <li><a href="catalog.html?category=Горы" class="footer__link">Горные курорты</a></li>
              <li><a href="catalog.html?category=Город" class="footer__link">Городской отдых</a></li>
              <li><a href="catalog.html?category=Природа" class="footer__link">Природа и экотуризм</a></li>
              <li><a href="catalog.html?city=Сочи" class="footer__link">Сочи</a></li>
              <li><a href="catalog.html?city=Санкт-Петербург" class="footer__link">Санкт-Петербург</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__col-title">Сервис</div>
            <ul class="footer__links">
              <li><a href="about.html" class="footer__link">О ДомГость</a></li>
              <li><a href="owners.html" class="footer__link">Сдать жильё</a></li>
              <li><a href="favorites.html" class="footer__link">Избранное</a></li>
              <li><a href="about.html#faq" class="footer__link">Частые вопросы</a></li>
              <li><a href="about.html#contacts" class="footer__link">Контакты</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__col-title">Контакты</div>
            <div class="footer__contact">
              <div class="footer__contact-item">${ICONS.phone} <span>+7 (800) 555-07-07</span></div>
              <div class="footer__contact-item">${ICONS.mail} <span>help@domgost.ru</span></div>
              <div class="footer__contact-item">${ICONS.location} <span>Москва, Россия</span></div>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <p class="footer__copy">© 2026 ДомГость. Все права защищены.</p>
          <p class="footer__demo">Сервис создан в демонстрационных целях.</p>
        </div>
      </div>`;
    document.body.appendChild(footerEl);
  }

  /* ── INTERSECTION OBSERVER for reveal ── */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }});
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ── FAV BUTTON DELEGATION ── */
  function initFavDelegation() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.listing-card__fav');
      if (!btn) return;
      e.preventDefault();
      const id = btn.dataset.id;
      if (!id) return;
      const nowFav = toggleFavorite(id);
      btn.innerHTML = nowFav ? ICONS.heartFilled : ICONS.heart;
      btn.classList.toggle('active', nowFav);
      btn.setAttribute('title', nowFav ? 'Убрать из избранного' : 'В избранное');
    });
  }

  /* ── ACCORDION ── */
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
  window.DG.initAccordions = initAccordions;

  /* ── DEMO WATERMARK ── */
  function renderWatermark() {
    const wm = document.createElement('div');
    wm.className = 'demo-watermark';
    wm.setAttribute('aria-hidden', 'true');
    wm.textContent = 'ДЕМО · ДомГость';
    document.body.appendChild(wm);
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    renderWatermark();
    updateFavCount();
    initFavDelegation();
    setTimeout(initReveal, 50);
  });

})();
