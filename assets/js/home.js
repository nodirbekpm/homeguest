/* ДомГость — home.js */
(function () {
  'use strict';

  const CAT_ICONS = {
    'Море':    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/><path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/><path d="M2 7c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0"/></svg>',
    'Город':   '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="7" height="14"/><rect x="10" y="2" width="7" height="19"/><rect x="17" y="11" width="4" height="10"/><line x1="3" y1="21" x2="21" y2="21"/></svg>',
    'Горы':    '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 20 9 8 13 16 15 12 21 20"/><line x1="3" y1="20" x2="21" y2="20"/></svg>',
    'Природа': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12C12 7 7 4 3 6c3 1 5 4 5 8M12 12c0-5 5-8 9-6-3 1-5 4-5 8"/></svg>'
  };

  const CATEGORIES = [
    { name: 'Море',    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=70', query: 'Море' },
    { name: 'Город',   image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=70', query: 'Город' },
    { name: 'Горы',    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=70', query: 'Горы' },
    { name: 'Природа', image: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&w=600&q=70', query: 'Природа' }
  ];

  function init() {
    renderCategories();
    renderCities();
    renderTopListings();
    renderReviews();
    initSearch();
    initStats();
    initRevealObserver();
  }

  function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map(cat => `
      <a href="catalog.html?category=${encodeURIComponent(cat.query)}" class="category-card reveal">
        <img class="category-card__img" src="${cat.image}" alt="${cat.name}" loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/cat-${cat.query}/600/800'">
        <div class="category-card__overlay"></div>
        <div class="category-card__body">
          <div class="category-card__icon">${CAT_ICONS[cat.name]}</div>
          <div class="category-card__title">${cat.name}</div>
          <div class="category-card__count">${window.DATA.listings.filter(l => l.category === cat.query).length} объектов</div>
        </div>
      </a>`).join('');
  }

  function renderCities() {
    const grid = document.getElementById('citiesGrid');
    if (!grid) return;
    grid.innerHTML = window.DATA.cities.map(city => `
      <a href="catalog.html?city=${encodeURIComponent(city.name)}" class="city-card reveal">
        <img class="city-card__img" src="${city.image}" alt="${city.name}" loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/city-${city.name}/600/400'">
        <div class="city-card__overlay"></div>
        <div class="city-card__body">
          <div class="city-card__name">${city.name}</div>
          <div class="city-card__count">${city.count} объектов</div>
        </div>
      </a>`).join('');
  }

  function renderTopListings() {
    const grid = document.getElementById('topListingsGrid');
    if (!grid) return;
    const top = [...window.DATA.listings].sort((a, b) => b.rating - a.rating).slice(0, 8);
    grid.innerHTML = top.map(l => window.DG.renderListingCard(l)).join('');
    initRevealObserver();
  }

  /* ── REVIEWS SLIDER ── */
  let reviewPage = 0;
  const PER_PAGE = 3;

  function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    const dots = document.getElementById('reviewsDots');
    if (!grid) return;
    const reviews = window.DATA.reviews;
    const pages = Math.ceil(reviews.length / PER_PAGE);

    function renderPage() {
      const slice = reviews.slice(reviewPage * PER_PAGE, reviewPage * PER_PAGE + PER_PAGE);
      grid.innerHTML = slice.map(r => `
        <div class="review-card reveal">
          <div class="review-card__header">
            <div class="review-card__avatar">${r.avatarLetter}</div>
            <div>
              <div class="review-card__name">${r.author}</div>
              <div class="review-card__city">${r.city}</div>
            </div>
            <div class="rating" style="margin-left:auto">
              <span class="rating__star" style="color:var(--star)">★</span>
              <span>${r.rating}.0</span>
            </div>
          </div>
          <p class="review-card__text">"${r.text}"</p>
          <div class="review-card__date">${r.date}</div>
        </div>`).join('');
      if (dots) {
        dots.innerHTML = Array.from({length: pages}, (_, i) =>
          `<span class="reviews-nav__dot ${i === reviewPage ? 'active' : ''}" data-page="${i}"></span>`).join('');
        dots.querySelectorAll('.reviews-nav__dot').forEach(d =>
          d.addEventListener('click', () => { reviewPage = +d.dataset.page; renderPage(); }));
      }
      initRevealObserver();
    }

    renderPage();
    document.getElementById('reviewsPrev')?.addEventListener('click', () => {
      reviewPage = (reviewPage - 1 + pages) % pages; renderPage();
    });
    document.getElementById('reviewsNext')?.addEventListener('click', () => {
      reviewPage = (reviewPage + 1) % pages; renderPage();
    });
  }

  /* ── SEARCH ── */
  function initSearch() {
    const citySelect = document.getElementById('searchCity');
    if (citySelect) {
      const cities = [...new Set(window.DATA.listings.map(l => l.city))].sort();
      cities.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        citySelect.appendChild(opt);
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const checkin = document.getElementById('searchCheckin');
    const checkout = document.getElementById('searchCheckout');
    if (checkin) { checkin.min = today; checkin.value = tomorrow; }
    if (checkout) {
      const d2 = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
      checkout.min = tomorrow; checkout.value = d2;
    }
    checkin?.addEventListener('change', () => {
      if (checkout && checkout.value <= checkin.value) {
        const next = new Date(checkin.value);
        next.setDate(next.getDate() + 1);
        checkout.value = next.toISOString().split('T')[0];
      }
    });

    let guests = 2;
    document.getElementById('guestsMinus')?.addEventListener('click', () => {
      if (guests > 1) { guests--; document.getElementById('guestsCount').textContent = guests; }
    });
    document.getElementById('guestsPlus')?.addEventListener('click', () => {
      if (guests < 20) { guests++; document.getElementById('guestsCount').textContent = guests; }
    });

    document.getElementById('searchBtn')?.addEventListener('click', () => {
      const params = new URLSearchParams();
      const city = document.getElementById('searchCity')?.value;
      if (city) params.set('city', city);
      if (checkin?.value) params.set('checkin', checkin.value);
      if (checkout?.value) params.set('checkout', checkout.value);
      params.set('guests', guests);
      window.location.href = 'catalog.html?' + params.toString();
    });
  }

  /* ── STATS COUNTER ── */
  function animateCounter(el, target, suffix) {
    if (target === 0) { el.textContent = '0' + suffix; return; }
    const duration = 1800;
    const start = performance.now();
    function step(ts) {
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(ease * target);
      if (target >= 1000000) {
        el.textContent = (value / 1000000).toFixed(1).replace('.', ',') + ' млн' + suffix;
      } else if (target >= 1000) {
        el.textContent = Math.round(value / 1000) * 1000 >= 1000
          ? (value >= 1000 ? Math.round(value / 1000) + ' тыс' + suffix : value + suffix)
          : value + suffix;
      } else {
        el.textContent = value + suffix;
      }
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initStats() {
    const stats = [
      { id: 'stat0', target: 100, suffix: ' 000+' },
      { id: 'stat1', target: 1.5, suffix: ' млн+', isMillion: true },
      { id: 'stat2', target: 0, suffix: '%' },
      { id: 'stat3', target: 14, suffix: ' лет' }
    ];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const stat = stats.find(s => s.id === e.target.id);
        if (!stat) return;
        if (stat.isMillion) {
          e.target.textContent = '1,5 млн+';
        } else {
          animateCounter(e.target, stat.target, stat.suffix);
        }
        observer.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    stats.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }

  /* ── RE-RUN reveal observer after dynamic render ── */
  function initRevealObserver() {
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
