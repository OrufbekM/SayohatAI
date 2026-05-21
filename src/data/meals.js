import mealsData from './meals.json'
import { sortByName } from './sort'

export const meals = sortByName(mealsData, 'name')
