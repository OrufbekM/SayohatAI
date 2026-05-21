import citiesData from './cities.json'
import { filterByQuery, sortByName } from './sort'

export const cities = sortByName(citiesData)

export function getCitiesByCountry(countryId) {
  if (!countryId) return []
  return cities.filter((city) => city.countryId === countryId)
}

export function filterCities(query, countryId) {
  const list = getCitiesByCountry(countryId)
  return filterByQuery(list, query, ['name'])
}
