// NusaData — page views. Each view returns the page's HTML; the router in
// main.js mounts it and wires the controls. All figures come from data.js.

import {
  YEARS, HEADLINES, SERIES, SECTORS, MONTHLY_INFLATION_2024, CPI_BASKET,
  AGE_GROUPS, PROVINCES, EMPLOYMENT, TRADE, HUMAN_DEV, RELEASES, SOURCES,
  density, fmt,
} from './data.js';
import { barChart, lineChart, donutChart, pyramidChart, hbarChart } from './charts.js';

function kpiCards() {
  return `<div class="kpi-grid">${HEADLINES.map((k) => `
    <div class="kpi">
      <div class="k-label">${k.label}</div>
      <div class="k-value">${k.value}</div>
      <div class="k-change">${k.change}</div>
      <div class="k-note">${k.note}</div>
      <div class="k-source">Source: ${k.source}</div>
    </div>`).join('')}
  </div>`;
}

function releaseList() {
  return `<ul class="release-list">${RELEASES.map((r) => `
    <li><span class="r-date">${r.date}</span><span class="r-topic">${r.topic}</span><span>${r.title}</span></li>`).join('')}
  </ul>`;
}

export function overviewPage() {
  const top5 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5);
  return `
  <section class="hero">
    <h1>Indonesia in numbers</h1>
    <p>The national statistics portal: population, economy, prices, labour and trade —
       the figures people look up, with the source and year on every number.</p>
    <div class="updated">Updated 3 November 2026 · Next release: Consumer Price Index, 1 December 2026</div>
  </section>
  ${kpiCards()}
  <div class="grid-2">
    <section class="card">
      <p class="chart-title">Population, 2015–2024</p>
      <p class="chart-sub">Million people · ${SOURCES.population}</p>
      ${barChart(YEARS.map(String), SERIES.population.values, { label: 'Population by year', highlight: 9 })}
    </section>
    <section class="card">
      <p class="chart-title">Real GDP growth, 2015–2024</p>
      <p class="chart-sub">% year on year · ${SOURCES.gdp}</p>
      ${lineChart(YEARS.map(String), SERIES.gdpGrowth.values, { label: 'GDP growth by year' })}
    </section>
  </div>
  <div class="grid-2">
    <section class="card">
      <h2>Latest releases</h2>
      ${releaseList()}
    </section>
    <section class="card">
      <h2>Largest provinces, 2024</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Province</th><th class="num">Population (m)</th><th class="num">Density /km²</th></tr></thead>
        <tbody>${top5.map((p) => `<tr><td>${p.name}</td><td class="num">${fmt(p.pop)}</td><td class="num">${density(p).toLocaleString('en-US')}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="table-note">Three provinces hold over 45% of the population. <a href="#/population">See all provinces →</a></p>
    </section>
  </div>
  <h2>Explore the statistics</h2>
  <div class="explore-grid">
    <a class="explore-card" href="#/population"><h3>Population</h3><p>Age structure, provinces, density and growth.</p></a>
    <a class="explore-card" href="#/economy"><h3>Economy</h3><p>GDP, growth, sectors and foreign trade.</p></a>
    <a class="explore-card" href="#/prices"><h3>Prices</h3><p>Inflation, monthly CPI and the CPI basket.</p></a>
    <a class="explore-card" href="#/labour"><h3>Labour</h3><p>Unemployment, employment by sector and the labour force.</p></a>
    <a class="explore-card" href="#/data"><h3>Data explorer</h3><p>Search, sort and download the provincial dataset.</p></a>
    <a class="explore-card" href="#/about"><h3>Methods &amp; sources</h3><p>How the figures are compiled and where they come from.</p></a>
  </div>`;
}

function provinceRows(list) {
  return list.map((p) => `<tr>
    <td>${p.name}</td><td class="num">${fmt(p.pop)}</td>
    <td class="num">${p.area.toLocaleString('en-US')}</td>
    <td class="num">${density(p).toLocaleString('en-US')}</td>
    <td class="num">+${fmt(p.growth)}%</td></tr>`).join('');
}

export function populationPage(state) {
  const q = (state.provinceQuery || '').toLowerCase();
  let list = PROVINCES.filter((p) => p.name.toLowerCase().includes(q));
  const key = state.provinceSort || 'pop';
  const dir = state.provinceDir || -1;
  list = [...list].sort((a, b) => {
    const av = key === 'density' ? density(a) : a[key];
    const bv = key === 'density' ? density(b) : b[key];
    return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * dir;
  });
  const sortBtn = (col, label) =>
    `<button data-sort="${col}" aria-label="Sort by ${label}">${label} ${state.provinceSort === col ? (state.provinceDir === 1 ? '▲' : '▼') : ''}</button>`;
  return `
  <h1>Population</h1>
  <p class="lede">281.6 million people in 2024, growing 1.1% a year. Java holds 56% of the
     population on 7% of the land; the median age is 30.1 years.</p>
  <div class="grid-2">
    <section class="card">
      <p class="chart-title">Population, 2015–2024</p>
      <p class="chart-sub">Million people · ${SOURCES.population}</p>
      ${barChart(YEARS.map(String), SERIES.population.values, { label: 'Population by year', highlight: 9 })}
    </section>
    <section class="card">
      <p class="chart-title">Age structure, 2024</p>
      <p class="chart-sub">Share of population by age group · ${SOURCES.population}</p>
      ${pyramidChart(AGE_GROUPS, { label: 'Age structure pyramid' })}
      <p class="source-note">Working-age population (15–64): <b>68.9%</b> · Children (0–14): <b>24.5%</b> · 65 and over: <b>6.5%</b></p>
    </section>
  </div>
  <section class="card">
    <h2>Provinces, 2024</h2>
    <div class="controls">
      <label for="province-search">Search provinces</label>
      <input type="search" id="province-search" placeholder="Type a province name…" value="${state.provinceQuery || ''}">
      <span class="table-note" id="province-count">${list.length} of ${PROVINCES.length} provinces shown</span>
    </div>
    <div class="table-wrap"><table class="data">
      <thead><tr>
        <th>${sortBtn('name', 'Province')}</th>
        <th class="num">${sortBtn('pop', 'Population (m)')}</th>
        <th class="num">${sortBtn('area', 'Area (km²)')}</th>
        <th class="num">${sortBtn('density', 'Density /km²')}</th>
        <th class="num">${sortBtn('growth', 'Growth /yr')}</th>
      </tr></thead>
      <tbody>${provinceRows(list) || `<tr><td colspan="5">No province matches “${state.provinceQuery}”.</td></tr>`}</tbody>
    </table></div>
    <p class="source-note">Source: <b>${SOURCES.population}</b>. Density = population ÷ land area. Figures rounded.</p>
  </section>`;
}

export function economyPage(state) {
  const range = state.economyRange || '10y';
  const n = range === '5y' ? 5 : 10;
  const years = YEARS.slice(-n).map(String);
  return `
  <h1>Economy</h1>
  <p class="lede">GDP of Rp 22,139 trillion in 2024 (US$ 1.40 trillion), growing 5.03%.
     Manufacturing is the largest sector; exports of US$ 264.7 billion left a US$ 31.0 billion trade surplus.</p>
  <div class="controls">
    <label>Growth chart range</label>
    <div class="seg" role="group" aria-label="Chart range">
      <button data-range="5y" aria-pressed="${range === '5y'}">Last 5 years</button>
      <button data-range="10y" aria-pressed="${range === '10y'}">Last 10 years</button>
    </div>
  </div>
  <div class="grid-2">
    <section class="card">
      <p class="chart-title">Real GDP growth, ${years[0]}–${years[years.length - 1]}</p>
      <p class="chart-sub">% year on year · ${SOURCES.gdp}</p>
      ${lineChart(years, SERIES.gdpGrowth.values.slice(-n), { label: 'GDP growth' })}
      <p class="source-note">The 2020 contraction (−2.07%) is the only fall in the series, caused by the pandemic.</p>
    </section>
    <section class="card">
      <p class="chart-title">GDP by sector, 2024</p>
      <p class="chart-sub">Share of GDP at current prices · ${SOURCES.gdp}</p>
      ${donutChart(SECTORS, { label: 'GDP by sector', centre: '100%', centreSub: 'of GDP' })}
    </section>
  </div>
  <div class="grid-2">
    <section class="card">
      <p class="chart-title">GDP per capita, 2015–2024</p>
      <p class="chart-sub">US$ · ${SOURCES.worldBank}</p>
      ${barChart(YEARS.map(String), SERIES.gdpPerCapita.values, { label: 'GDP per capita by year', highlight: 9 })}
    </section>
    <section class="card">
      <h2>Foreign trade, 2024</h2>
      <dl class="stat-list">
        <div><dt>Exports</dt><dd>US$ 264.7 bn</dd></div>
        <div><dt>Imports</dt><dd>US$ 233.7 bn</dd></div>
        <div><dt>Trade surplus</dt><dd>US$ 31.0 bn</dd></div>
        <div><dt>Largest export partner</dt><dd>China (25.6%)</dd></div>
        <div><dt>Top export</dt><dd>Coal</dd></div>
        <div><dt>GDP at current prices</dt><dd>Rp 22,139 tn</dd></div>
      </dl>
      <p class="source-note">Source: <b>${SOURCES.trade}</b>. Top exports: ${TRADE.topExports.join(', ')}.</p>
      <h3>Exports by destination</h3>
      ${hbarChart(TRADE.partners.map((p) => ({ name: p.country, share: p.share })), { label: 'Exports by destination' })}
    </section>
  </div>`;
}

export function pricesPage(state) {
  const view = state.pricesView || 'annual';
  return `
  <h1>Prices</h1>
  <p class="lede">Consumer prices rose 1.57% in the year to December 2024 — the lowest annual
     rate in the series — after five straight months of falling prices mid-year.</p>
  <div class="controls">
    <label>Chart</label>
    <div class="seg" role="group" aria-label="Inflation chart">
      <button data-prices-view="annual" aria-pressed="${view === 'annual'}">Annual, 2015–2024</button>
      <button data-prices-view="monthly" aria-pressed="${view === 'monthly'}">Monthly, 2024</button>
    </div>
  </div>
  <div class="grid-2">
    <section class="card">
      <p class="chart-title">${view === 'annual' ? 'Annual inflation, 2015–2024' : 'Monthly inflation, 2024'}</p>
      <p class="chart-sub">${view === 'annual' ? '% year on year, December' : '% month on month'} · ${SOURCES.prices}</p>
      ${view === 'annual'
        ? lineChart(YEARS.map(String), SERIES.inflation.values, { label: 'Annual inflation' })
        : barChart(MONTHLY_INFLATION_2024.map((m) => m.month), MONTHLY_INFLATION_2024.map((m) => m.value), { label: 'Monthly inflation 2024' })}
      <p class="source-note">${view === 'annual'
        ? 'The 2022 spike (5.51%) followed the administered fuel price rise in September 2022.'
        : 'Five consecutive monthly falls from May to September 2024 pulled the annual rate down to 1.57%.'}</p>
    </section>
    <section class="card">
      <h2>CPI basket, 2024</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Expenditure group</th><th class="num">Weight (%)</th><th class="num">Annual change (%)</th></tr></thead>
        <tbody>${CPI_BASKET.map((c) => `<tr><td>${c.group}</td><td class="num">${fmt(c.weight)}</td><td class="num">${fmt(c.annual, 1)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="source-note">Source: <b>${SOURCES.prices}</b>. Food carries the largest weight in the basket at 27.0%.</p>
      <div class="callout"><b>What moved prices in 2024:</b> food prices eased after the harvest, while
      administered prices (fuel, electricity) were held flat for most of the year.</div>
    </section>
  </div>`;
}

export function labourPage() {
  return `
  <h1>Labour</h1>
  <p class="lede">149.4 million people in the labour force in August 2024; 144.6 million were
     working and 7.3 million were unemployed — an open unemployment rate of 4.91%, the lowest since 1998.</p>
  <div class="grid-2">
    <section class="card">
      <p class="chart-title">Open unemployment rate, 2015–2024</p>
      <p class="chart-sub">% of labour force, August · ${SOURCES.labour}</p>
      ${lineChart(YEARS.map(String), SERIES.unemployment.values, { label: 'Unemployment rate by year' })}
      <p class="source-note">The 2020 jump to 7.07% is the pandemic peak; the rate has fallen every year since.</p>
    </section>
    <section class="card">
      <p class="chart-title">Employment by sector, Aug 2024</p>
      <p class="chart-sub">Share of workers · ${SOURCES.labour}</p>
      ${hbarChart(EMPLOYMENT.map((e) => ({ name: e.sector, share: e.share })), { label: 'Employment by sector' })}
    </section>
  </div>
  <div class="grid-2">
    <section class="card">
      <h2>Labour force, August 2024</h2>
      <dl class="stat-list">
        <div><dt>Labour force</dt><dd>149.4 million</dd></div>
        <div><dt>Employed</dt><dd>144.6 million</dd></div>
        <div><dt>Unemployed</dt><dd>7.3 million</dd></div>
        <div><dt>Labour force participation</dt><dd>70.6%</dd></div>
        <div><dt>Informal workers</dt><dd>59.2% of workers</dd></div>
        <div><dt>Underemployment</dt><dd>9.7 million</dd></div>
      </dl>
      <p class="source-note">Source: <b>${SOURCES.labour}</b>.</p>
    </section>
    <section class="card">
      <h2>Human development, 2024</h2>
      <dl class="stat-list">
        <div><dt>Human Development Index</dt><dd>${fmt(HUMAN_DEV.hdi, 2)}</dd></div>
        <div><dt>Life expectancy</dt><dd>${fmt(HUMAN_DEV.lifeExpectancy, 2)} years</dd></div>
        <div><dt>Mean years of schooling</dt><dd>${fmt(HUMAN_DEV.meanSchooling, 1)} years</dd></div>
        <div><dt>Expected years of schooling</dt><dd>${fmt(HUMAN_DEV.expectedSchooling, 1)} years</dd></div>
        <div><dt>GNI per capita (PPP)</dt><dd>US$ ${HUMAN_DEV.gniPerCapita.toLocaleString('en-US')}</dd></div>
        <div><dt>Poverty rate</dt><dd>9.03% (Mar 2024)</dd></div>
      </dl>
      <p class="source-note">Source: <b>${SOURCES.hdi}</b>; poverty: <b>${SOURCES.poverty}</b>.</p>
    </section>
  </div>`;
}

export function dataPage(state) {
  const indicator = state.explorerIndicator || 'population';
  const s = SERIES[indicator];
  const q = (state.explorerQuery || '').toLowerCase();
  const list = PROVINCES.filter((p) => p.name.toLowerCase().includes(q));
  return `
  <h1>Data explorer</h1>
  <p class="lede">Every series on this site, as tables you can sort, search and download.
     Figures are the published headline values; the About page lists the full sources.</p>
  <section class="card">
    <h2>Annual indicator</h2>
    <div class="controls">
      <label for="indicator-select">Indicator</label>
      <select id="indicator-select">
        ${Object.entries(SERIES).map(([k, v]) => `<option value="${k}" ${k === indicator ? 'selected' : ''}>${v.label} (${v.unit})</option>`).join('')}
      </select>
    </div>
    ${barChart(YEARS.map(String), s.values, { label: s.label, highlight: 9 })}
    <div class="table-wrap"><table class="data">
      <thead><tr><th>Year</th>${YEARS.map((y) => `<th class="num">${y}</th>`).join('')}</tr></thead>
      <tbody><tr><td>${s.label}</td>${s.values.map((v) => `<td class="num">${fmt(v, 2)}</td>`).join('')}</tr></tbody>
    </table></div>
    <p class="source-note">Source: <b>${s.source}</b>.</p>
  </section>
  <section class="card">
    <h2>Provincial dataset, 2024</h2>
    <div class="controls">
      <label for="explorer-search">Search</label>
      <input type="search" id="explorer-search" placeholder="Province name…" value="${state.explorerQuery || ''}">
      <button id="download-csv" type="button">Download CSV</button>
      <span class="table-note">${list.length} of ${PROVINCES.length} provinces</span>
    </div>
    <div class="table-wrap"><table class="data">
      <thead><tr><th>Province</th><th class="num">Population (m)</th><th class="num">Area (km²)</th><th class="num">Density /km²</th><th class="num">Growth /yr (%)</th></tr></thead>
      <tbody>${list.map((p) => `<tr><td>${p.name}</td><td class="num">${fmt(p.pop)}</td><td class="num">${p.area.toLocaleString('en-US')}</td><td class="num">${density(p).toLocaleString('en-US')}</td><td class="num">+${fmt(p.growth)}%</td></tr>`).join('') || `<tr><td colspan="5">No province matches “${state.explorerQuery}”.</td></tr>`}</tbody>
    </table></div>
    <p class="source-note">Source: <b>${SOURCES.population}</b>. The CSV download contains exactly the rows shown above.</p>
  </section>`;
}

export function aboutPage() {
  return `
  <h1>Methods &amp; sources</h1>
  <p class="lede">NusaData is an independent statistics portal. It republishes the headline
     figures of Indonesia's official statistics with the source and reference year on every number.</p>
  <section class="card">
    <h2>Sources</h2>
    <ul class="method-list">
      <li><b>Population</b> — ${SOURCES.population}.</li>
      <li><b>Economy</b> — ${SOURCES.gdp}.</li>
      <li><b>Prices</b> — ${SOURCES.prices}.</li>
      <li><b>Labour</b> — ${SOURCES.labour}.</li>
      <li><b>Trade</b> — ${SOURCES.trade}.</li>
      <li><b>Welfare</b> — ${SOURCES.poverty}; ${SOURCES.hdi}.</li>
      <li><b>International comparison</b> — ${SOURCES.worldBank}.</li>
    </ul>
    <p class="source-note">Figures are rounded for display. Where a series was revised, the latest
       published vintage is shown. This site is not affiliated with Statistics Indonesia (BPS) or the World Bank.</p>
  </section>
  <div class="grid-2">
    <section class="card">
      <h2>Definitions</h2>
      <ul class="method-list">
        <li><b>Open unemployment rate</b> — unemployed people as a share of the labour force, measured in August each year.</li>
        <li><b>Inflation</b> — change in the Consumer Price Index; the annual figure is the December year-on-year change.</li>
        <li><b>Real GDP growth</b> — change in GDP at constant 2010 prices, year on year.</li>
        <li><b>Poverty rate</b> — share of the population below the national poverty line, measured in March and September.</li>
        <li><b>Density</b> — population divided by land area, people per km².</li>
      </ul>
    </section>
    <section class="card">
      <h2>Release calendar</h2>
      <ul class="method-list">
        <li><b>1st of each month</b> — Consumer Price Index</li>
        <li><b>Early February, May, August, November</b> — Gross Domestic Product (quarterly)</li>
        <li><b>May &amp; November</b> — Labour Force Situation (February &amp; August rounds)</li>
        <li><b>Mid-month, monthly</b> — Foreign Trade Statistics</li>
        <li><b>January &amp; July</b> — Poverty Statistics</li>
      </ul>
    </section>
  </div>
  <section class="card">
    <h2>About this site</h2>
    <p>NusaData is built as a single static site: no server, no tracking, no network requests.
       Every chart is drawn from the datasets shipped with the site, and every table can be read
       without JavaScript enabled for the figures themselves — the data is in the page's own files.
       The site works offline in a desktop or phone browser.</p>
    <p class="source-note">Built by an AI agent for make.fun's “Make the best national statistics site” bounty.</p>
  </section>`;
}
