/* ДомГость — property.js */
(function () {
  'use strict';

  const AMENITY_ICONS = {
    'Wi-Fi': 'wifi', 'Кухня': 'kitchen', 'Кондиционер': 'ac', 'Парковка': 'parking',
    'Балкон': 'area', 'Стиральная машина': 'bed', 'Терраса': 'area', 'Мангал': 'kitchen',
    'Камин': 'bath', 'Сауна': 'bath', 'Баня': 'bath', 'Бассейн': 'bath',
    'Горячая вода': 'bath', 'Завтрак': 'kitchen', 'Завтрак включён': 'kitchen',
    'Велосипеды': 'area', 'Лодка': 'area', 'Рыбалка': 'area', 'Дрова': 'kitchen',
    'Мини-бар': 'kitchen', 'Ресторан': 'kitchen', 'Spa': 'bath'
  };

  function getIcon(amenity) {
    const key = AMENITY_ICONS[amenity] || 'area';
    return window.ICONS[key] || window.ICONS.area;
  }

  let listing = null;
  let lightboxIndex = 0;

  function init() {
    const id = window.DG.getParam('id');
    if (!id) { showNotFound(); return; }
    listing = window.DATA.listings.find(l => l.id === id);
    if (!listing) { showNotFound(); return; }

    document.title = listing.title + ' — ДомГость';
    document.getElementById('propBreadcrumb').textContent = listing.city;
    document.getElementById('propertyContent').innerHTML = buildPropertyHTML();

    initGallery();
    initBookingCard();
    initActions();
    initLightbox();
    renderSimilar();
  }

  function showNotFound() {
    document.getElementById('propertyContent').innerHTML = `
      <div style="text-align:center;padding:80px 0;">
        <div style="font-size:4rem;margin-bottom:16px;">🏠</div>
        <h2>Объект не найден</h2>
        <p style="color:var(--muted);margin:12px 0 24px">Возможно, объявление было удалено или ссылка устарела.</p>
        <a href="catalog.html" class="btn btn--primary">Перейти в каталог</a>
      </div>`;
  }

  function buildPropertyHTML() {
    const l = listing;
    const fav = window.DG.isFavorite(l.id);

    // gallery
    const mainImg = l.images[0] || 'https://picsum.photos/seed/' + l.id + '/900/600';
    const thumbsHtml = l.images.slice(1, 4).map((img, i) => {
      const isLast = i === 2 && l.images.length > 4;
      return `<div class="gallery-thumb" data-index="${i + 1}">
        <img src="${img}" alt="${window.DG.escapeHtml(l.title)}" loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/${l.id}-${i}/900/600'">
        ${isLast ? `<div class="gallery-more">+${l.images.length - 4} фото</div>` : ''}
      </div>`;
    }).join('');

    const badgesHtml = (l.badges || []).map(b =>
      `<span class="badge ${b === 'Топ-выбор' ? 'badge--navy' : b === 'Без комиссии' ? 'badge--success' : ''}">${b}</span>`
    ).join('');

    const amenitiesHtml = l.amenities.map(a =>
      `<div class="amenity-item">${getIcon(a)}<span>${a}</span></div>`).join('');

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const d3 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

    const reviews = window.DATA.reviews.filter(r => l.reviewIds.includes(r.id));
    const reviewsHtml = reviews.map(r => `
      <div class="review-card" style="margin-bottom:16px">
        <div class="review-card__header">
          <div class="review-card__avatar" style="width:40px;height:40px;font-size:1rem">${r.avatarLetter}</div>
          <div><div class="review-card__name">${r.author}</div><div class="review-card__city">${r.city}</div></div>
          <div class="rating" style="margin-left:auto"><span style="color:var(--star)">★</span> ${r.rating}.0</div>
        </div>
        <p class="review-card__text">"${r.text}"</p>
        <div class="review-card__date">${r.date}</div>
      </div>`).join('');

    return `
      <!-- Gallery -->
      <div class="property-gallery" id="gallery">
        <div class="gallery-main" data-index="0">
          <img id="galleryMainImg" src="${mainImg}" alt="${window.DG.escapeHtml(l.title)}"
               onerror="this.onerror=null;this.src='https://picsum.photos/seed/${l.id}/900/600'">
        </div>
        ${thumbsHtml}
      </div>

      <!-- Layout -->
      <div class="property-layout">
        <!-- Main -->
        <div class="property-main">
          <div class="property-header">
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">${badgesHtml}</div>
            <h1 class="property-title">${window.DG.escapeHtml(l.title)}</h1>
            <div class="property-meta">
              <div class="property-meta__item">
                ${window.ICONS.location}
                <span>${window.DG.escapeHtml(l.city)}, ${window.DG.escapeHtml(l.region)}</span>
              </div>
              <div class="property-meta__item">
                <div class="rating">
                  <span class="rating__star">${window.ICONS.star}</span>
                  <span>${l.rating.toFixed(1)}</span>
                  <span class="rating__count">(${l.reviewsCount} отзывов)</span>
                </div>
              </div>
              <div class="property-meta__item">${window.DG.escapeHtml(l.type)}</div>
            </div>
            <div class="property-actions">
              <button class="btn btn--outline btn--sm ${fav ? 'active' : ''}" id="favBtn" data-id="${l.id}">
                ${fav ? window.ICONS.heartFilled : window.ICONS.heart}
                <span id="favBtnText">${fav ? 'В избранном' : 'В избранное'}</span>
              </button>
              <button class="btn btn--outline btn--sm" id="shareBtn">
                ${window.ICONS.share}
                Поделиться
              </button>
            </div>
          </div>

          <!-- Specs -->
          <div class="property-specs">
            <div class="spec-item">
              <div class="spec-item__icon">${window.ICONS.guests}</div>
              <div class="spec-item__value">${l.guests}</div>
              <div class="spec-item__label">гостей</div>
            </div>
            <div class="spec-item">
              <div class="spec-item__icon">${window.ICONS.bed}</div>
              <div class="spec-item__value">${l.bedrooms}</div>
              <div class="spec-item__label">спален</div>
            </div>
            <div class="spec-item">
              <div class="spec-item__icon">${window.ICONS.bed}</div>
              <div class="spec-item__value">${l.beds}</div>
              <div class="spec-item__label">кроватей</div>
            </div>
            <div class="spec-item">
              <div class="spec-item__icon">${window.ICONS.bath}</div>
              <div class="spec-item__value">${l.baths}</div>
              <div class="spec-item__label">санузлов</div>
            </div>
            <div class="spec-item">
              <div class="spec-item__icon">${window.ICONS.area}</div>
              <div class="spec-item__value">${l.area}</div>
              <div class="spec-item__label">м²</div>
            </div>
          </div>

          <!-- Description -->
          <div class="property-section">
            <div class="property-section__title">Описание</div>
            ${l.description.split('\n\n').map(p => `<p style="margin-bottom:14px;color:var(--text);line-height:1.7">${window.DG.escapeHtml(p)}</p>`).join('')}
          </div>

          <!-- Amenities -->
          <div class="property-section">
            <div class="property-section__title">Удобства</div>
            <div class="amenities-grid">${amenitiesHtml}</div>
          </div>

          <!-- Host -->
          <div class="property-section">
            <div class="property-section__title">Хозяин</div>
            <div class="host-card">
              <div class="host-avatar">${l.host.name[0]}</div>
              <div>
                <div class="host-name">${window.DG.escapeHtml(l.host.name)}</div>
                <div class="host-since">Хозяин с ${l.host.since} года</div>
                ${l.host.superhost ? `<div style="display:flex;align-items:center;gap:4px;color:var(--star);font-size:0.875rem;margin-top:4px;">${window.ICONS.superhost} Суперхозяин</div>` : ''}
              </div>
            </div>
          </div>

          <!-- Map -->
          <div class="property-section">
            <div class="property-section__title">Расположение</div>
            <div class="map-placeholder">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=37.5,55.7,37.7,55.8&layer=mapnik"
                title="Карта расположения"
                loading="lazy"
                allowfullscreen></iframe>
              <div style="padding:10px 16px;font-size:0.875rem;color:var(--muted);border-top:1px solid var(--line);">
                ${window.ICONS.location} ${window.DG.escapeHtml(l.address)}, ${window.DG.escapeHtml(l.city)}
              </div>
            </div>
          </div>

          <!-- Reviews -->
          ${reviews.length ? `<div class="property-section">
            <div class="property-section__title">Отзывы гостей (${reviews.length})</div>
            ${reviewsHtml}
          </div>` : ''}
        </div>

        <!-- Booking card -->
        <div>
          <div class="booking-card" id="bookingCard">
            <div class="booking-card__price">${window.DG.formatPrice(l.price)}</div>
            <div class="booking-card__per">за ночь · без комиссии</div>
            <div class="booking-dates">
              <div class="booking-field">
                <label for="bcCheckin">Заезд</label>
                <input type="date" class="search-input" id="bcCheckin" min="${today}" value="${tomorrow}">
              </div>
              <div class="booking-field">
                <label for="bcCheckout">Выезд</label>
                <input type="date" class="search-input" id="bcCheckout" min="${tomorrow}" value="${d3}">
              </div>
            </div>
            <div class="booking-field" style="margin-bottom:0">
              <label>Гости</label>
              <div class="search-guests" style="justify-content:space-between">
                <button class="guests-btn" id="bcGuestsMinus" aria-label="Меньше">−</button>
                <span id="bcGuestsCount">2</span>
                <button class="guests-btn" id="bcGuestsPlus" aria-label="Больше">+</button>
              </div>
            </div>
            <div class="booking-calc" id="bookingCalc">
              <div class="booking-calc__row">
                <span id="calcNightsLabel">— ночей × ${window.DG.formatPrice(l.price)}</span>
                <span id="calcSubtotal">—</span>
              </div>
              <div class="booking-calc__row">
                <span>Комиссия сервиса</span>
                <span style="color:var(--success);font-weight:600">0 ₽</span>
              </div>
              <div class="booking-calc__total">
                <span>Итого</span>
                <span id="calcTotal">—</span>
              </div>
            </div>
            <button class="btn btn--primary btn--lg" style="width:100%;margin-top:4px" id="bookingBtn">Забронировать</button>
            <p style="text-align:center;color:var(--muted);font-size:0.8125rem;margin-top:12px">Оплата напрямую хозяину · Без сервисного сбора</p>
          </div>
        </div>
      </div>

      <!-- Similar -->
      <div style="margin-top:64px">
        <h2 style="font-size:clamp(1.25rem,2.5vw,1.75rem);margin-bottom:8px;font-family:'Unbounded',sans-serif;">Похожие предложения</h2>
        <p style="color:var(--muted);margin-bottom:28px">Другие объекты в этой категории</p>
        <div class="listings-grid listings-grid--3" id="similarGrid"></div>
      </div>`;
  }

  function initGallery() {
    document.getElementById('gallery')?.addEventListener('click', e => {
      const el = e.target.closest('[data-index]');
      if (!el) return;
      openLightbox(+el.dataset.index);
    });
  }

  /* ── LIGHTBOX ── */
  function openLightbox(idx) {
    lightboxIndex = idx;
    updateLightboxImg();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateLightboxImg() {
    const imgs = listing.images;
    const img = document.getElementById('lightboxImg');
    img.src = imgs[lightboxIndex] || 'https://picsum.photos/seed/' + listing.id + '/900/600';
    img.alt = listing.title;
    img.onerror = function() { this.onerror=null; this.src='https://picsum.photos/seed/'+listing.id+'-'+lightboxIndex+'/900/600'; };
    document.getElementById('lightboxCounter').textContent = (lightboxIndex + 1) + ' / ' + imgs.length;
  }
  function initLightbox() {
    document.getElementById('lightboxClose').innerHTML = window.ICONS.close;
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + listing.images.length) % listing.images.length;
      updateLightboxImg();
    });
    document.getElementById('lightboxNext').addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % listing.images.length;
      updateLightboxImg();
    });
    document.getElementById('lightbox').addEventListener('click', e => {
      if (e.target === document.getElementById('lightbox')) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      const lb = document.getElementById('lightbox');
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + listing.images.length) % listing.images.length; updateLightboxImg(); }
      if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % listing.images.length; updateLightboxImg(); }
    });
  }

  /* ── BOOKING CARD ── */
  let bcGuests = 2;

  function calcPrice() {
    const checkin = document.getElementById('bcCheckin')?.value;
    const checkout = document.getElementById('bcCheckout')?.value;
    const nights = window.DG.nightsBetween(checkin, checkout);
    const subtotal = nights * listing.price;
    document.getElementById('calcNightsLabel').textContent = `${nights} ночей × ${window.DG.formatPrice(listing.price)}`;
    document.getElementById('calcSubtotal').textContent = nights ? window.DG.formatPrice(subtotal) : '—';
    document.getElementById('calcTotal').textContent = nights ? window.DG.formatPrice(subtotal) : '—';
  }

  function initBookingCard() {
    document.getElementById('bcCheckin')?.addEventListener('change', () => {
      const ci = document.getElementById('bcCheckin').value;
      const co = document.getElementById('bcCheckout');
      if (co && co.value <= ci) {
        const d = new Date(ci); d.setDate(d.getDate() + 1);
        co.value = d.toISOString().split('T')[0];
      }
      calcPrice();
    });
    document.getElementById('bcCheckout')?.addEventListener('change', calcPrice);

    document.getElementById('bcGuestsMinus')?.addEventListener('click', () => {
      if (bcGuests > 1) { bcGuests--; document.getElementById('bcGuestsCount').textContent = bcGuests; }
    });
    document.getElementById('bcGuestsPlus')?.addEventListener('click', () => {
      if (bcGuests < listing.guests) { bcGuests++; document.getElementById('bcGuestsCount').textContent = bcGuests; }
    });

    document.getElementById('bookingBtn')?.addEventListener('click', openBookingModal);
    calcPrice();
  }

  /* ── BOOKING MODAL ── */
  function openBookingModal() {
    const checkin = document.getElementById('bcCheckin')?.value || '';
    const checkout = document.getElementById('bcCheckout')?.value || '';
    const overlay = document.getElementById('bookingOverlay');
    document.getElementById('bookingModalBody').innerHTML = bookingFormHTML(checkin, checkout);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('bookingForm').addEventListener('submit', submitBooking);
  }
  function closeBookingModal() {
    document.getElementById('bookingOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function bookingFormHTML(checkin, checkout) {
    return `
      <h2 class="modal__title" id="bookingModalTitle">Заявка на бронирование</h2>
      <p class="modal__sub">${window.DG.escapeHtml(listing.title)}</p>
      <form id="bookingForm" novalidate>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="bfName">Ваше имя <span>*</span></label>
            <input type="text" class="form-input" id="bfName" placeholder="Иван Иванов" required>
            <span class="form-error" id="bfNameError">Введите имя (не менее 2 символов)</span>
          </div>
          <div class="form-group">
            <label class="form-label" for="bfPhone">Телефон <span>*</span></label>
            <input type="tel" class="form-input" id="bfPhone" placeholder="+7 (999) 123-45-67" required>
            <span class="form-error" id="bfPhoneError">Введите корректный номер телефона</span>
          </div>
          <div class="form-group form-group--full">
            <label class="form-label" for="bfEmail">Email</label>
            <input type="email" class="form-input" id="bfEmail" placeholder="ivan@mail.ru">
          </div>
          <div class="form-group">
            <label class="form-label" for="bfCheckin">Дата заезда</label>
            <input type="date" class="form-input" id="bfCheckin" value="${checkin}">
          </div>
          <div class="form-group">
            <label class="form-label" for="bfCheckout">Дата выезда</label>
            <input type="date" class="form-input" id="bfCheckout" value="${checkout}">
          </div>
          <div class="form-group">
            <label class="form-label" for="bfGuests">Гостей</label>
            <input type="number" class="form-input" id="bfGuests" value="${bcGuests}" min="1" max="${listing.guests}">
          </div>
          <div class="form-group form-group--full">
            <label class="form-label" for="bfMsg">Сообщение хозяину</label>
            <textarea class="form-input" id="bfMsg" placeholder="Расскажите о цели поездки, особых пожеланиях..."></textarea>
          </div>
        </div>
        <button type="submit" class="btn btn--primary btn--lg" style="width:100%;margin-top:20px">Отправить заявку</button>
        <p style="text-align:center;color:var(--muted);font-size:0.8125rem;margin-top:12px">Хозяин свяжется с вами в течение нескольких часов</p>
      </form>`;
  }

  function submitBooking(e) {
    e.preventDefault();
    const name = document.getElementById('bfName').value.trim();
    const phone = document.getElementById('bfPhone').value.trim();
    let valid = true;

    const nameErr = document.getElementById('bfNameError');
    const phoneErr = document.getElementById('bfPhoneError');
    const nameInput = document.getElementById('bfName');
    const phoneInput = document.getElementById('bfPhone');

    if (name.length < 2) {
      nameInput.classList.add('error'); nameErr.classList.add('show'); valid = false;
    } else { nameInput.classList.remove('error'); nameErr.classList.remove('show'); }

    if (phone.length < 7) {
      phoneInput.classList.add('error'); phoneErr.classList.add('show'); valid = false;
    } else { phoneInput.classList.remove('error'); phoneErr.classList.remove('show'); }

    if (!valid) return;

    const booking = {
      id: 'bk_' + Date.now(),
      listingId: listing.id,
      listingTitle: listing.title,
      name, phone,
      email: document.getElementById('bfEmail').value,
      checkin: document.getElementById('bfCheckin').value,
      checkout: document.getElementById('bfCheckout').value,
      guests: document.getElementById('bfGuests').value,
      message: document.getElementById('bfMsg').value,
      createdAt: new Date().toISOString()
    };

    try {
      const bookings = JSON.parse(localStorage.getItem('dg_bookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('dg_bookings', JSON.stringify(bookings));
    } catch {}

    document.getElementById('bookingModalBody').innerHTML = `
      <div class="modal-success">
        <div class="modal-success__icon">${window.ICONS.check}</div>
        <h2 class="modal-success__title">Заявка отправлена!</h2>
        <p class="modal-success__text">Хозяин <strong>${window.DG.escapeHtml(listing.host.name)}</strong> получил вашу заявку и свяжется с вами в ближайшее время по телефону <strong>${window.DG.escapeHtml(phone)}</strong>.</p>
        <button class="btn btn--primary" style="margin-top:24px" onclick="document.getElementById('bookingOverlay').classList.remove('open');document.body.style.overflow=''">Отлично!</button>
      </div>`;
  }

  /* ── ACTIONS ── */
  function initActions() {
    document.getElementById('bookingModalClose')?.addEventListener('click', closeBookingModal);
    document.getElementById('bookingOverlay')?.addEventListener('click', e => {
      if (e.target === document.getElementById('bookingOverlay')) closeBookingModal();
    });

    document.getElementById('favBtn')?.addEventListener('click', () => {
      const nowFav = window.DG.toggleFavorite(listing.id);
      const btn = document.getElementById('favBtn');
      const txt = document.getElementById('favBtnText');
      if (btn) { btn.querySelector('svg')?.remove(); btn.prepend(document.createRange().createContextualFragment(nowFav ? window.ICONS.heartFilled : window.ICONS.heart)); }
      if (txt) txt.textContent = nowFav ? 'В избранном' : 'В избранное';
    });

    document.getElementById('shareBtn')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        window.DG.showToast('Ссылка скопирована!', 'success');
      }).catch(() => window.DG.showToast('Скопируйте ссылку из адресной строки'));
    });
  }

  /* ── SIMILAR ── */
  function renderSimilar() {
    const grid = document.getElementById('similarGrid');
    if (!grid) return;
    const similar = window.DATA.listings
      .filter(l => l.id !== listing.id && (l.category === listing.category || l.city === listing.city))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    grid.innerHTML = similar.length
      ? similar.map(l => window.DG.renderListingCard(l)).join('')
      : '<p style="color:var(--muted)">Нет похожих предложений</p>';
    reObserve();
  }

  function reObserve() {
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
