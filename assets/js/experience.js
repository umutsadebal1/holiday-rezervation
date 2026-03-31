(function () {
  'use strict';

  const STORAGE_KEYS = {
    countdownEnd: 'campaignCountdownEnd',
    wishlistByUser: 'wishlistByUser',
    compareByUser: 'compareByUser',
    recentViewed: 'recentViewedHotels',
    notificationPrefs: 'notificationPrefs',
    cookiePrefs: 'cookiePrefs',
    callMeRequests: 'callMeRequests',
    reservations: 'reservations',
    indexedReservationSync: 'indexedReservationSyncAt'
  };

  const CAMPAIGNS = [
    {
      id: 'early-booking',
      title: 'Erken Rezervasyon Ekstra %20',
      subtitle: 'Seçili şehir otellerinde sınırlı süreli avantaj',
      code: 'ERKEN20',
      deadline: Date.now() + 1000 * 60 * 60 * 36,
      city: 'antalya',
      cta: 'Kampanyayi Kullan',
      description: 'Erken rezervasyon döneminde seçili otellerde gece fiyatları üye girişiyle birlikte ekstra %20 avantajla listelenir.'
    },
    {
      id: 'coupon-500',
      title: '20000 TL Uzeri 500 TL Kupon',
      subtitle: 'Kupon kodu ile sepet indirimi',
      code: 'TRAVEL500',
      deadline: Date.now() + 1000 * 60 * 60 * 54,
      city: 'izmir',
      cta: 'Kodu Kopyala',
      description: 'TRAVEL500 kodunu ödeme adımında uygulayarak 20.000 TL ve üzeri rezervasyonlarda 500 TL anlık indirim alabilirsiniz.'
    },
    {
      id: 'member-price',
      title: 'Üyelere Özel Fiyat Avantajı',
      subtitle: 'Giriş yapan kullanıcılara otomatik fiyat güncellemesi',
      code: 'UYE8',
      deadline: Date.now() + 1000 * 60 * 60 * 72,
      city: 'mugla',
      cta: 'Üye Fiyatını Gör',
      description: 'Üye girişi yapıldığında seçili otellerde gece fiyatları otomatik olarak üye indirimi uygulanmış şekilde gösterilir.'
    }
  ];

  const DEEP_EXPLORE_ITEMS = [
    { city: 'antalya', district: 'Konyaaltı', theme: 'Aile', copy: 'Şehir + plaj konseptleri' },
    { city: 'mugla', district: 'Fethiye', theme: 'Doğada Tatil', copy: 'Koy ve koylar ekseninde keşif' },
    { city: 'izmir', district: 'Çeşme', theme: 'Deniz', copy: 'Sahil ve butik koleksiyonlar' },
    { city: 'trabzon', district: 'Uzungöl', theme: 'Yayla', copy: 'Serin iklim ve doğa otelleri' },
    { city: 'gaziantep', district: 'Şehitkamil', theme: 'Lezzet', copy: 'Gastronomi odaklı konaklamalar' },
    { city: 'ankara', district: 'Çankaya', theme: 'Şehir', copy: 'İş seyahati ve hafta sonu paketleri' }
  ];

  const MAX_WISHLIST = 30;
  const MAX_COMPARE = 4;
  const MAX_RECENT = 14;

  let selectedMapHotelName = '';
  let currentCampaignIndex = 0;

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function readJSON(key, fallback) {
    return safeParse(localStorage.getItem(key), fallback);
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return (value || '')
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toCurrency(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return '₺0';
    return '₺' + amount.toLocaleString('tr-TR');
  }

  function getAuthSessionSafe() {
    try {
      if (typeof getAuthSession === 'function') {
        return getAuthSession();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  function getUserKey() {
    const session = getAuthSessionSafe();
    if (session && session.email) return session.email;
    return 'guest';
  }

  function getUserBucket(storageKey) {
    const all = readJSON(storageKey, {});
    const key = getUserKey();
    return Array.isArray(all[key]) ? all[key] : [];
  }

  function setUserBucket(storageKey, list) {
    const all = readJSON(storageKey, {});
    const key = getUserKey();
    all[key] = list;
    writeJSON(storageKey, all);
  }

  function showModalById(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'block';
  }

  function hideModalById(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
  }

  function bindCloseButton(closeId, modalId) {
    const closeBtn = document.getElementById(closeId);
    if (!closeBtn || closeBtn.dataset.bound === 'true') return;
    closeBtn.addEventListener('click', () => hideModalById(modalId));
    closeBtn.dataset.bound = 'true';
  }

  function initGlobalOverlayClose() {
    window.addEventListener('click', (event) => {
      const target = event.target;
      if (!target || !target.classList || !target.classList.contains('modal')) return;
      const id = target.id;
      if (!id) return;
      if (id === 'bookingModal') {
        if (typeof closeModal === 'function') closeModal();
        return;
      }
      if (id === 'loginModal' || id === 'signupModal') return;
      hideModalById(id);
    });
  }

  function initStaticModalClosers() {
    bindCloseButton('closeHotelDetailModal', 'hotelDetailModal');
    bindCloseButton('closeCampaignDetailModal', 'campaignDetailModal');
    bindCloseButton('closeCompareModal', 'compareModal');
    bindCloseButton('closeWishlistModal', 'wishlistModal');
    bindCloseButton('closeNotificationsModal', 'notificationsModal');
    bindCloseButton('closeCookieModal', 'cookiePreferenceModal');
    bindCloseButton('closeCallMeModal', 'callMeModal');

    const bookingClose = document.getElementById('closeBookingModal');
    if (bookingClose && bookingClose.dataset.bound !== 'true') {
      bookingClose.addEventListener('click', () => {
        if (typeof closeModal === 'function') closeModal();
      });
      bookingClose.dataset.bound = 'true';
    }
  }

  function ensureCountdownEnd() {
    let end = Number(localStorage.getItem(STORAGE_KEYS.countdownEnd) || 0);
    if (!Number.isFinite(end) || end <= Date.now()) {
      end = Date.now() + (1000 * 60 * 60 * 48);
      localStorage.setItem(STORAGE_KEYS.countdownEnd, String(end));
    }
    return end;
  }

  function initCountdown() {
    const countdownEl = document.getElementById('campaignCountdown');
    if (!countdownEl) return;

    const end = ensureCountdownEnd();
    const update = () => {
      const diff = Math.max(0, end - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      countdownEl.textContent = hours + ':' + minutes + ':' + seconds;
    };

    update();
    window.setInterval(update, 1000);
  }

  function getCampaignById(id) {
    return CAMPAIGNS.find((campaign) => campaign.id === id) || null;
  }

  function renderCampaignGrid() {
    const campaignGrid = document.getElementById('campaignGrid');
    if (!campaignGrid) return;

    campaignGrid.innerHTML = CAMPAIGNS.map((campaign) => {
      return ''
        + '<article class="campaign-card">'
        + '  <span class="campaign-chip">' + escapeHtml(campaign.city.toUpperCase()) + '</span>'
        + '  <h3>' + escapeHtml(campaign.title) + '</h3>'
        + '  <p>' + escapeHtml(campaign.subtitle) + '</p>'
        + '  <div class="campaign-footer">'
        + '    <span class="campaign-code">Kod: ' + escapeHtml(campaign.code) + '</span>'
        + '    <button type="button" class="btn-secondary js-open-campaign" data-campaign-id="' + escapeHtml(campaign.id) + '">Detay</button>'
        + '  </div>'
        + '</article>';
    }).join('');

    currentCampaignIndex = 0;
    campaignGrid.style.transform = 'translateX(0)';
    updateCampaignSliderState();
  }

  function updateCampaignSliderState() {
    const campaignGrid = document.getElementById('campaignGrid');
    if (!campaignGrid) return;

    const cards = Array.from(campaignGrid.children);
    if (!cards.length) return;

    cards.forEach((card, index) => {
      card.classList.toggle('active', index === currentCampaignIndex);
    });

    campaignGrid.style.transform = 'translateX(-' + (currentCampaignIndex * 100) + '%)';
  }

  function slideCampaign(direction) {
    const campaignGrid = document.getElementById('campaignGrid');
    if (!campaignGrid) return;

    const cards = campaignGrid.children;
    if (!cards.length) return;

    currentCampaignIndex = (currentCampaignIndex + direction + cards.length) % cards.length;
    updateCampaignSliderState();
  }

  function initCampaignSlider() {
    const prevBtn = document.getElementById('campaignPrevBtn');
    const nextBtn = document.getElementById('campaignNextBtn');
    const campaignGrid = document.getElementById('campaignGrid');

    if (!campaignGrid) return;

    if (prevBtn && prevBtn.dataset.bound !== 'true') {
      prevBtn.addEventListener('click', () => slideCampaign(-1));
      prevBtn.dataset.bound = 'true';
    }

    if (nextBtn && nextBtn.dataset.bound !== 'true') {
      nextBtn.addEventListener('click', () => slideCampaign(1));
      nextBtn.dataset.bound = 'true';
    }

    updateCampaignSliderState();
  }

  function openCampaignDetail(campaign) {
    if (!campaign) return;

    const title = document.getElementById('campaignDetailTitle');
    const description = document.getElementById('campaignDetailDescription');
    const code = document.getElementById('campaignDetailCode');
    const link = document.getElementById('campaignDetailLink');

    if (title) title.textContent = campaign.title;
    if (description) description.textContent = campaign.description;
    if (code) code.textContent = campaign.code;
    if (link) {
      link.href = 'city.html?city=' + encodeURIComponent(campaign.city) + '&campaign=' + encodeURIComponent(campaign.id);
      link.textContent = campaign.cta;
    }

    showModalById('campaignDetailModal');
  }

  function copyTextToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
  }

  function initCampaignInteractions() {
    const openCenterBtn = document.getElementById('openCampaignCenterBtn');
    if (openCenterBtn && openCenterBtn.dataset.bound !== 'true') {
      openCenterBtn.addEventListener('click', () => {
        const center = document.getElementById('campaignCenter');
        if (center) {
          center.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          openCampaignDetail(CAMPAIGNS[0]);
        }
      });
      openCenterBtn.dataset.bound = 'true';
    }

    document.addEventListener('click', (event) => {
      const detailBtn = event.target.closest('.js-open-campaign');
      if (detailBtn) {
        const campaignId = detailBtn.getAttribute('data-campaign-id') || '';
        openCampaignDetail(getCampaignById(campaignId));
        return;
      }

      const couponBtn = event.target.closest('[data-copy-coupon]');
      if (couponBtn) {
        const code = couponBtn.getAttribute('data-copy-coupon') || '';
        copyTextToClipboard(code);
        alert('Kupon kodu kopyalandi: ' + code);
      }

      const scrollBtn = event.target.closest('[data-scroll-to]');
      if (scrollBtn) {
        const targetId = scrollBtn.getAttribute('data-scroll-to') || '';
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });

    const copyCampaignCodeBtn = document.getElementById('copyCampaignCodeBtn');
    if (copyCampaignCodeBtn && copyCampaignCodeBtn.dataset.bound !== 'true') {
      copyCampaignCodeBtn.addEventListener('click', () => {
        const code = document.getElementById('campaignDetailCode')?.textContent || '';
        copyTextToClipboard(code);
        alert('Kupon kodu kopyalandi: ' + code);
      });
      copyCampaignCodeBtn.dataset.bound = 'true';
    }
  }

  function renderDeepExplore() {
    const container = document.getElementById('deepExploreGrid');
    if (!container) return;

    container.innerHTML = DEEP_EXPLORE_ITEMS.map((item) => {
      return ''
        + '<article class="deep-explore-card">'
        + '  <h3>' + escapeHtml(item.city.toUpperCase()) + ' / ' + escapeHtml(item.district) + '</h3>'
        + '  <p>' + escapeHtml(item.copy) + '</p>'
        + '  <div class="deep-explore-meta">Tema: ' + escapeHtml(item.theme) + '</div>'
        + '  <button class="btn-secondary js-open-city" type="button" data-city="' + escapeHtml(item.city) + '" data-theme="' + escapeHtml(item.theme) + '">Kesfet</button>'
        + '</article>';
    }).join('');
  }

  function getRecentViewed() {
    const list = readJSON(STORAGE_KEYS.recentViewed, []);
    return Array.isArray(list) ? list : [];
  }

  function setRecentViewed(list) {
    writeJSON(STORAGE_KEYS.recentViewed, list.slice(0, MAX_RECENT));
  }

  function addRecentViewed(hotel) {
    if (!hotel || !hotel.name) return;

    const citySlug = new URLSearchParams(window.location.search).get('city') || '';
    const currentCityName = (typeof CITY_DATA !== 'undefined' && CITY_DATA && CITY_DATA[citySlug])
      ? CITY_DATA[citySlug].name
      : '';

    const item = {
      name: hotel.name,
      image: hotel.image || 'img/logo.png',
      price: hotel.price || 0,
      rating: hotel.rating || 0,
      city: currentCityName,
      citySlug: citySlug || 'antalya',
      viewedAt: new Date().toISOString()
    };

    const filtered = getRecentViewed().filter((entry) => entry.name !== item.name);
    setRecentViewed([item, ...filtered]);
    renderRecentViewed();
  }

  function renderRecentViewed() {
    const containers = document.querySelectorAll('#recentViewedList');
    if (!containers.length) return;

    const recent = getRecentViewed();
    const html = recent.length
      ? recent.slice(0, 8).map((item) => {
          const cityPart = item.city ? '<span>' + escapeHtml(item.city) + '</span>' : '<span>Şehir oteli</span>';
          return ''
            + '<article class="recent-card">'
            + '  <img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '">'
            + '  <div class="recent-card-body">'
            + '    <h4>' + escapeHtml(item.name) + '</h4>'
            + '    <div class="recent-meta">'
            + cityPart
            + '      <span>' + toCurrency(item.price) + '/gece</span>'
            + '    </div>'
            + '    <a href="city.html?city=' + encodeURIComponent(item.citySlug || 'antalya') + '&q=' + encodeURIComponent(item.name) + '" class="btn-secondary">Tekrar Gör</a>'
            + '  </div>'
            + '</article>';
        }).join('')
      : '<p class="empty-inline-copy">Henüz son görüntülenen otel bulunmuyor.</p>';

    containers.forEach((container) => {
      container.innerHTML = html;
    });
  }

  function initRecentViewedControls() {
    const clearBtn = document.getElementById('clearRecentViewedBtn');
    if (clearBtn && clearBtn.dataset.bound !== 'true') {
      clearBtn.addEventListener('click', () => {
        setRecentViewed([]);
        renderRecentViewed();
      });
      clearBtn.dataset.bound = 'true';
    }
  }

  function getWishlist() {
    return getUserBucket(STORAGE_KEYS.wishlistByUser);
  }

  function setWishlist(list) {
    const trimmed = list.slice(0, MAX_WISHLIST);
    setUserBucket(STORAGE_KEYS.wishlistByUser, trimmed);
  }

  function isWishlisted(hotelName) {
    return getWishlist().some((entry) => entry.name === hotelName);
  }

  function toggleWishlist(hotel) {
    if (!hotel || !hotel.name) return;

    const list = getWishlist();
    const index = list.findIndex((entry) => entry.name === hotel.name);
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.unshift(hotel);
    }
    setWishlist(list);
    syncWishlistButtons();
    renderWishlistContent();
  }

  function getCompareList() {
    return getUserBucket(STORAGE_KEYS.compareByUser);
  }

  function setCompareList(list) {
    setUserBucket(STORAGE_KEYS.compareByUser, list.slice(0, MAX_COMPARE));
  }

  function isCompared(hotelName) {
    return getCompareList().some((entry) => entry.name === hotelName);
  }

  function toggleCompare(hotel) {
    if (!hotel || !hotel.name) return;

    const list = getCompareList();
    const idx = list.findIndex((entry) => entry.name === hotel.name);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      if (list.length >= MAX_COMPARE) {
        alert('En fazla ' + MAX_COMPARE + ' otel karşılaştırabilirsiniz.');
        return;
      }
      list.push(hotel);
    }
    setCompareList(list);
    syncCompareButtons();
    updateCompareDock();
    renderCompareTable();
  }

  function parseHotelCardData(card) {
    if (!card) return null;
    const raw = card.getAttribute('data-hotel-json') || '';
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch (error) {
      return null;
    }
  }

  function syncWishlistButtons() {
    document.querySelectorAll('.js-hotel-card').forEach((card) => {
      const hotel = parseHotelCardData(card);
      const btn = card.querySelector('.js-wishlist-btn');
      if (!hotel || !btn) return;
      const active = isWishlisted(hotel.name);
      btn.classList.toggle('active', active);
      btn.textContent = active ? '♥' : '❤';
      btn.setAttribute('aria-label', active ? 'Favorilerden cikar' : 'Favorilere ekle');
    });
  }

  function syncCompareButtons() {
    document.querySelectorAll('.js-hotel-card').forEach((card) => {
      const hotel = parseHotelCardData(card);
      const btn = card.querySelector('.js-compare-btn');
      if (!hotel || !btn) return;
      const active = isCompared(hotel.name);
      btn.classList.toggle('active', active);
      btn.textContent = active ? 'Seçildi' : 'Karşılaştır';
    });
  }

  function renderWishlistContent() {
    const wishlistContent = document.getElementById('wishlistContent');
    if (!wishlistContent) return;

    const list = getWishlist();
    if (!list.length) {
      wishlistContent.innerHTML = '<p class="empty-inline-copy">Favori listeniz boş. Otel kartlarındaki kalp ikonu ile ekleyebilirsiniz.</p>';
      return;
    }

    wishlistContent.innerHTML = list.map((hotel) => {
      return ''
        + '<article class="wishlist-item" data-wishlist-name="' + escapeHtml(hotel.name) + '">'
        + '  <img src="' + escapeHtml(hotel.image || 'img/logo.png') + '" alt="' + escapeHtml(hotel.name) + '">'
        + '  <div class="wishlist-item-body">'
        + '    <h4>' + escapeHtml(hotel.name) + '</h4>'
        + '    <p>' + toCurrency(hotel.price) + '/gece</p>'
        + '    <div class="wishlist-actions">'
        + '      <button type="button" class="btn-secondary js-open-wishlist-detail">Detay</button>'
        + '      <button type="button" class="btn-secondary js-remove-wishlist">Kaldir</button>'
        + '    </div>'
        + '  </div>'
        + '</article>';
    }).join('');
  }

  function openWishlistModal() {
    renderWishlistContent();
    showModalById('wishlistModal');
  }

  function updateCompareDock() {
    const count = getCompareList().length;
    const countEl = document.getElementById('compareCount');
    const openBtn = document.getElementById('openCompareDockBtn');

    if (countEl) countEl.textContent = String(count);
    if (openBtn) openBtn.disabled = count < 2;
  }

  function renderCompareTable() {
    const compareWrap = document.getElementById('compareTableWrap');
    if (!compareWrap) return;

    const list = getCompareList();
    if (list.length < 2) {
      compareWrap.innerHTML = '<p class="empty-inline-copy">Karşılaştırma için en az 2 otel seçin.</p>';
      return;
    }

    const headerCols = list.map((hotel) => '<th>' + escapeHtml(hotel.name) + '</th>').join('');
    const priceRow = list.map((hotel) => '<td>' + toCurrency(hotel.price) + '</td>').join('');
    const ratingRow = list.map((hotel) => '<td>' + escapeHtml(String(hotel.rating || 0)) + '</td>').join('');
    const conceptRow = list.map((hotel) => '<td>' + escapeHtml(hotel.meta?.concept || '-') + '</td>').join('');
    const themeRow = list.map((hotel) => '<td>' + escapeHtml(hotel.meta?.theme || '-') + '</td>').join('');
    const featureRow = list.map((hotel) => '<td>' + escapeHtml((hotel.features || []).slice(0, 3).join(', ')) + '</td>').join('');

    compareWrap.innerHTML = ''
      + '<table class="compare-table">'
      + '  <thead>'
      + '    <tr><th>Ozellik</th>' + headerCols + '</tr>'
      + '  </thead>'
      + '  <tbody>'
      + '    <tr><td>Fiyat</td>' + priceRow + '</tr>'
      + '    <tr><td>Puan</td>' + ratingRow + '</tr>'
      + '    <tr><td>Konsept</td>' + conceptRow + '</tr>'
      + '    <tr><td>Tema</td>' + themeRow + '</tr>'
      + '    <tr><td>One Cikanlar</td>' + featureRow + '</tr>'
      + '  </tbody>'
      + '</table>';
  }

  function openCompareModal() {
    renderCompareTable();
    showModalById('compareModal');
  }

  function deriveAmenitiesByCategory(hotel) {
    const features = Array.isArray(hotel.features) ? hotel.features : [];
    return {
      Genel: features.slice(0, 2),
      Aktivite: features.slice(2, 4),
      Ekstra: [hotel.meta?.concept || 'Standart', hotel.meta?.theme || 'Şehir']
    };
  }

  function buildPriceCalendar(basePrice) {
    const blocks = [];
    for (let i = 0; i < 14; i += 1) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const factor = 0.9 + ((i % 5) * 0.04);
      const price = Math.round((basePrice || 1000) * factor);
      blocks.push('<div class="calendar-cell"><span>'
        + date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
        + '</span><strong>' + toCurrency(price) + '</strong></div>');
    }
    return blocks.join('');
  }

  function openHotelDetailModal(hotel) {
    if (!hotel) return;

    const titleEl = document.getElementById('hotelDetailTitle');
    const mainImage = document.getElementById('hotelDetailMainImage');
    const thumbs = document.getElementById('hotelDetailThumbs');
    const roomConcepts = document.getElementById('hotelRoomConcepts');
    const amenitiesCols = document.getElementById('hotelAmenitiesByCategory');
    const priceCalendar = document.getElementById('hotelPriceCalendar');

    if (titleEl) titleEl.textContent = hotel.name;
    if (mainImage) mainImage.src = hotel.image || 'img/logo.png';

    if (thumbs) {
      const thumbImages = [hotel.image || 'img/logo.png', 'img/logo.png', hotel.image || 'img/logo.png'];
      thumbs.innerHTML = thumbImages.map((imgSrc, index) => {
        return '<button type="button" class="hotel-thumb ' + (index === 0 ? 'active' : '') + '" data-thumb-src="'
          + escapeHtml(imgSrc)
          + '"><img src="' + escapeHtml(imgSrc) + '" alt="Thumb"></button>';
      }).join('');

      thumbs.querySelectorAll('.hotel-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          thumbs.querySelectorAll('.hotel-thumb').forEach((x) => x.classList.remove('active'));
          thumb.classList.add('active');
          if (mainImage) mainImage.src = thumb.getAttribute('data-thumb-src') || 'img/logo.png';
        });
      });
    }

    if (roomConcepts) {
      const chips = [hotel.meta?.concept || 'Yarım Pansiyon', hotel.meta?.theme || 'Yetişkin', 'Standart Oda', 'Aile Oda'];
      roomConcepts.innerHTML = chips.map((chip) => '<span class="detail-chip">' + escapeHtml(chip) + '</span>').join('');
    }

    if (amenitiesCols) {
      const categories = deriveAmenitiesByCategory(hotel);
      amenitiesCols.innerHTML = Object.entries(categories).map(([category, values]) => {
        const items = (values || []).map((value) => '<li>' + escapeHtml(value) + '</li>').join('');
        return ''
          + '<div class="amenity-col">'
          + '  <h4>' + escapeHtml(category) + '</h4>'
          + '  <ul>' + items + '</ul>'
          + '</div>';
      }).join('');
    }

    if (priceCalendar) {
      priceCalendar.innerHTML = buildPriceCalendar(hotel.price || 0);
    }

    addRecentViewed(hotel);
    showModalById('hotelDetailModal');
  }

  function scrollToHotelByName(name) {
    if (!name) return;
    const cards = document.querySelectorAll('.js-hotel-card');
    for (const card of cards) {
      const hotel = parseHotelCardData(card);
      if (hotel && hotel.name === name) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlight-hotel-card');
        window.setTimeout(() => card.classList.remove('highlight-hotel-card'), 1200);
        return;
      }
    }
  }

  function getCurrentCityLabel() {
    const heroCity = document.getElementById('cityName')?.textContent?.trim() || '';
    if (heroCity && !heroCity.toLowerCase().includes('yükleniyor')) {
      return heroCity;
    }

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('city') || '';
    if (slug && typeof CITY_DATA !== 'undefined' && CITY_DATA[slug] && CITY_DATA[slug].name) {
      return CITY_DATA[slug].name;
    }

    return 'Türkiye';
  }

  function buildGoogleSatelliteMapUrl(query) {
    const normalized = (query || '').trim() || 'hotels in Türkiye';
    return 'https://maps.google.com/maps?q=' + encodeURIComponent(normalized) + '&t=k&z=14&ie=UTF8&iwloc=&output=embed';
  }

  function renderMap(hotels) {
    const mapCanvas = document.getElementById('mapCanvas');
    const mapLegend = document.getElementById('mapLegend');
    const mapCaption = document.getElementById('mapCaption');
    if (!mapCanvas || !mapLegend) return;

    if (!Array.isArray(hotels) || hotels.length === 0) {
      mapCanvas.innerHTML = '<p class="empty-inline-copy">Haritada gösterilecek otel bulunamadı.</p>';
      mapLegend.innerHTML = '';
      if (mapCaption) mapCaption.textContent = '';
      return;
    }

    const cityLabel = getCurrentCityLabel();
    const selectedHotel = selectedMapHotelName
      ? hotels.find((hotel) => hotel.name === selectedMapHotelName)
      : null;

    const mapQuery = selectedHotel
      ? selectedHotel.name + ' ' + cityLabel
      : 'hotels in ' + cityLabel;

    mapCanvas.innerHTML = ''
      + '<div class="google-map-wrap">'
      + '  <iframe class="google-map-frame" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" '
      + 'src="' + escapeHtml(buildGoogleSatelliteMapUrl(mapQuery)) + '"></iframe>'
      + '</div>';

    if (mapCaption) {
      mapCaption.textContent = selectedHotel
        ? selectedHotel.name + ' için Google Maps uydu görünümü'
        : cityLabel + ' için Google Maps uydu görünümü (şehirdeki oteller)';
    }

    mapLegend.innerHTML = ''
      + '<button type="button" class="map-legend-item' + (selectedHotel ? '' : ' active') + '" data-map-mode="overview">'
      + '<strong>•</strong> Şehirdeki tüm oteller</button>'
      + hotels.slice(0, 10).map((hotel, idx) => {
          const isActive = selectedHotel && selectedHotel.name === hotel.name;
          return '<button type="button" class="map-legend-item' + (isActive ? ' active' : '') + '" data-map-mode="hotel" data-marker-name="'
            + escapeHtml(hotel.name)
            + '"><strong>' + (idx + 1) + '.</strong> ' + escapeHtml(hotel.name) + '</button>';
        }).join('');

    mapLegend.querySelectorAll('.map-legend-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-map-mode') || 'overview';
        if (mode === 'overview') {
          selectedMapHotelName = '';
          renderMap(hotels);
          return;
        }

        const hotelName = btn.getAttribute('data-marker-name') || '';
        selectedMapHotelName = hotelName;
        renderMap(hotels);
        scrollToHotelByName(hotelName);
      });
    });
  }

  function updateResultsSummary(hotels) {
    const countEl = document.getElementById('resultsCount');
    if (countEl) countEl.textContent = String(hotels.length) + ' otel bulundu';

    const emptyState = document.getElementById('emptyResultsState');
    if (emptyState) {
      emptyState.classList.toggle('hidden', hotels.length > 0);
    }

    const tripSummaryText = document.getElementById('tripSummaryText');
    if (tripSummaryText) {
      const params = new URLSearchParams(window.location.search);
      const checkIn = params.get('checkIn') || '-';
      const checkOut = params.get('checkOut') || '-';
      const guests = params.get('guests') || '2';
      tripSummaryText.textContent = checkIn + ' - ' + checkOut + ' | ' + guests + ' misafir';
    }
  }

  function updateCityFilterParamsInUrl() {
    if (!document.body.classList.contains('page-city')) return;

    const params = new URLSearchParams(window.location.search);
    const fields = [
      ['minPrice', document.getElementById('minPriceInput')?.value || ''],
      ['maxPrice', document.getElementById('maxPriceInput')?.value || ''],
      ['rating', document.getElementById('ratingFilter')?.value || ''],
      ['concept', document.getElementById('conceptFilter')?.value || ''],
      ['theme', document.getElementById('themeFilter')?.value || ''],
      ['sort', document.getElementById('sortBy')?.value || ''],
      ['checkIn', params.get('checkIn') || ''],
      ['checkOut', params.get('checkOut') || ''],
      ['guests', params.get('guests') || ''],
      ['rooms', params.get('rooms') || '']
    ];

    fields.forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const next = window.location.pathname + '?' + params.toString();
    window.history.replaceState({}, '', next);
  }

  function applyFilterParamsFromUrl() {
    if (!document.body.classList.contains('page-city')) return;

    const params = new URLSearchParams(window.location.search);
    const mappings = [
      ['minPrice', 'minPriceInput', 'input'],
      ['maxPrice', 'maxPriceInput', 'input'],
      ['rating', 'ratingFilter', 'change'],
      ['concept', 'conceptFilter', 'change'],
      ['theme', 'themeFilter', 'change'],
      ['sort', 'sortBy', 'change']
    ];

    mappings.forEach(([paramKey, elementId, eventType]) => {
      const value = params.get(paramKey);
      const el = document.getElementById(elementId);
      if (!el || value === null) return;
      el.value = value;
      el.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
  }

  function initFilterQuerySync() {
    const filterIds = ['minPriceInput', 'maxPriceInput', 'ratingFilter', 'conceptFilter', 'themeFilter', 'sortBy'];
    filterIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.urlBound === 'true') return;
      const eventName = (id === 'minPriceInput' || id === 'maxPriceInput') ? 'input' : 'change';
      el.addEventListener(eventName, updateCityFilterParamsInUrl);
      el.dataset.urlBound = 'true';
    });
  }

  function initSearchTabs() {
    const tabs = document.querySelectorAll('.search-tab');
    const panels = document.querySelectorAll('.search-panel');
    const selectedProductInput = document.getElementById('selectedProduct');

    if (!tabs.length || !panels.length) return;

    const activate = (product) => {
      tabs.forEach((tab) => tab.classList.toggle('active', tab.getAttribute('data-product') === product));
      panels.forEach((panel) => panel.classList.toggle('active', panel.getAttribute('data-panel') === product));
      if (selectedProductInput) selectedProductInput.value = product;
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const product = tab.getAttribute('data-product') || 'hotel';
        activate(product);
      });
    });
  }

  function resolveCityFromInput(text) {
    if (typeof resolveCitySlug === 'function') {
      return resolveCitySlug(text || '');
    }

    const normalized = (text || '').toLowerCase();
    if (normalized.includes('antalya')) return 'antalya';
    if (normalized.includes('bodrum')) return 'bodrum';
    return 'antalya';
  }

  function navigateToCity(citySlug, extra) {
    const params = new URLSearchParams();
    params.set('city', citySlug || 'antalya');

    const checkIn = document.getElementById('checkIn')?.value || '';
    const checkOut = document.getElementById('checkOut')?.value || '';
    const guests = document.getElementById('guests')?.value || '2';
    const rooms = document.getElementById('rooms')?.value || '1';

    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', guests);
    params.set('rooms', rooms);

    if (extra && typeof extra === 'object') {
      Object.keys(extra).forEach((key) => {
        const value = extra[key];
        if (value) params.set(key, value);
      });
    }

    window.location.href = 'city.html?' + params.toString();
  }

  function initSearchSubmit() {
    const submitBtn = document.getElementById('searchSubmitBtn');
    if (!submitBtn || submitBtn.dataset.bound === 'true') return;

    submitBtn.addEventListener('click', () => {
      const selectedProduct = document.getElementById('selectedProduct')?.value || 'hotel';

      if (selectedProduct === 'hotel') {
        if (typeof searchResorts === 'function') {
          searchResorts();
        }
        return;
      }

      const sourceId = selectedProduct === 'tour' ? 'tourDestination'
        : selectedProduct === 'villa' ? 'villaDestination'
        : selectedProduct === 'flight' ? 'flightRoute'
        : 'busRoute';

      const rawValue = document.getElementById(sourceId)?.value || '';
      const citySlug = resolveCityFromInput(rawValue);
      navigateToCity(citySlug, { product: selectedProduct, q: rawValue || selectedProduct });
    });

    submitBtn.dataset.bound = 'true';
  }

  function initRegionButtons() {
    const regionButtons = document.querySelectorAll('[data-city]');
    if (!regionButtons.length) return;

    regionButtons.forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.addEventListener('click', () => {
        const city = btn.getAttribute('data-city') || 'antalya';
        const theme = btn.getAttribute('data-theme') || '';
        navigateToCity(city, { theme });
      });
      btn.dataset.bound = 'true';
    });
  }

  function initSliderButtons() {
    const heroPrev = document.getElementById('heroPrevBtn');
    const heroNext = document.getElementById('heroNextBtn');
    const testimonialPrev = document.getElementById('testimonialPrevBtn');
    const testimonialNext = document.getElementById('testimonialNextBtn');

    if (heroPrev && heroPrev.dataset.bound !== 'true') {
      heroPrev.addEventListener('click', () => {
        if (typeof slideHero === 'function') slideHero(-1);
      });
      heroPrev.dataset.bound = 'true';
    }

    if (heroNext && heroNext.dataset.bound !== 'true') {
      heroNext.addEventListener('click', () => {
        if (typeof slideHero === 'function') slideHero(1);
      });
      heroNext.dataset.bound = 'true';
    }

    if (testimonialPrev && testimonialPrev.dataset.bound !== 'true') {
      testimonialPrev.addEventListener('click', () => {
        if (typeof slideTestimonial === 'function') slideTestimonial(-1);
      });
      testimonialPrev.dataset.bound = 'true';
    }

    if (testimonialNext && testimonialNext.dataset.bound !== 'true') {
      testimonialNext.addEventListener('click', () => {
        if (typeof slideTestimonial === 'function') slideTestimonial(1);
      });
      testimonialNext.dataset.bound = 'true';
    }
  }

  function initMapViewControls() {
    const cityLayout = document.getElementById('cityLayout');
    const listBtn = document.getElementById('listViewBtn');
    const mapBtn = document.getElementById('mapViewBtn');

    if (!cityLayout || !listBtn || !mapBtn) return;

    listBtn.addEventListener('click', () => {
      cityLayout.classList.remove('map-focused');
      listBtn.classList.add('active');
      mapBtn.classList.remove('active');
    });

    mapBtn.addEventListener('click', () => {
      cityLayout.classList.add('map-focused');
      mapBtn.classList.add('active');
      listBtn.classList.remove('active');
    });
  }

  function initWishlistCompareActions() {
    document.addEventListener('wishlist:open', () => {
      openWishlistModal();
    });

    const openWishlistBtn = document.getElementById('openWishlistBtn');
    if (openWishlistBtn && openWishlistBtn.dataset.bound !== 'true') {
      openWishlistBtn.addEventListener('click', openWishlistModal);
      openWishlistBtn.dataset.bound = 'true';
    }

    const openCompareBtn = document.getElementById('openCompareBtn');
    if (openCompareBtn && openCompareBtn.dataset.bound !== 'true') {
      openCompareBtn.addEventListener('click', openCompareModal);
      openCompareBtn.dataset.bound = 'true';
    }

    const openCompareDockBtn = document.getElementById('openCompareDockBtn');
    if (openCompareDockBtn && openCompareDockBtn.dataset.bound !== 'true') {
      openCompareDockBtn.addEventListener('click', openCompareModal);
      openCompareDockBtn.dataset.bound = 'true';
    }

    const clearCompareDockBtn = document.getElementById('clearCompareDockBtn');
    if (clearCompareDockBtn && clearCompareDockBtn.dataset.bound !== 'true') {
      clearCompareDockBtn.addEventListener('click', () => {
        setCompareList([]);
        syncCompareButtons();
        updateCompareDock();
        renderCompareTable();
      });
      clearCompareDockBtn.dataset.bound = 'true';
    }

    const wishlistContent = document.getElementById('wishlistContent');
    if (wishlistContent && wishlistContent.dataset.bound !== 'true') {
      wishlistContent.addEventListener('click', (event) => {
        const row = event.target.closest('.wishlist-item');
        if (!row) return;

        const name = row.getAttribute('data-wishlist-name') || '';
        const list = getWishlist();
        const hotel = list.find((item) => item.name === name);

        if (event.target.closest('.js-remove-wishlist')) {
          setWishlist(list.filter((item) => item.name !== name));
          renderWishlistContent();
          syncWishlistButtons();
          return;
        }

        if (event.target.closest('.js-open-wishlist-detail') && hotel) {
          openHotelDetailModal(hotel);
        }
      });
      wishlistContent.dataset.bound = 'true';
    }
  }

  function initHotelCardDelegation() {
    document.addEventListener('click', (event) => {
      const plainCardClick = event.target.closest('.js-hotel-card')
        && !event.target.closest('button, a, input, label, select, textarea');
      if (plainCardClick) {
        const card = event.target.closest('.js-hotel-card');
        const hotel = parseHotelCardData(card);
        if (hotel) {
          selectedMapHotelName = hotel.name;
          renderMap(collectHotelsFromDom());
        }
      }

      const detailBtn = event.target.closest('.js-detail-btn');
      if (detailBtn) {
        const card = detailBtn.closest('.js-hotel-card');
        const hotel = parseHotelCardData(card);
        if (hotel) {
          selectedMapHotelName = hotel.name;
          renderMap(collectHotelsFromDom());
          openHotelDetailModal(hotel);
        }
        return;
      }

      const wishlistBtn = event.target.closest('.js-wishlist-btn');
      if (wishlistBtn) {
        const card = wishlistBtn.closest('.js-hotel-card');
        const hotel = parseHotelCardData(card);
        if (hotel) toggleWishlist(hotel);
        return;
      }

      const compareBtn = event.target.closest('.js-compare-btn');
      if (compareBtn) {
        const card = compareBtn.closest('.js-hotel-card');
        const hotel = parseHotelCardData(card);
        if (hotel) toggleCompare(hotel);
        return;
      }

      const bookBtn = event.target.closest('.js-book-btn');
      if (bookBtn) {
        const card = bookBtn.closest('.js-hotel-card');
        const hotel = parseHotelCardData(card);
        if (hotel) {
          selectedMapHotelName = hotel.name;
          renderMap(collectHotelsFromDom());
          addRecentViewed(hotel);
        }
        setTimeout(() => {
          setBookingStep(0);
        }, 0);
      }
    });

    document.addEventListener('hotels:rendered', (event) => {
      const hotels = Array.isArray(event.detail?.hotels) ? event.detail.hotels : [];
      if (selectedMapHotelName && !hotels.some((hotel) => hotel.name === selectedMapHotelName)) {
        selectedMapHotelName = '';
      }
      syncWishlistButtons();
      syncCompareButtons();
      updateCompareDock();
      updateResultsSummary(hotels);
      renderMap(hotels);
    });
  }

  function initNotificationPrefs() {
    const openBtn = document.getElementById('openNotificationPrefsBtn');
    const form = document.getElementById('notificationPrefsForm');

    if (openBtn && openBtn.dataset.bound !== 'true') {
      openBtn.addEventListener('click', () => {
        const prefs = readJSON(STORAGE_KEYS.notificationPrefs, { email: true, sms: false, push: true });
        if (form) {
          form.querySelector('input[name="email"]').checked = !!prefs.email;
          form.querySelector('input[name="sms"]').checked = !!prefs.sms;
          form.querySelector('input[name="push"]').checked = !!prefs.push;
        }
        showModalById('notificationsModal');
      });
      openBtn.dataset.bound = 'true';
    }

    if (form && form.dataset.bound !== 'true') {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const prefs = {
          email: form.querySelector('input[name="email"]').checked,
          sms: form.querySelector('input[name="sms"]').checked,
          push: form.querySelector('input[name="push"]').checked
        };
        writeJSON(STORAGE_KEYS.notificationPrefs, prefs);
        hideModalById('notificationsModal');
        alert('Bildirim tercihleriniz kaydedildi.');
      });
      form.dataset.bound = 'true';
    }
  }

  function initCookiePrefs() {
    const openBtn = document.getElementById('openCookiePrefsBtn');
    const form = document.getElementById('cookiePrefsForm');
    const rejectBtn = document.getElementById('rejectCookiesBtn');
    const acceptAllBtn = document.getElementById('acceptAllCookiesBtn');

    const applyPrefsToForm = (prefs) => {
      if (!form) return;
      form.querySelector('input[name="analytics"]').checked = !!prefs.analytics;
      form.querySelector('input[name="marketing"]').checked = !!prefs.marketing;
      form.querySelector('input[name="personalization"]').checked = !!prefs.personalization;
    };

    if (openBtn && openBtn.dataset.bound !== 'true') {
      openBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const prefs = readJSON(STORAGE_KEYS.cookiePrefs, {
          analytics: true,
          marketing: false,
          personalization: true
        });
        applyPrefsToForm(prefs);
        showModalById('cookiePreferenceModal');
      });
      openBtn.dataset.bound = 'true';
    }

    if (rejectBtn && rejectBtn.dataset.bound !== 'true') {
      rejectBtn.addEventListener('click', () => {
        const prefs = { analytics: false, marketing: false, personalization: false };
        writeJSON(STORAGE_KEYS.cookiePrefs, prefs);
        applyPrefsToForm(prefs);
      });
      rejectBtn.dataset.bound = 'true';
    }

    if (acceptAllBtn && acceptAllBtn.dataset.bound !== 'true') {
      acceptAllBtn.addEventListener('click', () => {
        const prefs = { analytics: true, marketing: true, personalization: true };
        writeJSON(STORAGE_KEYS.cookiePrefs, prefs);
        applyPrefsToForm(prefs);
      });
      acceptAllBtn.dataset.bound = 'true';
    }

    if (form && form.dataset.bound !== 'true') {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const prefs = {
          analytics: form.querySelector('input[name="analytics"]').checked,
          marketing: form.querySelector('input[name="marketing"]').checked,
          personalization: form.querySelector('input[name="personalization"]').checked
        };
        writeJSON(STORAGE_KEYS.cookiePrefs, prefs);
        hideModalById('cookiePreferenceModal');
        alert('Çerez tercihleriniz güncellendi.');
      });
      form.dataset.bound = 'true';
    }
  }

  function initCallMe() {
    const openBtn = document.getElementById('openCallMeBtn');
    const openInlineBtn = document.getElementById('openCallMeBtnInline');
    const form = document.getElementById('callMeForm');

    const openForm = (event) => {
      if (event) event.preventDefault();
      showModalById('callMeModal');
    };

    if (openBtn && openBtn.dataset.bound !== 'true') {
      openBtn.addEventListener('click', openForm);
      openBtn.dataset.bound = 'true';
    }

    if (openInlineBtn && openInlineBtn.dataset.bound !== 'true') {
      openInlineBtn.addEventListener('click', openForm);
      openInlineBtn.dataset.bound = 'true';
    }

    if (form && form.dataset.bound !== 'true') {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const payload = {
          name: document.getElementById('callMeName')?.value || '',
          phone: document.getElementById('callMePhone')?.value || '',
          hour: document.getElementById('callMeHour')?.value || '',
          createdAt: new Date().toISOString()
        };

        const old = readJSON(STORAGE_KEYS.callMeRequests, []);
        old.unshift(payload);
        writeJSON(STORAGE_KEYS.callMeRequests, old.slice(0, 30));
        hideModalById('callMeModal');
        form.reset();
        alert('Geri arama talebiniz alındı. En kısa sürede sizi arayacağız.');
      });
      form.dataset.bound = 'true';
    }
  }

  const BookingStore = {
    dbName: 'tatilrez-account-db',
    storeName: 'reservations',

    open() {
      return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
          reject(new Error('IndexedDB not supported'));
          return;
        }

        const request = window.indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
            store.createIndex('accountKey', 'accountKey', { unique: false });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('DB open failed'));
      });
    },

    async save(record) {
      const db = await this.open();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error || new Error('DB write failed'));
      });
      db.close();
    },

    async listByAccount(accountKey) {
      const db = await this.open();
      const all = await new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const request = tx.objectStore(this.storeName).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error || new Error('DB read failed'));
      });
      db.close();
      return all.filter((item) => item.accountKey === accountKey);
    }
  };

  async function saveReservationWithDualStorage(record) {
    const list = readJSON(STORAGE_KEYS.reservations, []);
    const merged = [record, ...list.filter((item) => item.id !== record.id)];
    writeJSON(STORAGE_KEYS.reservations, merged.slice(0, 200));

    try {
      await BookingStore.save(record);
      localStorage.setItem(STORAGE_KEYS.indexedReservationSync, new Date().toISOString());
    } catch (error) {
      // Fallback already handled by localStorage write.
    }
  }

  async function syncReservationsFromIndexedDB() {
    const session = getAuthSessionSafe();
    if (!session || !session.email) return;

    try {
      const indexed = await BookingStore.listByAccount(session.email);
      if (!indexed.length) return;

      const local = readJSON(STORAGE_KEYS.reservations, []);
      const mergedMap = new Map();
      [...indexed, ...local].forEach((item) => {
        if (item && item.id) mergedMap.set(item.id, item);
      });

      writeJSON(STORAGE_KEYS.reservations, Array.from(mergedMap.values()).sort((a, b) => b.id - a.id));
    } catch (error) {
      // Ignore sync errors to keep UI responsive.
    }
  }

  const bookingStepperState = {
    current: 0,
    max: 3
  };

  function setBookingStep(step) {
    const steps = document.querySelectorAll('#bookingStepper li');
    const panels = document.querySelectorAll('.booking-step-panel');
    const prevBtn = document.getElementById('bookingPrevStepBtn');
    const nextBtn = document.getElementById('bookingNextStepBtn');
    const submitBtn = document.getElementById('bookingSubmitBtn');

    if (!steps.length || !panels.length) return;

    const nextStep = Math.max(0, Math.min(step, bookingStepperState.max));
    bookingStepperState.current = nextStep;

    steps.forEach((item, idx) => {
      item.classList.toggle('active', idx <= nextStep);
    });

    panels.forEach((panel) => {
      const index = Number(panel.getAttribute('data-step-panel') || '0');
      panel.classList.toggle('active', index === nextStep);
    });

    if (prevBtn) prevBtn.disabled = nextStep === 0;
    if (nextBtn) nextBtn.classList.toggle('hidden', nextStep >= bookingStepperState.max);
    if (submitBtn) submitBtn.classList.toggle('hidden', nextStep < bookingStepperState.max);
  }

  function validateCurrentBookingStep() {
    const panel = document.querySelector('.booking-step-panel.active');
    if (!panel) return true;

    const requiredFields = panel.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (!field.value) {
        field.focus();
        return false;
      }
    }
    return true;
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (bookingStepperState.current < bookingStepperState.max) {
      setBookingStep(bookingStepperState.max);
      return;
    }

    const reservation = {
      id: Date.now(),
      resortName: document.getElementById('resortName')?.value || '',
      guestName: document.getElementById('guestName')?.value || '',
      guestEmail: document.getElementById('guestEmail')?.value || '',
      guestPhone: document.getElementById('guestPhone')?.value || '',
      checkIn: document.getElementById('bookingCheckIn')?.value || '',
      checkOut: document.getElementById('bookingCheckOut')?.value || '',
      guests: document.getElementById('bookingGuests')?.value || '1',
      roomType: document.getElementById('roomType')?.value || 'Standard',
      specialRequests: document.getElementById('specialRequests')?.value || '',
      totalPrice: document.getElementById('totalPrice')?.textContent || '₺0',
      status: 'Onaylandı',
      bookingDate: new Date().toLocaleDateString('tr-TR'),
      accountKey: getUserKey(),
      syncSource: 'indexeddb+localStorage'
    };

    await saveReservationWithDualStorage(reservation);

    if (typeof loadReservations === 'function') {
      loadReservations();
    }

    alert('Başarılı! Rezervasyon numaranız: ' + reservation.id);

    const form = document.getElementById('bookingForm');
    if (form) form.reset();
    setBookingStep(0);

    if (typeof closeModal === 'function') {
      closeModal();
    } else {
      hideModalById('bookingModal');
    }
  }

  function initBookingWizard() {
    const prevBtn = document.getElementById('bookingPrevStepBtn');
    const nextBtn = document.getElementById('bookingNextStepBtn');
    const form = document.getElementById('bookingForm');

    if (prevBtn && prevBtn.dataset.bound !== 'true') {
      prevBtn.addEventListener('click', () => {
        setBookingStep(bookingStepperState.current - 1);
      });
      prevBtn.dataset.bound = 'true';
    }

    if (nextBtn && nextBtn.dataset.bound !== 'true') {
      nextBtn.addEventListener('click', () => {
        if (!validateCurrentBookingStep()) {
          alert('Bu adımdaki zorunlu alanları doldurun.');
          return;
        }
        if (typeof updateTotalPrice === 'function') updateTotalPrice();
        setBookingStep(bookingStepperState.current + 1);
      });
      nextBtn.dataset.bound = 'true';
    }

    if (form && form.dataset.boundWizard !== 'true') {
      form.addEventListener('submit', handleBookingSubmit);
      form.dataset.boundWizard = 'true';
    }

    setBookingStep(0);
  }

  function initEmptyStateReset() {
    const resetBtn = document.getElementById('emptyStateResetBtn');
    const clearBtn = document.getElementById('clearFiltersBtn');
    if (!resetBtn || !clearBtn || resetBtn.dataset.bound === 'true') return;

    resetBtn.addEventListener('click', () => {
      clearBtn.click();
    });

    resetBtn.dataset.bound = 'true';
  }

  function renderPersonalizedCollections() {
    const container = document.getElementById('personalizedCollections');
    if (!container) return;

    const recent = getRecentViewed();
    const wishlist = getWishlist();

    const cards = [
      {
        title: 'Aile Tatili Onerileri',
        text: 'Cocuk dostu havuzlu, kolay ulasimli sehir otelleri.',
        city: 'antalya',
        tag: 'Aile'
      },
      {
        title: 'Balayi Koleksiyonu',
        text: 'Ciftler icin romantik ve daha sakin tesis secimleri.',
        city: 'mugla',
        tag: 'Balayi'
      },
      {
        title: 'Sehir Kacamagı',
        text: '2 gecelik hafta sonu planlari icin merkezi oteller.',
        city: 'istanbul',
        tag: 'Hafta Sonu'
      }
    ];

    if (wishlist.length > 0) {
      cards.unshift({
        title: 'Favorilerine Göre',
        text: 'Kaydettigin otellere benzer secenekleri one cikardik.',
        city: 'izmir',
        tag: 'Kisisel'
      });
    }

    if (recent.length > 0) {
      cards.push({
        title: 'Son Incelediklerine Benzer',
        text: 'Son baktigin otellerin fiyat araligina yakin secenekler.',
        city: recent[0].citySlug || 'antalya',
        tag: 'Tekrar Oneri'
      });
    }

    container.innerHTML = cards.slice(0, 4).map((card) => {
      return ''
        + '<article class="personal-card">'
        + '  <span class="personal-tag">' + escapeHtml(card.tag) + '</span>'
        + '  <h3>' + escapeHtml(card.title) + '</h3>'
        + '  <p>' + escapeHtml(card.text) + '</p>'
        + '  <button type="button" class="btn-secondary js-open-city" data-city="' + escapeHtml(card.city) + '">Koleksiyonu Gör</button>'
        + '</article>';
    }).join('');
  }

  function hydrateSearchFromUrl() {
    const params = new URLSearchParams(window.location.search);

    const destination = document.getElementById('destination');
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    const guests = document.getElementById('guests');
    const rooms = document.getElementById('rooms');

    const query = params.get('q');
    const city = params.get('city');

    if (destination && (query || city)) {
      if (query) {
        destination.value = query;
      } else if (city && typeof CITY_DATA !== 'undefined' && CITY_DATA[city]) {
        destination.value = CITY_DATA[city].name;
      }
    }

    if (checkIn && params.get('checkIn')) checkIn.value = params.get('checkIn');
    if (checkOut && params.get('checkOut')) checkOut.value = params.get('checkOut');
    if (guests && params.get('guests')) guests.value = params.get('guests');
    if (rooms && params.get('rooms')) rooms.value = params.get('rooms');
  }

  function initHomePromoButtons() {
    document.querySelectorAll('[data-open="login"]').forEach((btn) => {
      if (btn.dataset.bound === 'true') return;
      btn.addEventListener('click', () => {
        if (typeof openLoginModal === 'function') {
          openLoginModal();
        }
      });
      btn.dataset.bound = 'true';
    });
  }

  function initContactFormFeedback() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm || contactForm.dataset.bound === 'true') return;

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Mesajınız alındı. En kısa sürede dönüş yapacağız.');
      contactForm.reset();
    });

    contactForm.dataset.bound = 'true';
  }

  function collectHotelsFromDom() {
    const hotels = [];
    document.querySelectorAll('.js-hotel-card').forEach((card) => {
      const hotel = parseHotelCardData(card);
      if (hotel) hotels.push(hotel);
    });
    return hotels;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    initStaticModalClosers();
    initGlobalOverlayClose();
    initCountdown();

    initHotelCardDelegation();

    renderCampaignGrid();
    initCampaignSlider();
    renderDeepExplore();
    renderPersonalizedCollections();

    hydrateSearchFromUrl();
    applyFilterParamsFromUrl();

    initSearchTabs();
    initSearchSubmit();
    initRegionButtons();
    initSliderButtons();
    initMapViewControls();

    initCampaignInteractions();
    initHomePromoButtons();

    initWishlistCompareActions();
    initRecentViewedControls();
    renderRecentViewed();

    initNotificationPrefs();
    initCookiePrefs();
    initCallMe();

    initBookingWizard();
    initFilterQuerySync();
    initEmptyStateReset();
    initContactFormFeedback();

    updateCompareDock();
    renderCompareTable();
    syncWishlistButtons();
    syncCompareButtons();

    const initialHotels = collectHotelsFromDom();
    if (initialHotels.length > 0) {
      updateResultsSummary(initialHotels);
      renderMap(initialHotels);
    }

    await syncReservationsFromIndexedDB();
  });
})();
