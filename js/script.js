
// ==========================================
// 1. FUNGSI DATA DAN FORMAT RUPIAH
// ==========================================

function formatRupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

function ambilData(key, dataAwal) {
    const data = localStorage.getItem(key);

    return data
        ? JSON.parse(data)
        : JSON.parse(JSON.stringify(dataAwal));
}

function simpanData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ==========================================
// 2. LOGIN DAN LOGOUT
// ==========================================

function prosesLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (
        email === "admin@gmail.com" &&
        password === "12345"
    ) {
        localStorage.setItem("statusLogin", "aktif");

        window.location.href = "dashboard.html";
    } else {
        alert("email/password yang anda masukkan salah");
    }
}

function cekLogin() {
    if (localStorage.getItem("statusLogin") !== "aktif") {
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("statusLogin");

    window.location.href = "index.html";
}

// ==========================================
// 3. MODAL LUPA PASSWORD DAN DAFTAR
// ==========================================

function bukaModal(id) {
    document.getElementById(id).style.display = "flex";
}

function tutupModal(id) {
    document.getElementById(id).style.display = "none";
}

// ==========================================
// 4. GREETING DASHBOARD
// ==========================================

function tampilGreeting() {
    const greeting = document.getElementById("greeting");

    if (!greeting) return;

    const jam = new Date().getHours();
    let sapaan;

    if (jam < 11) {
        sapaan = "Selamat Pagi";
    } else if (jam < 15) {
        sapaan = "Selamat Siang";
    } else if (jam < 18) {
        sapaan = "Selamat Sore";
    } else {
        sapaan = "Selamat Malam";
    }

    greeting.textContent =
        sapaan + ", Selamat Datang di BookStore!";
}

// ==========================================
// 5. KATALOG DAN STOK BUKU
// ==========================================

function ambilKatalog() {
    return ambilData("katalogBuku", dataKatalogBuku);
}

function tampilStok() {
    const tabel = document.getElementById("tabelStok");

    if (!tabel) return;

    const buku = ambilKatalog();

    tabel.innerHTML = "";

    buku.forEach((item, index) => {
        tabel.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>
                    <img src="${item.gambar || ''}"
                    class="book-image"
                    alt="Buku ${item.judul}"
                    onerror="this.style.display='none'">
                </td>
                <td>${item.judul}</td>
                <td>${item.penulis}</td>
                <td>${item.kategori}</td>
                <td>${formatRupiah(item.harga)}</td>
                <td>${item.stok}</td>
                <td>
                    <button class="btn-danger btn-small"
                    onclick="hapusStok(${index})">
                    Hapus
                    </button>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// 6. TAMBAH STOK BUKU
// ==========================================

function tambahStok(event) {
    event.preventDefault();

    const judul = document.getElementById("judul").value.trim();
    const penulis = document.getElementById("penulis").value.trim();
    const kategori = document.getElementById("kategori").value;
    const harga = Number(document.getElementById("harga").value);
    const stok = Number(document.getElementById("stok").value);

    if (
        !judul ||
        !penulis ||
        !kategori ||
        !Number.isFinite(harga) ||
        harga <= 0 ||
        !Number.isInteger(stok) ||
        stok < 0
    ) {
        alert("Silakan masukkan data buku dengan benar!");
        return;
    }

    const buku = ambilKatalog();

    buku.push({
        id: Date.now(),
        judul: judul,
        penulis: penulis,
        kategori: kategori,
        harga: harga,
        stok: stok,
        gambar: ""
    });

    simpanData("katalogBuku", buku);

    alert("Buku berhasil ditambahkan!");

    event.target.reset();

    tampilStok();
    tampilPilihanBuku();
}

// ==========================================
// 7. HAPUS STOK BUKU
// ==========================================

function hapusStok(index) {
    const konfirmasi = confirm(
        "Apakah Anda yakin ingin menghapus buku ini?"
    );

    if (!konfirmasi) return;

    const buku = ambilKatalog();

    buku.splice(index, 1);

    simpanData("katalogBuku", buku);

    tampilStok();
    tampilPilihanBuku();
}

// ==========================================
// 8. KERANJANG PEMESANAN
// ==========================================

function ambilKeranjang() {
    return ambilData("keranjangBuku", []);
}

function tampilPilihanBuku() {
    const select = document.getElementById("pilihBuku");

    if (!select) return;

    const buku = ambilKatalog();

    select.innerHTML = '<option value="">Pilih Buku</option>';

    buku.forEach(item => {
        if (item.stok > 0) {
            select.innerHTML += `
                <option value="${item.id}">
                    ${item.judul} - ${formatRupiah(item.harga)}
                    (Stok: ${item.stok})
                </option>
            `;
        }
    });
}

// ==========================================
// 9. TAMBAH BUKU KE KERANJANG
// ==========================================

function tambahKeranjang() {
    const id = document.getElementById("pilihBuku").value;
    const jumlah = Number(document.getElementById("jumlah").value);

    const buku = ambilKatalog();

    const item = buku.find(b => String(b.id) === id);

    if (!item) {
        alert("Silakan pilih buku terlebih dahulu!");
        return;
    }

    if (!Number.isInteger(jumlah) || jumlah < 1) {
        alert("Jumlah buku tidak valid!");
        return;
    }

    const keranjang = ambilKeranjang();

    const sudahAda = keranjang.find(
        b => String(b.id) === String(item.id)
    );

    const jumlahBaru = sudahAda
        ? sudahAda.jumlah + jumlah
        : jumlah;

    if (jumlahBaru > item.stok) {
        alert("Jumlah melebihi stok buku yang tersedia!");
        return;
    }

    if (sudahAda) {
        sudahAda.jumlah = jumlahBaru;
    } else {
        keranjang.push({
            id: item.id,
            judul: item.judul,
            harga: item.harga,
            jumlah: jumlah
        });
    }

    simpanData("keranjangBuku", keranjang);

    document.getElementById("jumlah").value = 1;

    tampilKeranjang();

    alert("Buku berhasil ditambahkan ke keranjang!");
}

// ==========================================
// 10. MENAMPILKAN KERANJANG
// ==========================================

function tampilKeranjang() {
    const tabel = document.getElementById("tabelKeranjang");

    if (!tabel) return;

    const keranjang = ambilKeranjang();

    tabel.innerHTML = "";

    keranjang.forEach((item, index) => {
        tabel.innerHTML += `
            <tr>
                <td>${item.judul}</td>
                <td>${formatRupiah(item.harga)}</td>
                <td>
                    <input type="number"
                    min="1"
                    value="${item.jumlah}"
                    onchange="ubahJumlah(${index}, this.value)"
                    style="width:80px">
                </td>
                <td>${formatRupiah(item.harga * item.jumlah)}</td>
                <td>
                    <button class="btn-danger btn-small"
                    onclick="hapusKeranjang(${index})">
                    Hapus
                    </button>
                </td>
            </tr>
        `;
    });

    hitungTotal();
}

// ==========================================
// 11. UBAH JUMLAH PESANAN
// ==========================================

function ubahJumlah(index, nilai) {
    const jumlah = Number(nilai);
    const keranjang = ambilKeranjang();
    const buku = ambilKatalog();

    const item = keranjang[index];

    const stokBuku = buku.find(
        b => String(b.id) === String(item.id)
    );

    if (
        !Number.isInteger(jumlah) ||
        jumlah < 1 ||
        !stokBuku ||
        jumlah > stokBuku.stok
    ) {
        alert("Jumlah tidak valid atau stok tidak mencukupi!");
        tampilKeranjang();
        return;
    }

    item.jumlah = jumlah;

    simpanData("keranjangBuku", keranjang);

    tampilKeranjang();
}

// ==========================================
// 12. HAPUS BUKU DARI KERANJANG
// ==========================================

function hapusKeranjang(index) {
    const keranjang = ambilKeranjang();

    keranjang.splice(index, 1);

    simpanData("keranjangBuku", keranjang);

    tampilKeranjang();
}

// ==========================================
// 13. HITUNG TOTAL PEMBAYARAN
// ==========================================

function hitungTotal() {
    const keranjang = ambilKeranjang();

    const total = keranjang.reduce(
        (jumlah, item) => jumlah + item.harga * item.jumlah,
        0
    );

    const output = document.getElementById("total");

    if (output) {
        output.textContent = formatRupiah(total);
    }
}

// ==========================================
// 14. PROSES CHECKOUT
// ==========================================

function prosesPesanan(event) {
    event.preventDefault();

    const nama = document.getElementById("namaPemesan").value.trim();
    const alamat = document.getElementById("alamat").value.trim();
    const telepon = document.getElementById("telepon").value.trim();
    const pembayaran = document.getElementById("pembayaran").value;

    if (!nama || !alamat || !telepon || !pembayaran) {
        alert("Silakan lengkapi informasi pemesan!");
        return;
    }

    if (!/^[0-9]{10,15}$/.test(telepon)) {
        alert("Nomor telepon harus 10 sampai 15 digit!");
        return;
    }

    const keranjang = ambilKeranjang();

    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const buku = ambilKatalog();

    // CEK KETERSEDIAAN STOK
    for (const pesanan of keranjang) {
        const item = buku.find(
            b => String(b.id) === String(pesanan.id)
        );

        if (!item || pesanan.jumlah > item.stok) {
            alert("Stok buku " + pesanan.judul + " tidak mencukupi!");
            return;
        }
    }

    // MENGHITUNG TOTAL
    const total = keranjang.reduce(
        (jumlah, item) => jumlah + item.harga * item.jumlah,
        0
    );

    const nomorDO = "DO" + Date.now().toString().slice(-8);

    // MENGURANGI STOK
    keranjang.forEach(pesanan => {
        const item = buku.find(
            b => String(b.id) === String(pesanan.id)
        );

        item.stok -= pesanan.jumlah;
    });

    // MENYIMPAN PESANAN
    const pesanan = ambilData("pesananBuku", dataPesanan);
    const pengiriman = ambilData("pengirimanBuku", dataPengiriman);

    pesanan.push({
        id: nomorDO,
        nama: nama,
        alamat: alamat,
        telepon: telepon,
        items: keranjang.map(item => ({...item})),
        total: total,
        pembayaran: pembayaran,
        status: "Diproses"
    });

    // MENYIMPAN PENGIRIMAN
    pengiriman.push({
        do: nomorDO,
        nama: nama,
        status: "Pesanan Diproses",
        ekspedisi: "JNE",
        tanggal: new Date().toLocaleDateString("id-ID"),
        paket: "Reguler",
        total: total,
        progress: 20
    });

    simpanData("katalogBuku", buku);
    simpanData("pesananBuku", pesanan);
    simpanData("pengirimanBuku", pengiriman);
    simpanData("keranjangBuku", []);

    // MENAMPILKAN HASIL
    document.getElementById("hasilPesanan").innerHTML = `
        <div class="card">
            <h2>Pesanan Berhasil!</h2>
            <p>Nomor Delivery Order: <b>${nomorDO}</b></p>
            <p>Nama Pemesan: ${nama}</p>
            <p>Total Pembayaran: ${formatRupiah(total)}</p>
            <p>Metode Pembayaran: ${pembayaran}</p>
            <br>
            <p>Simpan nomor DO untuk melakukan tracking.</p>
        </div>
    `;

    event.target.reset();

    tampilKeranjang();
    tampilPilihanBuku();
    tampilStok();
}

// ==========================================
// 15. TRACKING PENGIRIMAN
// ==========================================

function cariPengiriman() {
    const nomor = document.getElementById("nomorDO").value.trim();

    const pengiriman = ambilData(
        "pengirimanBuku",
        dataPengiriman
    );

    const hasil = pengiriman.find(
        item => item.do.toLowerCase() === nomor.toLowerCase()
    );

    const output = document.getElementById("hasilTracking");

    if (!hasil) {
        output.innerHTML = `
            <div class="card">
                <p>Nomor Delivery Order tidak ditemukan!</p>
            </div>
        `;
        return;
    }

    output.innerHTML = `
        <div class="card">
            <h2>Informasi Pengiriman</h2>

            <p><b>Nomor DO:</b> ${hasil.do}</p>
            <p><b>Nama Pemesan:</b> ${hasil.nama}</p>
            <p><b>Status:</b> <span class="status">${hasil.status}</span></p>

            <div class="progress">
                <div class="progress-bar"
                style="width:${hasil.progress}%"></div>
            </div>

            <p>Progress Pengiriman: ${hasil.progress}%</p>

            <br>

            <p><b>Ekspedisi:</b> ${hasil.ekspedisi}</p>
            <p><b>Tanggal Kirim:</b> ${hasil.tanggal}</p>
            <p><b>Jenis Paket:</b> ${hasil.paket}</p>
            <p><b>Total Pembayaran:</b> ${formatRupiah(hasil.total)}</p>
        </div>
    `;
}

// ==========================================
// 16. LAPORAN PEMESANAN
// ==========================================

function tampilLaporan() {
    const tabel = document.getElementById("tabelLaporan");

    if (!tabel) return;

    const pesanan = ambilData("pesananBuku", dataPesanan);

    tabel.innerHTML = "";

    pesanan.forEach(item => {
        const daftarBuku = item.items
            ? item.items.map(b => b.judul + " (" + b.jumlah + ")").join(", ")
            : item.buku;

        tabel.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.nama}</td>
                <td>${daftarBuku}</td>
                <td>${formatRupiah(item.total)}</td>
                <td>${item.status}</td>
            </tr>
        `;
    });
}

// ==========================================
// 17. HISTORY TRANSAKSI
// ==========================================

function tampilHistori() {
    const tabel = document.getElementById("tabelHistori");

    if (!tabel) return;

    const pesanan = ambilData("pesananBuku", dataPesanan);

    tabel.innerHTML = "";

    pesanan.forEach(item => {
        const daftarBuku = item.items
            ? item.items.map(b => b.judul).join(", ")
            : item.buku;

        tabel.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.nama}</td>
                <td>${daftarBuku}</td>
                <td>${formatRupiah(item.total)}</td>
                <td>${item.pembayaran || "-"}</td>
            </tr>
        `;
    });
}

// ==========================================
// 18. MENJALANKAN FUNGSI SAAT HALAMAN DIBUKA
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    tampilGreeting();
    tampilStok();
    tampilPilihanBuku();
    tampilKeranjang();
    tampilLaporan();
    tampilHistori();
});
