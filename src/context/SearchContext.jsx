import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { hotels } from '@/data/hotels'

const SearchContext = createContext(null)

function pruneHotels(selectedHotelIds, predicate) {
  const next = new Set(selectedHotelIds)
  for (const hotelId of selectedHotelIds) {
    const hotel = hotels.find((h) => h.id === hotelId)
    if (hotel && !predicate(hotel)) next.delete(hotelId)
  }
  return next
}

export function SearchProvider({ children }) {
  const [fromCityId, setFromCityId] = useState('toshkent')
  const [toCountryId, setToCountryId] = useState('')
  const [selectedCityIds, setSelectedCityIds] = useState(() => new Set())
  const [selectedStarIds, setSelectedStarIds] = useState(() => new Set())
  const [selectedHotelIds, setSelectedHotelIds] = useState(() => new Set())
  const [hasSearched, setHasSearched] = useState(false)
  const [searchKey, setSearchKey] = useState(0)

  const setToCountry = useCallback((countryId) => {
    setToCountryId(countryId)
    setSelectedCityIds(new Set())
    setSelectedStarIds(new Set())
    setSelectedHotelIds(new Set())
  }, [])

  const toggleCity = useCallback((cityId, checked) => {
    setSelectedCityIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(cityId)
      else next.delete(cityId)
      return next
    })

    if (!checked) {
      setSelectedHotelIds((prev) =>
        pruneHotels(prev, (hotel) => hotel.cityId !== cityId),
      )
    }
  }, [])

  const toggleStar = useCallback((starId) => {
    setSelectedStarIds((prevStars) => {
      const nextStars = new Set(prevStars)
      if (nextStars.has(starId)) nextStars.delete(starId)
      else nextStars.add(starId)

      setSelectedHotelIds((prevHotels) => {
        if (nextStars.size === 0) return prevHotels
        return pruneHotels(prevHotels, (hotel) => nextStars.has(hotel.stars))
      })

      return nextStars
    })
  }, [])

  const toggleHotel = useCallback((hotelId, checked) => {
    setSelectedHotelIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(hotelId)
      else next.delete(hotelId)
      return next
    })
  }, [])

  const removeFilter = useCallback(
    (type, valueId) => {
      if (type === 'country') setToCountry('')
      else if (type === 'city') toggleCity(valueId, false)
      else if (type === 'star') toggleStar(valueId)
      else if (type === 'hotel') toggleHotel(valueId, false)
    },
    [setToCountry, toggleCity, toggleStar, toggleHotel],
  )

  const clearFilters = useCallback(() => {
    setToCountryId('')
    setSelectedCityIds(new Set())
    setSelectedStarIds(new Set())
    setSelectedHotelIds(new Set())
  }, [])

  const submitSearch = useCallback(() => {
    setHasSearched(true)
    setSearchKey((k) => k + 1)
  }, [])

  const value = useMemo(
    () => ({
      fromCityId,
      setFromCityId,
      toCountryId,
      setToCountry,
      selectedCityIds,
      toggleCity,
      selectedStarIds,
      toggleStar,
      selectedHotelIds,
      toggleHotel,
      clearFilters,
      removeFilter,
      hasSearched,
      submitSearch,
      searchKey,
    }),
    [
      fromCityId,
      toCountryId,
      selectedCityIds,
      selectedStarIds,
      selectedHotelIds,
      setToCountry,
      toggleCity,
      toggleStar,
      toggleHotel,
      clearFilters,
      removeFilter,
      hasSearched,
      submitSearch,
      searchKey,
    ],
  )

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}
