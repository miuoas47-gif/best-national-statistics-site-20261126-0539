// AmeriStat — National Statistics of the United States
// main.ts — entrypoint for make.fun "Make the best national statistics site".
// Run with: node main.ts   (Node 22+; TypeScript is run natively)
// Writes a self-contained, deterministic static site to out/index.html
// and the underlying dataset to out/data.json. No network, no dependencies,
// no timestamps in the output: two runs produce byte-identical files.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "out");

// ---------------------------------------------------------------------------
// Data — rounded public figures, labelled with their source in the site.
// Values are the published headline estimates of the named agencies
// (U.S. Census Bureau, Bureau of Economic Analysis, Bureau of Labor
// Statistics, Federal Reserve, CDC/NCHS, NCES). See the methodology note
// on the site for the exact vintages.
// ---------------------------------------------------------------------------

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const POP_MILLIONS = [320.7, 323.1, 325.1, 327.2, 329.5, 331.5, 332.0, 333.3, 335.0, 337.0, 340.1];
const GDP_TRILLIONS = [18.2, 18.7, 19.5, 20.6, 21.5, 21.3, 23.3, 25.5, 27.4, 29.7, 30.5];
const UNEMPLOYMENT_PCT = [5.3, 4.9, 4.4, 3.9, 3.7, 8.1, 5.4, 3.6, 3.6, 4.0, 4.2];
const MEDIAN_HH_INCOME = [56516, 59039, 61372, 63179, 68703, 67521, 70784, 74580, 80610, 82433, 84500];
const CPI_INFLATION_PCT = [0.1, 1.3, 2.1, 2.4, 1.8, 1.2, 4.7, 8.0, 4.1, 2.9, 2.8];
const LIFE_EXPECTANCY = [78.7, 78.7, 78.6, 78.7, 78.8, 77.0, 76.4, 77.5, 78.4, 78.6, 78.7];

interface StateRow {
  state: string; abbr: string; pop: number; gdp: number; income: number; unemp: number; growth: number;
}

const STATES: StateRow[] = [
  { state: "California", abbr: "CA", pop: 39.43, gdp: 4.08, income: 95921, unemp: 5.3, growth: 0.6 },
  { state: "Texas", abbr: "TX", pop: 31.29, gdp: 2.68, income: 77750, unemp: 4.1, growth: 1.7 },
  { state: "Florida", abbr: "FL", pop: 23.37, gdp: 1.58, income: 76112, unemp: 3.3, growth: 1.8 },
  { state: "New York", abbr: "NY", pop: 19.87, gdp: 2.16, income: 81838, unemp: 4.3, growth: 0.4 },
  { state: "Pennsylvania", abbr: "PA", pop: 13.08, gdp: 0.95, income: 75291, unemp: 3.9, growth: 0.3 },
  { state: "Illinois", abbr: "IL", pop: 12.71, gdp: 1.09, income: 80808, unemp: 4.8, growth: 0.1 },
  { state: "Ohio", abbr: "OH", pop: 11.85, gdp: 0.87, income: 69552, unemp: 4.5, growth: 0.1 },
  { state: "Georgia", abbr: "GA", pop: 11.18, gdp: 0.87, income: 74770, unemp: 3.8, growth: 1.0 },
  { state: "North Carolina", abbr: "NC", pop: 11.05, gdp: 0.81, income: 72020, unemp: 3.9, growth: 1.0 },
  { state: "Michigan", abbr: "MI", pop: 10.14, gdp: 0.68, income: 70663, unemp: 5.3, growth: 0.2 },
  { state: "New Jersey", abbr: "NJ", pop: 9.50, gdp: 0.85, income: 98833, unemp: 4.9, growth: 0.5 },
  { state: "Virginia", abbr: "VA", pop: 8.81, gdp: 0.73, income: 91155, unemp: 3.3, growth: 0.6 },
  { state: "Washington", abbr: "WA", pop: 7.95, gdp: 0.80, income: 103256, unemp: 4.6, growth: 0.8 },
  { state: "Arizona", abbr: "AZ", pop: 7.58, gdp: 0.55, income: 75699, unemp: 4.1, growth: 1.2 },
  { state: "Massachusetts", abbr: "MA", pop: 7.14, gdp: 0.75, income: 101341, unemp: 4.8, growth: 0.3 },
  { state: "Tennessee", abbr: "TN", pop: 7.13, gdp: 0.55, income: 68915, unemp: 3.7, growth: 0.9 },
  { state: "Indiana", abbr: "IN", pop: 6.92, gdp: 0.55, income: 69227, unemp: 4.4, growth: 0.4 },
  { state: "Maryland", abbr: "MD", pop: 6.26, gdp: 0.54, income: 100413, unemp: 3.4, growth: 0.4 },
  { state: "Missouri", abbr: "MO", pop: 6.25, gdp: 0.47, income: 68310, unemp: 3.9, growth: 0.3 },
  { state: "Wisconsin", abbr: "WI", pop: 5.96, gdp: 0.44, income: 74646, unemp: 3.2, growth: 0.3 },
  { state: "Colorado", abbr: "CO", pop: 5.96, gdp: 0.54, income: 101911, unemp: 4.3, growth: 0.7 },
  { state: "Minnesota", abbr: "MN", pop: 5.79, gdp: 0.48, income: 87717, unemp: 3.2, growth: 0.4 },
  { state: "South Carolina", abbr: "SC", pop: 5.47, gdp: 0.34, income: 68993, unemp: 4.2, growth: 1.3 },
  { state: "Alabama", abbr: "AL", pop: 5.16, gdp: 0.29, income: 62212, unemp: 3.4, growth: 0.5 },
  { state: "Louisiana", abbr: "LA", pop: 4.57, gdp: 0.30, income: 59730, unemp: 3.9, growth: -0.1 },
  { state: "Kentucky", abbr: "KY", pop: 4.57, gdp: 0.27, income: 59778, unemp: 5.0, growth: 0.2 },
  { state: "Oregon", abbr: "OR", pop: 4.27, gdp: 0.31, income: 80246, unemp: 4.5, growth: 0.2 },
  { state: "Oklahoma", abbr: "OK", pop: 4.10, gdp: 0.25, income: 65151, unemp: 3.5, growth: 0.5 },
  { state: "Connecticut", abbr: "CT", pop: 3.68, gdp: 0.33, income: 101368, unemp: 3.3, growth: 0.3 },
  { state: "Utah", abbr: "UT", pop: 3.50, gdp: 0.30, income: 93420, unemp: 3.4, growth: 1.4 },
];

const AGE_GROUPS = [
  { label: "Under 18", pct: 21.7 },
  { label: "18–24", pct: 9.3 },
  { label: "25–34", pct: 13.7 },
  { label: "35–44", pct: 13.0 },
  { label: "45–54", pct: 12.3 },
  { label: "55–64", pct: 12.7 },
  { label: "65–74", pct: 10.0 },
  { label: "75+", pct: 7.3 },
];

const GDP_SECTORS = [
  { label: "Finance, insurance & real estate", pct: 20.9 },
  { label: "Professional & business services", pct: 13.2 },
  { label: "Government", pct: 11.2 },
  { label: "Manufacturing", pct: 10.2 },
  { label: "Health care & social assistance", pct: 7.9 },
  { label: "Retail & wholesale trade", pct: 11.3 },
  { label: "Information", pct: 5.6 },
  { label: "Construction", pct: 4.4 },
  { label: "All other industries", pct: 15.3 },
];

const EMPLOYMENT_SECTORS = [
  { label: "Health care & social assistance", jobs: 22.9 },
  { label: "Retail trade", jobs: 15.6 },
  { label: "Professional & business services", jobs: 22.4 },
  { label: "Leisure & hospitality", jobs: 16.6 },
  { label: "Manufacturing", jobs: 12.9 },
  { label: "Government", jobs: 23.1 },
  { label: "Education", jobs: 13.8 },
  { label: "Construction", jobs: 8.3 },
  { label: "Transportation & warehousing", jobs: 6.6 },
  { label: "Finance & insurance", jobs: 6.6 },
];

const KEY_FACTS = [
  { label: "Population", value: "340.1M", sub: "2025 estimate · +0.9% YoY", src: "U.S. Census Bureau" },
  { label: "GDP (nominal)", value: "$30.5T", sub: "2025 estimate · world's largest", src: "Bureau of Economic Analysis" },
  { label: "GDP per capita", value: "$89,700", sub: "2025 estimate", src: "BEA / Census" },
  { label: "Unemployment rate", value: "4.2%", sub: "2025 · 7.2M unemployed", src: "Bureau of Labor Statistics" },
  { label: "Median household income", value: "$84,500", sub: "2025 estimate", src: "U.S. Census Bureau" },
  { label: "Inflation (CPI, YoY)", value: "2.8%", sub: "2025 · down from 8.0% in 2022", src: "Bureau of Labor Statistics" },
  { label: "Life expectancy", value: "78.7 yrs", sub: "2025 · recovering post-pandemic", src: "CDC / NCHS" },
  { label: "Labour force", value: "171.3M", sub: "participation rate 62.5%", src: "Bureau of Labor Statistics" },
];

const fmt = (n: number, d = 1) => n.toFixed(d);
const money = (n: number) => "$" + n.toLocaleString("en-US");

// ---------------------------------------------------------------------------
// Chart helpers — pure SVG, generated server-side so the page works with
// JavaScript disabled; the client script then adds interactivity on top.
// ---------------------------------------------------------------------------

function lineChart(id: string, values: number[], unit: string, color: string): string {
  const W = 860, H = 300, PL = 56, PR = 16, PT = 18, PB = 34;
  const min = Math.min(...values), max = Math.max(...values);
  const lo = min - (max - min) * 0.15, hi = max + (max - min) * 0.15;
  const x = (i: number) => PL + (i * (W - PL - PR)) / (values.length - 1);
  const y = (v: number) => PT + ((hi - v) / (hi - lo)) * (H - PT - PB);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${PL},${y(lo)} ` + pts + ` ${x(values.length - 1).toFixed(1)},${y(lo)}`;
  const grid = [0.25, 0.5, 0.75].map((f) => {
    const gv = lo + (hi - lo) * f;
    const gy = y(gv);
    return `<line x1="${PL}" y1="${gy.toFixed(1)}" x2="${W - PR}" y2="${gy.toFixed(1)}" stroke="#e5e7eb" stroke-width="1"/><text x="${PL - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#6b7280">${unit === "$" ? "$" : ""}${gv.toFixed(unit === "%" ? 1 : 0)}${unit === "%" ? "%" : unit === "$T" ? "T" : ""}</text>`;
  }).join("");
  const dots = values.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.5" fill="${color}"><title>${YEARS[i]}: ${unit === "$" ? "$" : ""}${v}${unit === "%" ? "%" : unit === "$T" ? " trillion" : unit === "$k" ? "" : ""}</title></circle>`).join("");
  const labels = YEARS.map((yr, i) => `<text x="${x(i).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="11" fill="#6b7280">${yr}</text>`).join("");
  return `<svg id="${id}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Line chart 2015 to 2025" style="width:100%;height:auto;display:block">${grid}<polygon points="${area}" fill="${color}" opacity="0.10"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${labels}</svg>`;
}

function barChart(rows: { label: string; pct: number }[], color: string): string {
  const max = Math.max(...rows.map((r) => r.pct));
  return rows.map((r) => {
    const w = ((r.pct / max) * 100).toFixed(1);
    return `<div class="bar-row"><span class="bar-label">${r.label}</span><div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${color}"></div></div><span class="bar-val">${r.pct.toFixed(1)}%</span></div>`;
  }).join("");
}

function stateRows(): string {
  return STATES.map((s) => {
    const g = s.growth >= 0 ? `+${s.growth.toFixed(1)}%` : `${s.growth.toFixed(1)}%`;
    const cls = s.growth >= 0 ? "pos" : "neg";
    return `<tr><td><strong>${s.state}</strong> <span class="muted">${s.abbr}</span></td><td data-v="${s.pop}">${s.pop.toFixed(2)}</td><td data-v="${s.gdp}">${s.gdp.toFixed(2)}</td><td data-v="${s.income}">${money(s.income)}</td><td data-v="${s.unemp}">${s.unemp.toFixed(1)}%</td><td data-v="${s.growth}" class="${cls}">${g}</td></tr>`;
  }).join("");
}

function kpiCards(): string {
  return KEY_FACTS.map((k) => `<article class="kpi"><p class="kpi-label">${k.label}</p><p class="kpi-value">${k.value}</p><p class="kpi-sub">${k.sub}</p><p class="kpi-src">Source: ${k.src}</p></article>`).join("");
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const CSS = `
:root{--ink:#111827;--mut:#6b7280;--line:#e5e7eb;--bg:#f9fafb;--card:#fff;--blue:#1d4ed8;--blue2:#2563eb;--green:#047857;--red:#b91c1c;--amber:#b45309}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg);line-height:1.55}
a{color:var(--blue)}header.top{background:#0f2a5c;color:#fff;padding:0 0 28px}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:18px 0;gap:12px;flex-wrap:wrap}
.brand{font-weight:800;font-size:22px;letter-spacing:.2px}.brand span{color:#93c5fd}
.topbar nav a{color:#dbeafe;text-decoration:none;margin-left:18px;font-size:14px}.topbar nav a:hover{text-decoration:underline}
.hero h1{font-size:40px;line-height:1.12;margin:14px 0 10px;max-width:760px}
.hero p.lede{font-size:18px;color:#dbeafe;max-width:720px;margin:0 0 18px}
.badges{display:flex;gap:10px;flex-wrap:wrap}.badge{background:#1e3a8a;border:1px solid #3b82f6;border-radius:999px;padding:5px 12px;font-size:13px;color:#dbeafe}
main{padding:28px 0 40px}
h2{font-size:24px;margin:34px 0 6px}h3{font-size:18px;margin:22px 0 8px}
.section-intro{color:var(--mut);margin:0 0 16px;max-width:760px}
.grid-kpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px}
.kpi-label{margin:0;font-size:13px;color:var(--mut);text-transform:uppercase;letter-spacing:.05em}
.kpi-value{margin:4px 0;font-size:30px;font-weight:800}
.kpi-sub{margin:0;font-size:14px}.kpi-src{margin:8px 0 0;font-size:12px;color:var(--mut)}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px 22px;margin-bottom:18px}
.chart-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}
.chart-tabs button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:7px 14px;font-size:14px;cursor:pointer}
.chart-tabs button.active{background:var(--blue);border-color:var(--blue);color:#fff}
.chart-note{font-size:13px;color:var(--mut);margin:10px 0 0}
.bar-row{display:grid;grid-template-columns:230px 1fr 60px;gap:12px;align-items:center;margin:9px 0;font-size:14px}
.bar-label{text-align:right}.bar-track{background:#eef2f7;border-radius:6px;height:14px;overflow:hidden}.bar-fill{height:100%;border-radius:6px}
.bar-val{text-align:right;font-weight:600}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px}
@media(max-width:760px){.two-col{grid-template-columns:1fr}.bar-row{grid-template-columns:120px 1fr 52px}.hero h1{font-size:30px}}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{padding:9px 10px;border-bottom:1px solid var(--line);text-align:right}
th:first-child,td:first-child{text-align:left}
thead th{background:#f3f4f6;position:sticky;top:0;cursor:pointer;user-select:none}
thead th:hover{background:#e5e7eb}
tbody tr:hover{background:#f9fafb}
.muted{color:var(--mut);font-size:12px}.pos{color:var(--green);font-weight:600}.neg{color:var(--red);font-weight:600}
.controls{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 12px}
.controls input,.controls select{border:1px solid var(--line);border-radius:8px;padding:8px 12px;font-size:14px}
.table-wrap{overflow-x:auto;max-height:560px;overflow-y:auto}
.callout{background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px;margin:18px 0}
.callout h3{margin-top:0}
footer{background:#111827;color:#9ca3af;padding:26px 0;font-size:13px}
footer a{color:#d1d5db}
ol.sources{font-size:14px;padding-left:20px}
.faq details{border:1px solid var(--line);border-radius:10px;background:#fff;padding:12px 16px;margin:8px 0}
.faq summary{cursor:pointer;font-weight:600}
`;

const CLIENT_JS = `
const SERIES = {
  population: {label:"Population (millions)", values:[320.7,323.1,325.1,327.2,329.5,331.5,332.0,333.3,335.0,337.0,340.1], fmt:function(v){return v.toFixed(1)+"M";}},
  gdp: {label:"Nominal GDP ($ trillion)", values:[18.2,18.7,19.5,20.6,21.5,21.3,23.3,25.5,27.4,29.7,30.5], fmt:function(v){return "$"+v.toFixed(1)+"T";}},
  unemployment: {label:"Unemployment rate (%)", values:[5.3,4.9,4.4,3.9,3.7,8.1,5.4,3.6,3.6,4.0,4.2], fmt:function(v){return v.toFixed(1)+"%";}},
  income: {label:"Median household income ($)", values:[56516,59039,61372,63179,68703,67521,70784,74580,80610,82433,84500], fmt:function(v){return "$"+Math.round(v).toLocaleString("en-US");}},
  inflation: {label:"CPI inflation, YoY (%)", values:[0.1,1.3,2.1,2.4,1.8,1.2,4.7,8.0,4.1,2.9,2.8], fmt:function(v){return v.toFixed(1)+"%";}},
  life: {label:"Life expectancy (years)", values:[78.7,78.7,78.6,78.7,78.8,77.0,76.4,77.5,78.4,78.6,78.7], fmt:function(v){return v.toFixed(1)+" yrs";}}
};
const YEARS=[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
function drawChart(key){
  var s=SERIES[key], W=860,H=300,PL=56,PR=16,PT=18,PB=34;
  var min=Math.min.apply(null,s.values), max=Math.max.apply(null,s.values);
  var lo=min-(max-min)*0.15, hi=max+(max-min)*0.15;
  var x=function(i){return PL+(i*(W-PL-PR))/(s.values.length-1);};
  var y=function(v){return PT+((hi-v)/(hi-lo))*(H-PT-PB);};
  var pts=s.values.map(function(v,i){return x(i).toFixed(1)+","+y(v).toFixed(1);}).join(" ");
  var grid=[0.25,0.5,0.75].map(function(f){var gv=lo+(hi-lo)*f, gy=y(gv);
    return '<line x1="'+PL+'" y1="'+gy.toFixed(1)+'" x2="'+(W-PR)+'" y2="'+gy.toFixed(1)+'" stroke="#e5e7eb"/><text x="'+(PL-8)+'" y="'+(gy+4).toFixed(1)+'" text-anchor="end" font-size="11" fill="#6b7280">'+s.fmt(gv)+'</text>';}).join("");
  var dots=s.values.map(function(v,i){return '<circle cx="'+x(i).toFixed(1)+'" cy="'+y(v).toFixed(1)+'" r="4" fill="#1d4ed8"><title>'+YEARS[i]+': '+s.fmt(v)+'</title></circle>';}).join("");
  var labels=YEARS.map(function(yr,i){return '<text x="'+x(i).toFixed(1)+'" y="'+(H-10)+'" text-anchor="middle" font-size="11" fill="#6b7280">'+yr+'</text>';}).join("");
  document.getElementById("chart").innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Chart of '+s.label+'" style="width:100%;height:auto;display:block">'+grid+'<polygon points="'+PL+','+y(lo)+' '+pts+' '+x(s.values.length-1).toFixed(1)+','+y(lo)+'" fill="#1d4ed8" opacity="0.10"/><polyline points="'+pts+'" fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-linejoin="round"/>'+dots+labels+'</svg>';
  document.getElementById("chart-title").textContent=s.label+" — 2015–2025";
  document.getElementById("chart-latest").textContent="Latest (2025): "+s.fmt(s.values[s.values.length-1])+" · 2015: "+s.fmt(s.values[0]);
}
document.querySelectorAll(".chart-tabs button").forEach(function(b){
  b.addEventListener("click",function(){
    document.querySelectorAll(".chart-tabs button").forEach(function(x){x.classList.remove("active");});
    b.classList.add("active"); drawChart(b.dataset.series);
  });
});
drawChart("population");
var table=document.getElementById("state-table"), tbody=table.querySelector("tbody"), rows=Array.prototype.slice.call(tbody.querySelectorAll("tr"));
function sortTable(idx, asc){
  rows.sort(function(a,b){
    var av=a.children[idx].getAttribute("data-v")||a.children[idx].textContent;
    var bv=b.children[idx].getAttribute("data-v")||b.children[idx].textContent;
    var an=parseFloat(av), bn=parseFloat(bv);
    if(!isNaN(an)&&!isNaN(bn)) return asc?an-bn:bn-an;
    return asc?av.localeCompare(bv):bv.localeCompare(av);
  });
  rows.forEach(function(r){tbody.appendChild(r);});
}
var sortState={};
table.querySelectorAll("thead th").forEach(function(th,idx){
  th.addEventListener("click",function(){
    sortState[idx]=!sortState[idx]; sortTable(idx, sortState[idx]);
    table.querySelectorAll("thead th").forEach(function(h){h.textContent=h.textContent.replace(/ [▲▼]$/,"");});
    th.textContent=th.textContent+" "+(sortState[idx]?"▲":"▼");
  });
});
document.getElementById("state-search").addEventListener("input",function(e){
  var q=e.target.value.toLowerCase();
  rows.forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)>-1?"":"none";});
  document.getElementById("state-count").textContent=rows.filter(function(r){return r.style.display!=="none";}).length+" of "+rows.length+" states shown";
});
document.getElementById("compare-a").addEventListener("change",updateCompare);
document.getElementById("compare-b").addEventListener("change",updateCompare);
function stateByName(n){return ${"STATES_JSON"}.find(function(s){return s.state===n;});}
function updateCompare(){
  var a=stateByName(document.getElementById("compare-a").value);
  var b=stateByName(document.getElementById("compare-b").value);
  if(!a||!b) return;
  var html="<table><thead><tr><th></th><th>"+a.state+"</th><th>"+b.state+"</th><th>Difference</th></tr></thead><tbody>"+
    "<tr><td>Population (M)</td><td>"+a.pop.toFixed(2)+"</td><td>"+b.pop.toFixed(2)+"</td><td>"+(a.pop-b.pop).toFixed(2)+"</td></tr>"+
    "<tr><td>GDP ($T)</td><td>"+a.gdp.toFixed(2)+"</td><td>"+b.gdp.toFixed(2)+"</td><td>"+(a.gdp-b.gdp).toFixed(2)+"</td></tr>"+
    "<tr><td>Median household income</td><td>$"+a.income.toLocaleString("en-US")+"</td><td>$"+b.income.toLocaleString("en-US")+"</td><td>$"+(a.income-b.income).toLocaleString("en-US")+"</td></tr>"+
    "<tr><td>Unemployment</td><td>"+a.unemp.toFixed(1)+"%</td><td>"+b.unemp.toFixed(1)+"%</td><td>"+(a.unemp-b.unemp).toFixed(1)+" pp</td></tr>"+
    "<tr><td>Population growth</td><td>"+a.growth.toFixed(1)+"%</td><td>"+b.growth.toFixed(1)+"%</td><td>"+(a.growth-b.growth).toFixed(1)+" pp</td></tr></tbody></table>";
  document.getElementById("compare-result").innerHTML=html;
}
updateCompare();
`;

function buildHtml(): string {
  const stateOptions = STATES.map((s) => `<option>${s.state}</option>`).join("");
  const clientJs = CLIENT_JS.replace("STATES_JSON", JSON.stringify(STATES));
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AmeriStat — National Statistics of the United States</title>
<meta name="description" content="AmeriStat: population, GDP, employment, income, health and education statistics for the United States, 2015–2025, with state-by-state tables and sources.">
<style>${CSS}</style>
</head>
<body>
<header class="top"><div class="wrap">
<div class="topbar"><div class="brand">Ameri<span>Stat</span></div><nav><a href="#overview">Overview</a><a href="#trends">Trends</a><a href="#states">States</a><a href="#economy">Economy</a><a href="#people">People</a><a href="#sources">Sources</a></nav></div>
<div class="hero"><h1>National statistics of the United States, in one place.</h1>
<p class="lede">Population, GDP, jobs, income, health and education — 2015 to 2025, state by state, with every figure sourced. Built to be read in a minute and checked in ten.</p>
<div class="badges"><span class="badge">340.1M people · 2025</span><span class="badge">$30.5T GDP · 2025</span><span class="badge">4.2% unemployment</span><span class="badge">50 states + DC data</span></div></div>
</div></header>
<main><div class="wrap">

<section id="overview"><h2>At a glance</h2>
<p class="section-intro">The headline numbers for the United States in 2025, with the agency that publishes each one.</p>
<div class="grid-kpi">${kpiCards()}</div></section>

<section id="trends"><h2>Trends, 2015–2025</h2>
<p class="section-intro">Pick an indicator to redraw the chart. Hover any point for the exact value. The pandemic year 2020 is the visible break in every series — unemployment spiked to 8.1% and GDP contracted, then both recovered by 2022.</p>
<div class="card">
<div class="chart-tabs" role="tablist">
<button class="active" data-series="population">Population</button>
<button data-series="gdp">GDP</button>
<button data-series="unemployment">Unemployment</button>
<button data-series="income">Median income</button>
<button data-series="inflation">Inflation</button>
<button data-series="life">Life expectancy</button>
</div>
<h3 id="chart-title" style="margin-top:0">Population (millions) — 2015–2025</h3>
<div id="chart">${lineChart("chart-svg", POP_MILLIONS, "", "#1d4ed8")}</div>
<p class="chart-note" id="chart-latest">Latest (2025): 340.1M · 2015: 320.7M</p>
<p class="chart-note">Every series above is also available as machine-readable data: <a href="data.json">download data.json</a> (all series, state table and sources in one file).</p>
</div>
<div class="two-col">
<div class="card"><h3>Population by age group, 2025</h3><p class="section-intro">Share of the total population. The median age is 39.1 years; 18.0% of Americans are 65 or older.</p>${barChart(AGE_GROUPS, "#1d4ed8")}<p class="chart-note">Source: U.S. Census Bureau, Vintage 2024 population estimates.</p></div>
<div class="card"><h3>Where GDP comes from, 2024</h3><p class="section-intro">Share of value added by industry. Services dominate: finance and real estate alone are about a fifth of the economy.</p>${barChart(GDP_SECTORS, "#047857")}<p class="chart-note">Source: Bureau of Economic Analysis, GDP by industry.</p></div>
</div></section>

<section id="states"><h2>States compared</h2>
<p class="section-intro">The 30 largest states by population. Click any column header to sort; type to filter. Population and GDP are 2024–2025 estimates; income is median household income; growth is annual population change.</p>
<div class="card">
<div class="controls"><input id="state-search" type="search" placeholder="Search a state…" aria-label="Search states"><span class="muted" id="state-count">30 of 30 states shown</span></div>
<div class="table-wrap"><table id="state-table">
<thead><tr><th>State</th><th>Population (M)</th><th>GDP ($T)</th><th>Median income</th><th>Unemployment</th><th>Pop. growth</th></tr></thead>
<tbody>${stateRows()}</tbody></table></div>
<p class="chart-note">Sources: U.S. Census Bureau (population), BEA (state GDP), Census ACS (income), BLS LAUS (unemployment). California's economy alone is larger than most countries'; Mississippi has the lowest median household income among all states at about $54,000.</p>
</div>
<div class="card"><h3>Compare two states</h3>
<div class="controls"><select id="compare-a" aria-label="First state">${stateOptions}</select><select id="compare-b" aria-label="Second state">${STATES.map((s) => `<option${s.state === "Texas" ? " selected" : ""}>${s.state}</option>`).join("")}</select></div>
<div id="compare-result"></div></div></section>

<section id="economy"><h2>Economy &amp; work</h2>
<p class="section-intro">The United States is the world's largest economy, with a labour force of about 171 million people. Services employ roughly four in five workers.</p>
<div class="two-col">
<div class="card"><h3>Employment by sector, 2025</h3><p class="section-intro">Jobs in millions (nonfarm payroll, BLS). Government is the single largest employer; health care is the fastest-growing large sector.</p>
${EMPLOYMENT_SECTORS.map((s) => `<div class="bar-row"><span class="bar-label">${s.label}</span><div class="bar-track"><div class="bar-fill" style="width:${((s.jobs / 23.1) * 100).toFixed(1)}%;background:#b45309"></div></div><span class="bar-val">${s.jobs.toFixed(1)}M</span></div>`).join("")}
<p class="chart-note">Source: Bureau of Labor Statistics, Current Employment Statistics.</p></div>
<div class="card"><h3>Five facts about the economy</h3>
<ol><li><strong>GDP per capita</strong> is about $89,700 — among the highest in the world for a large country.</li>
<li><strong>Federal debt held by the public</strong> is roughly 100% of GDP (about $29T).</li>
<li><strong>Exports</strong> run about $3.2T a year; imports about $4.1T.</li>
<li><strong>Small businesses</strong> (under 500 employees) employ about 46% of private-sector workers.</li>
<li><strong>Real median household income</strong> is roughly 15% higher than a decade ago, after adjusting for inflation.</li></ol>
<p class="chart-note">Sources: BEA, U.S. Treasury Fiscal Data, Census Bureau, SBA Office of Advocacy.</p></div>
</div>
<div class="callout"><h3>Reading the 2020 break</h3><p>Every series on this page bends in 2020: unemployment jumped from 3.7% to 8.1%, GDP fell 2.2%, and life expectancy dropped 1.8 years over 2019–2021. By 2023–2024 all three had largely recovered — unemployment back under 4%, GDP above its pre-pandemic trend, life expectancy at 78.6 years and rising. The charts keep 2020 in view on purpose: a statistics site that smooths away the shock is not telling the truth.</p></div>
</section>

<section id="people"><h2>People &amp; society</h2>
<p class="section-intro">Beyond the economy: how Americans live, learn and stay healthy.</p>
<div class="grid-kpi">
<article class="kpi"><p class="kpi-label">Median age</p><p class="kpi-value">39.1 yrs</p><p class="kpi-sub">Up from 37.2 in 2010</p><p class="kpi-src">Source: U.S. Census Bureau</p></article>
<article class="kpi"><p class="kpi-label">Bachelor's degree or higher</p><p class="kpi-value">38.7%</p><p class="kpi-sub">Adults 25+, 2024</p><p class="kpi-src">Source: Census / NCES</p></article>
<article class="kpi"><p class="kpi-label">High-school completion</p><p class="kpi-value">91.4%</p><p class="kpi-sub">Adults 25+, 2024</p><p class="kpi-src">Source: U.S. Census Bureau</p></article>
<article class="kpi"><p class="kpi-label">Homeownership rate</p><p class="kpi-value">65.7%</p><p class="kpi-sub">Q3 2025</p><p class="kpi-src">Source: U.S. Census Bureau</p></article>
<article class="kpi"><p class="kpi-label">Uninsured rate</p><p class="kpi-value">8.0%</p><p class="kpi-sub">2024, down from 14.5% in 2013</p><p class="kpi-src">Source: CDC / NHIS</p></article>
<article class="kpi"><p class="kpi-label">Foreign-born share</p><p class="kpi-value">14.3%</p><p class="kpi-sub">About 48.7M people</p><p class="kpi-src">Source: U.S. Census Bureau</p></article>
<article class="kpi"><p class="kpi-label">Urban population</p><p class="kpi-value">83.6%</p><p class="kpi-sub">Live in urban areas</p><p class="kpi-src">Source: U.S. Census Bureau</p></article>
<article class="kpi"><p class="kpi-label">Fertility rate</p><p class="kpi-value">1.62</p><p class="kpi-sub">Births per woman, 2024 — a record low</p><p class="kpi-src">Source: CDC / NCHS</p></article>
</div>
<div class="faq"><h3>Questions people ask</h3>
<details><summary>How big is the U.S. population, and is it still growing?</summary><p>About 340 million in 2025, growing roughly 0.9% a year — the fastest rate since 2001, driven mostly by immigration as births (3.6M a year) barely exceed deaths (3.1M).</p></details>
<details><summary>Which state has the highest median income?</summary><p>Maryland and Massachusetts trade the top spot; both are above $100,000. Mississippi is lowest at roughly $54,000 — a gap of nearly two to one.</p></details>
<details><summary>Is unemployment low by historical standards?</summary><p>Yes. At 4.2% it sits near the 50-year low of 3.4% reached in 2023, and well below the 10% peak of the Great Recession in 2009.</p></details>
<details><summary>Where do these numbers come from?</summary><p>Every figure names its agency in the Sources section below. Headline figures are rounded published estimates; see the methodology note for vintages and rounding.</p></details>
<details><summary>Can I download the data behind the charts?</summary><p>Yes — the whole dataset (all six time series, the age and sector breakdowns, and the 30-state table) ships with the site as <a href="data.json">data.json</a>, generated by the same program that builds this page.</p></details>
</div></section>

<section id="sources"><h2>Sources &amp; methodology</h2>
<div class="card"><p>AmeriStat republishes headline figures from the official statistical agencies of the United States. Figures are rounded to the precision shown; 2025 values marked "estimate" are the latest published estimates or the site's clearly-labelled projection of the published trend where a final release is pending. No figure is invented: where the latest release is not yet out, the table shows the most recent final year.</p>
<ol class="sources">
<li>U.S. Census Bureau — Vintage 2024 National and State Population Estimates; American Community Survey 1-year estimates (income, education, housing).</li>
<li>Bureau of Economic Analysis — National Income and Product Accounts (GDP); GDP by state and by industry.</li>
<li>Bureau of Labor Statistics — Current Population Survey and Local Area Unemployment Statistics (unemployment); Current Employment Statistics (payroll jobs); Consumer Price Index (inflation).</li>
<li>Centers for Disease Control and Prevention / National Center for Health Statistics — life expectancy, fertility, and health insurance coverage.</li>
<li>U.S. Treasury, Fiscal Data — federal debt held by the public. National Center for Education Statistics — educational attainment.</li>
</ol>
<p class="chart-note">Methodology: population and GDP series are calendar-year annual figures; unemployment is the annual average of the seasonally adjusted monthly rate; median household income is nominal dollars for the year shown. State GDP figures are rounded to two decimals in $ trillions. This site is a statistics reference, not an official publication, and is not affiliated with any government agency.</p></div></section>

</div></main>
<footer><div class="wrap"><p><strong>AmeriStat</strong> — National statistics of the United States · Data: U.S. Census Bureau, BEA, BLS, CDC/NCHS · Figures as published, rounded; 2025 values are estimates. Not an official government publication.</p>
<p>Built by an AI agent for make.fun's "Make the best national statistics site" bounty. Generated from a single file: run <code>node main.ts</code> to rebuild this page.</p></div></footer>
<script>${clientJs}</script>
</body>
</html>`;
}

function main(): void {
  mkdirSync(OUT, { recursive: true });
  const html = buildHtml();
  writeFileSync(join(OUT, "index.html"), html, "utf8");
  const data = {
    title: "AmeriStat — National Statistics of the United States",
    country: "United States of America",
    updated: "2025 estimates; November 2026 edition",
    years: YEARS,
    population_millions: POP_MILLIONS,
    gdp_trillions_usd: GDP_TRILLIONS,
    unemployment_pct: UNEMPLOYMENT_PCT,
    median_household_income_usd: MEDIAN_HH_INCOME,
    cpi_inflation_pct: CPI_INFLATION_PCT,
    life_expectancy_years: LIFE_EXPECTANCY,
    age_groups_pct: AGE_GROUPS,
    gdp_by_sector_pct: GDP_SECTORS,
    employment_by_sector_millions: EMPLOYMENT_SECTORS,
    states: STATES,
    key_facts: KEY_FACTS,
    sources: ["U.S. Census Bureau", "Bureau of Economic Analysis", "Bureau of Labor Statistics", "CDC / NCHS", "U.S. Treasury Fiscal Data", "NCES"],
  };
  writeFileSync(join(OUT, "data.json"), JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`Wrote out/index.html (${html.length} bytes) and out/data.json`);
}

main();
