import { API_BASE_URL, ApiError } from '@/services/api-client'
import { snapNightsForParser } from '@/lib/parser-filters'
import {
  getParserPathForCountry,
  getParserStateToId,
  getParserTownFromId,
  isParserDepartureSupported,
  isParserDestinationSupported,
} from '@/lib/travel-catalog'

function parsePositiveInt(value) {
  const num = Number.parseInt(String(value), 10)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

/**
 * FILTER_REFERENCE.txt dagi ruxsat etilgan query parametrlar.
 * Shahar/yulduz/mehmonxona — faqat client filtri; parser API da yo‘q.
 */
export function buildParserStreamParams(
  filters,
  page = 1,
  { limit = 20, sortBy, operator } = {},
) {
  const countryOperator =
    operator ?? (filters.toCountryId ? getParserPathForCountry(filters.toCountryId) : 'stream')
  const parserOperator = countryOperator === 'easybooking' ? 'easybooking' : 'kompas'
  const resolvedSort = sortBy ?? filters.sortBy ?? 'price'
  const params = { page, limit, sortBy: resolvedSort }

  const townFrom = getParserTownFromId(filters.departureCityId, parserOperator)
  if (townFrom != null) params.townFrom = townFrom

  const stateTo = getParserStateToId(filters.toCountryId, parserOperator)
  if (stateTo != null) params.stateTo = stateTo

  if (filters.dateFrom) params.dateFrom = filters.dateFrom
  if (filters.dateTo) params.dateTo = filters.dateTo

  const nightsFrom = snapNightsForParser(filters.nightsFrom, parserOperator)
  const nightsTo = snapNightsForParser(filters.nightsTo, parserOperator)
  if (nightsFrom !== undefined) params.nightsFrom = nightsFrom
  if (nightsTo !== undefined) params.nightsTo = nightsTo

  const adults = parsePositiveInt(filters.adults)
  const children = parsePositiveInt(filters.children)
  if (adults !== undefined && adults >= 1 && adults <= 4) params.adults = adults
  if (children !== undefined && children >= 0 && children <= 3) {
    params.children = children
  }

  if (countryOperator === 'easybooking') {
    return { path: '/parser/easybooking/stream', params }
  }
  if (countryOperator === 'kompas') {
    return { path: '/parser/kompas/stream', params }
  }

  return { path: '/parser/stream', params }
}

export function validateParserSearchFilters(filters) {
  const parserOperator =
    filters.toCountryId && getParserPathForCountry(filters.toCountryId) === 'easybooking'
      ? 'easybooking'
      : 'kompas'

  if (!filters.departureCityId) {
    return 'Qayerdan shaharini tanlang'
  }
  if (!isParserDepartureSupported(filters.departureCityId, parserOperator)) {
    return 'Tanlangan shahar uchun parser ID topilmadi (FILTER_REFERENCE). Boshqa shahar tanlang'
  }
  if (!filters.toCountryId) {
    return 'Qayerga davlatini tanlang'
  }
  if (!isParserDestinationSupported(filters.toCountryId, parserOperator)) {
    return 'Bu davlat parserda qo‘llab-quvvatlanmaydi. Maldiv, Mavrikiy, Seyshel yoki Ozarbayjonni tanlang'
  }
  return null
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

/** Katta `result` event — JSON.parse butun qatorga sig‘masa, qavslarni hisoblab ajratish */
function extractResultPayloadFromBuffer(buffer) {
  const markerIdx = buffer.lastIndexOf('"type":"result"')
  if (markerIdx === -1) return null

  const braceStart = buffer.lastIndexOf('{', markerIdx)
  if (braceStart === -1) return null

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = braceStart; i < buffer.length; i += 1) {
    const char = buffer[i]

    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }

    if (char === '"') inString = true
    else if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        try {
          const payload = JSON.parse(buffer.slice(braceStart, i + 1))
          if (payload?.type === 'result') return payload
        } catch {
          return null
        }
        return null
      }
    }
  }

  return null
}

/** Kichik SSE eventlar (progress, tour, error) — result dan alohida */
function parseSmallSseEvents(text) {
  const events = []
  const normalized = text.replace(/\r\n/g, '\n')

  for (const block of normalized.split(/\n\n+/)) {
    if (block.includes('"type":"result"')) continue

    const dataLines = block
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())

    if (dataLines.length === 0) continue

    const joined = dataLines.join('\n')
    if (joined.length > 8000) continue

    try {
      const payload = JSON.parse(joined)
      if (payload?.type && payload.type !== 'result') events.push(payload)
    } catch {
      /* ignore */
    }
  }

  return events
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

function dispatchPayload(payload, handlers) {
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
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    fullText += decoder.decode(value, { stream: true })

    const progressMatch = fullText.match(
      /data:\s*(\{"type":"progress"[\s\S]*?\})\s*(?:\n\n|$)/g,
    )
    if (progressMatch?.length) {
      try {
        const last = progressMatch[progressMatch.length - 1]
        const json = last.replace(/^data:\s*/, '').trim()
        dispatchPayload(JSON.parse(json), handlers)
      } catch {
        /* ignore */
      }
    }
  }

  if (signal?.aborted) return

  const resultPayload = extractResultPayloadFromBuffer(fullText)
  if (resultPayload) {
    handlers.onResult?.(resultPayload)
  } else {
    try {
      const lastData = fullText.lastIndexOf('data:')
      if (lastData !== -1) {
        const json = fullText.slice(lastData + 5).trim()
        const payload = JSON.parse(json)
        if (payload?.type === 'result') handlers.onResult?.(payload)
      }
    } catch {
      /* ignore */
    }
  }

  for (const event of parseSmallSseEvents(fullText)) {
    dispatchPayload(event, handlers)
  }

  handlers.onDone?.()
}
