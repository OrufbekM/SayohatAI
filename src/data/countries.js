import countriesData from './countries.json'
import { sortByName } from './sort'

export const countries = sortByName(countriesData)
