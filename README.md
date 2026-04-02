# HolidayRez

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-1E3A8A?style=for-the-badge)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-0F766E?style=for-the-badge)

HolidayRez, Turkiye odakli sehir otellerini kesfetme, karsilastirma, favorileme ve rezervasyon yonetimi icin gelistirilmis bir front-end uygulamasidir.

## Icerik

- [Neler Sunuyor?](#neler-sunuyor)
- [2 Dakikada Demo Akisi](#2-dakikada-demo-akisi)
- [Kurulum ve Calistirma](#kurulum-ve-calistirma)
- [Sayfa Haritasi](#sayfa-haritasi)
- [Veri Saklama Mimarisi](#veri-saklama-mimarisi)
- [Proje Yapisi](#proje-yapisi)
- [Gelistirme Notlari](#gelistirme-notlari)
- [Yol Haritasi](#yol-haritasi)
- [Lisans](#lisans)

## Neler Sunuyor?

| Alan | Detay |
| --- | --- |
| Arama ve Kesif | Sekmeli arama akisi (otel/tur/ucak/villa/otobus), populer ve son aramalar, sehir bazli yonlendirme |
| Sehir Sonuc Ekrani | Fiyat, puan, konsept, tema, olanak filtreleri + siralama + liste/harita gorunumu |
| Otel Etkilesimleri | Favoriler, karsilastirma, detay modal, fiyat takvimi, son goruntulenenler |
| Rezervasyon | Cok adimli rezervasyon wizard'i, durum yonetimi, rezervasyon duzenleme/iptal |
| Hesap Alani | Giris/kayit modal akisi, profil ozeti, kuponlar, kayitli aramalar |
| Tema | Acik/Koyu tema secimi ve kalici tercih |

## 2 Dakikada Demo Akisi

Bu bolumu mini checklist gibi kullanabilirsin:

- [ ] Ana sayfada urun sekmesini degistir (Otel/Tur/Ucak).
- [ ] Arama yapip sehir sonuc sayfasina gec.
- [ ] Filtreleri degistir ve harita gorunumunu ac.
- [ ] En az 2 otel secip karsilastirma modalini test et.
- [ ] Bir oteli favorilere ekle.
- [ ] Rezervasyon wizard'i ile yeni rezervasyon olustur.
- [ ] Rezervasyonlarim sayfasinda filtrele, duzenle veya iptal et.

## Kurulum ve Calistirma

```bash
git clone https://github.com/umutsadebal1/holiday-rezervation.git
cd holiday-rezervation
```

Statik sunucu ile calistir:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Sonrasinda tarayicida su adresi ac:

<http://localhost:8000>

## Sayfa Haritasi

<!-- markdownlint-disable MD033 -->
<details open>
  <summary><strong>Ana Sayfa - index.html</strong></summary>

- Hero slider, kampanya sayaci ve kampanya merkezi
- Sekmeli urun arama kutusu ve akilli yonlendirme
- Son goruntulenenler, kisisellestirilmis oneriler, iletisim formu

</details>

<details>
  <summary><strong>Sehir Sonuc - city.html</strong></summary>

- Gelismis filtreleme/siralama paneli
- Otel kartlari, favori ve karsilastirma akislari
- Harita gorunumu, yorumlar ve son goruntulenenler

</details>

<details>
  <summary><strong>Rezervasyon Yonetimi - reservations.html</strong></summary>

- Onay / Yaklasan / Gecmis / Iptal / Tumu sekmeleri
- Ozet kartlari, detay-duzenleme modal'i, toplu temizleme

</details>

<details>
  <summary><strong>Kimlik ve Profil Akislari</strong></summary>

- login.html, signpage.html, modal tabanli giris/kayit
- Header user menu: profil, kuponlar, kayitli aramalar

</details>
<!-- markdownlint-enable MD033 -->

## Veri Saklama Mimarisi

Uygulama backend olmadan, istemci tarafli depolama ile calisir:

- `localStorage`
  - tema tercihi
  - auth session ve temel kullanici bilgisi
  - favoriler / karsilastirma / son aramalar / rezervasyon listesi
- `IndexedDB`
  - rezervasyon kayitlari icin ikinci katman (dual-write)
  - rezervasyon verilerinin senkronize edilmesi

Bu yapi sayesinde uygulama tamamen statik olarak calisirken rezervasyon verisi tarayici tarafinda kalici tutulur.

## Proje Yapisi

```text
holiday-rezervation/
|-- assets/
|   |-- css/
|   |   |-- aboutme.css
|   |   |-- experience.css
|   |   `-- styles.css
|   `-- js/
|       |-- app.js
|       |-- cities.js
|       |-- experience.js
|       |-- hotels.js
|       |-- login.js
|       |-- signpage.js
|       `-- title.js
|-- img/
|-- aboutme.html
|-- city.html
|-- index.html
|-- login.html
|-- reservations.html
|-- signpage.html
`-- README.md
```

## Gelistirme Notlari

- Projede CSP (Content-Security-Policy) aktif; inline script yerine harici JS dosyalari kullanilir.
- Kod yapisi vanilla JavaScript odaklidir, framework bagimliligi yoktur.
- UI davranislari agirlikli olarak `assets/js/app.js` ve `assets/js/experience.js` icinde toplanmistir.

## Yol Haritasi

- [ ] Gercek API entegrasyonu (otel/veri kaynagi)
- [ ] Coklu kullanici ve guvenli auth altyapisi
- [ ] Test otomasyonu (unit + e2e)
- [ ] CI pipeline ve release notlari

## Lisans

Bu proje kisisel gelisim ve portfolyo amacli hazirlanmistir.
