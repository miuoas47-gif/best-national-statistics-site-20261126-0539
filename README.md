[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Node 22](https://img.shields.io/badge/node-22-green)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# NusaStat — Indonesia in Numbers

A national statistics site for Indonesia, built for make.fun's
[“Make the best national statistics site”](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
bounty ($50 prize pool, entries close 2026-11-29).

The site runs entirely from static files with no network request: open
`app/index.html` in a desktop browser or on a phone and it works. It covers
population, economy, people (health, education, work) and all 38 provinces,
with real figures — each labelled with its source and year (BPS, World Bank,
Bank Indonesia, APJII, Ministry of Health).

## Pages

- **Overview** — headline indicators, GDP and population charts, GDP by sector, largest provinces, latest updates
- **Population** — population trend 2015–2024, age structure, regional spread
- **Economy** — GDP over time with working year-range and metric switches (GDP, GDP per capita, real growth), sector shares, 2024 trade
- **People** — health, education and work indicators
- **Regions** — ten largest provinces chart plus a searchable, sortable table of all 38 provinces
- **Data & sources** — the full indicator table (sortable), a working CSV download, and the source list with method notes

Charts are hand-drawn SVG (no libraries, no network). Every control does what
it says: navigation, chart switches, province search/sort, table sort, CSV download.

## Run it

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to `/output` and writes `/output/dossier.json` with the kit's
`vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Run twice and the output is byte-identical. Screenshots in `screenshots/`
are real renders of this site in headless Chrome: desktop overview, economy,
regions, and a 390×844 phone view.

## License

MIT — see [LICENSE](LICENSE).
