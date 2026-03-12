const t = document.getElementById("themeToggle");

// Tema kontrolü
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  if (t) t.textContent = "☀️";
}

if (t) {
    t.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      t.textContent = isDark ? "☀️" : "🌙";
    });
}


// Otel verileri
const h = [
  {
    name: "Kale Otel Diyarbakır",
    image: "img/67.jpg",
    rating: 4.7,
    price: 1100,
    features: ["Kale", "Manzara", "Balkon", "Tarihi"]
  },
  {
    name: "Dicle Heritage Hotel",
    image: "img/90.jpg",
    rating: 4.6,
    price: 1000,
    features: ["Kaliteli", "Restaurant", "Bahçe", "Konfor"]
  },
  {
    name: "Mesopotamia Boutique",
    image: "img/91.jpg",
    rating: 4.5,
    price: 950,
    features: ["Lüks", "Modern", "Tasarım", "Safe"]
  },
  {
    name: "Dicle Riverside Inn",
    image: "img/92.jpg",
    rating: 4.4,
    price: 850,
    features: ["Nəhr", "Terasa", "Sakin", "Güzel"]
  },
  {
    name: "Antik Diyarbakır Konak",
    image: "img/93.jpg",
    rating: 4.8,
    price: 1250,
    features: ["Restorasyon", "Geleneksel", "Özgün", "Romantik"]
  },
  {
    name: "Tur Merkezi Hotel",
    image: "img/94.jpg",
    rating: 4.3,
    price: 900,
    features: ["Turizm", "Bilgi", "Rehber", "Tur"]
  },
  {
    name: "Sur Çatı Otel",
    image: "img/95.jpg",
    rating: 4.6,
    price: 1150,
    features: ["Surlar", "Gözlem", "Fotoğraf", "İkonodik"]
  },
  {
    name: "Dicle Palace Resort",
    image: "img/96.jpg",
    rating: 4.5,
    price: 1050,
    features: ["Resort", "Havuz", "SPA", "Aktivite"]
  }
];


// Otelleri yükleme
function loadHotels() {
  const g = document.getElementById("hotelsGrid");

  g.innerHTML = h.map(x => `
    <div class="hotel-card">
      <img src="${x.image}" alt="${x.name}" onerror="this.src='img/67.jpg'">
      
      <div class="hotel-info">
        <h3 class="hotel-name">${x.name}</h3>

        <div class="hotel-rating">
          ${"⭐".repeat(Math.floor(x.rating))}${x.rating}
        </div>

        <div class="hotel-price">
          ₺${x.price}/gece
        </div>

        <ul class="hotel-features">
          ${x.features.map(f => `<li>${f}</li>`).join("")}
        </ul>

        <button class="btn-book"
          onclick="openBooking('${x.name}', ${x.price})">
          Rezervasyon
        </button>
      </div>
    </div>
  `).join("");
}


const m = document.getElementById("bookingModal");
let p = 0;


// Rezervasyon açma
function openBooking(name, price) {
  p = price;
  document.getElementById("resortName").value = name;
  updateTotalPrice();
  m.style.display = "block";
}

function closeModal() {
  m.style.display = "none";
}


// Toplam fiyat hesaplama
function updateTotalPrice() {
  const ci = new Date(document.getElementById("bookingCheckIn").value);
  const co = new Date(document.getElementById("bookingCheckOut").value);

  if (ci && co && ci < co) {
    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));

    const multiplier = {
      Standard: 1,
      Deluxe: 1.3,
      Suite: 1.6,
      Villa: 2
    };

    const total = Math.round(
      p * (multiplier[document.getElementById("roomType").value] || 1) * nights
    );

    document.getElementById("totalPrice").textContent =
      "₺" + total.toLocaleString("tr-TR");
  }
}


// Sayfa yüklendiğinde
document.addEventListener("DOMContentLoaded", () => {
  loadHotels();

  ["bookingCheckIn", "bookingCheckOut", "roomType"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", updateTotalPrice);
  });
});


// Rezervasyon gönderme
function submitReservation(e) {
  e.preventDefault();

  const r = {
    id: Date.now(),
    resortName: document.getElementById("resortName").value,
    guestName: document.getElementById("guestName").value,
    guestEmail: document.getElementById("guestEmail").value,
    guestPhone: document.getElementById("guestPhone").value,
    checkIn: document.getElementById("bookingCheckIn").value,
    checkOut: document.getElementById("bookingCheckOut").value,
    guests: document.getElementById("bookingGuests").value,
    roomType: document.getElementById("roomType").value,
    specialRequests: document.getElementById("specialRequests").value,
    totalPrice: document.getElementById("totalPrice").textContent,
    status: "Onaylandı",
    bookingDate: new Date().toLocaleDateString("tr-TR")
  };

  let res = JSON.parse(localStorage.getItem("reservations")) || [];
  res.push(r);
  localStorage.setItem("reservations", JSON.stringify(res));

  alert(`Başarılı! ${r.id}`);
  closeModal();
  document.getElementById("bookingForm").reset();
}