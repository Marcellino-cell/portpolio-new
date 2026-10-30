# Marcellino Portfolio V8 — Orbit Motion Fix

## Perbaikan utama
- Seluruh orbit Beranda dipusatkan ke kotak foto yang sama (`inset: 0` + `margin: auto`) dan transform animasi hanya memutar elemen pada titik pusat.
- Tiga titik cahaya berputar pada kecepatan berbeda agar orbit tetap tampak bergerak, bukan seperti lingkaran statis.
- Ikon HTML, CSS, JavaScript, PHP, dan React mengitari foto dengan gerakan berlawanan pada ikon agar tetap tegak.
- Orbit Tentang Saya juga berputar mengitari foto.
- CSS tidak lagi mematikan orbit ketika sistem memakai `prefers-reduced-motion: reduce`; dalam mode tersebut gerakan orbit diperlambat, sementara gerakan mengambang/glow yang dekoratif dikurangi.
- Versi CSS/JS menggunakan cache-busting `v=8` agar browser meminta file baru.

## Isi paket
- `index.html`, `style.css`, `script.js`
- `projects-data.js`
- `project-detail.html`, `project-detail.css`, `project-detail.js`
- `README-portfolio.md`, `QA-REPORT.md`

## Cara memasang
1. Buat cadangan folder website lama.
2. Ekstrak ZIP ini dan salin file V8 ke folder website, mengganti file dengan nama yang sama.
3. Pertahankan folder aset pribadi `foto/`, `project/`, dan `sertifikat/` di lokasi yang sama dengan `index.html`.
4. Buka website melalui VS Code Live Server atau hosting yang digunakan.
5. Lakukan hard refresh dengan `Ctrl + F5` untuk memastikan CSS `v=8` terambil.

## Aset dan URL
- Foto profil utama dibaca dari `foto/foto home.jpeg` dan `foto/foto about.jpeg`.
- Gambar proyek tetap dibaca dari folder `project/`.
- Scan sertifikat dibaca dari folder `sertifikat/` sesuai nama file yang sudah dikonfigurasi di website.
- Isi URL sebenarnya di `projects-data.js` untuk proyek yang akan ditautkan ke website eksternal. Jangan isi URL palsu.
- Jika foto barcode BMI asli tersedia, letakkan pada `project/BMI-barcode.png`. QR fallback memerlukan koneksi internet.

## Catatan pengujian
JavaScript diperiksa dengan `node --check`; CSS diparse dengan `tinycss2`; duplikasi ID dan tautan internal HTML diperiksa; serta beberapa assertion khusus orbit dan cache-busting dijalankan. Pengujian visual browser langsung untuk paket V8 tidak berhasil diselesaikan dalam lingkungan ini, sehingga tetap lakukan pemeriksaan akhir melalui Live Server dengan aset aslimu.
