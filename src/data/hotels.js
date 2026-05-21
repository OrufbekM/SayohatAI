import hotelsData from './hotels.json'
import { filterByQuery, sortByName } from './sort'

export const hotels = sortByName(hotelsData)

export function getFilteredHotels(cityIds, starIds) {
  if (!cityIds?.size) return []

  return hotels.filter((hotel) => {
    if (!cityIds.has(hotel.cityId)) return false
    if (!starIds?.size) return true
    return starIds.has(hotel.stars)
  })
}

export function filterHotels(query, cityIds, starIds) {
  const list = getFilteredHotels(cityIds, starIds)
  return filterByQuery(list, query)
}
