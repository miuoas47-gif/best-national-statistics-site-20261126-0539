// charts.js — small inline-SVG charts drawn from data.js. No libraries,
// no network: every point is computed here and rendered as SVG markup.

function fmt(value) {
  return String(value).replace(".", ",");
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const size = nice * mag;
  const start = Math.floor(min / size) * size;
  const ticks = [];
  for (let v = start; v <= max + size * 0.001; v += size) ticks.push(v);
  return ticks;
}

// Vertical bar chart. `points` is [{label, value}]. Negative values draw
// below the zero line. Returns an SVG string.
export function barChart(points, options) {
  const width = options.width || 640;
  const height = options.height || 300;
  const padL = 52;
  const padR = 12;
  const padT = 18;
  const padB = 34;
  const unit = options.unit || "%";
  const values = points.map((p) => p.value);
  let min = Math.min(0, ...values);
  let max = Math.max(0, ...values);
  if (min === max) max = min + 1;
  const span = max - min;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const y = (v) => padT + (1 - (v - min) / span) * plotH;
  const zeroY = y(0);
  const slot = plotW / points.length;
  const barW = Math.min(46, slot * 0.62);
  const ticks = niceTicks(min, max, 4);

  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.label || "Diagram batang"}" class="chart">`;
  for (const t of ticks) {
    const ty = y(t);
    svg += `<line x1="${padL}" y1="${ty}" x2="${width - padR}" y2="${ty}" class="grid"/>`;
    svg += `<text x="${padL - 8}" y="${ty + 4}" class="tick" text-anchor="end">${fmt(Math.round(t * 100) / 100)}</text>`;
  }
  svg += `<line x1="${padL}" y1="${zeroY}" x2="${width - padR}" y2="${zeroY}" class="axis"/>`;
  points.forEach((p, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = Math.min(y(p.value), zeroY);
    const bottom = Math.max(y(p.value), zeroY);
    const cls = p.value < 0 ? "bar neg" : "bar";
    svg += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW}" height="${Math.max(1, bottom - top).toFixed(1)}" class="${cls}"><title>${p.label}: ${fmt(p.value)}${unit}</title></rect>`;
    const labelY = p.value < 0 ? bottom - 8 : top - 6;
    const labelCls = p.value < 0 ? "val val-in" : "val";
    svg += `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" class="${labelCls}" text-anchor="middle">${fmt(p.value)}</text>`;
    svg += `<text x="${cx.toFixed(1)}" y="${height - 12}" class="tick" text-anchor="middle">${p.label}</text>`;
  });
  svg += "</svg>";
  return svg;
}

// Line chart with dots. `points` is [{label, value}].
export function lineChart(points, options) {
  const width = options.width || 640;
  const height = options.height || 300;
  const padL = 52;
  const padR = 18;
  const padT = 18;
  const padB = 34;
  const unit = options.unit || "%";
  const values = points.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) max = min + 1;
  const pad = (max - min) * 0.15;
  min -= pad;
  max += pad;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const x = (i) => padL + (plotW * i) / (points.length - 1);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * plotH;
  const ticks = niceTicks(min, max, 4);

  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${options.label || "Diagram garis"}" class="chart">`;
  for (const t of ticks) {
    const ty = y(t);
    svg += `<line x1="${padL}" y1="${ty}" x2="${width - padR}" y2="${ty}" class="grid"/>`;
    svg += `<text x="${padL - 8}" y="${ty + 4}" class="tick" text-anchor="end">${fmt(Math.round(t * 100) / 100)}</text>`;
  }
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  svg += `<path d="${path}" class="line" fill="none"/>`;
  points.forEach((p, i) => {
    svg += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4.5" class="dot"><title>${p.label}: ${fmt(p.value)}${unit}</title></circle>`;
    svg += `<text x="${x(i).toFixed(1)}" y="${(y(p.value) - 10).toFixed(1)}" class="val" text-anchor="middle">${fmt(p.value)}</text>`;
    svg += `<text x="${x(i).toFixed(1)}" y="${height - 12}" class="tick" text-anchor="middle">${p.label}</text>`;
  });
  svg += "</svg>";
  return svg;
}

// Horizontal share bars for a parts-of-a-whole list.
export function shareBars(rows, options) {
  const max = Math.max(...rows.map((r) => Math.abs(r.share)));
  let html = `<div class="sharebars" role="list" aria-label="${options.label || "Pangsa"}">`;
  for (const row of rows) {
    const pct = (Math.abs(row.share) / max) * 100;
    const sign = row.share < 0 ? "−" : "";
    html += `<div class="sharebar" role="listitem"><span class="share-label">${row.component}</span>`
      + `<span class="share-track"><span class="share-fill${row.share < 0 ? " neg" : ""}" style="width:${pct.toFixed(1)}%"></span></span>`
      + `<span class="share-value">${sign}${fmt(Math.abs(row.share))}%</span></div>`;
  }
  html += "</div>";
  return html;
}
