# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/miuoas47-gif/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/miuoas47-gif/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaData — the national statistics portal for Indonesia: population, economy, prices, labour and trade, with the source and year on every figure. Seven pages (overview, population, economy, prices, labour, data explorer, methods & sources), hand-drawn SVG charts, sortable and searchable provincial tables, a CSV download, and a phone layout — all as static files that run offline in a desktop or phone browser with no network request.

## Run it

```sh
node main.ts
```

`main.ts` (Node 22) copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `dossier.json`. To browse the site locally, serve `app/` with any static server, for example:

```sh
python3 -m http.server 8080 --directory app
```

then open http://localhost:8080.

## What's inside

- `app/index.html` — the portal shell, header, navigation and footer
- `app/data.js` — every dataset: annual series 2015–2024, provinces, sectors, CPI basket, age structure, trade and labour, each with its source
- `app/charts.js` — small SVG chart builders (bars, lines, donut, pyramid, horizontal bars)
- `app/views.js` — the seven pages
- `app/main.js` — hash router, controls and the CSV download
- `screenshots/` — real renders of the site in a browser
- `main.ts` — the entrypoint that hands the site in

---

<sub>Entered on [make.fun](https://make.fun/?ref=6gvkzysc&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
