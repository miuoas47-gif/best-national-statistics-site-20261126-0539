// NusaData — small SVG chart builders. No library, no network: every
// chart is drawn from the datasets in data.js into plain inline SVG.

const INK = '#123f3c';
const TEAL = '#0f766e';
const TEAL_LIGHT = '#5eead4';
const AMBER = '#d97706';
const SLATE = '#64748b';
const GRID = '#e2e8f0';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceMax(values) {
  const max = Math.max(...values.map(Math.abs));
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / pow) * pow;
}

function axisLabels(svg, min, max, x0, x1, yBottom, yTop) {
  let out = '';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = min + ((max - min) * i) / steps;
    const y = yBottom - ((yBottom - yTop) * i) / steps;
    out += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;
    out += `<text x="${x0 - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="${SLATE}">${esc(trimNum(v))}</text>`;
  }
  return out;
}

function trimNum(v) {
  const r = Math.round(v * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
}

// Vertical bar chart. labels: string[], values: number[].
export function barChart(labels, values, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 300;
  const padL = 52, padR = 12, padT = 14, padB = 34;
  const min = Math.min(0, ...values);
  const max = niceMax(values);
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const zeroY = padT + (plotH * (max - 0)) / (max - min);
  const bw = Math.min(42, (plotW / values.length) * 0.62);
  let bars = '';
  values.forEach((v, i) => {
    const x = padL + (plotW * (i + 0.5)) / values.length - bw / 2;
    const y = padT + (plotH * (max - Math.max(v, 0))) / (max - min);
    const bh = Math.abs((plotH * v) / (max - min));
    const fill = v < 0 ? '#b45309' : (opts.highlight === i ? AMBER : TEAL);
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(bh, 1).toFixed(1)}" rx="3" fill="${fill}"/>`;
    bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${esc(trimNum(v))}</text>`;
    bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="${SLATE}">${esc(labels[i])}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.label || 'Bar chart')}">
    ${axisLabels('', min, max, padL, w - padR, zeroY, padT)}
    <line x1="${padL}" y1="${zeroY}" x2="${w - padR}" y2="${zeroY}" stroke="${SLATE}" stroke-width="1"/>
    ${bars}</svg>`;
}

// Line chart with dots and value labels.
export function lineChart(labels, values, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 300;
  const padL = 52, padR = 18, padT = 18, padB = 34;
  const min = Math.min(0, ...values);
  const max = niceMax(values);
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const px = (i) => padL + (plotW * i) / (values.length - 1);
  const py = (v) => padT + (plotH * (max - v)) / (max - min);
  const zeroY = py(0);
  let points = '';
  let dots = '';
  values.forEach((v, i) => {
    points += `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)} `;
    dots += `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="4" fill="#fff" stroke="${TEAL}" stroke-width="2.5"/>`;
    dots += `<text x="${px(i).toFixed(1)}" y="${(py(v) - 10).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${esc(trimNum(v))}</text>`;
    dots += `<text x="${px(i).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="${SLATE}">${esc(labels[i])}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.label || 'Line chart')}">
    ${axisLabels('', min, max, padL, w - padR, zeroY, padT)}
    <line x1="${padL}" y1="${zeroY}" x2="${w - padR}" y2="${zeroY}" stroke="${SLATE}" stroke-width="1"/>
    <path d="${points.trim()}" fill="none" stroke="${opts.color || TEAL}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}</svg>`;
}

// Donut chart with a centre label and a legend list.
export function donutChart(items, opts = {}) {
  const size = opts.size || 240;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r - 34;
  const total = items.reduce((s, it) => s + it.share, 0);
  const palette = ['#0f766e', '#d97706', '#2563eb', '#7c3aed', '#db2777', '#0891b2', '#65a30d', '#ea580c', '#475569', '#94a3b8'];
  let a0 = -Math.PI / 2;
  let arcs = '';
  items.forEach((it, i) => {
    const a1 = a0 + (it.share / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    arcs += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${palette[i % palette.length]}"><title>${esc(it.name)}: ${esc(trimNum(it.share))}%</title></path>`;
    a0 = a1;
  });
  const legend = items.map((it, i) =>
    `<li><span class="swatch" style="background:${palette[i % palette.length]}"></span>${esc(it.name)}<b>${esc(trimNum(it.share))}%</b></li>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${esc(opts.label || 'Donut chart')}">
    ${arcs}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="700" fill="${INK}">${esc(opts.centre || '')}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="${SLATE}">${esc(opts.centreSub || '')}</text></svg>
    <ul class="legend">${legend}</ul></div>`;
}

// Population pyramid: shares per age group, mirrored bars with a centre
// gutter that holds the age-group labels, so no label sits under a bar.
export function pyramidChart(groups, opts = {}) {
  const w = opts.width || 640;
  const h = opts.height || 360;
  const padL = 46, padR = 46, padT = 12, padB = 26;
  const gutter = 44;
  const rowH = (h - padT - padB) / groups.length;
  const maxShare = Math.max(...groups.map((g) => g.share));
  const half = (w - padL - padR - gutter) / 2;
  const midX = padL + half + gutter / 2;
  let rows = '';
  groups.forEach((g, i) => {
    const y = padT + i * rowH;
    const bw = (g.share / maxShare) * half * 0.92;
    rows += `<rect x="${(midX - gutter / 2 - bw).toFixed(1)}" y="${(y + 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${(rowH - 4).toFixed(1)}" rx="2" fill="${TEAL}"/>`;
    rows += `<rect x="${(midX + gutter / 2).toFixed(1)}" y="${(y + 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${(rowH - 4).toFixed(1)}" rx="2" fill="${TEAL_LIGHT}"/>`;
    rows += `<text x="${(midX - gutter / 2 - bw - 5).toFixed(1)}" y="${(y + rowH / 2 + 4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="${INK}">${esc(trimNum(g.share))}%</text>`;
    rows += `<text x="${(midX + gutter / 2 + bw + 5).toFixed(1)}" y="${(y + rowH / 2 + 4).toFixed(1)}" font-size="10.5" fill="${INK}">${esc(trimNum(g.share))}%</text>`;
    rows += `<text x="${midX.toFixed(1)}" y="${(y + rowH / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="600" fill="${INK}">${esc(g.group)}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.label || 'Population pyramid')}">
    <text x="${padL + half / 2}" y="${h - 6}" text-anchor="middle" font-size="11" fill="${SLATE}">Share of population (%)</text>
    <text x="${padL + half + gutter + half / 2}" y="${h - 6}" text-anchor="middle" font-size="11" fill="${SLATE}">Share of population (%)</text>
    ${rows}</svg>`;
}

// Horizontal bars for ranked lists (e.g. employment by sector).
export function hbarChart(items, opts = {}) {
  const w = opts.width || 640;
  const rowH = 34;
  const h = items.length * rowH + 14;
  const padL = 210, padR = 56, padT = 6;
  const max = Math.max(...items.map((it) => it.share));
  let rows = '';
  items.forEach((it, i) => {
    const y = padT + i * rowH;
    const bw = ((w - padL - padR) * it.share) / max;
    rows += `<text x="${padL - 8}" y="${y + 17}" text-anchor="end" font-size="12" fill="${INK}">${esc(it.name)}</text>`;
    rows += `<rect x="${padL}" y="${y + 4}" width="${Math.max(bw, 2).toFixed(1)}" height="18" rx="3" fill="${i === 0 ? AMBER : TEAL}"/>`;
    rows += `<text x="${(padL + bw + 6).toFixed(1)}" y="${y + 17}" font-size="12" font-weight="600" fill="${INK}">${esc(trimNum(it.share))}%</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(opts.label || 'Horizontal bar chart')}">${rows}</svg>`;
}
