export function sortByName(items, key = 'name') {
  return [...items].sort((a, b) =>
    String(a[key]).localeCompare(String(b[key]), 'uz', { sensitivity: 'base' }),
  )
}

export function filterByQuery(items, query, keys = ['name']) {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) =>
    keys.some((key) => String(item[key] ?? '').toLowerCase().includes(q)),
  )
}
