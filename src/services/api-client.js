export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function formatApiMessage(message) {
  if (Array.isArray(message)) {
    return message.join('. ')
  }
  if (typeof message === 'string' && message.trim()) {
    return message
  }
  return null
}

export async function apiRequest(path, { method = 'GET', body, token, params } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let url = `${API_BASE_URL}${path}`
  if (params) {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        search.append(key, String(value))
      }
    }
    const query = search.toString()
    if (query) url += `?${query}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }
  }

  if (!response.ok) {
    const message =
      formatApiMessage(data?.message) ??
      `So'rov bajarilmadi (${response.status})`
    throw new ApiError(message, { status: response.status, data })
  }

  return data
}
