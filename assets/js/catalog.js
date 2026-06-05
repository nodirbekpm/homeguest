/* ДомГость — catalog.js */
(function () {
  'use strict';

  let filterGuests = 1;
  let activeCategory = '';

  function getFilters() {
    const types = [...document.querySelectorAll('#typeFilters input:checked')].map(i => i.value);
    const amenities = [...document.querySelectorAll('#amenitiesFilters input:checked')].map(i => i.value);
    const priceMin = +document.getElementById('priceMin').value || 0;
    const priceMax = +document.getElementById('priceMax').value || Infinity;
    return { types, amenities, priceMin, priceMax };
  }

  function applyFilters() {
    const { types, amenities, priceMin, priceMax } = getFilters();
    const sort = document.getElementById('sortSelect').value;
    const city = window.DG.getParam('city');

    let results = window.DATA.listings.filter(l => {
      if (types.length && !types.includes(l.type)) return false;
      if (activeCategory && l.category !== activeCategory) return false;
      if (city && l.city !== city) return false;
      if (l.price < priceMin) return false;
      if (priceMax !== Infinity && l.price > priceMax) return false;
      if (filterGuests > 1 && l.guests < filterGuests) return false;
      if (amenities.length && !amenities.every(a => l.amenities.includes(a))) return false;
      return true;
    });

    results = results.sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating_asc') return a.rating - b.rating;
      return b.rating - a.rating;
    });

    const grid = document.getElementById('catalogGrid');
    const countEl = document.getElementById('resultsCount');

    if (results.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--line)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <h3>Ничего не найдено</h3>
        <p>Попробуйте изменить или сбросить фильтры</p>
        <button class="btn btn--primary" style="margin-top:16px" onclick="document.getElementById('resetFilters').click()">Сбросить фильтры</button>
      </div>`;
    } else {
      grid.innerHTML = results.map(l => window.DG.renderListingCard(l)).join('');
      reObserveReveal();
    }

    countEl.innerHTML = `Найдено: <strong>${results.length}</strong> объектов`;

    const params = new URLSearchParams(window.location.search);
    if (activeCategory) params.set('category', activeCategory); else params.delete('category');
    history.replaceState(null, '', '?' + params.toString());
  }

  function reObserveReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }});
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => obs.observe(el));
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city') || '';
    const category = params.get('category') || '';
    const guests = +params.get('guests') || 1;

    // title / subtitle
    const titleEl = document.getElementById('catalogTitle');
    const subEl = document.getElementById('catalogSubtitle');
    const breadEl = document.getElementById('breadcrumbCurrent');
    if (city) {
      titleEl.textContent = 'Жильё в городе ' + city;
      subEl.textContent = 'Все объекты в ' + city;
      breadEl.textContent = city;
    } else if (category) {
      const labels = { 'Море': 'Отдых у моря', 'Город': 'Городской отдых', 'Горы': 'Горные курорты', 'Природа': 'Природа и экотуризм' };
      titleEl.textContent = labels[category] || category;
      subEl.textContent = 'Жильё категории «' + category + '»';
      breadEl.textContent = category;
    }

    // set initial category chip
    if (category) {
      activeCategory = category;
      document.querySelectorAll('[data-cat]').forEach(c => c.classList.toggle('active', c.dataset.cat === category));
    }

    // guests
    filterGuests = Math.max(1, guests);
    document.getElementById('filterGuestsCount').textContent = filterGuests;

    // category chips
    document.querySelectorAll('[data-cat]').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.cat;
        if (activeCategory === cat) {
          activeCategory = '';
          chip.classList.remove('active');
        } else {
          activeCategory = cat;
          document.querySelectorAll('[data-cat]').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        }
        applyFilters();
      });
    });

    // type / amenity checkboxes
    document.querySelectorAll('#typeFilters input, #amenitiesFilters input').forEach(inp =>
      inp.addEventListener('change', applyFilters));

    // price
    document.getElementById('priceMin').addEventListener('input', applyFilters);
    document.getElementById('priceMax').addEventListener('input', applyFilters);

    // guests counter
    document.getElementById('filterGuestsMinus').addEventListener('click', () => {
      if (filterGuests > 1) { filterGuests--; document.getElementById('filterGuestsCount').textContent = filterGuests; applyFilters(); }
    });
    document.getElementById('filterGuestsPlus').addEventListener('click', () => {
      if (filterGuests < 20) { filterGuests++; document.getElementById('filterGuestsCount').textContent = filterGuests; applyFilters(); }
    });

    // sort
    document.getElementById('sortSelect').addEventListener('change', applyFilters);

    // reset
    document.getElementById('resetFilters').addEventListener('click', () => {
      document.querySelectorAll('#typeFilters input, #amenitiesFilters input').forEach(i => i.checked = false);
      document.getElementById('priceMin').value = '';
      document.getElementById('priceMax').value = '';
      filterGuests = 1;
      document.getElementById('filterGuestsCount').textContent = 1;
      activeCategory = '';
      document.querySelectorAll('[data-cat]').forEach(c => c.classList.remove('active'));
      applyFilters();
    });

    // mobile sidebar
    document.getElementById('mobileFiltersBtn')?.addEventListener('click', openMobileSidebar);

    applyFilters();
  }

  function openMobileSidebar() {
    document.getElementById('catalogSidebar').classList.add('mobile-open');
    document.getElementById('sidebarOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  window.closeMobileSidebar = function () {
    document.getElementById('catalogSidebar').classList.remove('mobile-open');
    document.getElementById('sidebarOverlay').style.display = 'none';
    document.body.style.overflow = '';
  };

  document.addEventListener('DOMContentLoaded', init);
})();
