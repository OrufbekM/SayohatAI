/** O‘zbekistondan uchish shaharlari (Qayerdan) */
export const UZBEKISTAN_DEPARTURE_CITIES = [
  { id: 'toshkent', name: 'Toshkent', townFrom: 'TAS' },
  { id: 'samarqand', name: 'Samarqand', townFrom: 'SKD' },
  { id: 'buxoro', name: 'Buxoro', townFrom: 'BHK' },
  { id: 'namangan', name: 'Namangan', townFrom: 'NMA' },
  { id: 'fargona', name: 'Farg\'ona', townFrom: 'FEG' },
  { id: 'andijon', name: 'Andijon', townFrom: 'AZN' },
  { id: 'nukus', name: 'Nukus', townFrom: 'NCU' },
  { id: 'qarshi', name: 'Qarshi', townFrom: 'KSQ' },
  { id: 'termez', name: 'Termiz', townFrom: 'TMJ' },
  { id: 'navoiy', name: 'Navoiy', townFrom: 'NVI' },
  { id: 'urganch', name: 'Urganch', townFrom: 'UGC' },
  { id: 'jizzax', name: 'Jizzax', townFrom: 'JIZ' },
]

/** Top 10 ta yo‘nalish davlati (Qayerga) */
export const TOP_DESTINATION_COUNTRIES = [
  { id: 'tr', name: 'Turkiya', stateTo: 'TR' },
  { id: 'eg', name: 'Misr', stateTo: 'EG' },
  { id: 'ae', name: 'BAA (Dubai)', stateTo: 'AE' },
  { id: 'th', name: 'Tailand', stateTo: 'TH' },
  { id: 'mv', name: 'Maldiv orollari', stateTo: 'MV' },
  { id: 'my', name: 'Malayziya', stateTo: 'MY' },
  { id: 'vn', name: 'Vyetnam', stateTo: 'VN' },
  { id: 'ge', name: 'Gruziya', stateTo: 'GE' },
  { id: 'az', name: 'Ozarbayjon', stateTo: 'AZ' },
  { id: 'qa', name: 'Qatar', stateTo: 'QA' },
]

const CITIES_BY_COUNTRY = {
  tr: [
    'Antalya',
    'Alanya',
    'Kemer',
    'Belek',
    'Side',
    'Bodrum',
    'Marmaris',
    'Fethiye',
    'Dalaman',
    'Istanbul',
    'Kusadasi',
    'Didim',
    'Cesme',
  ],
  eg: [
    'Sharm El Sheikh',
    'Hurghada',
    'Marsa Alam',
    'Cairo',
    'Alexandria',
    'Dahab',
    'Taba',
    'Luxor',
    'El Gouna',
  ],
  ae: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
  th: [
    'Phuket',
    'Pattaya',
    'Bangkok',
    'Krabi',
    'Koh Samui',
    'Hua Hin',
    'Chiang Mai',
    'Koh Lanta',
  ],
  mv: ['Male', 'Maafushi', 'Hulhumale', 'Ari Atoll', 'Baa Atoll', 'Lhaviyani Atoll'],
  my: ['Kuala Lumpur', 'Langkawi', 'Penang', 'Kota Kinabalu', 'Malacca', 'Johor Bahru'],
  vn: [
    'Nha Trang',
    'Phu Quoc',
    'Da Nang',
    'Ho Chi Minh',
    'Hanoi',
    'Mui Ne',
    'Vung Tau',
    'Hoi An',
  ],
  ge: ['Tbilisi', 'Batumi', 'Kutaisi', 'Borjomi', 'Gudauri', 'Bakuriani', 'Kobuleti'],
  az: ['Baku', 'Gabala', 'Sheki', 'Guba', 'Lankaran', 'Naftalan', 'Quba', 'Sumqayit'],
  qa: ['Doha', 'Al Wakrah', 'Al Khor', 'Lusail', 'The Pearl'],
}

const HOTELS_BY_COUNTRY = {
  tr: [
    { name: 'Rixos Premium Belek', stars: 5 },
    { name: 'Titanic Mardan Palace', stars: 5 },
    { name: 'Maxx Royal Kemer', stars: 5 },
    { name: 'Gloria Serenity Resort', stars: 5 },
    { name: 'Calista Luxury Resort', stars: 5 },
    { name: 'Regnum Carya', stars: 5 },
    { name: 'Delphin Imperial', stars: 5 },
    { name: 'Cornelia Diamond', stars: 5 },
    { name: 'Liberty Hotels Lykia', stars: 5 },
    { name: 'Akra Hotel Antalya', stars: 5 },
    { name: 'Granada Luxury Belek', stars: 5 },
    { name: 'Orange County Kemer', stars: 5 },
    { name: 'Crystal Sunset Resort', stars: 5 },
    { name: 'Barut Hemera', stars: 5 },
    { name: 'Limak Lara De Luxe', stars: 5 },
  ],
  eg: [
    { name: 'Rixos Sharm El Sheikh', stars: 5 },
    { name: 'Baron Resort Sharm', stars: 5 },
    { name: 'Stella Di Mare', stars: 4 },
    { name: 'Sunrise Arabian Beach', stars: 5 },
    { name: 'Jaz Aquamarine', stars: 4 },
    { name: 'Steigenberger Alcazar', stars: 5 },
    { name: 'Pickalbatros Aqua Park', stars: 5 },
    { name: 'Coral Sea Holiday', stars: 4 },
    { name: 'Sultan Gardens', stars: 4 },
    { name: 'Parrotel Beach Resort', stars: 4 },
    { name: 'Grand Rotana Resort', stars: 5 },
    { name: 'Cleopatra Luxury Resort', stars: 5 },
  ],
  ae: [
    'Atlantis The Palm',
    'Burj Al Arab',
    'Jumeirah Beach Hotel',
    'Armani Hotel Dubai',
    'Address Downtown',
    'Rixos The Palm',
    'One&Only The Palm',
    'Waldorf Astoria Palm Jumeirah',
    'Madinat Jumeirah',
    'Hilton Dubai The Walk',
    'Sofitel Dubai The Palm',
  ],
  th: [
    'Centara Grand Mirage',
    'Amari Phuket',
    'Novotel Phuket',
    'Hilton Pattaya',
    'Grande Centre Point',
    'Banyan Tree Phuket',
    'Anantara Riverside',
    'Pullman Phuket Arcadia',
    'Movenpick Resort Karon',
    'Kata Rocks',
  ],
  mv: [
    'Paradise Island Resort',
    'Kurumba Maldives',
    'Baros Maldives',
    'Conrad Maldives',
    'Anantara Dhigu',
    'Sun Island Resort',
    'Bandos Maldives',
    'Adaaran Select',
    'Vilamendhoo Island',
  ],
  my: [
    'The Datai Langkawi',
    'Shangri-La Rasa Sayang',
    'Mandarin Oriental KL',
    'Pangkor Laut Resort',
    'Berjaya Langkawi',
    'Genting Highlands Resort',
    'Four Seasons Langkawi',
  ],
  vn: [
    'Vinpearl Nha Trang',
    'InterContinental Nha Trang',
    'Fusion Resort Phu Quoc',
    'Novotel Danang',
    'Pullman Danang Beach',
    'Amiana Resort Nha Trang',
    'Mia Resort Nha Trang',
    'Sheraton Nha Trang',
  ],
  ge: [
    'Rooms Hotel Tbilisi',
    'Paragraph Freedom Square',
    'Radisson Blu Batumi',
    'Sheraton Batumi',
    'Hilton Batumi',
    'Marriott Tbilisi',
    'Castello Mare Resort',
    'Colchis Batumi',
  ],
  az: [
    'Fairmont Baku',
    'Hilton Baku',
    'JW Marriott Absheron',
    'Boulevard Hotel Baku',
    'Qafqaz Baku City',
    'Shahdag Hotel & Spa',
    'Gabala City Hotel',
    'Pik Palace Shahdag',
  ],
  qa: [
    'Marsa Malaz Kempinski',
    'Sharq Village & Spa',
    'Four Seasons Doha',
    'St. Regis Doha',
    'W Doha',
    'InterContinental Doha',
    'Hilton Salwa Beach',
    'Rixos Gulf Hotel Doha',
  ],
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[''`]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function toOptions(names) {
  return names.map((name) => ({ id: slugify(name), name }))
}

function toHotelOptions(entries) {
  return entries.map((entry) => {
    const name = typeof entry === 'string' ? entry : entry.name
    const stars = typeof entry === 'object' && entry.stars != null ? entry.stars : 5
    return { id: slugify(name), name, stars }
  })
}

/** Mehmonxonalarni tanlangan yulduz(lar) bo‘yicha filtrlash */
export function filterHotelsByStars(hotels, selectedStarIds) {
  if (!selectedStarIds?.size) return hotels
  return hotels.filter((h) => selectedStarIds.has(String(h.stars)))
}

export function getDepartureCities() {
  return UZBEKISTAN_DEPARTURE_CITIES
}

export function getTopDestinationCountries() {
  return TOP_DESTINATION_COUNTRIES
}

export function getTownFromByCityId(cityId) {
  return UZBEKISTAN_DEPARTURE_CITIES.find((c) => c.id === cityId)?.townFrom
}

export function getStateToByCountryId(countryId) {
  return TOP_DESTINATION_COUNTRIES.find((c) => c.id === countryId)?.stateTo
}

export function getCitiesForCountry(countryId) {
  if (!countryId) return []
  return toOptions(CITIES_BY_COUNTRY[countryId] ?? [])
}

export function getHotelsForCountry(countryId) {
  if (!countryId) return []
  return toHotelOptions(HOTELS_BY_COUNTRY[countryId] ?? [])
}

export function getCountryName(countryId) {
  return TOP_DESTINATION_COUNTRIES.find((c) => c.id === countryId)?.name
}

export function getDepartureCityName(cityId) {
  return UZBEKISTAN_DEPARTURE_CITIES.find((c) => c.id === cityId)?.name
}
