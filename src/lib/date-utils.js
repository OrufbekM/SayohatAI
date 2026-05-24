export function parseIsoDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function toIsoDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDisplayDate(iso) {
  const date = parseIsoDate(iso)
  if (!date) return null
  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatMonthYear(year, month) {
  return new Intl.DateTimeFormat('uz-UZ', { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1),
  )
}

const WEEKDAY_ANCHOR = new Date(2024, 0, 7)

export function getWeekdayLabels() {
  return Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat('uz-UZ', { weekday: 'short' }).format(
      new Date(WEEKDAY_ANCHOR.getFullYear(), WEEKDAY_ANCHOR.getMonth(), WEEKDAY_ANCHOR.getDate() + i),
    ),
  )
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function buildCalendarCells(viewYear, viewMonth) {
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const currentMonthDays = daysInMonth(viewYear, viewMonth)
  const prev = normalizeMonthYear(viewYear, viewMonth - 1)
  const next = normalizeMonthYear(viewYear, viewMonth + 1)
  const prevMonthDays = daysInMonth(prev.year, prev.month)
  const cells = []

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: prevMonthDays - i,
      month: prev.month,
      year: prev.year,
      outside: true,
    })
  }

  for (let day = 1; day <= currentMonthDays; day++) {
    cells.push({ day, month: viewMonth, year: viewYear, outside: false })
  }

  let nextDay = 1
  while (cells.length % 7 !== 0) {
    cells.push({
      day: nextDay++,
      month: next.month,
      year: next.year,
      outside: true,
    })
  }

  return cells
}

export function normalizeMonthYear(year, month) {
  const date = new Date(year, month, 1)
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function isSameDay(a, b) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isBeforeDay(a, b) {
  const aNorm = new Date(a.getFullYear(), a.getMonth(), a.getDate())
  const bNorm = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return aNorm < bNorm
}
