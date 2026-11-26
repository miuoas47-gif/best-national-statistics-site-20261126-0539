// NusaStat app: hash-routed single-page site.
// Routes: #/ (overview) · #/population · #/economy · #/people · #/regions · #/data
// Every control on the page works: navigation, chart range and metric
// switches, province search and sorting, table sorting, CSV download.

import { COUNTRY, HEADLINE, GDP_YEARS, POP_YEARS, AGE_GROUPS, SECTORS, TRADE, PROVINCES, PEOPLE, INDICATORS, SOURCES, UPDATES } from "./data.js";
import { lineChart, barChart, hbarChart, donutChart } from "./charts.js";

const root = document.getElementById("view");

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmtNum(n, digits = 1) {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function kpiCards(items) {
  return `<div class="kpis">${items.map((k) =>
    `<article class="kpi"><p class="kpi-label">${esc(k.label)}</p>
     <p class="kpi-value">${esc(k.value)}</p><p class="kpi-note">${esc(k.note)}</p></article>`).join("")}</div>`;
}

function section(title, intro, body) {
  return `<section class="panel"><h2>${esc(title)}</h2>${intro ? `<p class="lede">${esc(intro)}</p>` : ""}${body}</section>`;
}

function chartCard(title, caption, svg, controls = "") {
  return `<figure class="chart-card"><figcaption><strong>${esc(title)}</strong><span>${esc(caption)}</span></figcaption>
    ${controls}<div class="chart-box">${svg}</div></figure>`;
}

// ---------- views ----------

function overview() {
  const gdp = GDP_YEARS.map((d) => ({ label: String(d.year), value: d.gdp }));
  const pop = POP_YEARS.map((d) => ({ label: String(d.year).slice(2), value: d.pop }));
  const sectors = SECTORS.map((s) => ({ label: s.name, value: s.share }));
  const topProv = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 8)
    .map((p) => ({ label: p.name, value: p.pop }));
  return `
  <header class="hero"><p class="eyebrow">National statistics · ${esc(COUNTRY.name)}</p>
    <h1>${esc(COUNTRY.tagline)}</h1>
    <p class="lede">The numbers that describe a country of ${COUNTRY.provinces} provinces,
    ${fmtNum(COUNTRY.islands, 0)} islands and 281.6 million people — population, economy, health,
    education and regions, each figure with its source and year.</p>
    <p class="hero-facts"><span><strong>${fmtNum(COUNTRY.areaKm2, 0)} km²</strong> land area</span>
    <span><strong>${COUNTRY.provinces}</strong> provinces</span>
    <span><strong>${COUNTRY.regenciesCities}</strong> regencies &amp; cities</span>
    <span><strong>${esc(COUNTRY.currency)}</strong></span></p></header>
  ${kpiCards(HEADLINE)}
  <div class="grid2">
    ${chartCard("GDP, 2015–2024", "Current US$ billions · World Bank", lineChart(gdp, { title: "GDP 2015 to 2024", format: (v) => "$" + fmtNum(v, 0) + "bn" }))}
    ${chartCard("Population, 2015–2024", "Millions of people · BPS mid-year estimates", barChart(pop, { title: "Population 2015 to 2024", format: (v) => fmtNum(v, 0) + "m" }))}
  </div>
  <div class="grid2">
    ${chartCard("What the economy makes", "Share of GDP by sector, 2024 · BPS", donutChart(sectors, { title: "GDP by sector 2024", centre: "100%", centreSub: "of GDP" }))}
    ${chartCard("Largest provinces", "Population in millions, 2024 · BPS", hbarChart(topProv, { title: "Largest provinces by population", format: (v) => fmtNum(v, 1) + "m" }))}
  </div>
  ${section("Latest updates", "What changed in the newest releases.", `<ul class="updates">${UPDATES.map((u) =>
    `<li><time>${esc(u.date)}</time><span>${esc(u.text)}</span></li>`).join("")}</ul>
    <p><a class="btn" href="#/data">Browse the full indicator table →</a></p>`)}
  ${section("Start exploring", "Every page is reached from the menu above — no dead ends.",
    `<p class="linkrow"><a href="#/population">Population →</a><a href="#/economy">Economy →</a>
    <a href="#/people">People →</a><a href="#/regions">Regions →</a><a href="#/data">Data &amp; sources →</a></p>`)}`;
}

function population() {
  const pop = POP_YEARS.map((d) => ({ label: String(d.year), value: d.pop }));
  const ages = AGE_GROUPS.map((a) => ({ label: a.group, value: a.share }));
  return `
  <header class="pagehead"><h1>Population</h1>
  <p class="lede">281.6 million people in 2024 — the world's fourth-largest population — spread
  across 17,508 islands, with 56% living on Java, an island of 138,000 km².</p></header>
  ${kpiCards([
    { label: "Population 2024", value: "281.6m", note: "BPS mid-year estimate" },
    { label: "Growth 2023–24", value: "1.04%", note: "About 2.9m more people" },
    { label: "Median age", value: "30.1 yrs", note: "2024 · BPS" },
    { label: "Density", value: "148 /km²", note: "National average, 2024" },
  ])}
  <div class="grid2">
    ${chartCard("Population growth", "Millions, 2015–2024 · BPS", lineChart(pop, { title: "Population 2015 to 2024", format: (v) => fmtNum(v, 0) + "m" }))}
    ${chartCard("Age structure", "Share of population by age group, 2024 · BPS", hbarChart(ages, { title: "Age structure 2024", format: (v) => fmtNum(v, 1) + "%" }))}
  </div>
  ${section("Who lives where", "Java holds more than half the population on 7% of the land; Papua's provinces are the least dense.",
    `<p>Jakarta is the densest province at 16,113 people per km²; South Papua is the least dense at 4 per km².
    Use the Regions page to search and sort every province.</p>
    <p><a class="btn" href="#/regions">See all 38 provinces →</a></p>`)}`;
}

let econRange = "all";
let econMetric = "gdp";
function economy() {
  const years = econRange === "all" ? GDP_YEARS : econRange === "recent" ? GDP_YEARS.slice(5) : GDP_YEARS.slice(0, 5);
  const metric = econMetric;
  const pts = years.map((d) => ({ label: String(d.year), value: metric === "gdp" ? d.gdp : metric === "percapita" ? d.perCapita : d.growth }));
  const title = metric === "gdp" ? "GDP in current US$ billions" : metric === "percapita" ? "GDP per capita in current US$" : "Real GDP growth, % per year";
  const fmt = metric === "growth" ? (v) => fmtNum(v, 2) + "%" : metric === "gdp" ? (v) => "$" + fmtNum(v, 0) + "bn" : (v) => "$" + fmtNum(v, 0);
  const chart = metric === "growth"
    ? barChart(pts, { title, format: fmt })
    : lineChart(pts, { title, format: fmt });
  const controls = `<div class="controls" role="group" aria-label="Chart controls">
    <label>Years <select id="econ-range" aria-label="Year range">
      <option value="all"${econRange === "all" ? " selected" : ""}>2015–2024</option>
      <option value="recent"${econRange === "recent" ? " selected" : ""}>2020–2024</option>
      <option value="early"${econRange === "early" ? " selected" : ""}>2015–2019</option></select></label>
    <label>Show <select id="econ-metric" aria-label="Metric">
      <option value="gdp"${metric === "gdp" ? " selected" : ""}>GDP (US$ bn)</option>
      <option value="percapita"${metric === "percapita" ? " selected" : ""}>GDP per capita (US$)</option>
      <option value="growth"${metric === "growth" ? " selected" : ""}>Real growth (%)</option></select></label></div>`;
  return `
  <header class="pagehead"><h1>Economy</h1>
  <p class="lede">A $1.4 trillion economy in 2024 — the largest in Southeast Asia — growing 5.03% in real terms,
  with manufacturing, trade and agriculture as its biggest sectors.</p></header>
  ${kpiCards([
    { label: "GDP 2024", value: "$1,396bn", note: "World Bank, current US$" },
    { label: "GDP per capita", value: "$4,960", note: "World Bank, 2024" },
    { label: "Real growth", value: "5.03%", note: "2024 · BPS" },
    { label: "Inflation", value: "1.57%", note: "Annual CPI, 2024 · BPS" },
  ])}
  ${chartCard("GDP over time", "Change the years and the metric — the chart redraws. World Bank / BPS.", chart, controls)}
  <div class="grid2">
    ${chartCard("GDP by sector", "Share of GDP, 2024 · BPS", donutChart(SECTORS.map((s) => ({ label: s.name, value: s.share })), { title: "GDP by sector 2024", centre: "100%", centreSub: "of GDP" }))}
    ${section("Trade in 2024", "Goods trade kept a surplus for a fifth straight year.", `<div class="kpis">${TRADE.map((t) =>
      `<article class="kpi"><p class="kpi-label">${esc(t.label)}</p><p class="kpi-value">${esc(t.value)}</p><p class="kpi-note">${esc(t.note)}</p></article>`).join("")}</div>`)}
  </div>
  <p class="sourcenote">In rupiah, GDP was Rp 22,139 trillion in 2024 (BPS). The 2020 dip (−2.07%) is the COVID-19 recession; growth has run at about 5% in every year since.</p>`;
}

function people() {
  return `
  <header class="pagehead"><h1>People</h1>
  <p class="lede">Health, education and work: life expectancy is 74.2 years, schooling averages 9.12 years,
  and 221.6 million people are online.</p></header>
  ${kpiCards(PEOPLE)}
  ${section("Health", "Longer lives, but stunting still affects one child in five.",
    `<ul class="facts"><li><strong>Life expectancy 74.2 years</strong> (2024, BPS) — up from 71.7 in 2015.</li>
    <li><strong>Stunting 19.8%</strong> of children under five (2024, Ministry of Health) — down from 21.5% in 2023.</li>
    <li><strong>Infant mortality about 16 per 1,000 live births</strong> (2023, BPS estimate).</li></ul>`)}
  ${section("Education & work", "Schooling is near-universal for children; most adults work informally.",
    `<ul class="facts"><li><strong>Adult literacy 96.0%</strong> (2023, BPS); youth literacy is above 99%.</li>
    <li><strong>Mean years of schooling 9.12</strong> (2024, BPS) — just past junior secondary school.</li>
    <li><strong>Labour force 152.1 million</strong> (Aug 2024, BPS); 57.9% of workers are in informal jobs.</li>
    <li><strong>Internet users 221.6 million</strong> — 79.5% of the population (2024, APJII).</li></ul>`)}`;
}

let provQuery = "";
let provSort = "pop-desc";
function regions() {
  const q = provQuery.trim().toLowerCase();
  let list = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q));
  const [key, dir] = provSort.split("-");
  list = [...list].sort((a, b) => (dir === "asc" ? a[key] - b[key] : b[key] - a[key]));
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10)
    .map((p) => ({ label: p.name, value: p.pop }));
  return `
  <header class="pagehead"><h1>Regions</h1>
  <p class="lede">38 provinces, from West Java's 50.35 million people to South Papua's 0.56 million.
  Search by name or island group, and sort the table — it updates as you type.</p></header>
  ${chartCard("Ten largest provinces", "Population in millions, 2024 · BPS", hbarChart(top, { title: "Ten largest provinces", format: (v) => fmtNum(v, 1) + "m" }))}
  ${section("All 38 provinces", "Population (millions) and density (people per km²), 2024 · BPS mid-year estimates.",
    `<div class="controls"><label>Search <input id="prov-search" type="search" value="${esc(provQuery)}" placeholder="e.g. Java or Bali" aria-label="Search provinces"></label>
    <label>Sort by <select id="prov-sort" aria-label="Sort provinces">
      <option value="pop-desc"${provSort === "pop-desc" ? " selected" : ""}>Population: largest first</option>
      <option value="pop-asc"${provSort === "pop-asc" ? " selected" : ""}>Population: smallest first</option>
      <option value="density-desc"${provSort === "density-desc" ? " selected" : ""}>Density: highest first</option>
      <option value="density-asc"${provSort === "density-asc" ? " selected" : ""}>Density: lowest first</option></select></label>
    <span class="count" id="prov-count">${list.length} of 38 provinces</span></div>
    <div class="tablewrap"><table><thead><tr><th>Province</th><th>Island group</th><th>Population (m)</th><th>Density /km²</th></tr></thead>
    <tbody>${list.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.region)}</td><td>${fmtNum(p.pop, 2)}</td><td>${fmtNum(p.density, 0)}</td></tr>`).join("") || `<tr><td colspan="4">No province matches “${esc(provQuery)}”. Try another name.</td></tr>`}</tbody></table></div>`)}`;
}

let dataSort = "indicator";
function dataPage() {
  const rows = [...INDICATORS].sort((a, b) =>
    dataSort === "year" ? b.year - a.year : a.indicator.localeCompare(b.indicator));
  return `
  <header class="pagehead"><h1>Data &amp; sources</h1>
  <p class="lede">Every headline figure in one table, with its year and source — and a CSV download
  of the same table, generated in your browser from this page's data.</p></header>
  ${section("Key indicators", "Sort the table, or download it as CSV.",
    `<div class="controls"><label>Sort by <select id="data-sort" aria-label="Sort indicators">
      <option value="indicator"${dataSort === "indicator" ? " selected" : ""}>Indicator A–Z</option>
      <option value="year"${dataSort === "year" ? " selected" : ""}>Year: newest first</option></select></label>
    <button class="btn" id="csv-btn" type="button">Download indicators as CSV</button></div>
    <div class="tablewrap"><table><thead><tr><th>Indicator</th><th>Value</th><th>Year</th><th>Source</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><td>${esc(r.indicator)}</td><td>${esc(r.value)}</td><td>${r.year}</td><td>${esc(r.source)}</td></tr>`).join("")}</tbody></table></div>`)}
  ${section("Sources", "Where each figure comes from. Figures are rounded as published; provincial populations are mid-year estimates.",
    `<ul class="facts">${SOURCES.map((s) => `<li><strong>${esc(s.name)}</strong> (${esc(s.url)}) — ${esc(s.what)}</li>`).join("")}</ul>
    <p class="sourcenote">Method: national totals are the latest published annual figure (2024 where available).
    Figures from different publishers are shown as published and are not re-based. This site is an independent
    compilation and is not affiliated with BPS, the World Bank or any other publisher named here.</p>`)}`;
}

function notFound(route) {
  return `<header class="pagehead"><h1>Page not found</h1>
  <p class="lede">There is no page at “${esc(route)}”. These pages exist:</p></header>
  <p class="linkrow"><a href="#/">Overview →</a><a href="#/population">Population →</a>
  <a href="#/economy">Economy →</a><a href="#/people">People →</a>
  <a href="#/regions">Regions →</a><a href="#/data">Data &amp; sources →</a></p>`;
}

// ---------- router ----------

const ROUTES = {
  "/": { render: overview, title: "Overview" },
  "/population": { render: population, title: "Population" },
  "/economy": { render: economy, title: "Economy" },
  "/people": { render: people, title: "People" },
  "/regions": { render: regions, title: "Regions" },
  "/data": { render: dataPage, title: "Data & sources" },
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return ROUTES[hash] ? hash : hash;
}

function render() {
  const route = currentRoute();
  const entry = ROUTES[route];
  root.innerHTML = entry ? entry.render() : notFound(route);
  document.querySelectorAll(".nav a").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === "#" + route);
    if (href === "#" + route) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  document.title = entry ? `NusaStat · ${entry.title} — Indonesia in Numbers` : "NusaStat · Page not found";
  bindControls(route);
  window.scrollTo(0, 0);
}

function bindControls(route) {
  if (route === "/economy") {
    const range = document.getElementById("econ-range");
    const metric = document.getElementById("econ-metric");
    if (range) range.addEventListener("change", () => { econRange = range.value; render(); });
    if (metric) metric.addEventListener("change", () => { econMetric = metric.value; render(); });
  }
  if (route === "/regions") {
    const search = document.getElementById("prov-search");
    const sort = document.getElementById("prov-sort");
    if (search) {
      search.addEventListener("input", () => { provQuery = search.value; render(); const again = document.getElementById("prov-search"); if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); } });
    }
    if (sort) sort.addEventListener("change", () => { provSort = sort.value; render(); });
  }
  if (route === "/data") {
    const sort = document.getElementById("data-sort");
    if (sort) sort.addEventListener("change", () => { dataSort = sort.value; render(); });
    const btn = document.getElementById("csv-btn");
    if (btn) btn.addEventListener("click", downloadCsv);
  }
}

function downloadCsv() {
  const head = "Indicator,Value,Year,Source";
  const lines = INDICATORS.map((r) => `"${r.indicator}","${r.value}",${r.year},"${r.source}"`);
  const blob = new Blob([[head, ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "nusastat-indicators.csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

window.addEventListener("hashchange", render);
render();
