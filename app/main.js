// NusaData — router and interactions. Hash routes: #/ (overview),
// #/population, #/economy, #/prices, #/labour, #/data, #/about.
// Every control re-renders its own page from the shared state object.

import { PROVINCES, density, fmt } from './data.js';
import {
  overviewPage, populationPage, economyPage, pricesPage, labourPage,
  dataPage, aboutPage,
} from './views.js';

const ROUTES = {
  '': { title: 'Overview', render: overviewPage },
  population: { title: 'Population', render: populationPage },
  economy: { title: 'Economy', render: economyPage },
  prices: { title: 'Prices', render: pricesPage },
  labour: { title: 'Labour', render: labourPage },
  data: { title: 'Data explorer', render: dataPage },
  about: { title: 'Methods & sources', render: aboutPage },
};

const state = {
  provinceQuery: '',
  provinceSort: 'pop',
  provinceDir: -1,
  economyRange: '10y',
  pricesView: 'annual',
  explorerIndicator: 'population',
  explorerQuery: '',
};

const app = document.getElementById('app');
const nav = document.querySelector('.main-nav');

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[hash] ? hash : '';
}

function render() {
  const route = currentRoute();
  const page = ROUTES[route];
  app.innerHTML = page.render(state);
  document.title = `NusaData · ${page.title} — Indonesia in numbers`;
  nav.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  bindPage(route);
}

function bindPage(route) {
  if (route === 'population') {
    const search = document.getElementById('province-search');
    search.addEventListener('input', () => {
      state.provinceQuery = search.value;
      render();
      const again = document.getElementById('province-search');
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    });
    app.querySelectorAll('[data-sort]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const col = btn.dataset.sort;
        if (state.provinceSort === col) state.provinceDir *= -1;
        else { state.provinceSort = col; state.provinceDir = col === 'name' ? 1 : -1; }
        render();
      });
    });
  }
  if (route === 'economy') {
    app.querySelectorAll('[data-range]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.economyRange = btn.dataset.range;
        render();
      });
    });
  }
  if (route === 'prices') {
    app.querySelectorAll('[data-prices-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.pricesView = btn.dataset.pricesView;
        render();
      });
    });
  }
  if (route === 'data') {
    document.getElementById('indicator-select').addEventListener('change', (e) => {
      state.explorerIndicator = e.target.value;
      render();
    });
    const search = document.getElementById('explorer-search');
    search.addEventListener('input', () => {
      state.explorerQuery = search.value;
      render();
      const again = document.getElementById('explorer-search');
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    });
    document.getElementById('download-csv').addEventListener('click', downloadCsv);
  }
}

function downloadCsv() {
  const q = (state.explorerQuery || '').toLowerCase();
  const rows = PROVINCES.filter((p) => p.name.toLowerCase().includes(q));
  const lines = ['Province,Population (millions),Area (km2),Density (per km2),Growth (% per year)'];
  rows.forEach((p) => {
    lines.push(`${p.name},${fmt(p.pop)},${p.area},${density(p)},${fmt(p.growth)}`);
  });
  const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nusadata-provinces-2024.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

window.addEventListener('hashchange', render);
render();
