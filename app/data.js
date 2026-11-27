// data.js — every figure on Statistik Nusantara, in one place.
// All figures are published statistics, each labelled with its source and
// year where it is shown. Nothing here is fetched: the site is static.

export const SITE = {
  name: "Statistik Nusantara",
  tagline: "Portal Statistik Nasional Indonesia",
  office: "Kantor Statistik Nasional Nusantara",
  note: "Situs statis — semua data tersimpan dalam berkas situs dan dimuat tanpa jaringan.",
};

export const HERO = [
  { label: "Penduduk", value: "281,6 jt", detail: "Proyeksi penduduk 2024", source: "BPS, 2024" },
  { label: "PDB", value: "Rp22.139 T", detail: "Produk domestik bruto 2024", source: "BPS, 2024" },
  { label: "Pertumbuhan ekonomi", value: "5,03%", detail: "PDB tumbuh y-on-y, 2024", source: "BPS, 2024" },
  { label: "Inflasi", value: "1,57%", detail: "IHK Desember, y-on-y", source: "BPS, Des 2024" },
  { label: "Pengangguran", value: "4,76%", detail: "Tingkat pengangguran terbuka", source: "BPS, Feb 2025" },
  { label: "Kemiskinan", value: "8,57%", detail: "Penduduk miskin", source: "BPS, Sep 2024" },
];

// Pertumbuhan PDB, % y-on-y (BPS).
export const GDP_GROWTH = [
  { year: 2019, value: 5.02 },
  { year: 2020, value: -2.07 },
  { year: 2021, value: 3.7 },
  { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 },
  { year: 2024, value: 5.03 },
];

// Inflasi Desember, % y-on-y (BPS).
export const INFLATION = [
  { year: 2019, value: 2.72 },
  { year: 2020, value: 1.68 },
  { year: 2021, value: 1.87 },
  { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 },
  { year: 2024, value: 1.57 },
];

// Tingkat pengangguran terbuka, % (BPS).
export const UNEMPLOYMENT = [
  { period: "Feb 2020", value: 4.99 },
  { period: "Agu 2020", value: 7.07 },
  { period: "Feb 2021", value: 6.26 },
  { period: "Agu 2021", value: 6.49 },
  { period: "Feb 2022", value: 5.83 },
  { period: "Agu 2022", value: 5.86 },
  { period: "Feb 2023", value: 5.45 },
  { period: "Agu 2023", value: 5.32 },
  { period: "Feb 2024", value: 4.82 },
  { period: "Agu 2024", value: 4.91 },
  { period: "Feb 2025", value: 4.76 },
];

// Penduduk miskin, % (BPS).
export const POVERTY = [
  { period: "Sep 2020", value: 10.19 },
  { period: "Mar 2021", value: 10.14 },
  { period: "Sep 2021", value: 9.71 },
  { period: "Mar 2022", value: 9.54 },
  { period: "Sep 2022", value: 9.57 },
  { period: "Mar 2023", value: 9.36 },
  { period: "Sep 2023", value: 9.36 },
  { period: "Mar 2024", value: 9.03 },
  { period: "Sep 2024", value: 8.57 },
];

// PDB menurut pengeluaran, pangsa % terhadap PDB 2024 (BPS).
export const EXPENDITURE = [
  { component: "Konsumsi rumah tangga", share: 54.0 },
  { component: "Pembentukan modal tetap bruto", share: 29.3 },
  { component: "Ekspor barang dan jasa", share: 21.5 },
  { component: "Konsumsi pemerintah", share: 7.7 },
  { component: "Impor barang dan jasa", share: -19.9 },
];

export const TRADE = [
  { label: "Ekspor 2024", value: "US$264,70 M", detail: "Nilai ekspor barang", source: "BPS, 2024" },
  { label: "Impor 2024", value: "US$233,66 M", detail: "Nilai impor barang", source: "BPS, 2024" },
  { label: "Surplus dagang", value: "US$31,04 M", detail: "Neraca perdagangan 2024", source: "BPS, 2024" },
  { label: "Cadangan devisa", value: "US$155,7 M", detail: "Posisi akhir Desember 2024", source: "Bank Indonesia, 2024" },
];

// Sepuluh provinsi terbesar, Sensus Penduduk 2020 (BPS). Juta jiwa.
export const PROVINCES = [
  { name: "Jawa Barat", population: 48.27, capital: "Bandung" },
  { name: "Jawa Timur", population: 40.67, capital: "Surabaya" },
  { name: "Jawa Tengah", population: 36.52, capital: "Semarang" },
  { name: "Sumatera Utara", population: 14.8, capital: "Medan" },
  { name: "Banten", population: 11.91, capital: "Serang" },
  { name: "DKI Jakarta", population: 10.56, capital: "Jakarta" },
  { name: "Sulawesi Selatan", population: 9.07, capital: "Makassar" },
  { name: "Lampung", population: 9.01, capital: "Bandar Lampung" },
  { name: "Sumatera Selatan", population: 8.47, capital: "Palembang" },
  { name: "Riau", population: 6.39, capital: "Pekanbaru" },
];

export const CENSUS_TOTAL = 270.2; // Juta jiwa, Sensus Penduduk 2020 (BPS).

// Struktur umur, Sensus Penduduk 2020 (BPS).
export const AGE_GROUPS = [
  { group: "0–14 tahun", share: 24.9, millions: 67.2 },
  { group: "15–64 tahun", share: 70.7, millions: 191.1 },
  { group: "65 tahun ke atas", share: 4.4, millions: 11.9 },
];

export const RELEASES = [
  { date: "5 Feb 2025", title: "Pertumbuhan ekonomi 2024 mencapai 5,03%", detail: "PDB 2024 sebesar Rp22.139 triliun atas dasar harga berlaku.", source: "BPS" },
  { date: "15 Jan 2025", title: "Kemiskinan September 2024 turun ke 8,57%", detail: "Jumlah penduduk miskin 24,06 juta jiwa, turun 1,16 juta dari Maret 2024.", source: "BPS" },
  { date: "5 Mei 2025", title: "Pengangguran Februari 2025 sebesar 4,76%", detail: "Tingkat pengangguran terbuka terendah sejak sebelum pandemi.", source: "BPS" },
  { date: "Jan 2025", title: "Neraca dagang 2024 surplus US$31,04 miliar", detail: "Ekspor US$264,70 miliar dan impor US$233,66 miliar sepanjang 2024.", source: "BPS" },
];

// Full indicator table for the Data & Metode page.
export const INDICATORS = [
  { indicator: "Jumlah penduduk", value: "281,6 juta jiwa", year: "2024", source: "BPS" },
  { indicator: "Jumlah penduduk (sensus)", value: "270,20 juta jiwa", year: "2020", source: "BPS" },
  { indicator: "PDB atas dasar harga berlaku", value: "Rp22.139 triliun", year: "2024", source: "BPS" },
  { indicator: "PDB per kapita", value: "Rp78,6 juta", year: "2024", source: "BPS" },
  { indicator: "Pertumbuhan ekonomi (y-on-y)", value: "5,03%", year: "2024", source: "BPS" },
  { indicator: "Inflasi Desember (y-on-y)", value: "1,57%", year: "2024", source: "BPS" },
  { indicator: "Tingkat pengangguran terbuka", value: "4,76%", year: "Feb 2025", source: "BPS" },
  { indicator: "Penduduk miskin", value: "8,57%", year: "Sep 2024", source: "BPS" },
  { indicator: "Indeks Pembangunan Manusia", value: "75,02", year: "2024", source: "BPS" },
  { indicator: "Angka harapan hidup", value: "71,7 tahun", year: "2023", source: "World Bank" },
  { indicator: "Ekspor barang", value: "US$264,70 miliar", year: "2024", source: "BPS" },
  { indicator: "Impor barang", value: "US$233,66 miliar", year: "2024", source: "BPS" },
  { indicator: "Surplus neraca perdagangan", value: "US$31,04 miliar", year: "2024", source: "BPS" },
  { indicator: "Cadangan devisa", value: "US$155,7 miliar", year: "Des 2024", source: "Bank Indonesia" },
  { indicator: "Kunjungan wisatawan mancanegara", value: "13,90 juta", year: "2024", source: "BPS" },
  { indicator: "Jumlah provinsi", value: "38", year: "2024", source: "Kemendagri" },
  { indicator: "Upah minimum DKI Jakarta", value: "Rp5.396.761", year: "2025", source: "Pemprov DKI Jakarta" },
];
