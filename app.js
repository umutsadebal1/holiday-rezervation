const initThemeToggle = () => {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        });
    }
};

  const HOTEL_DATA = (typeof window !== "undefined" && window.HOTELS_BY_CITY)
    ? window.HOTELS_BY_CITY
    : {};

let selectedPackagePrice = 0;

function openBooking(hotelName, price) {
    selectedPackagePrice = price;
    const resortNameField = document.getElementById('resortName');
    if (resortNameField) {
        resortNameField.value = hotelName;
        document.getElementById('bookingCheckIn').value = '';
        document.getElementById('bookingCheckOut').value = '';
        document.getElementById('bookingGuests').value = '1';
        document.getElementById('roomType').value = '';
        document.getElementById('guestName').value = '';
        document.getElementById('guestEmail').value = '';
        document.getElementById('guestPhone').value = '';
        document.getElementById('specialRequests').value = '';
        updateTotalPrice();
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) bookingModal.style.display = 'block';
    }
}

function closeModal() {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) bookingModal.style.display = 'none';
}

window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    if (event.target === bookingModal) {
        closeModal();
    }
};

function updateTotalPrice() {
    const checkInEl = document.getElementById('bookingCheckIn');
    const checkOutEl = document.getElementById('bookingCheckOut');
    const roomTypeEl = document.getElementById('roomType');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (!checkInEl || !checkOutEl) return;
    
    const checkIn = new Date(checkInEl.value);
    const checkOut = new Date(checkOutEl.value);
    
    if (checkIn && checkOut && checkIn < checkOut) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const roomMultiplier = {
            'Standard': 1,
            'Deluxe': 1.3,
            'Suite': 1.6,
            'Villa': 2
        };
        const roomType = roomTypeEl ? roomTypeEl.value : 'Standard';
        const multiplier = roomMultiplier[roomType] || 1;
        const total = Math.round(selectedPackagePrice * multiplier * nights);
        if (totalPriceEl) {
            totalPriceEl.textContent = '₺' + total.toLocaleString('tr-TR');
        }
    }
}

function submitReservation(event) {
    event.preventDefault();
    
    const getElementValue = (id) => document.getElementById(id)?.value || '';
    const getElementText = (id) => document.getElementById(id)?.textContent || '';
    
    const reservation = {
        id: Date.now(),
        resortName: getElementValue('resortName'),
        guestName: getElementValue('guestName'),
        guestEmail: getElementValue('guestEmail'),
        guestPhone: getElementValue('guestPhone'),
        checkIn: getElementValue('bookingCheckIn'),
        checkOut: getElementValue('bookingCheckOut'),
        guests: getElementValue('bookingGuests'),
        roomType: getElementValue('roomType'),
        specialRequests: getElementValue('specialRequests'),
        totalPrice: getElementText('totalPrice'),
        status: 'Onaylandı',
        bookingDate: new Date().toLocaleDateString('tr-TR')
    };
    
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    alert(`Başarılı! Rezervasyon numaranız: ${reservation.id}`);
    closeModal();
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.reset();
}

let currentSlide = 0;
let currentTestimonial = 0;

const slideHero = (direction) => {
    const heroSlider = document.getElementById('heroSlider');
    if (!heroSlider) return;
    const slides = heroSlider.children;
    const totalSlides = slides.length;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    heroSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
};

const testimonials = [
    { text: "Muhteşem bir tatil deneyimi! Her şey mükemmeldi.", name: "xxxx", location: "Antalya Tatili", rating: 5 },
    { text: "Otel personeli çok ilgiliydi. Kesinlikle tekrar geleceğiz!", name: "xxxxxx", location: "Bodrum Tatili", rating: 5 },
    { text: "Tarihi dokusuyla büyüleyici bir şehir. Harika bir deneyimdi!", name: "xxxx", location: "Mardin Tatili", rating: 5 },
    { text: "Çocuklarımız çok eğlendi. Doğa harikası bir tatildi.", name: "xxxx xxxx", location: "Trabzon Tatili", rating: 5 },
    { text: "Ege'nin en güzel kenti. Deniz, güneş, eğlence!", name: "xxxx xxx", location: "İzmir Tatili", rating: 5 }
];

const MAX_TESTIMONIALS_ON_HOME = 3;

const loadTestimonials = () => {
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    if (!testimonialsTrack) return;
  const visibleTestimonials = testimonials.slice(0, MAX_TESTIMONIALS_ON_HOME);

  testimonialsTrack.innerHTML = visibleTestimonials.map((t, i) => `
        <div class="testimonial-item">
            <div class="testimonial-card ${i === 0 ? 'active' : ''}">
                <div class="stars">${'⭐'.repeat(t.rating)}</div>
                <p>"${t.text}"</p>
                <div class="reviewer">
                    <span class="avatar">👤</span>
                    <div>
                        <strong>${t.name}</strong>
                        <p class="subtitle">${t.location}</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

const slideTestimonial = (direction) => {
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    if (!testimonialsTrack) return;
    const items = testimonialsTrack.children;
    currentTestimonial = (currentTestimonial + direction + items.length) % items.length;
    testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
};

const regions = [
  { name: 'Antalya', hotels: 172, image: 'img/antreg.jpg', link: 'city.html?city=antalya', class: 'large-left' },
  { name: 'Mardin', hotels: 106, image: 'img/marreg.jpg', link: 'city.html?city=mardin', class: 'top-right' },
  { name: 'Diyarbakır', hotels: 145, image: 'img/diyreg.jpg', link: 'city.html?city=diyarbakir', class: 'middle-left' },
  { name: 'Muğla', hotels: 238, image: 'img/mugreg.jpg', link: 'city.html?city=mugla', class: 'middle-right' },
  { name: 'Van', hotels: 221, image: 'img/vanreg.jpg', link: 'city.html?city=van', class: 'middle-left' },
  { name: 'Trabzon', hotels: 84, image: 'img/trabreg.jpg', link: 'city.html?city=trabzon', class: 'bottom-left' },
  { name: 'Bodrum', hotels: 189, image: 'img/bodreg.jpg', link: 'city.html?city=bodrum', class: 'bottom-left' },
  { name: 'Bursa', hotels: 156, image: 'img/burreg.jpg', link: 'city.html?city=bursa', class: 'bottom-right' },
  { name: 'İzmir', hotels: 267, image: 'img/izreg.jpg', link: 'city.html?city=izmir', class: 'bottom-right' }
];

const loadRegions = () => {
    const container = document.getElementById('regionsCascade');
    if (!container) return;
    
    container.innerHTML = regions.map(r => `
        <div class="region-card ${r.class}" style="background-image: url('${r.image}');">
            <div class="region-overlay"></div>
            <div class="region-content">
                <h3 class="region-name">${r.name}</h3>
                <span class="region-hotels">${r.hotels} Otel</span>
            </div>
            <a href="${r.link}" class="region-link"></a>
        </div>
    `).join('');
};

class ReservationManager {
    constructor() {
        this.storageKey = 'reservations';
    }

    getReservations = () => {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    };

    clearAll = async () => {
        const currentData = this.getReservations();
        const { length } = currentData;

        if (length === 0) {
            alert('Rezervasyonunuz zaten yok.');
            return false;
        }

        if (confirm('Tüm rezervasyonlar silinecek. Emin misiniz?')) {
            const delbtn = document.querySelector('.delbtn');
            if (delbtn) {
                const { textContent: oldText } = delbtn;
                
                delbtn.classList.add('delbtn-loading');
                delbtn.textContent = "Siliniyor...";
                delbtn.disabled = true;

                await new Promise(resolve => setTimeout(resolve, 1000));
                
                localStorage.removeItem(this.storageKey);
                loadReservations();

                delbtn.classList.remove('delbtn-loading');
                delbtn.textContent = oldText;
                delbtn.disabled = false;

                alert('Tüm rezervasyonlar temizlendi.');
            }
            return true;
        }
        return false;
    };
}

const reservationManager = new ReservationManager();

function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const content = document.getElementById('reservationsContent');
    
    if (!content) return;

    if (reservations.length === 0) {
        content.innerHTML = `
            <div class="no-reservations">
                <p>Henüz hiç rezervasyonunuz yok.</p>
                <p>Rüya tatilinizi başlatmak için hemen rezervasyon yapın!</p>
                <a href="index.html#packages" class="back-to-home">Tatillere Dönün</a>
            </div>
        `;
        return;
    }

    content.innerHTML = reservations.map((res, index) => {
        const { resortName, guestName, checkIn, checkOut, guests, roomType, totalPrice, status, guestEmail, guestPhone, specialRequests, id } = res;
        const statusText = status === 'Onaylandı' ? 'confirmed' : status === 'Beklemede' ? 'pending' : 'cancelled';
        
        return `
            <div class="booking-item">
                <div class="booking-header">
                    <div>
                        <h3>${resortName}</h3>
                        <p style="color: #999; margin-top: 0.3rem; font-size: 0.9rem;">Rezervasyon ID: ${id}</p>
                    </div>
                    <span class="status-badge status-${statusText}">${status}</span>
                </div>

                <div class="booking-details">
                    <div class="detail-item">
                        <strong>Konuk Adı</strong>
                        <span>${guestName}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Giriş Tarihi</strong>
                        <span>${new Date(checkIn).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Çıkış Tarihi</strong>
                        <span>${new Date(checkOut).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Konuk Sayısı</strong>
                        <span>${guests} Konuk</span>
                    </div>
                    <div class="detail-item">
                        <strong>Oda Tipi</strong>
                        <span>${roomType}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Toplam Fiyat</strong>
                        <span style="color: var(--secondary-color); font-weight: bold;">${totalPrice}</span>
                    </div>
                </div>

                ${guestPhone ? `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                    <p><strong>E-posta:</strong> ${guestEmail}</p>
                    <p><strong>Telefon:</strong> ${guestPhone}</p>
                </div>
                ` : ''}

                ${specialRequests ? `
                <div style="margin-top: 1rem; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
                    <strong>Özel İstekler:</strong>
                    <p style="margin-top: 0.5rem; color: #666;">${specialRequests}</p>
                </div>
                ` : ''}

                <div class="booking-actions">
                    <button class="btn-edit" onclick="editReservation(${index})">Düzenle</button>
                    <button class="btn-cancel" onclick="cancelReservation(${index})">İptal Et</button>
                </div>
            </div>
        `;
    }).join('');
}

const editReservation = (index) => {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const { resortName } = reservations[index];
    alert(`"${resortName}" için düzenleme\n\nHenüz bu özellik uygulanmadı. Lütfen iletişim sayfasından bize ulaşın.`);
};

const cancelReservation = (index) => {
    if (confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations[index].status = 'İptal Edildi';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        loadReservations();
        alert('Rezervasyon başarıyla iptal edildi.');
    }
};
const elementToggleFunc = function (elem) { 
    elem.classList.toggle("active"); 
};

const initAboutMePage = () => {
    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");

    if (sidebarBtn && sidebar) {
        sidebarBtn.addEventListener("click", function () { 
            elementToggleFunc(sidebar); 
        });
    }
    const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
    const modalContainer = document.querySelector("[data-modal-container]");
    const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
    const overlay = document.querySelector("[data-overlay]");

    const modalImg = document.querySelector("[data-modal-img]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalText = document.querySelector("[data-modal-text]");

    const testimonialsModalFunc = function () {
        if (modalContainer) modalContainer.classList.toggle("active");
        if (overlay) overlay.classList.toggle("active");
    };

    for (let i = 0; i < testimonialsItem.length; i++) {
        testimonialsItem[i].addEventListener("click", function () {
            if (modalImg) modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
            if (modalImg) modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
            if (modalTitle) modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
            if (modalText) modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

            testimonialsModalFunc();
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

    const select = document.querySelector("[data-select]");
    const selectItems = document.querySelectorAll("[data-select-item]");
    const selectValue = document.querySelector("[data-selecct-value]");
    const filterBtn = document.querySelectorAll("[data-filter-btn]");

    if (select) {
        select.addEventListener("click", function () { 
            elementToggleFunc(this); 
        });
    }

    for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {
            let selectedValue = this.innerText.toLowerCase();
            if (selectValue) selectValue.innerText = this.innerText;
            if (select) elementToggleFunc(select);
            filterFunc(selectedValue);
        });
    }

    const filterItems = document.querySelectorAll("[data-filter-item]");

    const filterFunc = function (selectedValue) {
        for (let i = 0; i < filterItems.length; i++) {
            if (selectedValue === "all") {
                filterItems[i].classList.add("active");
            } else if (selectedValue === filterItems[i].dataset.category) {
                filterItems[i].classList.add("active");
            } else {
                filterItems[i].classList.remove("active");
            }
        }
    };

    let lastClickedBtn = filterBtn[0];

    for (let i = 0; i < filterBtn.length; i++) {
        filterBtn[i].addEventListener("click", function () {
            let selectedValue = this.innerText.toLowerCase();
            if (selectValue) selectValue.innerText = this.innerText;
            filterFunc(selectedValue);

            if (lastClickedBtn) lastClickedBtn.classList.remove("active");
            this.classList.add("active");
            lastClickedBtn = this;
        });
    }
    const form = document.querySelector("[data-form]");
    const formInputs = document.querySelectorAll("[data-form-input]");
    const formBtn = document.querySelector("[data-form-btn]");

    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener("input", function () {
            if (form && form.checkValidity() && formBtn) {
                formBtn.removeAttribute("disabled");
            } else if (formBtn) {
                formBtn.setAttribute("disabled", "");
            }
        });
    }
    const navLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            const clickPage = this.getAttribute("data-nav-link");

            pages.forEach(page => {
                if (clickPage === page.dataset.page) {
                    page.classList.add("active");
                    this.classList.add("active");
                    window.scrollTo(0, 0);
                } else {
                    page.classList.remove("active");
                }
            });

            navLinks.forEach(l => {
                if (l !== this) l.classList.remove("active");
            });
        });
    });
};

let currentHotels = [];

const FILTER_STATE = {
  minPrice: 0,
  maxPrice: 3000,
  minRating: 0,
  concept: "",
  theme: "",
  amenities: [],
  sortBy: "recommended"
};

function normalizeText(text) {
  return (text || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

const CITY_DATA = (typeof window !== "undefined" && window.CITIES) ? window.CITIES : {};
const CITY_TITLES = (typeof window !== "undefined" && window.CITY_TITLES) ? window.CITY_TITLES : {};

function resolveCitySlug(input) {
  const normalizedInput = normalizeText(input || "").trim();
  if (!normalizedInput) return "";

  const cityEntries = Object.entries(CITY_DATA);
  for (const [slug, city] of cityEntries) {
    const aliases = Array.isArray(city.aliases) ? city.aliases : [];
    const candidates = [slug, city.name, ...aliases].map(normalizeText);
    if (candidates.some(candidate => candidate === normalizedInput || normalizedInput.includes(candidate))) {
      return slug;
    }
  }

  return "";
}

function getCityFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return resolveCitySlug(params.get("city"));
}

function renderCityPage() {
  const cityNameEl = document.getElementById("cityName");
  if (!cityNameEl) return;

  const slug = getCityFromQuery();
  const city = slug ? CITY_DATA[slug] : null;
  const titleData = slug ? CITY_TITLES[slug] : null;

  const pageTitleEl = document.getElementById("cityPageTitle");
  const cityDescriptionEl = document.getElementById("cityDescription");
  const cityImageEl = document.getElementById("cityImage");
  const cityHeroEl = document.getElementById("cityHero");
  const cityHotelsTitleEl = document.getElementById("cityHotelsTitle");
  const hotelsGridEl = document.getElementById("hotelsGrid");

  if (!city) {
    cityNameEl.textContent = "Sehir bulunamadi";
    if (cityDescriptionEl) cityDescriptionEl.textContent = "Gecerli bir sehir secerek tekrar deneyin.";
    if (cityHotelsTitleEl) cityHotelsTitleEl.textContent = "Sonuc yok";
    if (hotelsGridEl) {
      hotelsGridEl.innerHTML = "<div class='hotel-card'><div class='hotel-info'><h3 class='hotel-name'>Gecersiz sehir</h3><p>Index sayfasindan bir sehir secip tekrar deneyin.</p><a class='btn-book' href='index.html'>Anasayfaya Don</a></div></div>";
    }
    return;
  }

  const resolvedPageTitle = titleData?.pageTitle || (city.name + " Otelleri - TatilRez");
  const resolvedHeroTitle = titleData?.heroTitle || city.name;
  const resolvedHeroDescription = titleData?.heroDescription || city.description;
  const resolvedHotelsTitle = titleData?.hotelsSectionTitle || (city.name + "'da Populer Oteller");

  document.title = resolvedPageTitle;
  if (pageTitleEl) pageTitleEl.textContent = resolvedPageTitle;

  cityNameEl.textContent = resolvedHeroTitle;
  if (cityDescriptionEl) cityDescriptionEl.textContent = resolvedHeroDescription;
  if (cityHotelsTitleEl) cityHotelsTitleEl.textContent = resolvedHotelsTitle;

  if (cityImageEl) {
    cityImageEl.src = city.image;
    cityImageEl.alt = city.name;
  }

  if (cityHeroEl && city.heroBackground) {
    cityHeroEl.style.background = city.heroBackground;
  }

  document.body.className = document.body.className
    .split(" ")
    .filter(cls => cls && !cls.startsWith("page-"))
    .concat(["page-" + slug])
    .join(" ");
}

function inferMeta(hotel, index) {
  const featureText = normalizeText((hotel.features || []).join(" "));
  const nameText = normalizeText(hotel.name || "");

  const amenities = [];
  if (featureText.includes("spa")) amenities.push("Spa");
  if (featureText.includes("havuz") || featureText.includes("pool")) amenities.push("Havuz");
  if (featureText.includes("sahil") || featureText.includes("beach") || featureText.includes("deniz")) amenities.push("Denize Sifir");
  if (featureText.includes("otopark") || featureText.includes("parking")) amenities.push("Otopark");
  if (featureText.includes("evcil") || featureText.includes("pet")) amenities.push("Evcil Hayvan");

  const concept = featureText.includes("all-inclusive") ? "Her Sey Dahil"
                : (featureText.includes("kahvalti") || featureText.includes("breakfast")) ? "Oda Kahvalti"
                : "Yarim Pansiyon";

  const theme = (featureText.includes("aile") || featureText.includes("kids")) ? "Cocuk Dostu"
              : (featureText.includes("water park") || featureText.includes("aquapark")) ? "Aquapark"
              : (nameText.includes("boutique") || nameText.includes("luxury") || featureText.includes("romantik")) ? "Balayi"
              : "Yetiskin";

  const distanceKm = (index % 8) + 1;

  return { amenities, concept, theme, distanceKm };
}

function getHotelsByPage() {
  const cityFromQuery = getCityFromQuery();
  if (cityFromQuery && HOTEL_DATA[cityFromQuery]) return HOTEL_DATA[cityFromQuery];

  const page = window.location.pathname;
  if (page.includes("antalya")) return HOTEL_DATA.antalya || [];
  if (page.includes("bodrum")) return HOTEL_DATA.bodrum || [];
  if (page.includes("bursa")) return HOTEL_DATA.bursa || [];
  if (page.includes("diyarbakir")) return HOTEL_DATA.diyarbakir || [];
  if (page.includes("izmir")) return HOTEL_DATA.izmir || [];
  if (page.includes("mardin")) return HOTEL_DATA.mardin || [];
  if (page.includes("mugla")) return HOTEL_DATA.mugla || [];
  if (page.includes("trabzon")) return HOTEL_DATA.trabzon || [];
  if (page.includes("van")) return HOTEL_DATA.van || [];
  return [];
}

function renderHotels(list) {
  const grid = document.getElementById("hotelsGrid");
  const listEl = document.getElementById("hotelsList");
  const target = grid || listEl;
  if (!target) return;

  target.innerHTML = list.map(hotel => {
    const meta = hotel.meta || {};
    const badge = [
      meta.concept ? "<span>" + meta.concept + "</span>" : "",
      meta.theme ? "<span>" + meta.theme + "</span>" : "",
      typeof meta.distanceKm === "number" ? "<span>" + meta.distanceKm + " km</span>" : ""
    ].join(" ");

    return ""
      + "<div class='hotel-card'>"
      + "  <img src='" + hotel.image + "' alt='" + hotel.name + "' onerror=\"this.src='img/logo.png'\">"
      + "  <div class='hotel-info'>"
      + "    <h3 class='hotel-name'>" + hotel.name + "</h3>"
      + "    <div class='hotel-rating'>" + "⭐".repeat(Math.floor(hotel.rating)) + " " + hotel.rating + "</div>"
      + "    <div class='hotel-price'>₺" + hotel.price + "/gece</div>"
      + "    <div style='display:flex; gap:6px; flex-wrap:wrap; margin:6px 0; font-size:12px; color:#555;'>" + badge + "</div>"
      + "    <ul class='hotel-features'>" + (hotel.features || []).map(f => "<li>" + f + "</li>").join("") + "</ul>"
      + "    <button class='btn-book' onclick=\"openBooking('" + hotel.name.replace(/'/g, "\\'") + "', " + hotel.price + ")\">Rezervasyon Yap</button>"
      + "  </div>"
      + "</div>";
  }).join("");
}

function applyFiltersAndSort() {
  let data = [...currentHotels];

  data = data.filter(h => h.price >= FILTER_STATE.minPrice && h.price <= FILTER_STATE.maxPrice);
  data = data.filter(h => h.rating >= FILTER_STATE.minRating);

  if (FILTER_STATE.concept) data = data.filter(h => h.meta.concept === FILTER_STATE.concept);
  if (FILTER_STATE.theme) data = data.filter(h => h.meta.theme === FILTER_STATE.theme);

  if (FILTER_STATE.amenities.length > 0) {
    data = data.filter(h => FILTER_STATE.amenities.every(a => h.meta.amenities.includes(a)));
  }

  if (FILTER_STATE.sortBy === "priceAsc") data.sort((a, b) => a.price - b.price);
  if (FILTER_STATE.sortBy === "priceDesc") data.sort((a, b) => b.price - a.price);
  if (FILTER_STATE.sortBy === "ratingDesc") data.sort((a, b) => b.rating - a.rating);
  if (FILTER_STATE.sortBy === "distanceAsc") data.sort((a, b) => a.meta.distanceKm - b.meta.distanceKm);

  if (FILTER_STATE.sortBy === "recommended") {
    data.sort((a, b) => {
      const scoreA = (a.rating * 2) - (a.price / 1000);
      const scoreB = (b.rating * 2) - (b.price / 1000);
      return scoreB - scoreA;
    });
  }

  renderHotels(data);
}

function loadHotels() {
  const raw = getHotelsByPage();
  currentHotels = raw.map((hotel, idx) => {
    const meta = inferMeta(hotel, idx);
    return { ...hotel, meta };
  });
  applyFiltersAndSort();
}
function initAdvancedFilters() {
  const minEl = document.getElementById("minPriceInput") || document.getElementById("minPriceRange");
  const maxEl = document.getElementById("maxPriceInput") || document.getElementById("maxPriceRange");
  const minText = document.getElementById("minPriceText");
  const maxText = document.getElementById("maxPriceText");
  const ratingEl = document.getElementById("ratingFilter");
  const conceptEl = document.getElementById("conceptFilter");
  const themeEl = document.getElementById("themeFilter");
  const sortEl = document.getElementById("sortBy");
  const clearBtn = document.getElementById("clearFiltersBtn");

  if (!minEl || !maxEl) return;

  const parsePrice = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const syncPriceText = () => {
    FILTER_STATE.minPrice = parsePrice(minEl.value, 0);
    FILTER_STATE.maxPrice = parsePrice(maxEl.value, 3000);

    if (FILTER_STATE.minPrice < 0) FILTER_STATE.minPrice = 0;
    if (FILTER_STATE.maxPrice < 0) FILTER_STATE.maxPrice = 0;

    if (FILTER_STATE.minPrice > FILTER_STATE.maxPrice) {
      const temp = FILTER_STATE.minPrice;
      FILTER_STATE.minPrice = FILTER_STATE.maxPrice;
      FILTER_STATE.maxPrice = temp;
      minEl.value = String(FILTER_STATE.minPrice);
      maxEl.value = String(FILTER_STATE.maxPrice);
    }
    if (minText) minText.textContent = "₺" + FILTER_STATE.minPrice;
    if (maxText) maxText.textContent = "₺" + FILTER_STATE.maxPrice;
  };

  minEl.addEventListener("input", () => {
    syncPriceText();
    applyFiltersAndSort();
  });

  maxEl.addEventListener("input", () => {
    syncPriceText();
    applyFiltersAndSort();
  });

  if (ratingEl) ratingEl.addEventListener("change", () => {
    FILTER_STATE.minRating = Number(ratingEl.value || 0);
    applyFiltersAndSort();
  });

  if (conceptEl) conceptEl.addEventListener("change", () => {
    FILTER_STATE.concept = conceptEl.value || "";
    applyFiltersAndSort();
  });

  if (themeEl) themeEl.addEventListener("change", () => {
    FILTER_STATE.theme = themeEl.value || "";
    applyFiltersAndSort();
  });

  const amenityChecks = document.querySelectorAll(".amenityCheck");
  amenityChecks.forEach(ch => {
    ch.addEventListener("change", () => {
      FILTER_STATE.amenities = Array.from(document.querySelectorAll(".amenityCheck:checked")).map(x => x.value);
      applyFiltersAndSort();
    });
  });

  if (sortEl) sortEl.addEventListener("change", () => {
    FILTER_STATE.sortBy = sortEl.value || "recommended";
    applyFiltersAndSort();
  });

  if (clearBtn) clearBtn.addEventListener("click", () => {
    minEl.value = "0";
    maxEl.value = "3000";
    if (ratingEl) ratingEl.value = "0";
    if (conceptEl) conceptEl.value = "";
    if (themeEl) themeEl.value = "";
    if (sortEl) sortEl.value = "recommended";
    document.querySelectorAll(".amenityCheck").forEach(x => x.checked = false);

    FILTER_STATE.minPrice = 0;
    FILTER_STATE.maxPrice = 3000;
    FILTER_STATE.minRating = 0;
    FILTER_STATE.concept = "";
    FILTER_STATE.theme = "";
    FILTER_STATE.amenities = [];
    FILTER_STATE.sortBy = "recommended";

    syncPriceText();
    applyFiltersAndSort();
  });

  syncPriceText();
}
const POPULAR_SEARCHES = [
  "Antalya",
  "Bodrum",
  "Muğla",
  "İzmir",
  "Mardin"
];

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(value) {
  const v = (value || "").trim();
  if (!v) return;
  const old = getRecentSearches().filter(x => normalizeText(x) !== normalizeText(v));
  const next = [v, ...old].slice(0, 6);
  localStorage.setItem("recentSearches", JSON.stringify(next));
}

function getSuggestionPool() {
  const regions = ["Antalya", "Bodrum", "Bursa", "Diyarbakır", "İzmir", "Mardin", "Muğla", "Trabzon", "Van"];
  const hotels = Object.values(HOTEL_DATA)
    .flatMap(list => Array.isArray(list) ? list : [])
    .map(h => h.name);

  return Array.from(new Set([...regions, ...hotels]));
}

function renderChipList(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = items.map(item => {
    return "<button type='button' class='chip-btn' data-chip='" + item.replace(/"/g, "&quot;") + "'>" + item + "</button>";
  }).join("");

  el.querySelectorAll(".chip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const destinationEl = document.getElementById("destination");
      if (!destinationEl) return;
      destinationEl.value = btn.getAttribute("data-chip") || "";
      hideSuggestions();
    });
  });
}

function hideSuggestions() {
  const dd = document.getElementById("suggestionsDropdown");
  if (!dd) return;
  dd.classList.remove("show");
  dd.innerHTML = "";
}

function showSuggestions(query) {
  const dd = document.getElementById("suggestionsDropdown");
  if (!dd) return;

  const q = normalizeText(query);
  if (!q || q.length < 2) {
    hideSuggestions();
    return;
  }

  const pool = getSuggestionPool();
  const starts = pool.filter(x => normalizeText(x).startsWith(q));
  const contains = pool.filter(x => !normalizeText(x).startsWith(q) && normalizeText(x).includes(q));
  const results = [...starts, ...contains].slice(0, 8);

  if (results.length === 0) {
    hideSuggestions();
    return;
  }

  dd.innerHTML = results.map(item => "<div class='suggestion-item' data-s='" + item.replace(/"/g, "&quot;") + "'>" + item + "</div>").join("");
  dd.classList.add("show");

  dd.querySelectorAll(".suggestion-item").forEach(row => {
    row.addEventListener("click", () => {
      const val = row.getAttribute("data-s") || "";
      const destinationEl = document.getElementById("destination");
      if (destinationEl) destinationEl.value = val;
      hideSuggestions();
    });
  });
}

function initSmartSearch() {
  const destinationEl = document.getElementById("destination");
  if (!destinationEl) return;

  renderChipList("popularSearches", POPULAR_SEARCHES);
  renderChipList("recentSearches", getRecentSearches());

  destinationEl.addEventListener("input", () => {
    showSuggestions(destinationEl.value);
  });

  destinationEl.addEventListener("focus", () => {
    if (destinationEl.value.trim().length >= 2) showSuggestions(destinationEl.value);
  });

  document.addEventListener("click", (e) => {
    const box = document.getElementById("suggestionsDropdown");
    if (!box || !destinationEl) return;
    if (!box.contains(e.target) && e.target !== destinationEl) hideSuggestions();
  });
}
function searchResorts() {
  const destination = (document.getElementById("destination")?.value || "").trim();
  const checkIn = document.getElementById("checkIn")?.value || "";
  const checkOut = document.getElementById("checkOut")?.value || "";
  const guests = document.getElementById("guests")?.value || "1";

  if (!destination) {
    alert("Lütfen bir destinasyon seçin.");
    return;
  }

  saveRecentSearch(destination);
  renderChipList("recentSearches", getRecentSearches());

  const matchedCity = resolveCitySlug(destination);

  if (!matchedCity) {
    alert("\"" + destination + "\" için sayfa bulunamadı.");
    return;
  }

  const params = new URLSearchParams({
    city: matchedCity,
    q: destination,
    checkIn,
    checkOut,
    guests
  });

  window.location.href = "city.html?" + params.toString();
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  renderCityPage();

  loadTestimonials();
  loadRegions();
  setInterval(() => slideHero(1), 5000);

  initSmartSearch();
  loadHotels();
  initAdvancedFilters();

  const inputs = ["bookingCheckIn", "bookingCheckOut", "roomType"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", updateTotalPrice);
  });

  loadReservations();
  const clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => reservationManager.clearAll());
  }

  initAboutMePage();
});
