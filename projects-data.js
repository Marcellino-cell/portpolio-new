/*
 * SHARED PROJECT CATALOG
 * Add each published website address in `url` to make the portfolio's
 * "Lihat Detail" button open that live website directly.
 * For locally hosted projects, a relative path such as "projects/inventory/index.html" works too.
 *
 * BMI accepts an optional real barcode/photo at `project/BMI-barcode.png`.
 * If the image is absent, the BMI detail page generates a QR-code image for the configured URL
 * (or for the BMI detail page itself while no live URL is configured).
 */
(function () {
    "use strict";

    window.PORTFOLIO_PROJECTS = [
        {
            index: 0,
            slug: "website-portfolio",
            title: "Website Portfolio",
            image: "project/portopolio.jpeg",
            category: "website",
            url: "",
            barcodeImage: "",
            tags: ["HTML", "CSS", "JavaScript", "UI/UX"],
            description: "Website portfolio pribadi dengan desain modern, responsif, dan interaktif untuk menampilkan profil, keterampilan, pengalaman, pendidikan, dan proyek."
        },
        {
            index: 1,
            slug: "web-report-industri",
            title: "Web Report Industri",
            image: "project/web industri.jpg",
            category: "website",
            url: "",
            barcodeImage: "",
            tags: ["HTML", "CSS", "JavaScript", "Service Report"],
            description: "Web Report Before & After Service untuk membantu dokumentasi kondisi mesin sebelum dan sesudah servis agar laporan lebih rapi dan terstruktur."
        },
        {
            index: 2,
            slug: "desain-grafis-industri",
            title: "Desain Grafis Industri",
            image: "project/Desain Grafis.jpg",
            category: "design",
            url: "",
            barcodeImage: "",
            tags: ["Graphic Design", "Visual Design"],
            description: "Pembuatan desain grafis untuk kebutuhan promosi dan branding perusahaan dengan memperhatikan komposisi, estetika, dan identitas visual."
        },
        {
            index: 3,
            slug: "sistem-inventaris-it",
            title: "Sistem InventarisIT",
            image: "project/InventarisKu.png",
            category: "app",
            url: "",
            barcodeImage: "",
            tags: ["JavaScript", "CRUD", "Database"],
            description: "Aplikasi pengelolaan inventaris barang untuk membantu pencatatan, melihat, mengubah, dan mengelola data barang secara terstruktur."
        },
        {
            index: 4,
            slug: "bmi-health-tracker",
            title: "BMI Health Tracker",
            image: "project/BMI.jpeg",
            category: "app",
            url: "",
            barcodeImage: "project/BMI-barcode.png",
            tags: ["React Native", "Expo", "BMI"],
            description: "Aplikasi penghitung Body Mass Index berdasarkan tinggi dan berat badan, dilengkapi kategori BMI serta pengembangan fitur aktivitas dan estimasi kalori."
        },
        {
            index: 5,
            slug: "database-inventori",
            title: "Database Inventori",
            image: "project/basisdata.PNG",
            category: "database",
            url: "",
            barcodeImage: "",
            tags: ["MySQL", "SQL", "Database Design"],
            description: "Database inventori untuk mengelola aset melalui tabel barang, kategori, lokasi, kondisi, serta tabel users sebagai pengontrol hak akses pengguna."
        },
        {
            index: 6,
            slug: "dompet-digital-sumatra",
            title: "Dompet Digital Sumatra",
            image: "project/dompet-digital-sumatra.png",
            category: "app",
            url: "",
            barcodeImage: "",
            tags: ["UI/UX", "JavaScript", "Digital Wallet"],
            description: "Proyek antarmuka dompet digital dengan tampilan saldo, riwayat transaksi, serta navigasi fitur keuangan yang terstruktur dan mudah dipahami."
        },
        {
            index: 7,
            slug: "website-anniversary",
            title: "Website Anniversary",
            image: "project/website-anniversary.png",
            category: "website",
            url: "",
            barcodeImage: "",
            tags: ["HTML", "CSS", "JavaScript", "Animation"],
            description: "Website anniversary dengan desain personal, animasi interaktif, tipografi dekoratif, dan elemen visual untuk menciptakan pengalaman digital yang berkesan."
        }
    ];
})();
