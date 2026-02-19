let bahanList = [];

// Cek siapa yang login
let loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
  alert("Anda belum login!");
  window.location.href = "login.html";
}

// tampilkan nama karyawan
document.getElementById("userLogin").innerText = "Karyawan: " + loggedInUser;

// key transaksi khusus per user
const transaksiKey = "dataTransaksi_" + loggedInUser;

// ambil data transaksi sesuai user
let dataTransaksi = JSON.parse(localStorage.getItem(transaksiKey)) || [];

// Format Rupiah
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Tambah bahan
function tambahBahan() {
  const namaBahan = document.getElementById("namaBahan").value.trim();
  const jumlahBahan = parseFloat(document.getElementById("jumlahBahan").value);
  const hargaBahan = parseFloat(document.getElementById("hargaBahan").value);

  if (!namaBahan || isNaN(jumlahBahan) || isNaN(hargaBahan)) {
    alert("Isi nama bahan, jumlah, dan harga per bahan dengan benar!");
    return;
  }

  const subtotal = jumlahBahan * hargaBahan;

  bahanList.push({
    namaBahan,
    jumlahBahan,
    hargaBahan,
    subtotal
  });

  document.getElementById("namaBahan").value = "";
  document.getElementById("jumlahBahan").value = "";
  document.getElementById("hargaBahan").value = "";

  renderBahan();
}

// Render bahan
function renderBahan() {
  const list = document.getElementById("listBahan");
  list.innerHTML = "";

  let total = 0;

  bahanList.forEach((b, index) => {
    total += b.subtotal;

    const div = document.createElement("div");
    div.className = "item-bahan";

    div.innerHTML = `
      <span><b>${b.namaBahan}</b> (${b.jumlahBahan} x ${formatRupiah(b.hargaBahan)})</span>
      <span>${formatRupiah(b.subtotal)}</span>
      <button onclick="hapusBahan(${index})">Hapus</button>
    `;

    list.appendChild(div);
  });

  document.getElementById("totalSementara").innerText = formatRupiah(total);
}

// Hapus bahan
function hapusBahan(index) {
  bahanList.splice(index, 1);
  renderBahan();
}

// Simpan transaksi
function simpanTransaksi() {
  const tanggal = document.getElementById("tanggal").value;
  const nama = document.getElementById("nama").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const barang = document.getElementById("barang").value.trim();

  if (!tanggal || !nama || !alamat || !barang) {
    alert("Isi semua data transaksi!");
    return;
  }

  if (bahanList.length === 0) {
    alert("Tambahkan minimal 1 bahan sebelum simpan transaksi!");
    return;
  }

  let totalHarga = bahanList.reduce((acc, b) => acc + b.subtotal, 0);

  const transaksi = {
    tanggal,
    nama,
    alamat,
    barang,
    bahanList: [...bahanList],
    totalHarga
  };

  dataTransaksi.push(transaksi);

  localStorage.setItem(transaksiKey, JSON.stringify(dataTransaksi));

  batalSemuaData();

  renderTabel(dataTransaksi);
  hitungTotalPendapatan();

  alert("Transaksi berhasil disimpan!");
}

// Render tabel
function renderTabel(data) {
  const tabel = document.getElementById("tabelData");
  tabel.innerHTML = "";

  data.forEach((t, index) => {
    const rincianBahan = t.bahanList
      .map(b => `${b.namaBahan} (${b.jumlahBahan} x ${formatRupiah(b.hargaBahan)})`)
      .join(", ");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${t.tanggal}</td>
      <td>${t.nama}</td>
      <td>${t.alamat}</td>
      <td>${t.barang}</td>
      <td>${rincianBahan}</td>
      <td><b>${formatRupiah(t.totalHarga)}</b></td>
      <td><button class="btn-hapus" onclick="hapusTransaksi(${index})">Hapus</button></td>
    `;

    tabel.appendChild(row);
  });
}

// Hapus transaksi tertentu
function hapusTransaksi(index) {
  if (confirm("Yakin ingin menghapus transaksi ini?")) {
    dataTransaksi.splice(index, 1);
    localStorage.setItem(transaksiKey, JSON.stringify(dataTransaksi));
    renderTabel(dataTransaksi);
    hitungTotalPendapatan();
  }
}

// Cari data
function cariData() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();

  if (!keyword) {
    renderTabel(dataTransaksi);
    return;
  }

  const hasil = dataTransaksi.filter(t => t.nama.toLowerCase().includes(keyword));
  renderTabel(hasil);
}

// Hapus semua data transaksi user ini
function hapusSemuaData() {
  if (confirm("Yakin ingin menghapus semua riwayat transaksi akun ini?")) {
    dataTransaksi = [];
    localStorage.removeItem(transaksiKey);
    renderTabel(dataTransaksi);
    hitungTotalPendapatan();
    alert("Semua riwayat transaksi berhasil dihapus!");
  }
}

// Reset input saja (tidak hapus riwayat)
function batalSemuaData() {
  document.getElementById("tanggal").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("alamat").value = "";
  document.getElementById("barang").value = "";

  document.getElementById("namaBahan").value = "";
  document.getElementById("jumlahBahan").value = "";
  document.getElementById("hargaBahan").value = "";

  bahanList = [];
  renderBahan();
}

// Hitung total pendapatan user ini
function hitungTotalPendapatan() {
  let totalPendapatan = dataTransaksi.reduce((acc, t) => acc + t.totalHarga, 0);
  document.getElementById("totalPendapatan").innerText = formatRupiah(totalPendapatan);
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// saat web dibuka
renderTabel(dataTransaksi);
hitungTotalPendapatan();
renderBahan();
