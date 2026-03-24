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

const antalya_hotels = [
    { name: 'Rixos Downtown Antalyas', image: 'img/antot1.jpg', rating: 4.8, price: 1850, features: ['Sahil Kenarı', '5 Restoran', 'Spa', 'Kapalı Havuz'] },
    { name: 'Titanic Deluxe Beach', image: 'img/antot2.jpg', rating: 4.7, price: 1650, features: ['All-Inclusive', 'Animasyon', 'Su Parkı', 'Konsiyerj'] },
    { name: 'Kémer Luxury Hotels', image: 'img/antot3.jpg', rating: 4.6, price: 1450, features: ['Dağ Manzarası', 'Private Plaj', 'Yoga', 'Kütüphane'] },
    { name: 'Side Sun Garden', image: 'img/antot4.jpg', rating: 4.5, price: 1200, features: ['Antik Şehir Yakın', 'Balık Restoranı', 'Masaj', 'Kino'] },
    { name: 'Lara Family Resort', image: 'img/antot5.jpg', rating: 4.4, price: 980, features: ['Ailelere Uygun', 'Çocuk Kulübü', 'Oyun Parkı', 'Beslenme'] },
    { name: 'Marina Resort Antalya', image: 'img/antot6.jpg', rating: 4.3, price: 1100, features: ['Modern Mimari', 'Teknoloji', 'Business Merkezi', 'Uydu TV'] },
    { name: 'Alp Pasa Boutique Hotel', image: 'img/antot7.jpg', rating: 4.6, price: 750, features: ['Tarih Başıboş', 'Eski Şehir', 'Çay Saati', 'Rehber'] },
    { name: 'Beachfront Paradise', image: 'img/antot8.jpg', rating: 4.9, price: 2200, features: ['Kasırgalar Sahili', 'Sunset Bar', 'Gourmet', 'Helikopter'] }
];

const bodrum_hotels = [
    { name: 'Duja Bodrum', image: 'img/bodot1.jpg', rating: 4.8, price: 1200, features: ['WiFi', 'Pool', 'Restaurant', 'Beach Access'] },
    { name: 'Viking Infinity Resort', image: 'img/bodot2.jpg', rating: 4.9, price: 1500, features: ['All-Inclusive', 'Gym', 'Water Sports', 'Kids Club'] },
    { name: 'Club Med Bodrum', image: 'img/bodot3.jpg', rating: 4.7, price: 1350, features: ['Animation', 'Gym', 'Spa', 'Nightclub'] },
    { name: 'Rixos Bodrum', image: 'img/bodot4.jpg', rating: 5.0, price: 1800, features: ['Luxury', 'Private Beach', 'Spa'] },
    { name: 'Bougainville Otel', image: 'img/bodot5.jpg', rating: 4.6, price: 950, features: ['Budget Friendly', 'Central Location', 'Breakfast'] },
    { name: 'Lagoon Resort', image: 'img/bodot6.jpg', rating: 4.8, price: 1400, features: ['Lagoon View', 'Water Park', 'Kids Pool'] },
    { name: 'Marina Turizm Oteli', image: 'img/bodot7.jpg', rating: 4.5, price: 1100, features: ['Marina View', 'Restaurant', 'Bar'] },
    { name: 'Bodrum Sapphire', image: 'img/bodot8.jpg', rating: 4.9, price: 1600, features: ['Luxury Rooms', 'Spa', 'Beach Club'] }
];

const bursa_hotels = [
    { name: 'Kaya Uludağ Resorts', image: 'img/burot1.webp', rating: 4.9, price: 1850, features: ['Dağ', 'Thermal', 'Spa', 'Harita'] },
    { name: 'Thermal Springs Luxury', image: 'img/burot2.webp', rating: 4.8, price: 1750, features: ['Kaplıca', 'Sıcak', 'Termal', 'Sauna'] },
    { name: 'Trendlife Hotel', image: 'img/burot3.jpg', rating: 4.7, price: 1550, features: ['Kayak', 'Kış', 'Kar', 'Spor'] },
    { name: 'Karinna Forest Mansion', image: 'img/burot4.webp', rating: 4.6, price: 1300, features: ['Orman', 'Vadi', 'Doğa', 'Sakin'] },
    { name: 'Kadı Konağı', image: 'img/burot5.jpg', rating: 4.8, price: 1650, features: ['Tarih', 'Mimari', 'Köklü', 'Şık'] },
    { name: 'Dağönü Bungalov', image: 'img/burot6.jpg', rating: 4.5, price: 1200, features: ['Macera', 'Trekking', 'Rota', 'Rehber'] },
    { name: 'Mövenpick Bursa', image: 'img/burot7.jpg', rating: 4.9, price: 2000, features: ['Suite', 'Termal', 'Private', 'Lüks'] },
    { name: 'Avdan Dağ Evi', image: 'img/burot8.jpg', rating: 4.2, price: 850, features: ['Ekonomik', 'Temel', 'Isıtma', 'Fan'] }
];

const diyarbakir_hotels = [
    { name: "Anemon Otel", image: "img/diyot1.jpg", rating: 4.7, price: 1100, features: ["Kale", "Manzara", "Balkon", "Tarihi"] },
    { name: "Wyndham Garden Diyarbakır", image: "img/diyot2.jpg", rating: 4.6, price: 1000, features: ["Kaliteli", "Restaurant", "Bahçe", "Konfor"] },
    { name: "Amida Boutique", image: "img/diyot3.jpg", rating: 4.5, price: 950, features: ["Lüks", "Modern", "Tasarım", "Safe"] },
    { name: "Liv Suite", image: "img/diyot4.avif", rating: 4.4, price: 850, features: ["Nəhr", "Terasa", "Sakin", "Güzel"] },
    { name: "Antik Diyarbakır Konak", image: "img/diyot5.webp", rating: 4.8, price: 1250, features: ["Restorasyon", "Geleneksel", "Özgün", "Romantik"] },
    { name: "Tur Merkezi Hotel", image: "img/diyot6.webp", rating: 4.3, price: 900, features: ["Turizm", "Bilgi", "Rehber", "Tur"] },
    { name: "Sur Royals Otel", image: "img/diyot7.avif", rating: 4.6, price: 1150, features: ["Surlar", "Gözlem", "Fotoğraf", "İkonodik"] },
    { name: "Beyoğlu Palace Hotel", image: "img/diyot8.jpg", rating: 4.5, price: 1050, features: ["Resort", "Havuz", "SPA", "Aktivite"] }
];

const izmir_hotels = [
    { name: 'Swissôtel Büyük Efes', image: 'img/izot1.jpg', rating: 4.8, price: 1650, features: ['5 Yıldız', 'Kordon', 'Business', 'Spa'] },
    { name: 'Boheme Beach Resort', image: 'img/izot2.jpg', rating: 4.7, price: 1450, features: ['Sahil', 'Windsurf', 'Beach Club', 'Nightlife'] },
    { name: 'D"Mira Alaçatı', image: 'img/izot3.jpg', rating: 4.9, price: 1850, features: ['Butik', 'Taş Evler', 'Rüzgar Sörfü', 'Şarap'] },
    { name: 'İzmir Marina Hotel', image: 'img/izot4.jpg', rating: 4.6, price: 1200, features: ['Yat Limanı', 'Deniz Manzarası', 'Restaurant', 'Bar'] },
    { name: 'Bergama Aristonicus Hotel', image: 'img/izot5.webp', rating: 4.4, price: 780, features: ['Antik Kent', 'Arkeoloji', 'Müze', 'Kültür Turu'] },
    { name: 'Leon Otel Foça', image: 'img/izot6.avif', rating: 4.5, price: 950, features: ['Sahil Kasabası', 'Balık', 'Dalış', 'Tekne Turu'] },
    { name: 'Urla Bağ Evi', image: 'img/izot7.webp', rating: 4.8, price: 1550, features: ['Bağlar', 'Şarap Tadımı', 'Organik Yemek', 'Sanat'] },
    { name: 'Kordon Çankaya Hotel', image: 'img/izot8.jpg', rating: 4.9, price: 2100, features: ['Lüks', 'Deniz Manzarası', 'Penthouse', 'Concierge'] }
];

const mardin_hotels = [
    { name: 'Mardin Konukevi', image: 'img/madot1.jpg', rating: 4.7, price: 1200, features: ['Taş', 'Geleneksel', 'Balkon', 'Manzara'] },
    { name: 'Mesopotamia Hotel', image: 'img/madot2.jpg', rating: 4.6, price: 1100, features: ['Lüks', 'Misafir', 'Restaurant', 'Terasa'] },
    { name: 'Başak Hotel', image: 'img/madot3.jpg', rating: 4.5, price: 950, features: ['Konfor', 'Klima', 'Modern', 'Safe'] },
    { name: 'Mardius Hotel', image: 'img/madot4.webp', rating: 4.4, price: 850, features: ['İlçe', 'Tarih', 'Tasarım', 'Sakin'] },
    { name: 'Selçuklu Konağı', image: 'img/madot5.webp', rating: 4.8, price: 1350, features: ['Restorasyon', 'Antik', 'Özel', 'Şarmlı'] },
    { name: 'Antik Han Hotel', image: 'img/madot6.jpg', rating: 4.3, price: 900, features: ['Gozlem', 'Balkon', 'Kahvaltı', 'Sessiz'] },
    { name: 'Darius Stone House', image: 'img/madot7.jpg', rating: 4.6, price: 1250, features: ['Romantik', 'Spa', 'Hamam', 'Lüks'] },
    { name: 'Maridin Hotel', image: 'img/madot8.webp', rating: 4.5, price: 1050, features: ['Konaklama', 'Aktivite', 'Tur', 'Rehber'] }
];

const mugla_hotels = [
    { name: 'Marmaris Grand Resort', image: 'img/mugot1.jpg', rating: 4.7, price: 1350, features: ['All-Inclusive', 'Aquapark', 'Beach', 'Animation'] },
    { name: 'Bodrum Bay Resort', image: 'img/mugot2.jpg', rating: 4.8, price: 1650, features: ['Sahil', 'Yat Turu', 'Gece Hayatı', 'Spa'] },
    { name: 'Datça Cape Krio', image: 'img/mugot3.jpg', rating: 4.6, price: 980, features: ['Sakin', 'Doğa', 'Badem Ağaçları', 'Yoga'] },
    { name: 'Fethiye Butterfly Valley', image: 'img/mugot4.jpg', rating: 4.9, price: 850, features: ['Kamp', 'Trekking', 'Şelale', 'Doğa'] },
    { name: 'Ölüdeniz Beach Hotel', image: 'img/mugot5.jpg', rating: 4.8, price: 1450, features: ['Lagün', 'Yamaç Paraşütü', 'Beach', 'Water Sports'] },
    { name: 'Köyceğiz Kaunos Hotel', image: 'img/mugot6.jpg', rating: 4.5, price: 750, features: ['Göl', 'Tekne Turu', 'Termal', 'Kaplıca'] },
    { name: 'Dalyan River Resort', image: 'img/mugot7.jpg', rating: 4.7, price: 1100, features: ['Nehir', 'Caretta Plajı', 'Kaya Mezarları', 'Tekne'] },
    { name: 'Gulet Otel', image: 'img/mugot8.jpg', rating: 4.4, price: 650, features: ['Tarihi', 'Şehir Merkezi', 'Otopark', 'Restaurant'] }
];

const trabzon_hotels = [
    { name: 'Park Dedeman', image: 'img/trabot1.jpg', rating: 4.7, price: 850, features: ['Dağ Manzarası', 'Yayla Turu', 'Kahvaltı', 'Kültür'] },
    { name: 'Uzungöl Nature Resort', image: 'img/trabot2.jpg', rating: 4.8, price: 950, features: ['Göl Kenarı', 'Doğa Yürüyüşü', 'Balık Tutma', 'Fotoğrafçılık'] },
    { name: 'İnanlar City Hotel', image: 'img/trabot3.jpg', rating: 4.5, price: 650, features: ['Şehir Merkezi', 'Restoran', 'Otopark', 'Wi-Fi'] },
    { name: 'Ayder Plateau Gelgor Hotel', image: 'img/trabot4.jpg', rating: 4.6, price: 780, features: ['Yayla Bungalov', 'Termal', 'Kaplıca', 'Mangal'] },
    { name: 'Karadeniz Sun Pearl Resort', image: 'img/trabot5.webp', rating: 4.4, price: 720, features: ['Sahil', 'Balık Restoranı', 'Hamsi', 'Müzik'] },
    { name: 'Historical Sümela Hotel', image: 'img/trabot6.jpg', rating: 4.3, price: 550, features: ['Tarihi Konak', 'Çay Bahçesi', 'Antika', 'Kütüphane'] },
    { name: 'Zigana Bungalov Hotel', image: 'img/trabot7.jpg', rating: 4.7, price: 880, features: ['Kayak', 'Kış Sporları', 'Dağcılık', 'Sauna'] },
    { name: 'Green Palace Suite', image: 'img/trabot8.jpg', rating: 4.8, price: 1100, features: ['Çay Bahçeleri', 'Organik Yemek', 'Spa', 'Yoga'] }
];

const van_hotels = [
    { name: 'Şahmaran Resort Otel', image: 'img/vanot1.jpg', rating: 4.6, price: 780, features: ['Göl Manzarası', 'Balıkçılık', 'Tekne Turu', 'Kahvaltı'] },
    { name: 'Double Tree Hotel', image: 'img/vanot2.webp', rating: 4.7, price: 850, features: ['Ada Yakını', 'Tarihi Kilise', 'Fotoğraf', 'Restaurant'] },
    { name: 'Miro Mara Boutique Hotel', image: 'img/vanot3.jpg', rating: 4.4, price: 650, features: ['Şehir Merkezi', 'Kalede Yakın', 'Otantik', 'Kafe'] },
    { name: 'Suites Hotel', image: 'img/vanot4.jpg', rating: 4.5, price: 720, features: ['Dağ Evi', 'Kayak', 'Trekking', 'Mangal'] },
    { name: 'Van Cat House', image: 'img/vanot5.jpg', rating: 4.8, price: 980, features: ['Lüks', 'Van Kedisi Bahçesi', 'SPA', 'Havuz'] },
    { name: 'Historical Caravanserai Hotel', image: 'img/vanot6.jpg', rating: 4.3, price: 580, features: ['Tarihi Bina', 'Müze Yakını', 'Çay Evi', 'Antika'] },
    { name: 'Hotel Dosco', image: 'img/vanot7.jpg', rating: 4.5, price: 750, features: ['Urartu Kalıntıları', 'Arkeoloji Turu', 'Rehber', 'Kültür'] },
    { name: 'Royale Palace Resort', image: 'img/vanot8.webp', rating: 4.9, price: 1200, features: ['5 Yıldız', 'Gourmet', 'Konferans', 'Business'] }
];
function loadHotels() {
    const grid = document.getElementById('hotelsGrid');
    const list = document.getElementById('hotelsList');
    const target = grid || list;
    
    if (!target) return;
    
    let hotels = [];
    const page = window.location.pathname;
    
    if (page.includes('antalya')) hotels = antalya_hotels;
    else if (page.includes('bodrum')) hotels = bodrum_hotels;
    else if (page.includes('bursa')) hotels = bursa_hotels;
    else if (page.includes('diyarbakir')) hotels = diyarbakir_hotels;
    else if (page.includes('izmir')) hotels = izmir_hotels;
    else if (page.includes('mardin')) hotels = mardin_hotels;
    else if (page.includes('mugla')) hotels = mugla_hotels;
    else if (page.includes('trabzon')) hotels = trabzon_hotels;
    else if (page.includes('van')) hotels = van_hotels;
    
    target.innerHTML = hotels.map(hotel => `
        <div class="hotel-card">
            <img src="${hotel.image}" alt="${hotel.name}" onerror="this.src='img/logo.png'">
            <div class="hotel-info">
                <h3 class="hotel-name">${hotel.name}</h3>
                <div class="hotel-rating">${'⭐'.repeat(Math.floor(hotel.rating))} ${hotel.rating}</div>
                <div class="hotel-price">₺${hotel.price}/gece</div>
                <ul class="hotel-features">
                    ${hotel.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <button class="btn-book" onclick="openBooking('${hotel.name}', ${hotel.price})">Rezervasyon Yap</button>
            </div>
        </div>
    `).join('');
}
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

const loadTestimonials = () => {
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    if (!testimonialsTrack) return;
    testimonialsTrack.innerHTML = testimonials.map((t, i) => `
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
    { name: 'Antalya', hotels: 172, image: 'img/antreg.jpg', link: 'antalya.html', class: 'large-left' },
    { name: 'Mardin', hotels: 106, image: 'img/marreg.jpg', link: 'mardin.html', class: 'top-right' },
    { name: 'Diyarbakır', hotels: 145, image: 'img/diyreg.jpg', link: 'diyarbakir.html', class: 'middle-left' },
    { name: 'Muğla', hotels: 238, image: 'img/mugreg.jpg', link: 'mugla.html', class: 'middle-right' },
    { name: 'Van', hotels: 221, image: 'img/vanreg.jpg', link: 'van.html', class: 'middle-left' },
    { name: 'Trabzon', hotels: 84, image: 'img/trabreg.jpg', link: 'trabzon.html', class: 'bottom-left' },
    { name: 'Bodrum', hotels: 189, image: 'img/bodreg.jpg', link: 'bodrum.html', class: 'bottom-left' },
    { name: 'Bursa', hotels: 156, image: 'img/burreg.jpg', link: 'bursa.html', class: 'bottom-right' },
    { name: 'İzmir', hotels: 267, image: 'img/izreg.jpg', link: 'izmir.html', class: 'bottom-right' }
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

const searchResorts = () => {
    const destination = document.getElementById('destination')?.value || '';
    const checkIn = document.getElementById('checkIn')?.value || '';
    const checkOut = document.getElementById('checkOut')?.value || '';
    const guests = document.getElementById('guests')?.value || '1';
    
    if (!destination) {
        alert('Lütfen bir destinasyon seçin!');
        return;
    }
    
    const destinationLower = destination.toLowerCase();
    const pages = {
        'antalya': 'antalya.html',
        'bodrum': 'bodrum.html',
        'mardin': 'mardin.html',
        'diyarbakır': 'diyarbakir.html',
        'diyarbakir': 'diyarbakir.html',
        'bursa': 'bursa.html',
        'trabzon': 'trabzon.html',
        'van': 'van.html',
        'izmir': 'izmir.html',
        'i̇zmir': 'izmir.html',
        'muğla': 'mugla.html',
        'mugla': 'mugla.html'
    };
    
    const page = pages[destinationLower];
    if (page) {
        window.location.href = page;
    } else {
        alert(`"${destination}" için sayfa bulunamadı.`);
    }
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

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    
    loadTestimonials();
    loadRegions();
    setInterval(() => slideHero(1), 5000);
    
    loadHotels();
    const inputs = ['bookingCheckIn', 'bookingCheckOut', 'roomType'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateTotalPrice);
    });
    
    loadReservations();
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => reservationManager.clearAll());
    }
    
    initAboutMePage();
});
