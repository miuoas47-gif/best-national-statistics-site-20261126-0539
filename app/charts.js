// NusaStat charts: small, dependency-free SVG charts drawn from data.js.
// Every chart is plain SVG with a <title> and labelled axes, so it reads
// without JavaScript libraries and without any network request.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

// Line chart: points is [{label, value}], valueLabel formats a tick.
export function lineChart(points, opts = {}) {
  const w = opts.width || 720, h = opts.height || 300;
  const padL = 56, padR = 16, padT = 18, padB = 34;
  const vals = points.map((p) => p.value);
  const max = niceMax(Math.max(...vals) * 1.05);
  const min = Math.min(0, Math.min(...vals) * 1.05);
  const x = (i) => padL + ((w - padL - padR) * i) / (points.length - 1);
  const y = (v) => padT + ((h - padT - padB) * (max - v)) / (max - min);
  const fmt = opts.format || ((v) => String(v));
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const v = min + (max - min) * f;
    return `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" class="grid"/>
      <text x="${padL - 8}" y="${y(v) + 4}" class="tick" text-anchor="end">${esc(fmt(Math.round(v)))}</text>`;
  }).join("");
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${path} L${x(points.length - 1).toFixed(1)},${y(min)} L${x(0).toFixed(1)},${y(min)} Z`;
  const dots = points.map((p, i) =>
    `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4" class="dot"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></circle>`
  ).join("");
  const labels = points.map((p, i) =>
    `<text x="${x(i)}" y="${h - 10}" class="tick" text-anchor="middle">${esc(p.label)}</text>`
  ).join("");
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || "Line chart")}" class="chart">
    <title>${esc(opts.title || "Line chart")}</title>${grid}
    <path d="${area}" class="area"/><path d="${path}" class="line" fill="none"/>${dots}${labels}</svg>`;
}

// Vertical bar chart.
export function barChart(points, opts = {}) {
  const w = opts.width || 720, h = opts.height || 300;
  const padL = 56, padR = 12, padT = 18, padB = 34;
  const vals = points.map((p) => p.value);
  const max = niceMax(Math.max(...vals) * 1.08);
  const min = Math.min(0, Math.min(...vals) * 1.08);
  const slot = (w - padL - padR) / points.length;
  const bw = Math.min(46, slot * 0.62);
  const y = (v) => padT + ((h - padT - padB) * (max - v)) / (max - min);
  const fmt = opts.format || ((v) => String(v));
  const grid = [0, 0.5, 1].map((f) => {
    const v = min + (max - min) * f;
    return `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" class="grid"/>
      <text x="${padL - 8}" y="${y(v) + 4}" class="tick" text-anchor="end">${esc(fmt(Math.round(v)))}</text>`;
  }).join("");
  const bars = points.map((p, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = y(Math.max(p.value, min));
    const bottom = y(Math.min(p.value, min));
    const cls = p.value < 0 ? "bar neg" : "bar";
    return `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw}" height="${Math.max(1, bottom - top).toFixed(1)}" class="${cls}">
      <title>${esc(p.label)}: ${esc(fmt(p.value))}</title></rect>
      <text x="${cx}" y="${h - 10}" class="tick" text-anchor="middle">${esc(p.label)}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || "Bar chart")}" class="chart">
    <title>${esc(opts.title || "Bar chart")}</title>${grid}${bars}</svg>`;
}

// Horizontal bar chart for ranked lists (provinces, sectors).
export function hbarChart(points, opts = {}) {
  const rowH = opts.rowHeight || 30;
  const w = opts.width || 720;
  const h = (opts.height || (points.length * rowH + 46));
  const padL = opts.labelWidth || 170, padR = 64, padT = 10;
  const max = Math.max(...points.map((p) => p.value)) * 1.05;
  const fmt = opts.format || ((v) => String(v));
  const rows = points.map((p, i) => {
    const y = padT + i * rowH;
    const bw = ((w - padL - padR) * p.value) / max;
    return `<text x="${padL - 10}" y="${y + 19}" class="tick" text-anchor="end">${esc(p.label)}</text>
      <rect x="${padL}" y="${y + 5}" width="${bw.toFixed(1)}" height="18" class="bar"><title>${esc(p.label)}: ${esc(fmt(p.value))}</title></rect>
      <text x="${padL + bw + 8}" y="${y + 19}" class="tick value">${esc(fmt(p.value))}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.title || "Horizontal bar chart")}" class="chart">
    <title>${esc(opts.title || "Horizontal bar chart")}</title>${rows}</svg>`;
}

// Donut chart with a centre label.
export function donutChart(slices, opts = {}) {
  const size = opts.size || 260;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, hole = r * 0.58;
  const total = slices.reduce((a, s) => a + s.value, 0);
  const palette = ["#0b5e4b", "#c98a1b", "#2a7f9e", "#7a4a8c", "#b3452e", "#4a6b2a", "#8c5a2b", "#3d5a80", "#6d6875"];
  let angle = -Math.PI / 2;
  const paths = slices.map((s, i) => {
    const frac = s.value / total;
    const a2 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const ix2 = cx + hole * Math.cos(a2), iy2 = cy + hole * Math.sin(a2);
    const ix1 = cx + hole * Math.cos(angle), iy1 = cy + hole * Math.sin(angle);
    angle = a2;
    return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${ix2.toFixed(1)},${iy2.toFixed(1)} A${hole},${hole} 0 ${large} 0 ${ix1.toFixed(1)},${iy1.toFixed(1)} Z"
      fill="${palette[i % palette.length]}"><title>${esc(s.label)}: ${esc(s.value)}%</title></path>`;
  }).join("");
  const legend = slices.map((s, i) =>
    `<li><span class="swatch" style="background:${palette[i % palette.length]}"></span>${esc(s.label)} — ${esc(s.value)}%</li>`
  ).join("");
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(opts.title || "Donut chart")}" class="donut">
    <title>${esc(opts.title || "Donut chart")}</title>${paths}
    <text x="${cx}" y="${cy - 4}" class="donut-centre" text-anchor="middle">${esc(opts.centre || "")}</text>
    <text x="${cx}" y="${cy + 16}" class="tick" text-anchor="middle">${esc(opts.centreSub || "")}</text></svg>
    <ul class="legend">${legend}</ul></div>`;
}
