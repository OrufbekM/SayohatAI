import { ApiError } from '@/services/api-client'
import {
  getDepartureCityName,
  getStateToByCountryId,
  getTownFromByCityId,
} from '@/lib/travel-catalog'
import { findMeal } from '@/lib/filters'
import { getOptionName } from '@/services/tour-catalog'

function parsePositiveNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://64.226.103.10:4000/api'

const STATE_TO_CODES = {
  turkiya: 'TR',
  turkey: 'TR',
  misr: 'EG',
  egypt: 'EG',
  baa: 'AE',
  'united-arab-emirates': 'AE',
  tailand: 'TH',
  thailand: 'TH',
  malayziya: 'MY',
  malaysia: 'MY',
  'sri-lanka': 'LK',
  'sri-lanka-': 'LK',
  qatar: 'QA',
  oman: 'OM',
  maldiv: 'MV',
  maldives: 'MV',
  gruziya: 'GE',
  georgia: 'GE',
  azerbayjan: 'AZ',
  azerbaijan: 'AZ',
  'saudi-arabia': 'SA',
  'saudiya-arabistoni': 'SA',
  vietnam: 'VN',
  indoneziya: 'ID',
  indonesia: 'ID',
  xitoy: 'CN',
  china: 'CN',
}

function parsePositiveInt(value) {
  const num = Number.parseInt(String(value), 10)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

function resolveTownFrom(departureCityId, departureCityName) {
  const fromCatalog = getTownFromByCityId(departureCityId)
  if (fromCatalog) return fromCatalog
  const raw = departureCityName?.trim()
  if (!raw) return undefined
  if (/^[A-Z]{2,4}$/.test(raw)) return raw.toUpperCase()
  return undefined
}

function resolveStateTo(countryName, countryId) {
  const fromCatalog = getStateToByCountryId(countryId)
  if (fromCatalog) return fromCatalog
  if (!countryName && !countryId) return undefined
  const idKey = String(countryId ?? '')
    .toLowerCase()
    .trim()
  if (/^[A-Z]{2,3}$/i.test(idKey)) return idKey.toUpperCase()
  if (STATE_TO_CODES[idKey]) return STATE_TO_CODES[idKey]

  const nameKey = String(countryName ?? '')
    .toLowerCase()
    .trim()
    .replace(/[''`]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  if (STATE_TO_CODES[nameKey]) return STATE_TO_CODES[nameKey]
  if (/^[A-Z]{2,3}$/i.test(countryName)) return countryName.toUpperCase()
  return undefined
}

export function buildParserStreamParams(
  filters,
  page = 1,
  { countries = [], cities = [], limit = 10, sortBy = 'price', operator = 'all' } = {},
) {
  const params = { page, limit, sortBy }

  const countryName = getOptionName(countries, filters.toCountryId)
  const stateTo = resolveStateTo(countryName, filters.toCountryId)
  if (stateTo) params.stateTo = stateTo

  const departureName = getDepartureCityName(filters.departureCityId)
  const townFrom = resolveTownFrom(filters.departureCityId, departureName)
  if (townFrom) params.townFrom = townFrom

  if (filters.dateFrom) params.dateFrom = filters.dateFrom
  if (filters.dateTo) params.dateTo = filters.dateTo

  const nightsFrom = parsePositiveInt(filters.nightsFrom)
  const nightsTo = parsePositiveInt(filters.nightsTo)
  if (nightsFrom !== undefined) params.nightsFrom = nightsFrom
  if (nightsTo !== undefined) params.nightsTo = nightsTo

  const adults = parsePositiveInt(filters.adults)
  const children = parsePositiveInt(filters.children)
  if (adults !== undefined && adults > 0) params.adults = adults
  if (children !== undefined && children > 0) params.children = children

  const priceMin = parsePositiveNumber(filters.priceMin)
  const priceMax = parsePositiveNumber(filters.priceMax)
  if (priceMin !== undefined) params.priceMin = priceMin
  if (priceMax !== undefined) params.priceMax = priceMax

  if (filters.selectedCityIds?.size === 1) {
    const city = getOptionName(cities, [...filters.selectedCityIds][0])
    if (city) params.city = city
  }

  if (filters.selectedStarIds?.size === 1) {
    const starId = [...filters.selectedStarIds][0]
    if (['3', '4', '5'].includes(starId)) {
      params.stars = Number(starId)
      params.hotelStars = Number(starId)
    }
  }

  if (filters.selectedMealIds?.size === 1) {
    const meal = findMeal([...filters.selectedMealIds][0])
    if (meal?.name) params.meal = meal.name
  }

  if (filters.selectedHotelIds?.size === 1) {
    const hotel = filters.hotelOptions?.find((h) => h.id === [...filters.selectedHotelIds][0])
    if (hotel?.name) params.hotelName = hotel.name
  }

  if (operator === 'kompas') {
    return { path: '/parser/kompas/stream', params }
  }

  return { path: '/parser/stream', params }
}

function buildStreamUrl(path, params, token) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value))
    }
  }
  const query = search.toString()
  let url = `${API_BASE_URL}${path}`
  if (query) url += `?${query}`
  return { url, headers: token ? { Authorization: `Bearer ${token}` } : {} }
}

function extractSseEvents(buffer) {
  const events = []
  let rest = buffer

  while (true) {
    const boundary = rest.indexOf('\n\n')
    if (boundary === -1) break

    const rawBlock = rest.slice(0, boundary)
    rest = rest.slice(boundary + 2)

    const dataLines = rawBlock
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())

    if (dataLines.length === 0) continue
    events.push(dataLines.join('\n'))
  }

  return { events, rest }
}

function extractTour(payload) {
  if (!payload || typeof payload !== 'object') return null
  if (payload.tour && typeof payload.tour === 'object') return payload.tour
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data
  }
  if (payload.hotelName || payload.hotel || payload.price != null) return payload
  return null
}

function handleStreamPayload(payload, handlers) {
  if (!payload?.type) return

  switch (payload.type) {
    case 'progress':
      handlers.onProgress?.(payload)
      break
    case 'tour': {
      const tour = extractTour(payload)
      if (tour) handlers.onTour?.(tour, payload)
      break
    }
    case 'result':
      handlers.onResult?.(payload)
      break
    case 'error':
      handlers.onError?.(new ApiError(payload.message ?? 'Parser xatosi', { data: payload }))
      break
    case 'done':
    case 'complete':
      handlers.onDone?.(payload)
      break
    default:
      break
  }
}

/**
 * Server-Sent Events orqali parser stream endpointiga ulanadi.
 * Har bir tour kelganda onTour, oxirida onResult chaqiriladi.
 */
export async function streamParserTours({ path, params, token, signal, handlers = {} }) {
  const { url, headers } = buildStreamUrl(path, params, token)
  const response = await fetch(url, { method: 'GET', headers, signal })

  if (!response.ok) {
    let message = `So'rov bajarilmadi (${response.status})`
    try {
      const errBody = await response.json()
      if (errBody?.message) message = String(errBody.message)
    } catch {
      /* ignore */
    }
    throw new ApiError(message, { status: response.status })
  }

  if (!response.body) {
    throw new ApiError('Stream javobi mavjud emas')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const { events, rest } = extractSseEvents(buffer)
    buffer = rest

    for (const data of events) {
      try {
        const payload = JSON.parse(data)
        handleStreamPayload(payload, handlers)
      } catch {
        /* skip malformed chunks */
      }
    }
  }

  if (buffer.trim()) {
    const { events } = extractSseEvents(`${buffer}\n\n`)
    for (const data of events) {
      try {
        const payload = JSON.parse(data)
        handleStreamPayload(payload, handlers)
      } catch {
        /* skip */
      }
    }
  }

  handlers.onDone?.()
}
