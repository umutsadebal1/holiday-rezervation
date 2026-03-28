// Tema (Açık/Karanlık Mod) Seçicisini Başlat
const initThemeToggle = () => {
    // Tema butonunu ve localStorage'dan kaydedilen temayı al
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light'; // Varsayılan: açık mod
    
    // Eğer önceden karanlık mod seçilmişse, onu uygula
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode'); // Body'ye dark-mode sınıfı ekle
        if (themeToggle) themeToggle.textContent = '☀️'; // Buton ikonunu güneş yap
    }
    
    // Tema butonu tıklanırsa tema değiştir
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode'); // Tema sınıfını aç/kapat
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); // Temayı localStorage'a kaydet
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙'; // İkonu güncelle
        });
    }
};

  // Otel verilerini window.HOTELS_BY_CITY'den al (hotels.js'den geliyor)
  const HOTEL_DATA = (typeof window !== "undefined" && window.HOTELS_BY_CITY)
    ? window.HOTELS_BY_CITY
    : {};

// Seçilen paketin fiyatını saklamak için global değişken
let selectedPackagePrice = 0;

// Rezervasyon modalını aç ve form alanlarını temizle
function openBooking(hotelName, price) {
    // Seçilen paket fiyatını kaydet
    selectedPackagePrice = price;
    const resortNameField = document.getElementById('resortName');
    
    if (resortNameField) {
        // Form alanlarını doldur/temizle
        resortNameField.value = hotelName; // Otel adını yazı alanına koy
        document.getElementById('bookingCheckIn').value = ''; // Giriş tarihi temizle
        document.getElementById('bookingCheckOut').value = ''; // Çıkış tarihi temizle
        document.getElementById('bookingGuests').value = '1'; // Varsayılan konuk sayısı
        document.getElementById('roomType').value = ''; // Oda türü temizle
        document.getElementById('guestName').value = ''; // Konuk adı temizle
        document.getElementById('guestEmail').value = ''; // E-posta temizle
        document.getElementById('guestPhone').value = ''; // Telefon temizle
        document.getElementById('specialRequests').value = ''; // Özel istekler temizle
        updateTotalPrice(); // Toplam fiyatı güncelle
        
        // Rezervasyon modalını göster
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) bookingModal.style.display = 'block';
    }
}

// Rezervasyon modalını kapat
function closeModal() {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) bookingModal.style.display = 'none'; // Modal'ı gizle
}

// Modalın dışına tıklanırsa modalı kapat
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    // Eğer tıkla do modal'ın kendisiyse kapat
    if (event.target === bookingModal) {
        closeModal();
    }
};

// Gece, oda türü ve otel fiyatına göre toplam rezervasyon fiyatını hesapla
function updateTotalPrice() {
    const checkInEl = document.getElementById('bookingCheckIn');
    const checkOutEl = document.getElementById('bookingCheckOut');
    const roomTypeEl = document.getElementById('roomType');
    const totalPriceEl = document.getElementById('totalPrice');
    
    // Gerekli alanlar boşsa fonksiyondan çık
    if (!checkInEl || !checkOutEl) return;
    
    // Giriş ve çıkış tarihlerini Date objelerine dönüştür
    const checkIn = new Date(checkInEl.value);
    const checkOut = new Date(checkOutEl.value);
    
    // Tarihler geçerli ve giriş çıkıştan önce ise fiyat hesapla
    if (checkIn && checkOut && checkIn < checkOut) {
        // Gece sayısını hesapla (milisaniye cinsinden fark / gün başına millisaniye)
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        // Oda türüne göre fiyat çarpanları
        const roomMultiplier = {
            'Standard': 1,      // Standart oda %100
            'Deluxe': 1.3,      // Deluxe oda %130
            'Suite': 1.6,       // Suit %160
            'Villa': 2          // Villa %200
        };
        
        const roomType = roomTypeEl ? roomTypeEl.value : 'Standard';
        const multiplier = roomMultiplier[roomType] || 1; // Seçilen oda türünün çarpanını al
        const total = Math.round(selectedPackagePrice * multiplier * nights); // Toplam = temel fiyat × çarpan × gece
        
        // Toplam fiyatı ekranda göster
        if (totalPriceEl) {
            totalPriceEl.textContent = '₺' + total.toLocaleString('tr-TR');
        }
    }
}

// Rezervasyon formunu gönder ve localStorage'a kaydet
function submitReservation(event) {
    event.preventDefault(); // Form gönderiminin sayfayı yenilemesini engelle
    
    // Form alanlarından değer çekmek için yardımcı fonksiyonlar
    const getElementValue = (id) => document.getElementById(id)?.value || '';
    const getElementText = (id) => document.getElementById(id)?.textContent || '';
    
    // Rezervasyon objesi oluştur (tüm bilgileri sakla)
    const reservation = {
        id: Date.now(), // Benzersiz ID (şu anki zaman damgası)
        resortName: getElementValue('resortName'), // Otel adı
        guestName: getElementValue('guestName'), // Konuk adı
        guestEmail: getElementValue('guestEmail'), // Konuk e-postası
        guestPhone: getElementValue('guestPhone'), // Konuk telefonu
        checkIn: getElementValue('bookingCheckIn'), // Giriş tarihi
        checkOut: getElementValue('bookingCheckOut'), // Çıkış tarihi
        guests: getElementValue('bookingGuests'), // Konuk sayısı
        roomType: getElementValue('roomType'), // Oda türü
        specialRequests: getElementValue('specialRequests'), // Özel istekler
        totalPrice: getElementText('totalPrice'), // Toplam fiyat
        status: 'Onaylandı', // Varsayılan durum
        bookingDate: new Date().toLocaleDateString('tr-TR') // Rezervasyon tarihi
    };
    
    // localStorage'dan mevcut rezervasyonları al
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation); // Yeni rezervasyonu ekle
    localStorage.setItem('reservations', JSON.stringify(reservations)); // Tümünü kaydet
    
    // Başarılı mesajını göster ve ID'yi kopyala
    alert(`Başarılı! Rezervasyon numaranız: ${reservation.id}`);
    closeModal(); // Modalı kapat
    
    // Form alanlarını temizle
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.reset();
}

// Hero slayetrı ve yorum kaydıracı için mevcut indeks
let currentSlide = 0;
let currentTestimonial = 0;

// Hero slayderini ileri veya geri hareket ettir
const slideHero = (direction) => {
    const heroSlider = document.getElementById('heroSlider');
    if (!heroSlider) return;
    
    const slides = heroSlider.children; // Tüm slide öğeleri
    const totalSlides = slides.length; // Toplam slide sayısı
    
    // Mevcut indeksi güncelle (dairesel: sonundan başa dön)
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    
    // CSS transform ile slideri horizontal kaydır
    heroSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
};

// Yorum verileri (müşteri testimonyialları)
const testimonials = [
    { text: "Muhteşem bir tatil deneyimi! Her şey mükemmeldi.", name: "xxxx", location: "Antalya Tatili", rating: 5 },
    { text: "Otel personeli çok ilgiliydi. Kesinlikle tekrar geleceğiz!", name: "xxxxxx", location: "Bodrum Tatili", rating: 5 },
    { text: "Tarihi dokusuyla büyüleyici bir şehir. Harika bir deneyimdi!", name: "xxxx", location: "Mardin Tatili", rating: 5 },
    { text: "Çocuklarımız çok eğlendi. Doğa harikası bir tatildi.", name: "xxxx xxxx", location: "Trabzon Tatili", rating: 5 },
    { text: "Ege'nin en güzel kenti. Deniz, güneş, eğlence!", name: "xxxx xxx", location: "İzmir Tatili", rating: 5 }
];

const MAX_TESTIMONIALS_ON_HOME = 3; // Anasayfada gösterilecek maksimum yorum sayısı

// Yorum verilerini HTML'ye dönüştürüp sayfa'da göster
const loadTestimonials = () => {
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    if (!testimonialsTrack) return;
    
    // Sadece ilk 3 yorumu al
    const visibleTestimonials = testimonials.slice(0, MAX_TESTIMONIALS_ON_HOME);

    // Yorumları HTML kartlarına dönüştür ve render et
    testimonialsTrack.innerHTML = visibleTestimonials.map((t, i) => `
        <div class="testimonial-item">
            <div class="testimonial-card ${i === 0 ? 'active' : ''}"> <!-- İlk yorum aktif -->
                <div class="stars">${'⭐'.repeat(t.rating)}</div> <!-- Yıldizları göster -->
                <p>"${t.text}"</p> <!-- Yorum metni -->
                <div class="reviewer">
                    <span class="avatar">👤</span>
                    <div>
                        <strong>${t.name}</strong> <!-- Yorum sahibinin adı -->
                        <p class="subtitle">${t.location}</p> <!-- Tatil lokasyonu -->
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

// Yorum seçicisini ileri/geri kaydır
const slideTestimonial = (direction) => {
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    if (!testimonialsTrack) return;
    
    const items = testimonialsTrack.children;
    // Mevcut yorum indeksini güncelle (dairesel)
    currentTestimonial = (currentTestimonial + direction + items.length) % items.length;
    
    // CSS transform ile kaydır
    testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
};

// Tüm bölgeler ve otelleri verileri
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

// Bölgeleri sayfaya render et (kaskad kartları)
const loadRegions = () => {
    const container = document.getElementById('regionsCascade');
    if (!container) return;
    
    // Bölge verilerini HTML kartlarına dönüştür
    container.innerHTML = regions.map(r => `
        <div class="region-card ${r.class}" style="background-image: url('${r.image}');"> <!-- Arkaplan görüntüsü -->
            <div class="region-overlay"></div> <!-- Koyu katman -->
            <div class="region-content">
                <h3 class="region-name">${r.name}</h3> <!-- Bölge adı -->
                <span class="region-hotels">${r.hotels} Otel</span> <!-- Otel sayısı -->
            </div>
            <a href="${r.link}" class="region-link"></a> <!-- Şehir sayfasına link -->
        </div>
    `).join('');
};

// Rezervasyonları yönetmek için sınıf
class ReservationManager {
    constructor() {
        // localStorage'da rezervasyonları tutacağımız anahtar
        this.storageKey = 'reservations';
    }

    // Tüm reservation'ları localStorage'dan al
    getReservations = () => {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    };

    // Tüm reservation'ları sil
    clearAll = async () => {
        const currentData = this.getReservations();
        const { length } = currentData;

        // Eğer hiç reservasyon yoksa uyar
        if (length === 0) {
            alert('Rezervasyonunuz zaten yok.');
            return false;
        }

        // Kullanıcıdan silme onayı iste
        if (confirm('Tüm rezervasyonlar silinecek. Emin misiniz?')) {
            const delbtn = document.querySelector('.delbtn');
            if (delbtn) {
                const { textContent: oldText } = delbtn;
                
                // Silme işlemi sırasında butonu devre dışı bırak ve "Siliniyor..." yaz
                delbtn.classList.add('delbtn-loading');
                delbtn.textContent = "Siliniyor...";
                delbtn.disabled = true;

                // 1 saniye bekle (animasyon efekti)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Tüm reservation'ları sil
                localStorage.removeItem(this.storageKey);
                loadReservations(); // Sayfayı yenile

                // Buton durumunu eski haline getir
                delbtn.classList.remove('delbtn-loading');
                delbtn.textContent = oldText;
                delbtn.disabled = false;

                // Başarılı mesajı göster
                alert('Tüm rezervasyonlar temizlendi.');
            }
            return true;
        }
        return false;
    };
}

// Sınıftan örnek oluştur (global değişken olarak)
const reservationManager = new ReservationManager();

// localStorage'dan tüm reservation'ları getir ve sayfada göster
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const content = document.getElementById('reservationsContent');
    
    if (!content) return;

    // Eğer hiç reservation yoksa boş durum mesajı göster
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

    // Her reservation için bir kart oluştur
    content.innerHTML = reservations.map((res, index) => {
        // Reservation verilerini çıkart
        const { resortName, guestName, checkIn, checkOut, guests, roomType, totalPrice, status, guestEmail, guestPhone, specialRequests, id } = res;
        // Durum türüne göre stil sınıfını ayarla
        const statusText = status === 'Onaylandı' ? 'confirmed' : status === 'Beklemede' ? 'pending' : 'cancelled';
        
        return `
            <div class="booking-item">
                <div class="booking-header">
                    <div>
                        <h3>${resortName}</h3> <!-- Otel adı -->
                        <p style="color: #999; margin-top: 0.3rem; font-size: 0.9rem;">Rezervasyon ID: ${id}</p> <!-- ID -->
                    </div>
                    <span class="status-badge status-${statusText}">${status}</span> <!-- Durum etiketi -->
                </div>

                <!-- Reservation detayları -->
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

                <!-- İletişim bilgileri (varsa göster) -->
                ${guestPhone ? `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                    <p><strong>E-posta:</strong> ${guestEmail}</p>
                    <p><strong>Telefon:</strong> ${guestPhone}</p>
                </div>
                ` : ''}

                <!-- Özel istekler (varsa göster) -->
                ${specialRequests ? `
                <div style="margin-top: 1rem; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
                    <strong>Özel İstekler:</strong>
                    <p style="margin-top: 0.5rem; color: #666;">${specialRequests}</p>
                </div>
                ` : ''}

                <!-- Düzenle / İptal Et Butonları -->
                <div class="booking-actions">
                    <button class="btn-edit" onclick="editReservation(${index})">Düzenle</button>
                    <button class="btn-cancel" onclick="cancelReservation(${index})">İptal Et</button>
                </div>
            </div>
        `;
    }).join('');
}

// Belirtilen reservation'ı düzenlemeye açmaya çalış
const editReservation = (index) => {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const { resortName } = reservations[index];
    // Düzenleme henüz uygulanmamış - müşteri hizmetleri aracılığı ile
    alert(`"${resortName}" için düzenleme\n\nHenüz bu özellik uygulanmadı. Lütfen iletişim sayfasından bize ulaşın.`);
};

// Belirtilen reservation'ı iptal et
const cancelReservation = (index) => {
    // Kullanıcıdan iptal onayı iste
    if (confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations[index].status = 'İptal Edildi'; // Durumu "İptal Edildi" olarak ayarla
        localStorage.setItem('reservations', JSON.stringify(reservations)); // Güncelle
        loadReservations(); // Sayfayı yenile
        alert('Rezervasyon başarıyla iptal edildi.');
    }
};
// Bir HTML elemanında "active" sınıfını aç/kapat
const elementToggleFunc = function (elem) { 
    elem.classList.toggle("active"); // Sınıfı ekle veya kaldır
};

// Aboutme sayfasının tüm etkileşimlerini başlat
const initAboutMePage = () => {
    // Sidebar'ı açmak için buton ve sidebar öğelerini al
    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");

    // Sidebar butonuna tıklanırsa sidebar'ı aç/kapat
    if (sidebarBtn && sidebar) {
        sidebarBtn.addEventListener("click", function () { 
            elementToggleFunc(sidebar); // Active sınıfını aç/kapat
        });
    }
    
    // Yorum modal ve overlay öğelerini al
    const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
    const modalContainer = document.querySelector("[data-modal-container]");
    const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
    const overlay = document.querySelector("[data-overlay]");

    const modalImg = document.querySelector("[data-modal-img]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalText = document.querySelector("[data-modal-text]");

    // Modal aç/kapat işlevini tanımla
    const testimonialsModalFunc = function () {
        if (modalContainer) modalContainer.classList.toggle("active");
        if (overlay) overlay.classList.toggle("active");
    };

    // Her yorum öğesine tıklanırsa modal aç ve verileri doldur
    for (let i = 0; i < testimonialsItem.length; i++) {
        testimonialsItem[i].addEventListener("click", function () {
            // Modal'ı yorum verileri ile doldur
            if (modalImg) modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
            if (modalImg) modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
            if (modalTitle) modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
            if (modalText) modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

            testimonialsModalFunc(); // Modal'ı aç
        });
    }

    // Modal kapat butonları
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
    if (overlay) overlay.addEventListener("click", testimonialsModalFunc); // Overlay'e tıklanırsa kapat

    // Kategori seçiş ve filtreleme öğeleri
    const select = document.querySelector("[data-select]");
    const selectItems = document.querySelectorAll("[data-select-item]");
    const selectValue = document.querySelector("[data-selecct-value]");
    const filterBtn = document.querySelectorAll("[data-filter-btn]");

    // Select açılır menüsü aç/kapat
    if (select) {
        select.addEventListener("click", function () { 
            elementToggleFunc(this); 
        });
    }

    // Seçim yapılırsa filtreyi uygula
    for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {
            let selectedValue = this.innerText.toLowerCase();
            if (selectValue) selectValue.innerText = this.innerText; // Seçili değeri göster
            if (select) elementToggleFunc(select); // Select'i kapat
            filterFunc(selectedValue); // Filtre uygula
        });
    }

    // Filtrele işlevi: seçilen kategoriye göre öğeleri göster/gizle
    const filterItems = document.querySelectorAll("[data-filter-item]");

    const filterFunc = function (selectedValue) {
        // Her öğeyi kontrol et ve kategori değeri eşleşirse "active" ekle
        for (let i = 0; i < filterItems.length; i++) {
            if (selectedValue === "all") {
                filterItems[i].classList.add("active"); // Hepsi görünsün
            } else if (selectedValue === filterItems[i].dataset.category) {
                filterItems[i].classList.add("active"); // Kategorisi eşleşerse görünsün
            } else {
                filterItems[i].classList.remove("active"); // Gerekirse gizle
            }
        }
    };

    let lastClickedBtn = filterBtn[0]; // Sonra tıklanan buton

    // Filtre butonlarına tıklanırsa seçili stilini güncelle
    for (let i = 0; i < filterBtn.length; i++) {
        filterBtn[i].addEventListener("click", function () {
            let selectedValue = this.innerText.toLowerCase();
            if (selectValue) selectValue.innerText = this.innerText;
            filterFunc(selectedValue); // Filtre uygula

            // Önceki butondan "active" sınıfını kaldır
            if (lastClickedBtn) lastClickedBtn.classList.remove("active");
            this.classList.add("active"); // Yeni butona "active" ekle
            lastClickedBtn = this; // Güncelle
        });
    }
    
    // Form doğrulama: tüm alanlar dolduysa gönder butonunu aktif et
    const form = document.querySelector("[data-form]");
    const formInputs = document.querySelectorAll("[data-form-input]");
    const formBtn = document.querySelector("[data-form-btn]");

    // Her form inputuna dinleyici ekle
    for (let i = 0; i < formInputs.length; i++) {
        formInputs[i].addEventListener("input", function () {
            // Form geçerli mi ve tüm alanlar dolu mu?
            if (form && form.checkValidity() && formBtn) {
                formBtn.removeAttribute("disabled"); // Butonu aktif et
            } else if (formBtn) {
                formBtn.setAttribute("disabled", ""); // Butonu devre dışı bırak
            }
        });
    }
    
    // Sayfa navigasyon ve sekme sistemi
    const navLinks = document.querySelectorAll("[data-nav-link]");
    const pages = document.querySelectorAll("[data-page]");

    // Her navigation linkine tıklanırsa ilgili sayfayı göster
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            const clickPage = this.getAttribute("data-nav-link");

            // Sayfaları kontrol et
            pages.forEach(page => {
                if (clickPage === page.dataset.page) {
                    page.classList.add("active"); // Tıklanan sayfayı göster
                    this.classList.add("active"); // Liki aktif yap
                    window.scrollTo(0, 0); // Sayfanın başına git
                } else {
                    page.classList.remove("active"); // Diğerlerini gizle
                }
            });

            // Diğer buttonları deaktif et
            navLinks.forEach(l => {
                if (l !== this) l.classList.remove("active");
            });
        });
    });
};

// Aktif hotel listesi
let currentHotels = [];

// Filtreleme durumunu saklamak için global obje
const FILTER_STATE = {
  minPrice: 0,        // Minimum fiat
  maxPrice: 3000,     // Maksimum fiyat
  minRating: 0,       // Minimum yıldız puanı
  concept: "",        // Otel konsepti (Her Şey Dahil vb.)
  theme: "",          // Otel teması (Çocuk Dostu vb.)
  amenities: [],      // Seçili olanaklar (Spa, Havuz vb.)
  sortBy: "recommended" // Sıralama tercihli
};

// Türkçe karakterleri normalize et (ı→i, ğ→g vb.) arama için
function normalizeText(text) {
  return (text || "")
    .toString()
    .normalize("NFD") // Türkçe karakterleri ayrıştır
    .replace(/[\u0300-\u036f]/g, "") // Aksan işaretlrini kaldır
    .toLowerCase()
    .replace(/ı/g, "i")     // ı → i
    .replace(/ğ/g, "g")     // ğ → g
    .replace(/ü/g, "u")     // ü → u
    .replace(/ş/g, "s")     // ş → s
    .replace(/ö/g, "o")     // ö → o
    .replace(/ç/g, "c");    // ç → c
}

// Şehir verilerini window.CITIES'den al (cities.js'den geliyor)
const CITY_DATA = (typeof window !== "undefined" && window.CITIES) ? window.CITIES : {};
// Şehir başlık verilerini window.CITY_TITLES'den al (title.js'den geliyor)
const CITY_TITLES = (typeof window !== "undefined" && window.CITY_TITLES) ? window.CITY_TITLES : {};

// Kullanıcı girişini normalize edip şehir adlarıyla eşleştir
function resolveCitySlug(input) {
  const normalizedInput = normalizeText(input || "").trim();
  if (!normalizedInput) return "";

  // Tüm şehirleri kontrol et
  const cityEntries = Object.entries(CITY_DATA);
  for (const [slug, city] of cityEntries) {
    // Slug, şehir adı ve takma adları normalize et
    const aliases = Array.isArray(city.aliases) ? city.aliases : [];
    const candidates = [slug, city.name, ...aliases].map(normalizeText);
    
    // Eğer normalize edilmiş giriş eşleşirse slug'u döndür
    if (candidates.some(candidate => candidate === normalizedInput || normalizedInput.includes(candidate))) {
      return slug;
    }
  }

  return "";
}

// URL'den şehir parametresi al ve çöz
function getCityFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return resolveCitySlug(params.get("city"));
}

// Şehir sayfasının başlık, açıklama ve resimlneri render et
function renderCityPage() {
  const cityNameEl = document.getElementById("cityName");
  if (!cityNameEl) return;

  // URL'den şehir bilgisini al
  const slug = getCityFromQuery();
  const city = slug ? CITY_DATA[slug] : null;
  const titleData = slug ? CITY_TITLES[slug] : null; // title.js'den başlık verileri

  // Sayfadaki tüm ilgili öğeleri al
  const pageTitleEl = document.getElementById("cityPageTitle");
  const cityDescriptionEl = document.getElementById("cityDescription");
  const cityImageEl = document.getElementById("cityImage");
  const cityHeroEl = document.getElementById("cityHero");
  const cityHotelsTitleEl = document.getElementById("cityHotelsTitle");
  const hotelsGridEl = document.getElementById("hotelsGrid");

  // Şehir bulunamadıysa hata mesajı göster
  if (!city) {
    cityNameEl.textContent = "Sehir bulunamadi";
    if (cityDescriptionEl) cityDescriptionEl.textContent = "Gecerli bir sehir secerek tekrar deneyin.";
    if (cityHotelsTitleEl) cityHotelsTitleEl.textContent = "Sonuc yok";
    if (hotelsGridEl) {
      hotelsGridEl.innerHTML = "<div class='hotel-card'><div class='hotel-info'><h3 class='hotel-name'>Gecersiz sehir</h3><p>Index sayfasindan bir sehir secip tekrar deneyin.</p><a class='btn-book' href='index.html'>Anasayfaya Don</a></div></div>";
    }
    return;
  }

  // Başlık verilerini al, yoksa fallback kullan
  const resolvedPageTitle = titleData?.pageTitle || (city.name + " Otelleri - TatilRez");
  const resolvedHeroTitle = titleData?.heroTitle || city.name;
  const resolvedHeroDescription = titleData?.heroDescription || city.description;
  const resolvedHotelsTitle = titleData?.hotelsSectionTitle || (city.name + "'da Populer Oteller");

  // Sayfaya başlıkları ve açıklamaları yerleştir
  document.title = resolvedPageTitle; // Tarayıcı sekmesi başlığı
  if (pageTitleEl) pageTitleEl.textContent = resolvedPageTitle;

  cityNameEl.textContent = resolvedHeroTitle;
  if (cityDescriptionEl) cityDescriptionEl.textContent = resolvedHeroDescription;
  if (cityHotelsTitleEl) cityHotelsTitleEl.textContent = resolvedHotelsTitle;

  // Şehir resmini gaçerleştir
  if (cityImageEl) {
    cityImageEl.src = city.image;
    cityImageEl.alt = city.name;
  }

  // Hero bölümünün arkaplan rengini/gradyanını ayarla
  if (cityHeroEl && city.heroBackground) {
    cityHeroEl.style.background = city.heroBackground;
  }

  // Body'ye şehir-spesifik sınıf ekle (CSS'de stilini ayrı yapmak için)
  document.body.className = document.body.className
    .split(" ")
    .filter(cls => cls && !cls.startsWith("page-")) // Eski page sınıfını kaldır
    .concat(["page-" + slug]) // Yeni şehir sınıfını ekle
    .join(" ");
}

// Otel bilgilerindeki özellikleri analiz ederek meta veriler oluştur
function inferMeta(hotel, index) {
  // Otel özelliklerini normalize et
  const featureText = normalizeText((hotel.features || []).join(" "));
  const nameText = normalizeText(hotel.name || "");

  // Olanakları (amenities) özelliklerden çıkart
  const amenities = [];
  if (featureText.includes("spa")) amenities.push("Spa");
  if (featureText.includes("havuz") || featureText.includes("pool")) amenities.push("Havuz");
  if (featureText.includes("sahil") || featureText.includes("beach") || featureText.includes("deniz")) amenities.push("Denize Sifir");
  if (featureText.includes("otopark") || featureText.includes("parking")) amenities.push("Otopark");
  if (featureText.includes("evcil") || featureText.includes("pet")) amenities.push("Evcil Hayvan");

  // Otel konseptini belirle (ne dil dahil?)
  const concept = featureText.includes("all-inclusive") ? "Her Sey Dahil"
                : (featureText.includes("kahvalti") || featureText.includes("breakfast")) ? "Oda Kahvalti"
                : "Yarim Pansiyon";

  // Otel temasını belirle (hangi gruba uygun?)
  const theme = (featureText.includes("aile") || featureText.includes("kids")) ? "Cocuk Dostu"
              : (featureText.includes("water park") || featureText.includes("aquapark")) ? "Aquapark"
              : (nameText.includes("boutique") || nameText.includes("luxury") || featureText.includes("romantik")) ? "Balayi"
              : "Yetiskin";

  // Mesafeyi index'e göre hesapla (simülasyon)
  const distanceKm = (index % 8) + 1;

  return { amenities, concept, theme, distanceKm };
}

// Sayfanın URL'sine göre otelleri getir
function getHotelsByPage() {
  // Önce URL query parametresini kontrol et
  const cityFromQuery = getCityFromQuery();
  if (cityFromQuery && HOTEL_DATA[cityFromQuery]) return HOTEL_DATA[cityFromQuery];

  // Fallback: pathname içinde şehir adı ara
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

// Otel listesini HTML kartlarına dönüştürüp sayfaya render et
function renderHotels(list) {
  const grid = document.getElementById("hotelsGrid");
  const listEl = document.getElementById("hotelsList");
  const target = grid || listEl; // Grid veya List view'ı hedefle
  if (!target) return;

  // Her oteli HTML kartına dönüştür
  target.innerHTML = list.map(hotel => {
    const meta = hotel.meta || {};
    // Otel meta bilgilerini badge'ler olarak oluştur
    const badge = [
      meta.concept ? "<span>" + meta.concept + "</span>" : "",
      meta.theme ? "<span>" + meta.theme + "</span>" : "",
      typeof meta.distanceKm === "number" ? "<span>" + meta.distanceKm + " km</span>" : ""
    ].join(" ");

    // Otel kartı HTML'si
    return ""
      + "<div class='hotel-card'>"
      + "  <img src='" + hotel.image + "' alt='" + hotel.name + "' onerror=\"this.src='img/logo.png'\">" // Otel resmi
      + "  <div class='hotel-info'>"
      + "    <h3 class='hotel-name'>" + hotel.name + "</h3>" // Otel adı
      + "    <div class='hotel-rating'>" + "⭐".repeat(Math.floor(hotel.rating)) + " " + hotel.rating + "</div>" // Yıldızlar
      + "    <div class='hotel-price'>₺" + hotel.price + "/gece</div>" // Fiyat
      + "    <div style='display:flex; gap:6px; flex-wrap:wrap; margin:6px 0; font-size:12px; color:#555;'>" + badge + "</div>" // Badge'ler
      + "    <ul class='hotel-features'>" + (hotel.features || []).map(f => "<li>" + f + "</li>").join("") + "</ul>" // Özellikler
      + "    <button class='btn-book' onclick=\"openBooking('" + hotel.name.replace(/'/g, "\\'") + "', " + hotel.price + ")\">Rezervasyon Yap</button>" // Rezervasyon butonu
      + "  </div>"
      + "</div>";
  }).join("");
}

// Filtreleri ve sıralamayı uygula, sonuçları render et
function applyFiltersAndSort() {
  let data = [...currentHotels]; // Mevcut otellerin kopyasını al

  // Fiyat aralığına göre filtrele
  data = data.filter(h => h.price >= FILTER_STATE.minPrice && h.price <= FILTER_STATE.maxPrice);
  // Minimum yıldız puanına göre filtrele
  data = data.filter(h => h.rating >= FILTER_STATE.minRating);

  // Konsept filtresini uygula
  if (FILTER_STATE.concept) data = data.filter(h => h.meta.concept === FILTER_STATE.concept);
  // Tema filtresini uygula
  if (FILTER_STATE.theme) data = data.filter(h => h.meta.theme === FILTER_STATE.theme);

  // Tüm seçili olanakları bir otelde bulunması gerekiyor
  if (FILTER_STATE.amenities.length > 0) {
    data = data.filter(h => FILTER_STATE.amenities.every(a => h.meta.amenities.includes(a)));
  }

  // Sıralamayı uygula
  if (FILTER_STATE.sortBy === "priceAsc") data.sort((a, b) => a.price - b.price); // Fiyat artan
  if (FILTER_STATE.sortBy === "priceDesc") data.sort((a, b) => b.price - a.price); // Fiyat azalan
  if (FILTER_STATE.sortBy === "ratingDesc") data.sort((a, b) => b.rating - a.rating); // Puan yüksek
  if (FILTER_STATE.sortBy === "distanceAsc") data.sort((a, b) => a.meta.distanceKm - b.meta.distanceKm); // Mesafe yakın

  // Tavsiye edilen: puan × 2 - (fiyat / 1000) değerine göre sırala
  if (FILTER_STATE.sortBy === "recommended") {
    data.sort((a, b) => {
      const scoreA = (a.rating * 2) - (a.price / 1000);
      const scoreB = (b.rating * 2) - (b.price / 1000);
      return scoreB - scoreA; // Yüksek skora göre sırala
    });
  }

  renderHotels(data); // Sonuçları göster
}

// Otelleri yükle ve meta verileri oluştur
function loadHotels() {
  // Sayfanın URL'sine göre otelleri getir
  const raw = getHotelsByPage();
  // Her otele meta verileri ekle
  currentHotels = raw.map((hotel, idx) => {
    const meta = inferMeta(hotel, idx);
    return { ...hotel, meta };
  });
  applyFiltersAndSort(); // Filtreleri uygula ve render et
}
// Tüm filtreleme UI'sını başlat ve event dinleyicileri ekle
function initAdvancedFilters() {
  // Filtre input'larını ve display öğelerini al
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

  // Fiyat değerini sayıya dönüştür
  const parsePrice = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  // Fiyat aralığını senkronize et (min > max kontrolü)
  const syncPriceText = () => {
    FILTER_STATE.minPrice = parsePrice(minEl.value, 0);
    FILTER_STATE.maxPrice = parsePrice(maxEl.value, 3000);

    // Negatif fiyatları engelle
    if (FILTER_STATE.minPrice < 0) FILTER_STATE.minPrice = 0;
    if (FILTER_STATE.maxPrice < 0) FILTER_STATE.maxPrice = 0;

    // Eğer min > max ise swapla
    if (FILTER_STATE.minPrice > FILTER_STATE.maxPrice) {
      const temp = FILTER_STATE.minPrice;
      FILTER_STATE.minPrice = FILTER_STATE.maxPrice;
      FILTER_STATE.maxPrice = temp;
      minEl.value = String(FILTER_STATE.minPrice);
      maxEl.value = String(FILTER_STATE.maxPrice);
    }
    
    // Ekranda göster
    if (minText) minText.textContent = "₺" + FILTER_STATE.minPrice;
    if (maxText) maxText.textContent = "₺" + FILTER_STATE.maxPrice;
  };

  // Minimum fiyat değiştirince
  minEl.addEventListener("input", () => {
    syncPriceText();
    applyFiltersAndSort(); // Sonuçları yenile
  });

  // Maksimum fiyat değiştirince
  maxEl.addEventListener("input", () => {
    syncPriceText();
    applyFiltersAndSort();
  });

  // Yıldız puanı filtresi değiştirince
  if (ratingEl) ratingEl.addEventListener("change", () => {
    FILTER_STATE.minRating = Number(ratingEl.value || 0);
    applyFiltersAndSort();
  });

  // Konsept filtresi değiştirince (Her Şey Dahil vb.)
  if (conceptEl) conceptEl.addEventListener("change", () => {
    FILTER_STATE.concept = conceptEl.value || "";
    applyFiltersAndSort();
  });

  // Tema filtresi değiştirince (Çocuk Dostu vb.)
  if (themeEl) themeEl.addEventListener("change", () => {
    FILTER_STATE.theme = themeEl.value || "";
    applyFiltersAndSort();
  });

  // Olanaklar checkboxları (Spa, Havuz vb.)
  const amenityChecks = document.querySelectorAll(".amenityCheck");
  amenityChecks.forEach(ch => {
    ch.addEventListener("change", () => {
      // Seçili olanakları topla
      FILTER_STATE.amenities = Array.from(document.querySelectorAll(".amenityCheck:checked")).map(x => x.value);
      applyFiltersAndSort();
    });
  });

  // Sıralama seçeneği değiştirince
  if (sortEl) sortEl.addEventListener("change", () => {
    FILTER_STATE.sortBy = sortEl.value || "recommended";
    applyFiltersAndSort();
  });

  // Tüm filtreleri temizle butonu
  if (clearBtn) clearBtn.addEventListener("click", () => {
    minEl.value = "0";
    maxEl.value = "3000";
    if (ratingEl) ratingEl.value = "0";
    if (conceptEl) conceptEl.value = "";
    if (themeEl) themeEl.value = "";
    if (sortEl) sortEl.value = "recommended";
    document.querySelectorAll(".amenityCheck").forEach(x => x.checked = false);

    // Filter state'i sıfırla
    FILTER_STATE.minPrice = 0;
    FILTER_STATE.maxPrice = 3000;
    FILTER_STATE.minRating = 0;
    FILTER_STATE.concept = "";
    FILTER_STATE.theme = "";
    FILTER_STATE.amenities = [];
    FILTER_STATE.sortBy = "recommended";

    syncPriceText();
    applyFiltersAndSort(); // Tüm otelleri göster
  });

  syncPriceText(); // İlk senkronizasyon
}
// Popüler arama önerileri
const POPULAR_SEARCHES = [
  "Antalya",
  "Bodrum",
  "Muğla",
  "İzmir",
  "Mardin"
];

// localStorage'dan son aramaları getir
function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  } catch {
    return [];
  }
}

// Yapılan aramayı localStorage'a kaydet
function saveRecentSearch(value) {
  const v = (value || "").trim();
  if (!v) return; // Boş aramayı kaydetme
  
  // Aynı aramayı tekrar ekleme (normalize karşılaştırma)
  const old = getRecentSearches().filter(x => normalizeText(x) !== normalizeText(v));
  // Yeni aramayı başa ekle, maksimum 6 tut
  const next = [v, ...old].slice(0, 6);
  localStorage.setItem("recentSearches", JSON.stringify(next));
}

// Önerilecek tüm şehir ve otel adlarını getir
function getSuggestionPool() {
  const regions = ["Antalya", "Bodrum", "Bursa", "Diyarbakır", "İzmir", "Mardin", "Muğla", "Trabzon", "Van"];
  
  // Tüm otelleri topla ve adlarını al
  const hotels = Object.values(HOTEL_DATA)
    .flatMap(list => Array.isArray(list) ? list : [])
    .map(h => h.name);

  // Benzersiz öneriler döndür (şehirler + otel adları)
  return Array.from(new Set([...regions, ...hotels]));
}

// Çip (tag) görünüşlü düğmeleri oluştur ve göster
function renderChipList(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // İtemleri düğmelere dönüştür
  el.innerHTML = items.map(item => {
    return "<button type='button' class='chip-btn' data-chip='" + item.replace(/"/g, "&quot;") + "'>" + item + "</button>";
  }).join("");

  // Her düğmeye tıklanırsa destination'a yazı koy
  el.querySelectorAll(".chip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const destinationEl = document.getElementById("destination");
      if (!destinationEl) return;
      destinationEl.value = btn.getAttribute("data-chip") || "";
      hideSuggestions(); // Önerileri gizle
    });
  });
}

// Arama önerilerini gizle
function hideSuggestions() {
  const dd = document.getElementById("suggestionsDropdown");
  if (!dd) return;
  dd.classList.remove("show"); // Show sınıfını kaldır
  dd.innerHTML = ""; // İçeriği temizle
}

// Aranan metne göre öneriler göster
function showSuggestions(query) {
  const dd = document.getElementById("suggestionsDropdown");
  if (!dd) return;

  const q = normalizeText(query);
  // 2 karakterden az yazı yazılmışsa önerileri gösterme
  if (!q || q.length < 2) {
    hideSuggestions();
    return;
  }

  // Tüm önerileri al
  const pool = getSuggestionPool();
  
  // Yazıyla başlayanları (başlangıç eşleşmeleri) ve dahil olanları (içinde geçenler) ayır
  const starts = pool.filter(x => normalizeText(x).startsWith(q));
  const contains = pool.filter(x => !normalizeText(x).startsWith(q) && normalizeText(x).includes(q));
  
  // Başlangıç eşleşmeleri önce, maksimum 8 sonuç
  const results = [...starts, ...contains].slice(0, 8);

  if (results.length === 0) {
    hideSuggestions();
    return;
  }

  // Önerileri HTML'ye dönüştür
  dd.innerHTML = results.map(item => "<div class='suggestion-item' data-s='" + item.replace(/"/g, "&quot;") + "'>" + item + "</div>").join("");
  dd.classList.add("show"); // Show sınıfını ekle

  // Her öneri öğesine tıklanırsa destination'a yazı koy
  dd.querySelectorAll(".suggestion-item").forEach(row => {
    row.addEventListener("click", () => {
      const val = row.getAttribute("data-s") || "";
      const destinationEl = document.getElementById("destination");
      if (destinationEl) destinationEl.value = val;
      hideSuggestions();
    });
  });
}

// Akıllı arama sistemini başlat
function initSmartSearch() {
  const destinationEl = document.getElementById("destination");
  if (!destinationEl) return;

  // Popüler ve son aramaları yükle
  renderChipList("popularSearches", POPULAR_SEARCHES);
  renderChipList("recentSearches", getRecentSearches());

  // Her yazı yazınca öneriler göster
  destinationEl.addEventListener("input", () => {
    showSuggestions(destinationEl.value);
  });

  // Input'a focus olunca ve yeterli yazı varsa öneriler göster
  destinationEl.addEventListener("focus", () => {
    if (destinationEl.value.trim().length >= 2) showSuggestions(destinationEl.value);
  });

  // Input veya dropdown dışında tıklanırsa önerileri gizle
  document.addEventListener("click", (e) => {
    const box = document.getElementById("suggestionsDropdown");
    if (!box || !destinationEl) return;
    if (!box.contains(e.target) && e.target !== destinationEl) hideSuggestions();
  });
}

// Otel arama yap: şehri bul ve city.html'e yönlendir
function searchResorts() {
  const destination = (document.getElementById("destination")?.value || "").trim();
  const checkIn = document.getElementById("checkIn")?.value || "";
  const checkOut = document.getElementById("checkOut")?.value || "";
  const guests = document.getElementById("guests")?.value || "1";

  // Destination boşsa uyar
  if (!destination) {
    alert("Lütfen bir destinasyon seçin.");
    return;
  }

  // Aramayı son aramalara kaydet
  saveRecentSearch(destination);
  renderChipList("recentSearches", getRecentSearches()); // Chip listesini güncelle

  // Destinasyon adını şehir slug'ına dönüştür
  const matchedCity = resolveCitySlug(destination);

  // Eşleşme bulunamadıysa uyar
  if (!matchedCity) {
    alert("\"" + destination + "\" için sayfa bulunamadı.");
    return;
  }

  // URL parametreleri oluştur
  const params = new URLSearchParams({
    city: matchedCity, // Şehir slug'ı
    q: destination,    // Orijinal arama metni
    checkIn,           // Giriş tarihi
    checkOut,          // Çıkış tarihi
    guests             // Konuk sayısı
  });

  // City sayfasına yönlendir
  window.location.href = "city.html?" + params.toString();
}

// Sayfa tamamen yüklendiğinde tüm başlatma işlevlerini çalıştır
document.addEventListener("DOMContentLoaded", () => {
  // Tema değiştirme butonunu başlat
  initThemeToggle();
  
  // Şehir bilgisini (başlık, açıklama, resim) render et
  renderCityPage();

  // Anasayfadaki testimonial'ları yükle
  loadTestimonials();
  
  // Bölge kartlarını yükle
  loadRegions();
  
  // Her 5 saniyede bir hero slideri otomatik olarak kaydır
  setInterval(() => slideHero(1), 5000);

  // Akıllı arama sistemini başlat
  initSmartSearch();
  
  // Otelleri yükle
  loadHotels();
  
  // Filtreleme seçeneklerini başlat
  initAdvancedFilters();

  // Rezervasyon modalının tarih/oda değişimi dinleyicileri
  const inputs = ["bookingCheckIn", "bookingCheckOut", "roomType"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", updateTotalPrice); // Fiyatı güncelle
  });

  // Reservasyonları yükle ve göster
  loadReservations();
  
  // Tüm rezervasyonları sil butonunu bağla
  const clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => reservationManager.clearAll());
  }

  // About sayfasının tüm etkileşimlerini başlat
  initAboutMePage();
});
