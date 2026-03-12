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

// Bodrum Hotels
const bodrum_hotels = [
    { name: 'Divum Otel', image: 'img/95.jpg', rating: 4.8, price: 1200, features: ['WiFi', 'Pool', 'Restaurant', 'Beach Access'] },
    { name: 'Viking Infinity Resort', image: 'img/96.jpg', rating: 4.9, price: 1500, features: ['All-Inclusive', 'Water Sports', 'Kids Club'] },
    { name: 'Club Med Bodrum', image: 'img/97.jpg', rating: 4.7, price: 1350, features: ['Animation', 'Gym', 'Spa', 'Nightclub'] },
    { name: 'Rixos Bodrum', image: 'img/98.jpg', rating: 5.0, price: 1800, features: ['Luxury', 'Private Beach', 'Spa', 'Fine Dining'] },
    { name: 'Bougainville Otel', image: 'img/100.jpg', rating: 4.6, price: 950, features: ['Budget Friendly', 'Central Location', 'Breakfast'] },
    { name: 'Lagoon Resort', image: 'img/101.jpg', rating: 4.8, price: 1400, features: ['Lagoon View', 'Water Park', 'Kids Pool'] },
    { name: 'Marina Turizm Oteli', image: 'img/102.jpg', rating: 4.5, price: 1100, features: ['Marina View', 'Restaurant', 'Bar'] },
    { name: 'Bodrum Sapphire', image: 'img/103.jpg', rating: 4.9, price: 1600, features: ['Luxury Rooms', 'Spa', 'Beach Club'] }
];

function loadHotels() {
    const list = document.getElementById('hotelsList');
    list.innerHTML = bodrum_hotels.map(hotel => `
        <div class="hotel-card">
            <img src="${hotel.image}" alt="${hotel.name}" onerror="this.src='img/95.jpg'" class="hotel-image">
            <div class="hotel-content">
                <div class="hotel-rating">⭐ ${hotel.rating}</div>
                <h3>${hotel.name}</h3>
                <div class="hotel-features">
                    ${hotel.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <div class="hotel-price">₺${hotel.price}</div>
                <div class="hotel-footer">
                    <button class="btn-book-now" onclick="openBooking('${hotel.name}', ${hotel.price})">Rezervasyon</button>
                </div>
            </div>
        </div>
    `).join('');
}

const bookingModal = document.getElementById('bookingModal');
let selectedPrice = 0;

function openBooking(hotelName, price) {
    selectedPrice = price;
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
    if (event.target === bookingModal) closeModal();
}

function updateTotalPrice() {
    const checkIn = new Date(document.getElementById('bookingCheckIn').value);
    const checkOut = new Date(document.getElementById('bookingCheckOut').value);
    if (checkIn && checkOut) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (nights > 0) {
            const roomMultiplier = { 'Standard': 1, 'Deluxe': 1.3, 'Suite': 1.6, 'Villa': 2 };
            const roomType = document.getElementById('roomType').value || 'Standard';
            const total = Math.round(selectedPrice * (roomMultiplier[roomType] || 1) * nights);
            document.getElementById('totalPrice').textContent = '₺' + total.toLocaleString('tr-TR');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHotels();
    const inputs = ['bookingCheckIn', 'bookingCheckOut', 'roomType'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateTotalPrice);
    });
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