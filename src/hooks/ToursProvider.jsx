import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ApiError } from '@/services/api-client'
import { getOptionName } from '@/services/tour-catalog'
import {
  applyClientFilters,
  buildTourSearchParams,
  mapTourToOffer,
  searchTours,
} from '@/services/tours-service'
import { useAuth } from '@/hooks/Auth'
import { useTourCities } from '@/hooks/useTourCities'
import { useTourCountries } from '@/hooks/useTourCountries'
import { useTourRegions } from '@/hooks/useTourRegions'

const ToursContext = createContext(null)

export function ToursProvider({ children }) {
  const { token } = useAuth()
  const { countries, loading: countriesLoading, error: countriesError } = useTourCountries()
  const { regions, loading: regionsLoading, error: regionsError } = useTourRegions()

  const [departureCity, setDepartureCity] = useState('')
  const [toCountryId, setToCountryId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [nightsFrom, setNightsFrom] = useState('7')
  const [nightsTo, setNightsTo] = useState('14')
  const [adults, setAdults] = useState('2')
  const [childrenCount, setChildrenCount] = useState('0')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [hotelNameQuery, setHotelNameQuery] = useState('')

  const [selectedCityIds, setSelectedCityIds] = useState(() => new Set())
  const [selectedStarIds, setSelectedStarIds] = useState(() => new Set())
  const [selectedMealIds, setSelectedMealIds] = useState(() => new Set())

  const [hasSearched, setHasSearched] = useState(false)
  const [searchKey, setSearchKey] = useState(0)
  const [page, setPage] = useState(1)
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const countryName = getOptionName(countries, toCountryId)
  const {
    cities,
    loading: citiesLoading,
    error: citiesError,
  } = useTourCities(countryName)

  const catalog = useMemo(() => ({ countries, cities }), [countries, cities])

  const filterState = useMemo(
    () => ({
      departureCity,
      toCountryId,
      dateFrom,
      dateTo,
      nightsFrom,
      nightsTo,
      adults,
      children: childrenCount,
      priceMin,
      priceMax,
      hotelNameQuery,
      selectedCityIds,
      selectedStarIds,
      selectedMealIds,
    }),
    [
      departureCity,
      toCountryId,
      dateFrom,
      dateTo,
      nightsFrom,
      nightsTo,
      adults,
      childrenCount,
      priceMin,
      priceMax,
      hotelNameQuery,
      selectedCityIds,
      selectedStarIds,
      selectedMealIds,
    ],
  )

  const fetchTours = useCallback(
    async (pageNum) => {
      setLoading(true)
      setError('')

      try {
        const params = buildTourSearchParams(filterState, pageNum, catalog)
        const response = await searchTours(params, token)
        const rawTours = response.data ?? []
        const filtered = applyClientFilters(rawTours, filterState, cities)
        const offers = filtered.map(mapTourToOffer)

        setResults(offers)
        setTotal(
          filtered.length > 0 && filtered.length !== rawTours.length
            ? filtered.length
            : (response.meta?.total ?? filtered.length),
        )
        setTotalPages(response.meta?.totalPages ?? 1)
        setPage(response.meta?.page ?? pageNum)
      } catch (err) {
        setResults([])
        setTotal(0)
        setTotalPages(1)
        if (err instanceof ApiError) {
          setError(err.message)
        } else if (err instanceof TypeError) {
          setError('Serverga ulanib bo\'lmadi. Internet aloqasini tekshiring')
        } else {
          setError('Qidiruv amalga oshmadi')
        }
      } finally {
        setLoading(false)
      }
    },
    [filterState, catalog, cities, token],
  )

  const setToCountry = useCallback((countryId) => {
    setToCountryId(countryId)
    setSelectedCityIds(new Set())
    setSelectedStarIds(new Set())
  }, [])

  const toggleCity = useCallback((cityId, checked) => {
    setSelectedCityIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(cityId)
      else next.delete(cityId)
      return next
    })
  }, [])

  const toggleStar = useCallback((starId) => {
    setSelectedStarIds((prev) => {
      const next = new Set(prev)
      if (next.has(starId)) next.delete(starId)
      else next.add(starId)
      return next
    })
  }, [])

  const toggleMeal = useCallback((mealId, checked) => {
    setSelectedMealIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(mealId)
      else next.delete(mealId)
      return next
    })
  }, [])

  const removeFilter = useCallback(
    (type, valueId) => {
      if (type === 'country') setToCountry('')
      else if (type === 'city') toggleCity(valueId, false)
      else if (type === 'star') toggleStar(valueId)
      else if (type === 'meal') toggleMeal(valueId, false)
    },
    [setToCountry, toggleCity, toggleStar, toggleMeal],
  )

  const clearFilters = useCallback(() => {
    setToCountryId('')
    setSelectedCityIds(new Set())
    setSelectedStarIds(new Set())
    setSelectedMealIds(new Set())
    setHotelNameQuery('')
  }, [])

  const submitSearch = useCallback(() => {
    setHasSearched(true)
    setSearchKey((k) => k + 1)
    setPage(1)
    fetchTours(1)
  }, [fetchTours])

  const goToPage = useCallback(
    (nextPage) => {
      setPage(nextPage)
      fetchTours(nextPage)
    },
    [fetchTours],
  )

  const value = useMemo(
    () => ({
      countries,
      countriesLoading,
      countriesError,
      cities,
      citiesLoading,
      citiesError,
      regions,
      regionsLoading,
      regionsError,
      departureCity,
      setDepartureCity,
      toCountryId,
      setToCountry,
      dateFrom,
      setDateFrom,
      dateTo,
      setDateTo,
      nightsFrom,
      setNightsFrom,
      nightsTo,
      setNightsTo,
      adults,
      setAdults,
      childrenCount,
      setChildrenCount,
      priceMin,
      setPriceMin,
      priceMax,
      setPriceMax,
      hotelNameQuery,
      setHotelNameQuery,
      selectedCityIds,
      toggleCity,
      selectedStarIds,
      toggleStar,
      selectedMealIds,
      toggleMeal,
      clearFilters,
      removeFilter,
      hasSearched,
      submitSearch,
      searchKey,
      page,
      goToPage,
      results,
      total,
      totalPages,
      loading,
      error,
      fetchTours,
    }),
    [
      countries,
      countriesLoading,
      countriesError,
      cities,
      citiesLoading,
      citiesError,
      regions,
      regionsLoading,
      regionsError,
      departureCity,
      toCountryId,
      dateFrom,
      dateTo,
      nightsFrom,
      nightsTo,
      adults,
      childrenCount,
      priceMin,
      priceMax,
      hotelNameQuery,
      selectedCityIds,
      selectedStarIds,
      selectedMealIds,
      setToCountry,
      toggleCity,
      toggleStar,
      toggleMeal,
      clearFilters,
      removeFilter,
      hasSearched,
      submitSearch,
      searchKey,
      page,
      goToPage,
      results,
      total,
      totalPages,
      loading,
      error,
      fetchTours,
    ],
  )

  return <ToursContext.Provider value={value}>{children}</ToursContext.Provider>
}

export function useTours() {
  const ctx = useContext(ToursContext)
  if (!ctx) {
    throw new Error('useTours ToursProvider ichida ishlatilishi kerak')
  }
  return ctx
}
