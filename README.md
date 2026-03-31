# HolidayRez

HolidayRez, Türkiye'deki şehir otellerini keşfetmek ve rezervasyon yönetmek için hazırlanmış bir HTML, CSS ve JavaScript projesidir.

## Özellikler

- Şehir bazlı otel listeleme ve filtreleme
- Rezervasyon oluşturma ve rezervasyon yönetimi
- Favori ve karşılaştırma akışları
- Açık/koyu tema desteği
- Responsive arayüz

## Proje Yapısı

```text
holiday-rezervation/
├── assets/
│   ├── css/
│   │   ├── aboutme.css
│   │   ├── experience.css
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── cities.js
│       ├── experience.js
│       ├── hotels.js
│       ├── login.js
│       ├── signpage.js
│       └── title.js
├── img/
├── aboutme.html
├── city.html
├── index.html
├── login.html
├── reservations.html
├── signpage.html
└── README.md
```

## Kullanılan Teknolojiler

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage
- IndexedDB (rezervasyon senkronu için)

## Kurulum ve Çalıştırma

```bash
git clone https://github.com/umutsadebal1/holiday-rezervation.git
cd holiday-rezervation
```

Projeyi bir statik sunucuyla çalıştır:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Ardından tarayıcıda <http://localhost:8000> adresini aç.

## Kullanım Akışı

1. Ana sayfadan şehir veya ürün seçimi yap.
2. Şehir sayfasında filtreleri kullanarak otelleri daralt.
3. Otel detayından veya karttan rezervasyon oluştur.
4. Rezervasyonlarını reservations.html sayfasında yönet.

## Lisans

Bu proje kişisel kullanım amacıyla hazırlanmıştır.
