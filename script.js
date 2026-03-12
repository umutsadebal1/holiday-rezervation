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
let currentSlide = 0;
const heroSlider = document.getElementById('heroSlider');

const slideHero = (direction) => {
    if (!heroSlider) return;
    const slides = heroSlider.children;
    const totalSlides = slides.length;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    heroSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
};
setInterval(() => slideHero(1), 5000);

let currentTestimonial = 0;
const testimonialsTrack = document.getElementById('testimonialsTrack');

const testimonials = [
    { text: "Muhteşem bir tatil deneyimi! Her şey mükemmeldi.", name: "Ayşe Yılmaz", location: "Antalya Tatili", rating: 5 },
    { text: "Otel personeli çok ilgiliydi. Kesinlikle tekrar geleceğiz!", name: "Mehmet Kaya", location: "Bodrum Tatili", rating: 5 },
    { text: "Tarihi dokusuyla büyüleyici bir şehir. Harika bir deneyimdi!", name: "Zeynep Demir", location: "Mardin Tatili", rating: 5 },
    { text: "Çocuklarımız çok eğlendi. Doğa harikası bir tatildi.", name: "Ali Özkan", location: "Trabzon Tatili", rating: 5 },
    { text: "Ege'nin en güzel kenti. Deniz, güneş, eğlence!", name: "Fatma Şahin", location: "İzmir Tatili", rating: 5 }
];

const loadTestimonials = () => {
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
    if (!testimonialsTrack) return;
    const items = testimonialsTrack.children;
    currentTestimonial = (currentTestimonial + direction + items.length) % items.length;
    testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
};
const regions = [
    { name: 'Antalya', hotels: 172, image: 'img/1.jpg', link: 'antalya.html', class: 'large-left' },
    { name: 'Mardin', hotels: 106, image: 'img/11.jpg', link: 'mardin.html', class: 'top-right' },
    { name: 'Diyarbakır', hotels: 145, image: 'img/67.jpg', link: 'diyarbakir.html', class: 'middle-left' },
    { name: 'Muğla', hotels: 238, image: 'img/72.jpg', link: 'mugla.html', class: 'middle-right' },
    { name: 'Van', hotels: 221, image: 'img/97.jpg', link: 'van.html', class: 'middle-left' },
    { name: 'Trabzon', hotels: 84, image: 'img/90.jpg', link: 'trabzon.html', class: 'bottom-left' },
    { name: 'Bodrum', hotels: 189, image: 'img/95.jpg', link: 'bodrum.html', class: 'bottom-left' },
    { name: 'Bursa', hotels: 156, image: 'img/99.jpg', link: 'bursa.html', class: 'bottom-right' },
    { name: 'İzmir', hotels: 267, image: 'img/98.jpg', link: 'izmir.html', class: 'bottom-right' }
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
let selectedHotel = null;
let selectedPrice = 0;

const openBookingModal = (hotelName, price) => {
    selectedHotel = hotelName;
    selectedPrice = price;
    document.getElementById('resortName').value = hotelName;
    document.getElementById('totalPrice').textContent = `₺${price}`;
    document.getElementById('bookingModal').style.display = 'block';
};

const closeModal = () => {
    document.getElementById('bookingModal').style.display = 'none';
};

window.onclick = (e) => {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

const submitReservation = (event) => {
    event.preventDefault();
    
    const reservation = {
        resortName: document.getElementById('resortName').value,
        guestName: document.getElementById('guestName').value,
        guestEmail: document.getElementById('guestEmail').value,
        guestPhone: document.getElementById('guestPhone').value,
        checkIn: document.getElementById('bookingCheckIn').value,
        checkOut: document.getElementById('bookingCheckOut').value,
        guests: document.getElementById('bookingGuests').value,
        roomType: document.getElementById('roomType').value,
        specialRequests: document.getElementById('specialRequests')?.value || '',
        totalPrice: document.getElementById('totalPrice').textContent,
        status: 'Beklemede',
        id: Date.now()
    };
    
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    closeModal();
    alert('Rezervasyonunuz başarıyla alındı! Rezervasyonlarım sayfasından takip edebilirsiniz.');
    document.getElementById('bookingForm').reset();
};
document.addEventListener('DOMContentLoaded', () => {
    loadTestimonials();
    loadRegions();
});