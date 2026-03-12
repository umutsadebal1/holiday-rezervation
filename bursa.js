// Dark mode toggle
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

// Bursa Hotels Data
const bursa_hotels = [
    {
        name: 'Mountain Peak Resort',
        image: 'img/99.jpg',
        rating: 4.9,
        price: 1850,
        features: ['Dağ', 'Thermal', 'Spa', 'Harita']
    },
    {
        name: 'Thermal Springs Luxury',
        image: 'img/100.jpg',
        rating: 4.8,
        price: 1750,
        features: ['Kaplıca', 'Sıcak', 'Termal', 'Sauna']
    },
    {
        name: 'Winter Sports Lodge',
        image: 'img/101.jpg',
        rating: 4.7,
        price: 1550,
        features: ['Kayak', 'Kış', 'Kar', 'Spor']
    },
    {
        name: 'Forest Valley Inn',
        image: 'img/102.jpg',
        rating: 4.6,
        price: 1300,
        features: ['Orman', 'Vadi', 'Doğa', 'Sakin']
    },
    {
        name: 'Historic Grand Hotel',
        image: 'img/103.jpg',
        rating: 4.8,
        price: 1650,
        features: ['Tarih', 'Mimari', 'Köklü', 'Şık']
    },
    {
        name: 'Adventure Base Camp',
        image: 'img/94.jpg',
        rating: 4.5,
        price: 1200,
        features: ['Macera', 'Trekking', 'Rota', 'Rehber']
    },
    {
        name: 'Premium Alpine Suite',
        image: 'img/93.jpg',
        rating: 4.9,
        price: 2000,
        features: ['Suite', 'Termal', 'Private', 'Lüks']
    },
    {
        name: 'Budget Mountain Stay',
        image: 'img/92.jpg',
        rating: 4.2,
        price: 850,
        features: ['Ekonomik', 'Temel', 'Isıtma', 'Fan']
    }
];

// Load hotels to the page
function loadHotels() {
    const grid = document.getElementById('hotelsGrid');
    grid.innerHTML = bursa_hotels.map(hotel => `
        <div class="hotel-card">
            <img src="${hotel.image}" alt="${hotel.name}" onerror="this.src='img/99.jpg'">
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

// Modal handling
const bookingModal = document.getElementById('bookingModal');
let selectedPackagePrice = 0;

function openBooking(hotelName, price) {
    selectedPackagePrice = price;
    document.getElementById('resortName').value = hotelName;
    document.getElementById('bookingCheckIn').value = '';
    document.getElementById('bookingCheckOut').value = '';
    document.getElementById('bookingGuests').value = '1';
    document.getElementById('roomType').value = '';
    document.getElementById('guestName').value = '';
    document.getElementById('guestEmail').value = '';
    document.getElementById('guestPhone').value = '';
    document.getElementById('specialRequests').value = '';
    updateTotalPrice();
    bookingModal.style.display = 'block';
}

function closeModal() {
    bookingModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === bookingModal) {
        closeModal();
    }
}

// Price calculation
function updateTotalPrice() {
    const checkIn = new Date(document.getElementById('bookingCheckIn').value);
    const checkOut = new Date(document.getElementById('bookingCheckOut').value);
    
    if (checkIn && checkOut && checkIn < checkOut) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const roomMultiplier = {
            'Standard': 1,
            'Deluxe': 1.3,
            'Suite': 1.6,
            'Villa': 2
        };
        const roomType = document.getElementById('roomType').value || 'Standard';
        const multiplier = roomMultiplier[roomType] || 1;
        const total = Math.round(selectedPackagePrice * multiplier * nights);
        document.getElementById('totalPrice').textContent = '₺' + total.toLocaleString('tr-TR');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadHotels();
    document.getElementById('bookingCheckIn').addEventListener('change', updateTotalPrice);
    document.getElementById('bookingCheckOut').addEventListener('change', updateTotalPrice);
    document.getElementById('roomType').addEventListener('change', updateTotalPrice);
});

// Submit reservation
function submitReservation(event) {
    event.preventDefault();
    
    const reservation = {
        id: Date.now(),
        resortName: document.getElementById('resortName').value,
        guestName: document.getElementById('guestName').value,
        guestEmail: document.getElementById('guestEmail').value,
        guestPhone: document.getElementById('guestPhone').value,
        checkIn: document.getElementById('bookingCheckIn').value,
        checkOut: document.getElementById('bookingCheckOut').value,
        guests: document.getElementById('bookingGuests').value,
        roomType: document.getElementById('roomType').value,
        specialRequests: document.getElementById('specialRequests').value,
        totalPrice: document.getElementById('totalPrice').textContent,
        status: 'Onaylandı',
        bookingDate: new Date().toLocaleDateString('tr-TR')
    };
    
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    alert(`Başarılı! Rezervasyon numaranız: ${reservation.id}`);
    closeModal();
    document.getElementById('bookingForm').reset();
}
