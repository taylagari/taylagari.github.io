// Global site interactions for Taylagari


// Live Chat
// var Tawk_API = Tawk_API || {},
//         Tawk_LoadStart = new Date();
//       (function () {
//         var s1 = document.createElement("script"),
//           s0 = document.getElementsByTagName("script")[0];
//         s1.async = true;
//         s1.src = "https://embed.tawk.to/68eb9575ca008419546706c6/1j7c3vlpd";
//         s1.charset = "UTF-8";
//         s1.setAttribute("crossorigin", "*");
//         s0.parentNode.insertBefore(s1, s0);
//       })();

// Mobile menu toggle
export function initMobileMenu(toggleId = 'menu-toggle', menuId = 'mobile-menu') {
  const toggle = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
}

// Generic horizontal scroll slider controls
export function setupScrollSlider(prevId, nextId, sliderId, itemWidth = 320, gap = 24) {
  const slider = document.getElementById(sliderId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!slider || !prevBtn || !nextBtn) return;
  let scrollAmount = 0;
  const scrollStep = itemWidth + gap;
  nextBtn.addEventListener('click', () => {
    scrollAmount += scrollStep;
    if (scrollAmount >= slider.scrollWidth - slider.clientWidth) scrollAmount = 0;
    slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  });
  prevBtn.addEventListener('click', () => {
    scrollAmount = Math.max(scrollAmount - scrollStep, 0);
    slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  });
}

// Simple frame-based slider (translateX) with indicators
export function setupFrameSlider({
  containerId,
  prevId,
  nextId,
  indicatorSelector,
  intervalMs = 5000,
}) {
  const track = document.getElementById(containerId);
  if (!track) return;
  const slides = track.children;
  const indicators = document.querySelectorAll(indicatorSelector || '.indicator');
  const prev = prevId ? document.getElementById(prevId) : null;
  const next = nextId ? document.getElementById(nextId) : null;
  let current = 0;
  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    indicators.forEach((el, i) => {
      el.classList.toggle('bg-white', i === current);
      el.classList.toggle('bg-opacity-60', i !== current);
    });
  }
  if (next) next.addEventListener('click', () => { current = (current + 1) % slides.length; update(); });
  if (prev) prev.addEventListener('click', () => { current = (current - 1 + slides.length) % slides.length; update(); });
  indicators.forEach((el, i) => el.addEventListener('click', () => { current = i; update(); }));
  if (intervalMs) setInterval(() => { current = (current + 1) % slides.length; update(); }, intervalMs);
  update();
}

// Date inputs min=today
export function setTodayMinOnDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => { input.min = today; });
}

// Reveal on scroll
export function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('reveal-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
    });
  }, { threshold: 0.12 });
  elements.forEach(el => io.observe(el));
}

// Page-level initializers (call selectively per page)
export function initIndexPage() {
  setupFrameSlider({ containerId: 'hero-slider', prevId: 'hero-prev', nextId: 'hero-next', indicatorSelector: '.hero-indicator', intervalMs: 6000 });
  setupScrollSlider('explore-prev', 'explore-next', 'explore-slider');
  setupScrollSlider('dest-prev', 'dest-next', 'destinations-slider');
  setupScrollSlider('hotel-prev', 'hotel-next', 'hotels-slider');
}

export function initOffersSlider() {
  setupFrameSlider({ containerId: 'offers-slider', prevId: 'offers-prev', nextId: 'offers-next', indicatorSelector: '.offers-indicator', intervalMs: 5000 });
}

// Flight page: trip toggle, form demo, card animation
export function initFlightPage() {
  const tripButtons = document.querySelectorAll('.trip-btn');
  const returnField = document.getElementById('returnField');
  const form = document.getElementById('flightForm');
  if (tripButtons.length) {
    tripButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tripButtons.forEach((b) => { b.classList.remove('bg-blue-600', 'text-white'); b.classList.add('text-gray-600'); });
        btn.classList.remove('text-gray-600'); btn.classList.add('bg-blue-600', 'text-white');
        const tripType = btn.dataset.trip;
        if (returnField) {
          if (tripType === 'one-way' || tripType === 'multi') { returnField.style.display = 'none'; }
          else { returnField.style.display = 'block'; returnField.style.opacity = '1'; returnField.style.height = 'auto'; returnField.style.margin = ''; }
        }
      });
    });
  }
  if (form) {
    form.addEventListener('submit', (e) => { e.preventDefault(); alert('Searching flights... (Demo mode)'); });
    const formCard = document.querySelector('.backdrop-blur-sm');
    if (formCard) {
      formCard.style.opacity = '0'; formCard.style.transform = 'translateY(20px)';
      setTimeout(() => { formCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; formCard.style.opacity = '1'; formCard.style.transform = 'translateY(0)'; }, 300);
    }
  }
}

// Hotel page: min date and demo alert on buttons
export function initHotelPage() {
  setTodayMinOnDateInputs();
  document.querySelectorAll('.hotel-card button').forEach((btn) => {
    btn.addEventListener('click', () => { alert('Redirecting to booking page... (Demo)'); });
  });
}

// Tour page: country filter and search
export function initTourPage() {
  const countryButtons = document.querySelectorAll('.country-filter');
  const tourCards = document.querySelectorAll('.tour-card');
  const searchInput = document.getElementById('searchInput');
  if (countryButtons.length && tourCards.length) {
    countryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        countryButtons.forEach((b) => b.classList.remove('bg-blue-100', 'text-blue-700'));
        btn.classList.add('bg-blue-100', 'text-blue-700');
        const c = btn.dataset.country;
        tourCards.forEach((card) => { card.style.display = (c === 'all' || card.dataset.country === c) ? 'block' : 'none'; });
      });
    });
  }
  if (searchInput && tourCards.length) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      tourCards.forEach((card) => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.text-gray-600').textContent.toLowerCase();
        card.style.display = (title.includes(q) || location.includes(q)) ? 'block' : 'none';
      });
    });
  }
  document.querySelectorAll('.view-details').forEach((btn) => {
    btn.addEventListener('click', function () {
      const tourName = this.closest('.tour-card').querySelector('h3').textContent;
      alert(`Opening details for: ${tourName}\n(Demo mode)`);
    });
  });
}

// Visa page: filters and Apply button demo
export function initVisaPage() {
  const visaCards = document.querySelectorAll('.visa-card');
  const searchInput = document.getElementById('searchInput');
  const visaTypeFilter = document.getElementById('visaTypeFilter');
  const countryFilter = document.getElementById('countryFilter');
  function applyFilters() {
    if (!visaCards.length) return;
    const searchTerm = (searchInput?.value || '').toLowerCase();
    const visaType = visaTypeFilter?.value || 'all';
    const country = countryFilter?.value || 'all';
    visaCards.forEach((card) => {
      const matchesSearch = card.querySelector('h3').textContent.toLowerCase().includes(searchTerm)
        || card.querySelector('.text-gray-600').textContent.toLowerCase().includes(searchTerm)
        || card.querySelector('.visa-type-badge').textContent.toLowerCase().includes(searchTerm);
      const matchesVisaType = visaType === 'all' || card.dataset.visaType === visaType;
      const matchesCountry = country === 'all' || card.dataset.country === country;
      card.style.display = (matchesSearch && matchesVisaType && matchesCountry) ? 'block' : 'none';
    });
  }
  searchInput?.addEventListener('input', applyFilters);
  visaTypeFilter?.addEventListener('change', applyFilters);
  countryFilter?.addEventListener('change', applyFilters);
  document.querySelectorAll('.apply-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const countryText = this.closest('.visa-card').querySelector('h3').textContent.trim();
      const visaTypeText = this.closest('.visa-card').querySelector('.visa-type-badge').textContent;
      alert(`Starting application for:\n${visaTypeText} - ${countryText}\n\n(Demo mode: Redirecting to form...)`);
    });
  });
  applyFilters();
}

// Bootstrap all pages
export function initCommon() {
  initMobileMenu();
  setTodayMinOnDateInputs();
  initRevealOnScroll();
}

// Auto-initialize with guards so script can be included everywhere
document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  // Heuristics: if elements exist, initialize features
  if (document.getElementById('hero-slider')) initIndexPage();
  if (document.getElementById('offers-slider')) initOffersSlider();
  // Airline grid slider
  const airlineGrid = document.querySelector('.airline-grid');
  const airlinePrev = document.getElementById('airline-prev');
  const airlineNext = document.getElementById('airline-next');
  if (airlineGrid && airlinePrev && airlineNext) {
    const cards = Array.from(airlineGrid.children);
    let index = 0;
    const visible = 4;
    function show() {
      airlineGrid.innerHTML = '';
      for (let i = 0; i < visible; i++) {
        const idx = (index + i) % cards.length;
        airlineGrid.appendChild(cards[idx].cloneNode(true));
      }
    }
    airlineNext.addEventListener('click', () => { index = (index + 1) % cards.length; show(); });
    airlinePrev.addEventListener('click', () => { index = (index - 1 + cards.length) % cards.length; show(); });
    setInterval(() => { index = (index + 1) % cards.length; show(); }, 4000);
    show();
  }
  // Flight page
  if (document.getElementById('flightForm')) initFlightPage();
  // Hotel page
  if (document.getElementById('hotels-slider') || document.querySelector('.hotel-card')) initHotelPage();
  // Tour page
  if (document.querySelector('.tour-card')) initTourPage();
  // Visa page
  if (document.querySelector('.visa-card')) initVisaPage();
});


