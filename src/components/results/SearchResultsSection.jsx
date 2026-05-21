import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { useSearch } from '@/context/SearchContext'
import { cities } from '@/data/cities'
import { countries } from '@/data/countries'
import { hotelStars } from '@/data/hotel-stars'
import { hotels } from '@/data/hotels'
import { PAGE_SIZE, searchResults } from '@/data/search-results'
import { ResultsPagination } from './ResultsPagination'
import { SearchResultCard } from './SearchResultCard'

function buildActiveFilters(ctx) {
  const tags = []

  const country = countries.find((c) => c.id === ctx.toCountryId)
  if (country) {
    tags.push({ id: `country-${country.id}`, type: 'country', valueId: country.id, label: country.name })
  }

  for (const cityId of ctx.selectedCityIds) {
    const city = cities.find((c) => c.id === cityId)
    if (city) {
      tags.push({ id: `city-${city.id}`, type: 'city', valueId: city.id, label: city.name })
    }
  }

  for (const starId of ctx.selectedStarIds) {
    const star = hotelStars.find((s) => s.id === starId)
    if (star) {
      tags.push({ id: `star-${star.id}`, type: 'star', valueId: star.id, label: star.name })
    }
  }

  for (const hotelId of ctx.selectedHotelIds) {
    const hotel = hotels.find((h) => h.id === hotelId)
    if (hotel) {
      tags.push({ id: `hotel-${hotel.id}`, type: 'hotel', valueId: hotel.id, label: hotel.name })
    }
  }

  return tags
}

export function SearchResultsSection() {
  const search = useSearch()
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [search.searchKey])

  const activeFilters = useMemo(
    () => buildActiveFilters(search),
    [search.toCountryId, search.selectedCityIds, search.selectedStarIds, search.selectedHotelIds],
  )

  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE))

  const pageResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return searchResults.slice(start, start + PAGE_SIZE)
  }, [page])

  if (!search.hasSearched) return null

  return (
    <section aria-label="Qidiruv natijalari" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Qidiruv natijalari</h2>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{searchResults.length}</span> ta taklif topildi
        </p>
      </div>

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
            onClick={() => {
              search.clearFilters()
              setPage(1)
            }}
            className="text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            Filtrlarni tozalash
          </button>
        </div>
      )}

      <div className="space-y-4">
        {pageResults.map((offer) => (
          <SearchResultCard key={offer.id} offer={offer} />
        ))}
      </div>

      {totalPages > 1 && (
        <ResultsPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </section>
  )
}

export default SearchResultsSection
