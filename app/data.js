// NusaStat data: Indonesia in Numbers.
// Every figure carries its source and year in the site's Sources page.
// National figures are from Statistics Indonesia (BPS) and the World Bank
// unless a chart labels another source. Provincial populations are BPS
// mid-year estimates, rounded to two decimals (millions).

export const COUNTRY = {
  name: "Indonesia",
  tagline: "Indonesia in Numbers",
  areaKm2: 1904569,
  islands: 17508,
  provinces: 38,
  regenciesCities: 514,
  capital: "Jakarta (administrative capital; Nusantara under development)",
  currency: "Indonesian rupiah (IDR)",
  updated: "Figures as published for 2024 unless a figure says otherwise.",
};

export const HEADLINE = [
  { label: "Population", value: "281.6m", note: "Mid-year estimate, 2024 · BPS", id: "population" },
  { label: "GDP", value: "$1,396bn", note: "Current US$, 2024 · World Bank", id: "gdp" },
  { label: "GDP growth", value: "5.03%", note: "Real growth, 2024 · BPS", id: "growth" },
  { label: "GDP per capita", value: "$4,960", note: "Current US$, 2024 · World Bank", id: "percapita" },
  { label: "Unemployment", value: "4.76%", note: "Open unemployment, Aug 2024 · BPS", id: "unemployment" },
  { label: "Poverty rate", value: "8.57%", note: "Sep 2024 · BPS", id: "poverty" },
  { label: "Life expectancy", value: "74.2 yrs", note: "At birth, 2024 · BPS", id: "life" },
  { label: "Inflation", value: "1.57%", note: "Annual CPI, 2024 · BPS", id: "inflation" },
];

// GDP in current US$ billions and real growth, 2015-2024 (World Bank / BPS).
export const GDP_YEARS = [
  { year: 2015, gdp: 861, growth: 4.88, perCapita: 3369 },
  { year: 2016, gdp: 932, growth: 5.03, perCapita: 3604 },
  { year: 2017, gdp: 1016, growth: 5.07, perCapita: 3880 },
  { year: 2018, gdp: 1042, growth: 5.17, perCapita: 3927 },
  { year: 2019, gdp: 1120, growth: 5.02, perCapita: 4178 },
  { year: 2020, gdp: 1059, growth: -2.07, perCapita: 3905 },
  { year: 2021, gdp: 1186, growth: 3.70, perCapita: 4349 },
  { year: 2022, gdp: 1319, growth: 5.31, perCapita: 4788 },
  { year: 2023, gdp: 1371, growth: 5.05, perCapita: 4924 },
  { year: 2024, gdp: 1396, growth: 5.03, perCapita: 4960 },
];

// Population in millions, BPS mid-year estimates.
export const POP_YEARS = [
  { year: 2015, pop: 255.6 }, { year: 2016, pop: 258.7 },
  { year: 2017, pop: 261.9 }, { year: 2018, pop: 265.0 },
  { year: 2019, pop: 268.1 }, { year: 2020, pop: 270.2 },
  { year: 2021, pop: 272.7 }, { year: 2022, pop: 275.8 },
  { year: 2023, pop: 278.7 }, { year: 2024, pop: 281.6 },
];

export const AGE_GROUPS = [
  { group: "0–14 years", share: 24.5, note: "Children" },
  { group: "15–24 years", share: 16.9, note: "Youth" },
  { group: "25–54 years", share: 43.1, note: "Working age" },
  { group: "55–64 years", share: 8.9, note: "Older working age" },
  { group: "65+ years", share: 6.6, note: "Older people" },
];

export const SECTORS = [
  { name: "Manufacturing", share: 18.98 },
  { name: "Wholesale & retail trade", share: 12.96 },
  { name: "Agriculture, forestry & fishing", share: 12.53 },
  { name: "Construction", share: 9.78 },
  { name: "Mining & quarrying", share: 8.47 },
  { name: "Transport & storage", share: 5.05 },
  { name: "Information & communication", share: 4.41 },
  { name: "Finance & insurance", share: 4.03 },
  { name: "Other services", share: 23.79 },
];

export const TRADE = [
  { label: "Exports of goods", value: "$264.7bn", note: "2024 · BPS" },
  { label: "Imports of goods", value: "$233.7bn", note: "2024 · BPS" },
  { label: "Trade balance", value: "+$31.0bn", note: "Surplus, 2024 · BPS" },
  { label: "Top export: coal", value: "$33.8bn", note: "2024 · BPS" },
  { label: "Top export: palm oil", value: "$24.5bn", note: "2024 · BPS" },
  { label: "Foreign reserves", value: "$155.7bn", note: "End 2024 · Bank Indonesia" },
];

// Provinces: name, 2024 population (millions), island group, density (people/km2, rounded).
export const PROVINCES = [
  { name: "West Java", pop: 50.35, region: "Java", density: 1422 },
  { name: "East Java", pop: 41.81, region: "Java", density: 874 },
  { name: "Central Java", pop: 38.28, region: "Java", density: 1107 },
  { name: "North Sumatra", pop: 16.03, region: "Sumatra", density: 220 },
  { name: "Banten", pop: 12.43, region: "Java", density: 1288 },
  { name: "Jakarta", pop: 10.68, region: "Java", density: 16113 },
  { name: "South Sulawesi", pop: 9.53, region: "Sulawesi", density: 204 },
  { name: "Lampung", pop: 9.36, region: "Sumatra", density: 271 },
  { name: "South Sumatra", pop: 9.02, region: "Sumatra", density: 99 },
  { name: "Riau", pop: 6.94, region: "Sumatra", density: 80 },
  { name: "West Sumatra", pop: 6.06, region: "Sumatra", density: 144 },
  { name: "West Kalimantan", pop: 5.93, region: "Kalimantan", density: 40 },
  { name: "East Nusa Tenggara", pop: 5.66, region: "Nusa Tenggara", density: 117 },
  { name: "West Nusa Tenggara", pop: 5.60, region: "Nusa Tenggara", density: 302 },
  { name: "Aceh", pop: 5.55, region: "Sumatra", density: 96 },
  { name: "South Kalimantan", pop: 4.37, region: "Kalimantan", density: 113 },
  { name: "Bali", pop: 4.38, region: "Nusa Tenggara", density: 759 },
  { name: "East Kalimantan", pop: 4.03, region: "Kalimantan", density: 31 },
  { name: "Yogyakarta", pop: 3.76, region: "Java", density: 1206 },
  { name: "Jambi", pop: 3.65, region: "Sumatra", density: 73 },
  { name: "Central Sulawesi", pop: 3.13, region: "Sulawesi", density: 51 },
  { name: "Southeast Sulawesi", pop: 2.82, region: "Sulawesi", density: 74 },
  { name: "Central Kalimantan", pop: 2.81, region: "Kalimantan", density: 18 },
  { name: "North Sulawesi", pop: 2.73, region: "Sulawesi", density: 197 },
  { name: "Riau Islands", pop: 2.22, region: "Sumatra", density: 271 },
  { name: "Bengkulu", pop: 2.12, region: "Sumatra", density: 107 },
  { name: "Maluku", pop: 2.00, region: "Maluku", density: 43 },
  { name: "West Sulawesi", pop: 1.59, region: "Sulawesi", density: 95 },
  { name: "Bangka Belitung", pop: 1.52, region: "Sumatra", density: 93 },
  { name: "North Maluku", pop: 1.45, region: "Maluku", density: 45 },
  { name: "Central Papua", pop: 1.39, region: "Papua", density: 23 },
  { name: "Highland Papua", pop: 1.47, region: "Papua", density: 29 },
  { name: "Gorontalo", pop: 1.27, region: "Sulawesi", density: 104 },
  { name: "Papua", pop: 1.10, region: "Papua", density: 13 },
  { name: "North Kalimantan", pop: 0.74, region: "Kalimantan", density: 10 },
  { name: "Southwest Papua", pop: 0.63, region: "Papua", density: 16 },
  { name: "West Papua", pop: 0.59, region: "Papua", density: 9 },
  { name: "South Papua", pop: 0.56, region: "Papua", density: 4 },
];

export const PEOPLE = [
  { label: "Mean years of schooling", value: "9.12 yrs", note: "2024 · BPS" },
  { label: "Adult literacy", value: "96.0%", note: "2023 · BPS" },
  { label: "Human Development Index", value: "75.02", note: "2024 · BPS (0–100 scale)" },
  { label: "Stunting in under-5s", value: "19.8%", note: "2024 · Ministry of Health survey" },
  { label: "Internet users", value: "221.6m", note: "79.5% of population, 2024 · APJII" },
  { label: "Labour force", value: "152.1m", note: "Aug 2024 · BPS" },
  { label: "Informal employment", value: "57.9%", note: "Share of workers, Aug 2024 · BPS" },
  { label: "Median age", value: "30.1 yrs", note: "2024 · BPS" },
];

export const INDICATORS = [
  { indicator: "Population", value: "281.6 million", year: 2024, source: "BPS" },
  { indicator: "GDP (current US$)", value: "$1,396 billion", year: 2024, source: "World Bank" },
  { indicator: "GDP per capita (current US$)", value: "$4,960", year: 2024, source: "World Bank" },
  { indicator: "Real GDP growth", value: "5.03%", year: 2024, source: "BPS" },
  { indicator: "Inflation (CPI, annual)", value: "1.57%", year: 2024, source: "BPS" },
  { indicator: "Open unemployment rate", value: "4.76%", year: 2024, source: "BPS" },
  { indicator: "Poverty rate", value: "8.57%", year: 2024, source: "BPS" },
  { indicator: "Life expectancy at birth", value: "74.2 years", year: 2024, source: "BPS" },
  { indicator: "Human Development Index", value: "75.02", year: 2024, source: "BPS" },
  { indicator: "Mean years of schooling", value: "9.12 years", year: 2024, source: "BPS" },
  { indicator: "Exports of goods", value: "$264.7 billion", year: 2024, source: "BPS" },
  { indicator: "Imports of goods", value: "$233.7 billion", year: 2024, source: "BPS" },
  { indicator: "Foreign exchange reserves", value: "$155.7 billion", year: 2024, source: "Bank Indonesia" },
  { indicator: "Internet users", value: "221.6 million", year: 2024, source: "APJII" },
  { indicator: "Land area", value: "1,904,569 km²", year: 2024, source: "BPS" },
  { indicator: "Number of islands", value: "17,508", year: 2024, source: "BPS" },
];

export const SOURCES = [
  { name: "Statistics Indonesia (BPS)", what: "Population, GDP growth, unemployment, poverty, inflation, life expectancy, schooling, HDI and provincial figures.", url: "bps.go.id" },
  { name: "World Bank", what: "GDP and GDP per capita in current US dollars, 2015–2024.", url: "worldbank.org" },
  { name: "Bank Indonesia", what: "Foreign exchange reserves, end of 2024.", url: "bi.go.id" },
  { name: "APJII", what: "Internet users and penetration, 2024 survey.", url: "apjii.or.id" },
  { name: "Ministry of Health", what: "Stunting prevalence in children under five, 2024 survey.", url: "kemkes.go.id" },
];

export const UPDATES = [
  { date: "Sep 2024", text: "Poverty fell to 8.57%, the lowest rate on record, down from 9.03% in March 2024." },
  { date: "Aug 2024", text: "Open unemployment eased to 4.76% as the labour force reached 152.1 million people." },
  { date: "2024", text: "Real GDP grew 5.03%, with household consumption and investment driving growth." },
  { date: "2024", text: "Stunting in children under five fell to 19.8%, from 21.5% the year before." },
];
