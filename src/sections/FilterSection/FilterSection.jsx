import DestinationCities from './components/DestinationCities'
import GuestsAndPrice from './components/GuestsAndPrice'
import HotelNames from './components/HotelNames'
import HotelStars from './components/HotelStars'
import MealPlans from './components/MealPlans'

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
