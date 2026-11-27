// NusaData — datasets for the national statistics portal of Indonesia.
// Every figure carries its source and reference year. Figures are the
// published headline values of Statistics Indonesia (BPS) and the World
// Bank, rounded for display; see the About page for the full source list.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SOURCES = {
  population: 'Statistics Indonesia (BPS), Population Census 2020 and 2024 estimates',
  gdp: 'Statistics Indonesia (BPS), National Accounts 2024',
  prices: 'Statistics Indonesia (BPS), Consumer Price Index 2024',
  labour: 'Statistics Indonesia (BPS), National Labour Force Survey, August 2024',
  trade: 'Statistics Indonesia (BPS), Foreign Trade Statistics 2024',
  poverty: 'Statistics Indonesia (BPS), Poverty Statistics, March 2024',
  hdi: 'Statistics Indonesia (BPS), Human Development Index 2024',
  worldBank: 'World Bank, World Development Indicators 2024',
};

// Headline indicators shown on the overview page.
export const HEADLINES = [
  { key: 'population', label: 'Population', value: '281.6 million', change: '+1.1% on 2023', source: 'BPS, 2024', note: 'Fourth-largest population in the world' },
  { key: 'gdp', label: 'GDP (nominal)', value: 'Rp 22,139 trillion', change: 'US$ 1.40 trillion', source: 'BPS, 2024', note: 'Largest economy in Southeast Asia' },
  { key: 'growth', label: 'GDP growth', value: '5.03%', change: 'year on year, 2024', source: 'BPS, 2024', note: 'Tenth straight year above 5%, except 2020' },
  { key: 'inflation', label: 'Inflation (CPI)', value: '1.57%', change: 'year on year, Dec 2024', source: 'BPS, 2024', note: 'Lowest annual rate in the series' },
  { key: 'unemployment', label: 'Open unemployment', value: '4.91%', change: 'August 2024', source: 'BPS, Sakernas', note: 'Lowest since 1998' },
  { key: 'poverty', label: 'Poverty rate', value: '9.03%', change: '25.2 million people', source: 'BPS, Mar 2024', note: 'Down from 9.36% a year earlier' },
];

// Annual series, 2015-2024.
export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    values: [255.6, 258.7, 261.9, 265.0, 268.1, 270.2, 272.2, 274.9, 278.7, 281.6],
    source: SOURCES.population,
  },
  gdpGrowth: {
    label: 'Real GDP growth',
    unit: '% year on year',
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
    source: SOURCES.gdp,
  },
  gdpNominal: {
    label: 'GDP at current prices',
    unit: 'Rp trillion',
    values: [11526, 12401, 13588, 14838, 15834, 15443, 16977, 19543, 20892, 22139],
    source: SOURCES.gdp,
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'US$',
    values: [3335, 3570, 3840, 3900, 4170, 3870, 4270, 4780, 4880, 4960],
    source: SOURCES.worldBank,
  },
  inflation: {
    label: 'Consumer price inflation',
    unit: '% year on year, December',
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    source: SOURCES.prices,
  },
  unemployment: {
    label: 'Open unemployment rate',
    unit: '% of labour force, August',
    values: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
    source: SOURCES.labour,
  },
};

// GDP by sector, share of GDP, 2024.
export const SECTORS = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Wholesale & retail trade', share: 12.8 },
  { name: 'Agriculture, forestry & fishing', share: 12.5 },
  { name: 'Construction', share: 9.9 },
  { name: 'Mining & quarrying', share: 8.2 },
  { name: 'Transport & storage', share: 5.6 },
  { name: 'Information & communication', share: 4.1 },
  { name: 'Financial services', share: 4.1 },
  { name: 'Real estate', share: 2.7 },
  { name: 'Other services', share: 21.4 },
];

// Monthly CPI inflation, % month on month, 2024.
export const MONTHLY_INFLATION_2024 = [
  { month: 'Jan', value: 0.04 }, { month: 'Feb', value: 0.37 },
  { month: 'Mar', value: 0.52 }, { month: 'Apr', value: 0.25 },
  { month: 'May', value: -0.03 }, { month: 'Jun', value: -0.06 },
  { month: 'Jul', value: -0.18 }, { month: 'Aug', value: -0.03 },
  { month: 'Sep', value: -0.12 }, { month: 'Oct', value: 0.08 },
  { month: 'Nov', value: 0.30 }, { month: 'Dec', value: 0.44 },
];

// CPI basket weights, 2024.
export const CPI_BASKET = [
  { group: 'Food, beverages & tobacco', weight: 27.0, annual: 2.1 },
  { group: 'Housing, water & energy', weight: 19.8, annual: 0.9 },
  { group: 'Transport', weight: 12.5, annual: 1.2 },
  { group: 'Restaurants & accommodation', weight: 9.3, annual: 1.8 },
  { group: 'Education', weight: 5.9, annual: 2.0 },
  { group: 'Clothing & footwear', weight: 5.4, annual: 1.1 },
  { group: 'Health', weight: 4.6, annual: 1.6 },
  { group: 'Other goods & services', weight: 15.5, annual: 1.4 },
];

// Population age structure, share of total population, 2024.
export const AGE_GROUPS = [
  { group: '0–4', share: 8.6 }, { group: '5–9', share: 8.8 },
  { group: '10–14', share: 9.0 }, { group: '15–19', share: 8.8 },
  { group: '20–24', share: 8.5 }, { group: '25–29', share: 8.1 },
  { group: '30–34', share: 7.7 }, { group: '35–39', share: 7.2 },
  { group: '40–44', share: 6.8 }, { group: '45–49', share: 6.1 },
  { group: '50–54', share: 5.4 }, { group: '55–59', share: 4.6 },
  { group: '60–64', share: 3.9 }, { group: '65+', share: 6.5 },
];

// Provinces: population 2024 (millions), land area (km2), annual growth %.
export const PROVINCES = [
  { name: 'West Java', pop: 49.9, area: 35378, growth: 1.2 },
  { name: 'East Java', pop: 41.8, area: 47800, growth: 0.8 },
  { name: 'Central Java', pop: 38.0, area: 32800, growth: 0.9 },
  { name: 'North Sumatra', pop: 16.0, area: 72981, growth: 1.0 },
  { name: 'Banten', pop: 12.4, area: 9663, growth: 1.6 },
  { name: 'Jakarta', pop: 10.6, area: 664, growth: 0.9 },
  { name: 'South Sulawesi', pop: 9.5, area: 46717, growth: 1.0 },
  { name: 'Lampung', pop: 9.4, area: 34624, growth: 1.0 },
  { name: 'South Sumatra', pop: 8.9, area: 91592, growth: 1.1 },
  { name: 'Riau', pop: 7.0, area: 87024, growth: 1.4 },
  { name: 'West Sumatra', pop: 6.0, area: 42013, growth: 0.9 },
  { name: 'West Kalimantan', pop: 5.8, area: 147307, growth: 1.1 },
  { name: 'Aceh', pop: 5.6, area: 57957, growth: 1.2 },
  { name: 'South Kalimantan', pop: 4.4, area: 38744, growth: 1.1 },
  { name: 'Bali', pop: 4.4, area: 5780, growth: 0.9 },
  { name: 'East Kalimantan', pop: 4.0, area: 127267, growth: 1.8 },
  { name: 'Yogyakarta', pop: 3.8, area: 3133, growth: 0.9 },
  { name: 'Jambi', pop: 3.7, area: 50059, growth: 1.1 },
  { name: 'North Sulawesi', pop: 2.8, area: 13852, growth: 0.8 },
  { name: 'West Nusa Tenggara', pop: 5.6, area: 18572, growth: 1.1 },
];

// Employment by sector, share of workers, August 2024.
export const EMPLOYMENT = [
  { sector: 'Agriculture, forestry & fishing', share: 28.6 },
  { sector: 'Wholesale & retail trade', share: 19.0 },
  { sector: 'Manufacturing', share: 13.8 },
  { sector: 'Construction', share: 8.6 },
  { sector: 'Community & personal services', share: 8.4 },
  { sector: 'Transport & storage', share: 5.2 },
  { sector: 'Accommodation & food service', share: 5.0 },
  { sector: 'Other sectors', share: 11.4 },
];

// Foreign trade, 2024.
export const TRADE = {
  exports: 264.7, imports: 233.7, surplus: 31.0, unit: 'US$ billion',
  partners: [
    { country: 'China', share: 25.6 }, { country: 'United States', share: 11.0 },
    { country: 'Japan', share: 7.6 }, { country: 'India', share: 7.1 },
    { country: 'Singapore', share: 5.6 }, { country: 'Malaysia', share: 4.6 },
    { country: 'Other', share: 38.5 },
  ],
  topExports: ['Coal', 'Palm oil', 'Iron & steel', 'Electrical machinery', 'Rubber'],
};

// Human development, 2024.
export const HUMAN_DEV = {
  hdi: 75.02, lifeExpectancy: 73.93, meanSchooling: 9.0, expectedSchooling: 13.2,
  gniPerCapita: 4870, source: SOURCES.hdi,
};

// Latest statistical releases.
export const RELEASES = [
  { date: '2026-11-03', title: 'Consumer Price Index, October 2026', topic: 'Prices' },
  { date: '2026-11-05', title: 'Gross Domestic Product, Q3 2026', topic: 'Economy' },
  { date: '2026-11-07', title: 'Labour Force Situation, August 2026', topic: 'Labour' },
  { date: '2026-10-15', title: 'Foreign Trade Statistics, September 2026', topic: 'Trade' },
  { date: '2026-10-01', title: 'Poverty Statistics, March 2026', topic: 'Welfare' },
  { date: '2026-09-18', title: 'Human Development Index 2025', topic: 'Welfare' },
];

export function density(province) {
  return Math.round((province.pop * 1000000) / province.area);
}

export function fmt(value, decimals = 1) {
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
