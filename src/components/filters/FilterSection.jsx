import DestinationCities from './DestinationCities'
import GuestsAndPrice from './GuestsAndPrice'
import HotelNames from './HotelNames'
import HotelStars from './HotelStars'
import MealPlans from './MealPlans'

export function FilterSection() {
  return (
    <section aria-label="Filtrlar" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <GuestsAndPrice />
      <DestinationCities />
      <HotelStars />
      <HotelNames />
      <MealPlans />
    </section>
  )
}

export default FilterSection
