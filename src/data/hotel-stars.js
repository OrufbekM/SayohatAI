import hotelStarsData from './hotel-stars.json'
import { sortByName } from './sort'

export const hotelStars = sortByName(hotelStarsData, 'name')
