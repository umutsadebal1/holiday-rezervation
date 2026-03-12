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

// Trabzon Hotels Data
const trabzon_hotels = [
    {
        name: 'Sumela Monastery Hotel',
        image: 'img/90.jpg',
        rating: 4.7,
        price: 850,
        features: ['Dağ Manzarası', 'Yayla Turu', 'Kahvaltı', 'Kültür']
    },
    {
        name: 'Uzungöl Nature Resort',
        image: 'img/91.jpg',
        rating: 4.8,
        price: 950,
        features: ['Göl Kenarı', 'Doğa Yürüyüşü', 'Balık Tutma', 'Fotoğrafçılık']
    },
    {
        name: 'Trabzon City Hotel',
        image: 'img/92.jpg',
        rating: 4.5,
        price: 650,
        features: ['Şehir Merkezi', 'Restoran', 'Otopark', 'Wi-Fi']
    },
    {
        name: 'Ayder Plateau Lodge',
        image: 'img/93.jpg',
        rating: 4.6,
        price: 780,
        features: ['Yayla Bungalov', 'Termal', 'Kaplıca', 'Mangal']
    },
    {
        name: 'Karadeniz Pearl Resort',
        image: 'img/94.jpg',
        rating: 4.4,
        price: 720,
        features: ['Sahil', 'Balık Restoranı', 'Hamsi', 'Müzik']
    },
    {
        name: 'Historical Trabzon Inn',
        image: 'img/95.jpg',
        rating: 4.3,
        price: 550,
        features: ['Tarihi Konak', 'Çay Bahçesi', 'Antika', 'Kütüphane']
    },
    {
        name: 'Zigana Mountain Hotel',
        image: 'img/96.jpg',
        rating: 4.7,
        price: 880,
        features: ['Kayak', 'Kış Sporları', 'Dağcılık', 'Sauna']
    },
    {
        name: 'Green Trabzon Resort',
        image: 'img/97.jpg',
        rating: 4.8,
        price: 1100,
        features: ['Çay Bahçeleri', 'Organik Yemek', 'Spa', 'Yoga']
    }
];

function loadHotels() {
    const grid = document.getElementById('hotelsGrid');
    grid.innerHTML = trabzon_hotels.map(hotel => `
        <div class="hotel-card">
            <img src="${hotel.image}" alt="${hotel.name}" onerror="this.src='img/90.jpg'">
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

document.addEventListener('DOMContentLoaded', () => {
    loadHotels();
    document.getElementById('bookingCheckIn').addEventListener('change', updateTotalPrice);
    document.getElementById('bookingCheckOut').addEventListener('change', updateTotalPrice);
    document.getElementById('roomType').addEventListener('change', updateTotalPrice);
});

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
