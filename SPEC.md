# Spec — Statistik Nusantara (round 3 rebuild)

## What it is
A national statistics portal for Indonesia, in Bahasa Indonesia with English
glosses on key headings. Original design, text and name ("Statistik
Nusantara"); figures are real published statistics, each labelled with its
source and year (BPS, Bank Indonesia, World Bank). No network requests, no
external assets: pure static files under app/, inline SVG charts.

## Routes (hash router, every route reached from the top nav)
- `#/` Beranda — six hero indicator cards, GDP-growth bar chart, latest
  releases, quick links to every section.
- `#/ekonomi` Ekonomi — GDP growth chart with year-range buttons
  (2019–2024 / 2021–2024), GDP-by-expenditure table with share bars, trade
  cards (exports, imports, surplus), foreign reserves.
- `#/penduduk` Penduduk — sortable province table (2020 Census), province
  selector that updates a detail panel, age-structure bars.
- `#/harga-tenaga-kerja` Harga & Tenaga Kerja — inflation chart with a
  bar/line toggle, unemployment series, poverty series, wage card.
- `#/data` Data & Metode — searchable indicator table (every figure with
  value, year, source), working CSV download button, methods and sources.

## Controls that must all work
Nav routing, chart range buttons, chart type toggle, sortable table headers,
province selector + detail panel, indicator search filter, CSV download.

## Key figures (source + year shown next to each)
- Penduduk 281,6 juta (BPS, 2024); PDB Rp22.139 triliun (BPS, 2024);
  pertumbuhan 5,03% (BPS, 2024); inflasi 1,57% (BPS, Des 2024);
  pengangguran 4,76% (BPS, Feb 2025); kemiskinan 8,57% (BPS, Sep 2024);
  IPM 75,02 (BPS, 2024); harapan hidup 71,7 thn (World Bank, 2023).
- PDB growth 2019–2024: 5,02 / −2,07 / 3,70 / 5,31 / 5,05 / 5,03.
- Inflasi Des y-on-y 2019–2024: 2,72 / 1,68 / 1,87 / 5,51 / 2,61 / 1,57.
- Ekspor 2024 US$264,70 miliar; impor US$233,66 miliar; surplus US$31,04
  miliar; cadangan devisa US$155,7 miliar akhir 2024 (Bank Indonesia).
- Provinsi: Sensus Penduduk 2020 (total 270,20 juta); 10 provinsi terbesar
  with populations and shares. Age structure 2020: 0–14 24,9%,
  15–64 70,7%, 65+ 4,4%.

## Files
- `app/index.html` — shell, nav, `#view` mount, footer.
- `app/style.css` — design system, responsive, phone layout under 720px.
- `app/data.js` — all figures as exported constants (single source of truth).
- `app/charts.js` — inline-SVG bar/line chart builders from data.
- `app/views.js` — router + one renderer per route + table/sort/filter/CSV.
- `app/main.js` — entry module, boots the router.
- `main.ts` — entrypoint: copies app/ + screenshots/ to
  $MAKEFUN_OUTPUT_DIR (else /output), writes dossier.json via
  buildDossier from vendor/makefun-frontend.ts. Node builtins only,
  erasable TypeScript only, no network, no clock/randomness, exit 0.
- `vendor/makefun-frontend.ts` — kit copy, unchanged.
- `screenshots/` — 4 real headless-Chrome renders (3 desktop, 1 phone).
- `LICENSE` — MIT. `README.md` — make.fun badges per the template.

## Caps (from RULES.txt)
- app/: ≤993 files/dirs, ≤16 MiB; index.html ≤1 MiB.
- screenshots/: 3–4 files, each ≤256 KiB, long side ≤1280, short side ≥360.
- /output total ≤1000 entries, ≤64 MiB; dossier.json ≤1,5 MiB,
  dossier text ≤160 KiB.
- No absolute URLs, no `data:` scripts, no network references anywhere.

## Why round 2 failed (diagnosis)
The repo at HEAD held only LICENSE, README.md, main.ts — no app/,
screenshots/ or vendor/ — so the entrypoint could not even load its
`./vendor/makefun-frontend.ts` import (and its app/ copy would throw
ENOENT): exit 1. This rebuild ships every directory the entrypoint needs.
