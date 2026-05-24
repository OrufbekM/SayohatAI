import { sortByName } from '@/lib/list-utils'

export function toOptionSlug(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[''`]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function normalizeTourOptions(items) {
  if (!Array.isArray(items)) return []

  const options = items
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim()
        if (!name) return null
        return { id: toOptionSlug(name), name }
      }

      const name = String(item.name ?? item.country ?? item.city ?? item.region ?? '').trim()
      if (!name) return null
      return { id: item.id ?? toOptionSlug(name), name }
    })
    .filter(Boolean)

  return sortByName(options)
}

export function getOptionName(options, id) {
  if (!id) return undefined
  return options.find((o) => o.id === id)?.name
}
