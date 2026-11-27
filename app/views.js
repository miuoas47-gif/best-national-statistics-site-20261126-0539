// views.js — hash router and one renderer per page. Every control on the
// site is wired here: chart ranges, chart type, sortable tables, the
// province selector, the indicator search and the CSV download.

import {
  AGE_GROUPS,
  CENSUS_TOTAL,
  EXPENDITURE,
  GDP_GROWTH,
  HERO,
  INDICATORS,
  INFLATION,
  POVERTY,
  PROVINCES,
  RELEASES,
  SITE,
  TRADE,
  UNEMPLOYMENT,
} from "./data.js";
import { barChart, lineChart, shareBars } from "./charts.js";

const mount = document.getElementById("view");
const navLinks = Array.from(document.querySelectorAll("nav.mainnav a"));

// Page state, kept across re-renders within one visit.
let econFrom = 2019;
let priceChart = "bar";
let provinceSort = { key: "population", dir: -1 };
let selectedProvince = "Jawa Barat";
let indicatorQuery = "";

function sourceLine(source) {
  return `<p class="source">Sumber: ${source}.</p>`;
}

function statCards(cards) {
  return `<div class="cards">${cards
    .map(
      (c) =>
        `<div class="card"><div class="label">${c.label}</div>` +
        `<div class="value">${c.value}</div><div class="detail">${c.detail}</div>` +
        `<div class="src">Sumber: ${c.source}</div></div>`,
    )
    .join("")}</div>`;
}

function route() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return hash.split("/")[0] || "";
}

function setActiveNav(current) {
  for (const a of navLinks) {
    const target = a.getAttribute("href").replace(/^#\/?/, "");
    a.classList.toggle("active", target === current);
  }
}

function gdpPoints(fromYear) {
  return GDP_GROWTH.filter((p) => p.year >= fromYear).map((p) => ({
    label: String(p.year),
    value: p.value,
  }));
}

function renderOverview() {
  const releases = RELEASES.map(
    (r) =>
      `<li><div class="date">${r.date} · ${r.source}</div>` +
      `<div class="title">${r.title}</div><div class="detail">${r.detail}</div></li>`,
  ).join("");
  return `
    <p class="kicker">Beranda · Home</p>
    <h1>Indonesia dalam angka</h1>
    <p class="lede">Enam angka utama, grafik pertumbuhan, dan rilis terbaru dari
    ${SITE.office} — semua angka di halaman ini disertai sumber dan tahunnya.</p>
    ${statCards(HERO)}
    <div class="panel">
      <h2>Pertumbuhan ekonomi 2019–2024</h2>
      ${barChart(gdpPoints(2019), { label: "Pertumbuhan PDB 2019–2024, persen per tahun" })}
      ${sourceLine("BPS, pertumbuhan PDB y-on-y")}
    </div>
    <div class="panel">
      <h2>Rilis terbaru</h2>
      <ul class="releases">${releases}</ul>
    </div>
    <div class="panel">
      <h2>Jelajahi data</h2>
      <div class="quicklinks">
        <a href="#/ekonomi"><strong>Ekonomi</strong><span>PDB, pengeluaran, dan perdagangan 2024.</span></a>
        <a href="#/penduduk"><strong>Penduduk</strong><span>Sepuluh provinsi terbesar dan struktur umur.</span></a>
        <a href="#/harga-tenaga-kerja"><strong>Harga &amp; Tenaga Kerja</strong><span>Inflasi, pengangguran, dan kemiskinan.</span></a>
        <a href="#/data"><strong>Data &amp; Metode</strong><span>Semua indikator, cari, dan unduh CSV.</span></a>
      </div>
    </div>`;
}

function renderEconomy() {
  const trade = statCards(TRADE);
  return `
    <p class="kicker">Ekonomi · Economy</p>
    <h1>Ekonomi Indonesia</h1>
    <p class="lede">PDB 2024 sebesar Rp22.139 triliun dan tumbuh 5,03% — pertumbuhan
    ditopang konsumsi rumah tangga dan investasi.</p>
    <div class="panel">
      <h2>Pertumbuhan PDB</h2>
      <div class="controls" role="group" aria-label="Rentang tahun">
        <span class="ctl-label">Rentang:</span>
        <button type="button" data-range="2019" class="${econFrom === 2019 ? "on" : ""}">2019–2024</button>
        <button type="button" data-range="2021" class="${econFrom === 2021 ? "on" : ""}">2021–2024</button>
      </div>
      ${barChart(gdpPoints(econFrom), { label: "Pertumbuhan PDB, persen per tahun" })}
      ${sourceLine("BPS, pertumbuhan PDB y-on-y")}
      <p class="note">Tahun 2020 mencatat kontraksi −2,07% saat pandemi Covid-19;
      sejak 2022 pertumbuhan kembali di atas 5% setiap tahun.</p>
    </div>
    <div class="panel">
      <h2>PDB menurut pengeluaran, 2024</h2>
      ${shareBars(EXPENDITURE, { label: "Pangsa komponen PDB 2024" })}
      ${sourceLine("BPS, 2024. Sisa 7,4% adalah konsumsi LNPRT, perubahan inventori, dan diskrepansi statistik")}
    </div>
    <div class="panel">
      <h2>Perdagangan luar negeri</h2>
      ${trade}
    </div>`;
}

function provinceShare(p) {
  return (p.population / CENSUS_TOTAL) * 100;
}

function sortedProvinces() {
  const rows = [...PROVINCES];
  const { key, dir } = provinceSort;
  rows.sort((a, b) => {
    if (key === "name") return dir * a.name.localeCompare(b.name, "id");
    if (key === "population") return dir * (a.population - b.population);
    return dir * (provinceShare(a) - provinceShare(b));
  });
  return rows;
}

function renderPopulation() {
  const rows = sortedProvinces()
    .map(
      (p, i) =>
        `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.capital}</td>` +
        `<td class="num">${String(p.population).replace(".", ",")}</td>` +
        `<td class="num">${String(Math.round(provinceShare(p) * 10) / 10).replace(".", ",")}%</td></tr>`,
    )
    .join("");
  const arrow = (key) =>
    provinceSort.key === key ? (provinceSort.dir === 1 ? " ▲" : " ▼") : "";
  const selected = PROVINCES.find((p) => p.name === selectedProvince) || PROVINCES[0];
  const options = PROVINCES.map(
    (p) => `<option value="${p.name}"${p.name === selectedProvince ? " selected" : ""}>${p.name}</option>`,
  ).join("");
  const age = AGE_GROUPS.map(
    (g) =>
      `<div class="agebar"><span>${g.group}</span>` +
      `<span class="share-track"><span class="share-fill" style="width:${g.share.toFixed(1)}%"></span></span>` +
      `<span><strong>${String(g.share).replace(".", ",")}%</strong> · ${String(g.millions).replace(".", ",")} jt jiwa</span></div>`,
  ).join("");
  return `
    <p class="kicker">Penduduk · Population</p>
    <h1>Penduduk Indonesia</h1>
    <p class="lede">Sensus Penduduk 2020 mencatat 270,20 juta jiwa. Lebih dari separuh
    penduduk tinggal di Pulau Jawa, dan tujuh dari sepuluh penduduk berusia produktif.</p>
    <div class="panel">
      <h2>Sepuluh provinsi terbesar</h2>
      <p class="lede">Klik judul kolom untuk mengurutkan tabel.</p>
      <table>
        <thead><tr>
          <th>#</th>
          <th class="sortable" data-sort="name">Provinsi${arrow("name")}</th>
          <th>Ibu kota</th>
          <th class="num sortable" data-sort="population">Penduduk (jt)${arrow("population")}</th>
          <th class="num sortable" data-sort="share">Pangsa${arrow("share")}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${sourceLine("BPS, Sensus Penduduk 2020")}
    </div>
    <div class="panel">
      <h2>Profil provinsi</h2>
      <div class="controls">
        <label class="ctl-label" for="prov-select">Pilih provinsi:</label>
        <select id="prov-select">${options}</select>
      </div>
      <p><strong>${selected.name}</strong> — ibu kota ${selected.capital} — berpenduduk
      <strong>${String(selected.population).replace(".", ",")} juta jiwa</strong>,
      atau <strong>${String(Math.round(provinceShare(selected) * 10) / 10).replace(".", ",")}%</strong>
      dari seluruh penduduk Indonesia pada Sensus 2020.</p>
      ${sourceLine("BPS, Sensus Penduduk 2020")}
    </div>
    <div class="panel">
      <h2>Struktur umur, 2020</h2>
      ${age}
      ${sourceLine("BPS, Sensus Penduduk 2020")}
    </div>`;
}

function seriesTable(title, rows, unit) {
  const body = rows
    .map(
      (r) =>
        `<tr><td>${r.period}</td><td class="num">${String(r.value).replace(".", ",")}${unit}</td></tr>`,
    )
    .join("");
  return `<div class="panel"><h2>${title}</h2><table>
    <thead><tr><th>Periode</th><th class="num">Nilai</th></tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderPrices() {
  const points = INFLATION.map((p) => ({ label: String(p.year), value: p.value }));
  const chart =
    priceChart === "line"
      ? lineChart(points, { label: "Inflasi Desember, persen y-on-y" })
      : barChart(points, { label: "Inflasi Desember, persen y-on-y" });
  return `
    <p class="kicker">Harga &amp; Tenaga Kerja · Prices &amp; Labour</p>
    <h1>Harga dan tenaga kerja</h1>
    <p class="lede">Inflasi Desember 2024 sebesar 1,57% — terendah dalam enam tahun —
    sementara pengangguran Februari 2025 turun ke 4,76%.</p>
    <div class="panel">
      <h2>Inflasi Desember, 2019–2024</h2>
      <div class="controls" role="group" aria-label="Jenis grafik">
        <span class="ctl-label">Tampilan:</span>
        <button type="button" data-chart="bar" class="${priceChart === "bar" ? "on" : ""}">Batang</button>
        <button type="button" data-chart="line" class="${priceChart === "line" ? "on" : ""}">Garis</button>
      </div>
      ${chart}
      ${sourceLine("BPS, inflasi IHK Desember y-on-y")}
      <p class="note">Inflasi melonjak ke 5,51% pada 2022 setelah penyesuaian harga BBM
      bersubsidi, lalu mereda ke 2,61% pada 2023 dan 1,57% pada 2024.</p>
    </div>
    ${seriesTable("Tingkat pengangguran terbuka", UNEMPLOYMENT, "%")}
    ${sourceLine("BPS")}
    ${seriesTable("Penduduk miskin", POVERTY, "%")}
    ${sourceLine("BPS")}
    <div class="panel">
      <h2>Upah minimum</h2>
      <p>Upah minimum provinsi tertinggi 2025 adalah <strong>DKI Jakarta:
      Rp5.396.761</strong> per bulan.</p>
      ${sourceLine("Pemprov DKI Jakarta, 2025")}
    </div>`;
}

function indicatorRows(query) {
  const q = query.trim().toLowerCase();
  const rows = INDICATORS.filter(
    (r) =>
      q === "" ||
      r.indicator.toLowerCase().includes(q) ||
      r.value.toLowerCase().includes(q) ||
      r.source.toLowerCase().includes(q) ||
      r.year.toLowerCase().includes(q),
  );
  if (rows.length === 0) {
    return `<p class="empty">Tidak ada indikator yang cocok. Coba kata kunci lain, misalnya “inflasi” atau “BPS”.</p>`;
  }
  return `<table><thead><tr><th>Indikator</th><th>Nilai</th><th>Tahun</th><th>Sumber</th></tr></thead><tbody>${rows
    .map((r) => `<tr><td>${r.indicator}</td><td>${r.value}</td><td>${r.year}</td><td>${r.source}</td></tr>`)
    .join("")}</tbody></table>`;
}

function downloadCsv() {
  const lines = ["Indikator;Nilai;Tahun;Sumber"];
  for (const r of INDICATORS) {
    lines.push([r.indicator, r.value, r.year, r.source].join(";"));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "indikator-indonesia.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderData() {
  return `
    <p class="kicker">Data &amp; Metode · Data &amp; Methods</p>
    <h1>Data dan metode</h1>
    <p class="lede">Seluruh indikator yang dipakai situs ini, lengkap dengan nilai,
    tahun, dan sumbernya. Gunakan kotak cari untuk menyaring, atau unduh semuanya sebagai CSV.</p>
    <div class="panel">
      <h2>Semua indikator</h2>
      <div class="controls">
        <label class="ctl-label" for="indicator-search">Cari:</label>
        <input type="search" id="indicator-search" placeholder="misalnya inflasi, PDB, BPS…" value="${indicatorQuery.replace(/"/g, "&quot;")}" aria-label="Cari indikator">
        <button type="button" id="csv-download" class="primary">Unduh CSV</button>
      </div>
      <div id="indicator-table">${indicatorRows(indicatorQuery)}</div>
      <p class="source">Unduhan berisi ${INDICATORS.length} indikator dalam format CSV (pemisah titik koma).</p>
    </div>
    <div class="panel">
      <h2>Metode dan sumber</h2>
      <p>Angka-angka di situs ini berasal dari publikasi resmi: Badan Pusat Statistik (BPS)
      untuk penduduk, PDB, inflasi, pengangguran, kemiskinan, dan perdagangan; Bank Indonesia
      untuk cadangan devisa; World Bank untuk angka harapan hidup; dan pemerintah provinsi
      untuk upah minimum. Tahun dan sumber dicantumkan pada setiap angka.</p>
      <p>Situs ini statis: semua data tersimpan dalam berkas <code>app/data.js</code> dan
      grafik digambar di peramban sebagai SVG. Tidak ada data yang diambil dari jaringan,
      sehingga halaman ini tetap berfungsi luring.</p>
    </div>`;
}

const PAGES = {
  "": renderOverview,
  ekonomi: renderEconomy,
  penduduk: renderPopulation,
  "harga-tenaga-kerja": renderPrices,
  data: renderData,
};

function render() {
  const current = route();
  const page = PAGES[current] || renderOverview;
  setActiveNav(current in PAGES ? current : "");
  mount.innerHTML = page();
  window.scrollTo(0, 0);

  for (const btn of mount.querySelectorAll("[data-range]")) {
    btn.addEventListener("click", () => {
      econFrom = Number(btn.getAttribute("data-range"));
      render();
    });
  }
  for (const btn of mount.querySelectorAll("[data-chart]")) {
    btn.addEventListener("click", () => {
      priceChart = btn.getAttribute("data-chart") || "bar";
      render();
    });
  }
  for (const th of mount.querySelectorAll("[data-sort]")) {
    th.addEventListener("click", () => {
      const key = th.getAttribute("data-sort") || "population";
      if (provinceSort.key === key) {
        provinceSort = { key, dir: -provinceSort.dir };
      } else {
        provinceSort = { key, dir: key === "name" ? 1 : -1 };
      }
      render();
    });
  }
  const select = mount.querySelector("#prov-select");
  if (select) {
    select.addEventListener("change", () => {
      selectedProvince = select.value;
      render();
    });
  }
  const search = mount.querySelector("#indicator-search");
  if (search) {
    search.addEventListener("input", () => {
      indicatorQuery = search.value;
      const table = mount.querySelector("#indicator-table");
      if (table) table.innerHTML = indicatorRows(indicatorQuery);
    });
  }
  const csv = mount.querySelector("#csv-download");
  if (csv) csv.addEventListener("click", downloadCsv);
}

export function startRouter() {
  window.addEventListener("hashchange", render);
  render();
}
