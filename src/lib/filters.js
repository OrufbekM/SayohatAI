export const MEAL_OPTIONS = [
  { id: 'ai', name: 'AI', label: 'All Inclusive' },
  { id: 'bb', name: 'BB', label: 'Breakfast' },
  { id: 'fb', name: 'FB', label: 'Full Board' },
  { id: 'hb', name: 'HB', label: 'Half Board' },
  { id: 'ro', name: 'RO', label: 'Room Only' },
  { id: 'uai', name: 'UAI', label: 'Ultra All Inclusive' },
]

export const HOTEL_STAR_OPTIONS = [
  { id: '3', name: '3*' },
  { id: '4', name: '4*' },
  { id: '5', name: '5*' },
]

export function findMeal(id) {
  return MEAL_OPTIONS.find((m) => m.id === id)
}

export function findHotelStar(id) {
  return HOTEL_STAR_OPTIONS.find((s) => s.id === id)
}
