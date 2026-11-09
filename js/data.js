
// ==========================================
// DATA KATALOG BUKU
// ==========================================

const dataKatalogBuku = [
    {
        id: 1,
        judul: "Laskar Pelangi",
        penulis: "Andrea Hirata",
        kategori: "Novel",
        harga: 85000,
        stok: 20,
        gambar: "img/buku1.png"
    },
    {
        id: 2,
        judul: "Bumi",
        penulis: "Tere Liye",
        kategori: "Fiksi",
        harga: 95000,
        stok: 15,
        gambar: "img/buku2.png"
    },
    {
        id: 3,
        judul: "Atomic Habits",
        penulis: "James Clear",
        kategori: "Pengembangan Diri",
        harga: 110000,
        stok: 12,
        gambar: "img/buku3.png"
    },
    {
        id: 4,
        judul: "Filosofi Teras",
        penulis: "Henry Manampiring",
        kategori: "Filsafat",
        harga: 75000,
        stok: 18,
        gambar: "img/buku4.png"
    },
    {
        id: 5,
        judul: "Negeri 5 Menara",
        penulis: "Ahmad Fuadi",
        kategori: "Novel",
        harga: 90000,
        stok: 10,
        gambar: "img/buku5.png"
    }
];

// ==========================================
// DATA PESANAN DUMMY
// ==========================================

const dataPesanan = [
    {
        id: "DO001",
        nama: "Andi Saputra",
        alamat: "Bekasi",
        telepon: "081234567890",
        items: [
            {
                judul: "Laskar Pelangi",
                harga: 85000,
                jumlah: 2
            }
        ],
        total: 170000,
        pembayaran: "Transfer Bank",
        status: "Diproses"
    },
    {
        id: "DO002",
        nama: "Siti Aminah",
        alamat: "Cikarang",
        telepon: "081298765432",
        items: [
            {
                judul: "Atomic Habits",
                harga: 110000,
                jumlah: 1
            }
        ],
        total: 110000,
        pembayaran: "E-Wallet",
        status: "Selesai"
    }
];

// ==========================================
// DATA PENGIRIMAN DUMMY
// ==========================================

const dataPengiriman = [
    {
        do: "DO001",
        nama: "Andi Saputra",
        status: "Dalam Pengiriman",
        ekspedisi: "JNE",
        tanggal: "08 November 2026",
        paket: "Reguler",
        total: 170000,
        progress: 65
    },
    {
        do: "DO002",
        nama: "Siti Aminah",
        status: "Selesai",
        ekspedisi: "J&T Express",
        tanggal: "07 November 2026",
        paket: "Express",
        total: 110000,
        progress: 100
    }
];
