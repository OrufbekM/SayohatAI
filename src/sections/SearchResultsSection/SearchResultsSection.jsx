import { useMemo } from 'react'
import { X } from 'lucide-react'
import { useTours } from '@/hooks/Tours'
import { findHotelStar, findMeal } from '@/lib/filters'
import { ResultsPagination } from './components/ResultsPagination'
import { SearchResultCard } from './components/SearchResultCard'

function buildActiveFilters(ctx) {
  const tags = []

  const country = ctx.countries.find((c) => c.id === ctx.toCountryId)
  if (country) {
    tags.push({ id: `country-${country.id}`, type: 'country', valueId: country.id, label: country.name })
  }

  for (const cityId of ctx.selectedCityIds) {
    const city = ctx.cities.find((c) => c.id === cityId)
    if (city) {
      tags.push({ id: `city-${city.id}`, type: 'city', valueId: city.id, label: city.name })
    }
  }

  for (const starId of ctx.selectedStarIds) {
    const star = findHotelStar(starId)
    if (star) {
      tags.push({ id: `star-${star.id}`, type: 'star', valueId: star.id, label: star.name })
    }
  }

  for (const mealId of ctx.selectedMealIds) {
    const meal = findMeal(mealId)
    if (meal) {
      tags.push({ id: `meal-${meal.id}`, type: 'meal', valueId: meal.id, label: meal.name })
    }
  }

  for (const hotelId of ctx.selectedHotelIds) {
    const hotel = ctx.hotels.find((h) => h.id === hotelId)
    if (hotel) {
      tags.push({ id: `hotel-${hotel.id}`, type: 'hotel', valueId: hotel.id, label: hotel.name })
    }
  }

  return tags
}

export function SearchResultsSection() {
  const search = useTours()

  const activeFilters = useMemo(
    () => buildActiveFilters(search),
    [
      search.toCountryId,
      search.countries,
      search.cities,
      search.selectedCityIds,
      search.selectedStarIds,
      search.selectedMealIds,
      search.selectedHotelIds,
      search.hotels,
    ],
  )

  if (!search.hasSearched) return null

  return (
    <section aria-label="Qidiruv natijalari" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Qidiruv natijalari</h2>
        {!search.streaming && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{search.total}</span> ta taklif topildi
          </p>
        )}
      </div>

      {search.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{search.error}</p>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white py-1 pr-1.5 pl-3 text-sm font-medium text-foreground"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => search.removeFilter(tag.type, tag.valueId)}
                className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={`${tag.label} filtrini olib tashlash`}
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={search.clearFilters}
            className="text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            Filtrlarni tozalash
          </button>
        </div>
      )}

      {search.streaming && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="size-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="text-sm text-muted-foreground">Qidirilmoqda...</p>
        </div>
      )}

      {!search.streaming && !search.error && search.results.length === 0 && (
        <p className="rounded-lg border border-black/[0.06] bg-white px-4 py-8 text-center text-sm text-muted-foreground">
          Tanlangan parametrlar bo'yicha taklif topilmadi
        </p>
      )}

      {!search.streaming && (
        <div className="space-y-4">
          {search.results.map((offer) => (
            <SearchResultCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}

      {!search.streaming && search.totalPages > 1 && (
        <ResultsPagination
          page={search.page}
          totalPages={search.totalPages}
          onPageChange={search.goToPage}
        />
      )}
    </section>
  )
}

export default SearchResultsSection