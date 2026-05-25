import { apiRequest } from '@/services/api-client'
import { getOptionName } from '@/services/tour-catalog'
import { findMeal } from '@/lib/filters'

export const TOURS_PAGE_SIZE = 20

const MEAL_LABELS = {
  AI: 'AI (Hammasi kiritilgan)',
  BB: 'BB (Nonushta)',
  FB: 'FB (To\'liq ovqat)',
  HB: 'HB (Ikki mahal ovqat)',
  RO: 'RO (Faqat xona)',
  UAI: 'UAI (Ultra All Inclusive)',
}

function parsePositiveInt(value) {
  const num = Number.parseInt(String(value), 10)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

function parsePositiveNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

export function buildTourSearchParams(
  filters,
  page = 1,
  { countries = [], cities = [] } = {},
) {
  const params = { page, limit: TOURS_PAGE_SIZE }

  const country = getOptionName(countries, filters.toCountryId)
  if (country) params.country = country

  const departureCity = filters.departureCity?.trim()
  if (departureCity) params.departureCity = departureCity

  if (filters.dateFrom) params.departureDateFrom = filters.dateFrom
  if (filters.dateTo) params.departureDateTo = filters.dateTo

  const durationMin = parsePositiveInt(filters.nightsFrom)
  const durationMax = parsePositiveInt(filters.nightsTo)
  if (durationMin !== undefined) params.durationDaysMin = durationMin
  if (durationMax !== undefined) params.durationDaysMax = durationMax

  const adults = parsePositiveInt(filters.adults)
  const children = parsePositiveInt(filters.children)
  if (adults !== undefined && adults > 0) params.adults = adults
  if (children !== undefined && children > 0) params.children = children

  const priceMin = parsePositiveNumber(filters.priceMin)
  const priceMax = parsePositiveNumber(filters.priceMax)
  if (priceMin !== undefined) params.priceMin = priceMin
  if (priceMax !== undefined) params.priceMax = priceMax

  if (filters.selectedCityIds.size === 1) {
    const city = getOptionName(cities, [...filters.selectedCityIds][0])
    if (city) params.city = city
  }

  if (filters.selectedStarIds.size === 1) {
    const starId = [...filters.selectedStarIds][0]
    if (['3', '4', '5'].includes(starId)) params.hotelStars = Number(starId)
  }

  if (filters.selectedMealIds.size === 1) {
    const meal = findMeal([...filters.selectedMealIds][0])
    if (meal?.name) params.mealType = meal.name
  }

  const hotelQuery = filters.hotelNameQuery?.trim()
  if (hotelQuery) params.hotelName = hotelQuery

  if (filters.selectedHotelIds?.size === 1) {
    const hotel = filters.hotelOptions?.find((h) => h.id === [...filters.selectedHotelIds][0])
    if (hotel?.name) params.hotelName = hotel.name
  }

  return params
}

function matchesClientFilters(tour, filters, cities = []) {
  const tourCity = (tour.city ?? '').toLowerCase()
  const tourStars = String(tour.hotelStars ?? tour.stars ?? '')
  const tourMeal = (tour.mealType ?? tour.meal ?? '').toUpperCase()
  const tourHotel = (tour.hotelName ?? tour.hotel ?? '').toLowerCase()
  const tourPrice = tour.pricePerPerson ?? tour.price ?? tour.totalPrice

  if (filters.selectedCityIds?.size > 0) {
    const names = [...filters.selectedCityIds]
      .map((id) => getOptionName(cities, id))
      .filter(Boolean)
      .map((n) => n.toLowerCase())
    if (!names.some((name) => tourCity.includes(name) || name.includes(tourCity))) {
      return false
    }
  }

  if (filters.selectedStarIds?.size > 0) {
    if (!filters.selectedStarIds.has(tourStars)) return false
  }

  if (filters.selectedMealIds?.size > 0) {
    const codes = [...filters.selectedMealIds]
      .map((id) => findMeal(id)?.name)
      .filter(Boolean)
      .map((c) => c.toUpperCase())
    if (!codes.includes(tourMeal)) return false
  }

  if (filters.selectedHotelIds?.size > 0) {
    const names = [...filters.selectedHotelIds]
      .map((id) => filters.hotelOptions?.find((h) => h.id === id)?.name)
      .filter(Boolean)
      .map((n) => n.toLowerCase())
    if (!names.some((name) => tourHotel.includes(name) || name.includes(tourHotel))) {
      return false
    }
  }

  const priceMin = parsePositiveNumber(filters.priceMin)
  const priceMax = parsePositiveNumber(filters.priceMax)
  if (priceMin !== undefined && tourPrice != null && tourPrice < priceMin) return false
  if (priceMax !== undefined && tourPrice != null && tourPrice > priceMax) return false

  return true
}

export function applyClientFilters(tours, filters, cities = []) {
  const hasFilters =
    filters.selectedCityIds?.size > 0 ||
    filters.selectedStarIds?.size > 0 ||
    filters.selectedMealIds?.size > 0 ||
    filters.selectedHotelIds?.size > 0 ||
    filters.priceMin ||
    filters.priceMax

  if (!hasFilters) return tours
  return tours.filter((tour) => matchesClientFilters(tour, filters, cities))
}

function formatDisplayDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatDuration(days) {
  if (!days) return ''
  return `${days} tun`
}

function formatOccupancy(adults, children) {
  const parts = []
  if (adults) parts.push(`${adults} Kattalar`)
  if (children) parts.push(`${children} Bolalar`)
  return parts.join(' / ') || '2 Kattalar'
}

export function mapTourToOffer(tour) {
  const mealCode = (tour.mealType ?? tour.meal ?? '').toUpperCase()
  const adults = tour.adults ?? 2
  const children = tour.children ?? 0
  const price = tour.pricePerPerson ?? tour.price ?? tour.totalPrice ?? 0
  const currency = tour.currency ?? 'UZS'
  const durationDays = tour.durationDays ?? tour.nights ?? tour.duration
  const hotelName = tour.hotelName ?? tour.hotel ?? 'Mehmonxona'

  return {
    id:
      tour.id ??
      tour._id ??
      `${hotelName}-${tour.departureDate ?? tour.dateFrom ?? tour.checkIn}-${tour.source ?? ''}`,
    badge: tour.isCheapest ? 'eng-arzon' : tour.isRecommended ? 'tavsiya' : undefined,
    badgeLabel: tour.isCheapest ? 'Eng arzon' : tour.isRecommended ? 'Tavsiya etiladi' : undefined,
    stars: Number(tour.hotelStars ?? tour.stars ?? 0),
    hotelName,
    location: [tour.city, tour.country, tour.region].filter(Boolean).join(', ') || tour.location || '',
    flightInfo: tour.flightInfo ?? [tour.country, tour.city, tour.departureCity && `${tour.departureCity}dan`]
      .filter(Boolean)
      .join(' · '),
    date: formatDisplayDate(tour.departureDate ?? tour.date),
    flightTime: tour.flightTime ?? tour.departureTime ?? '',
    duration: tour.duration ?? formatDuration(durationDays),
    roomType: tour.roomType ?? tour.roomCategory ?? '',
    occupancy: tour.occupancy ?? formatOccupancy(adults, children),
    mealPlan: MEAL_LABELS[mealCode] ?? mealCode,
    features: tour.features ?? (tour.instantConfirmation ? ['Tezkor tasdiqlash'] : ['Joylar mavjud']),
    price,
    currency,
  }
}

export function fetchTourCountries(token) {
  return apiRequest('/tours/countries', { token })
}

export function fetchTourCities(country, token) {
  if (!country) return Promise.resolve([])
  return apiRequest(`/tours/countries/${encodeURIComponent(country)}/cities`, { token })
}

export function fetchTourRegions(token) {
  return apiRequest('/tours/regions', { token })
}

export function fetchTours(params, token) {
  return apiRequest('/tours', { params, token })
}

export function searchTours(params, token) {
  return apiRequest('/tours/search', { params, token })
}
