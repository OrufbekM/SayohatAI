/** FILTER_REFERENCE.txt — Kompas tun qiymatlari */
export const KOMPAS_NIGHTS = [4, 5, 6, 8, 9, 10, 11, 12, 13, 15]

/** FILTER_REFERENCE.txt — EasyBooking tun qiymatlari */
export const EASYBOOKING_NIGHTS = [3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21]

export const PARSER_SORT_OPTIONS = [
  'price',
  'price_desc',
  'stars',
  'meal',
  'duration',
  'duration_desc',
]

/** UI select uchun */
export const PARSER_SORT_CHOICES = [
  { id: 'price', name: 'Arzonidan qimmatga' },
  { id: 'price_desc', name: 'Qimmatidan arzonga' },
  { id: 'stars', name: 'Yulduz bo‘yicha' },
  { id: 'meal', name: 'Ovqatlanish bo‘yicha' },
  { id: 'duration', name: 'Qisqa muddatdan' },
  { id: 'duration_desc', name: 'Uzun muddatdan' },
]

function nearestAllowed(value, allowed) {
  return allowed.reduce((best, curr) =>
    Math.abs(curr - value) < Math.abs(best - value) ? curr : best,
  )
}

/** Parser API uchun tunlarni operator ro‘yxatiga moslashtirish */
export function snapNightsForParser(value, operator = 'kompas') {
  const num = Number.parseInt(String(value), 10)
  if (!Number.isFinite(num) || num < 1) return undefined

  const allowed = operator === 'easybooking' ? EASYBOOKING_NIGHTS : KOMPAS_NIGHTS
  if (allowed.includes(num)) return num
  return nearestAllowed(num, allowed)
}
