// Reservation Manager Class - await, class, JSON.parse, destructuring, arrow function kullanılıyor
class ReservationManager {
    constructor() {
        this.storageKey = 'reservations';
    }

    // Rezervasyonları getir
    getReservations = () => {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    };

    // Tüm rezervasyonları temizle
    clearAll = async () => {
        const currentData = this.getReservations();
        const { length } = currentData;

        if (length === 0) {
            alert('Rezervasyonunuz zaten yok.');
            return false;
        }

        if (confirm('Tüm rezervasyonlar silinecek. Emin misiniz?')) {
            const delbtn = document.querySelector('.delbtn');
            const { textContent: oldText } = delbtn;
            
            // Loading state
            delbtn.classList.add('delbtn-loading');
            delbtn.textContent = "Siliniyor...";
            delbtn.disabled = true;

            // 1 saniye bekle (async/await)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Temizle
            localStorage.removeItem(this.storageKey);
            loadReservations();

            // Reset button
            delbtn.classList.remove('delbtn-loading');
            delbtn.textContent = oldText;
            delbtn.disabled = false;

            alert('Tüm rezervasyonlar temizlendi.');
            return true;
        }
        return false;
    };
}

// Booking class
class Booking {
    constructor(resortName, guestName, guestEmail, checkIn, checkOut, guests, roomType, totalPrice, status = 'Beklemede', guestPhone = '', specialRequests = '') {
        this.resortName = resortName;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.guests = guests;
        this.roomType = roomType;
        this.totalPrice = totalPrice;
        this.status = status;
        this.guestPhone = guestPhone;
        this.specialRequests = specialRequests;
        this.id = Date.now();
    }
}

// ReservationManager instance
const reservationManager = new ReservationManager();

// Load reservations
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const content = document.getElementById('reservationsContent');

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

// Edit reservation
const editReservation = (index) => {
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    const { resortName } = reservations[index];
    alert(`"${resortName}" için düzenleme\n\nHenüz bu özellik uygulanmadı. Lütfen iletişim sayfasından bize ulaşın.`);
};

// Cancel reservation
const cancelReservation = (index) => {
    if (confirm('Bu rezervasyonu iptal etmek istediğinizden emin misiniz?')) {
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations[index].status = 'İptal Edildi';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        loadReservations();
        alert('Rezervasyon başarıyla iptal edildi.');
    }
};

// DOMContentLoaded - Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle initialization
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

    // Load reservations
    loadReservations();
    
    // Clear button event listener
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => reservationManager.clearAll());
    }
});
