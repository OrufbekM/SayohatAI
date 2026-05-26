import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ApiError } from '@/services/api-client'
import { getOptionName } from '@/services/tour-catalog'
import {
  buildParserStreamParams,
  streamParserTours,
  validateParserSearchFilters,
} from '@/services/parser-stream-service'
import {
  applyDisplayFilters,
  hasDisplayFilters,
  mapTourToOffer,
  TOURS_PAGE_SIZE,
} from '@/services/tours-service'
import { useAuth } from '@/hooks/Auth'
import { filterHotelsByStars, getDepartureCities } from '@/lib/travel-catalog'
import { useTourCities } from '@/hooks/useTourCities'
import { useTourCountries } from '@/hooks/useTourCountries'
import { useTourHotels } from '@/hooks/useTourHotels'
import { useTourRegions } from '@/hooks/useTourRegions'

const ToursContext = createContext(null)

export function ToursProvider({ children }) {
  const { token } = useAuth()
  const { countries, loading: countriesLoading, error: countriesError } = useTourCountries()
  const { regions, loading: regionsLoading, error: regionsError } = useTourRegions()

  const [departureCityId, setDepartureCityId] = useState('toshkent')
  const [toCountryId, setToCountryId] = useState('')
  const departureCities = useMemo(() => getDepartureCities(), [])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [nightsFrom, setNightsFrom] = useState('7')
  const [nightsTo, setNightsTo] = useState('14')
  const [adults, setAdults] = useState('2')
  const [childrenCount, setChildrenCount] = useState('0')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [selectedHotelIds, setSelectedHotelIds] = useState(() => new Set())

  const [selectedCityIds, setSelectedCityIds] = useState(() => new Set())
  const [selectedStarIds, setSelectedStarIds] = useState(() => new Set())
  const [selectedMealIds, setSelectedMealIds] = useState(() => new Set())
  const [sortBy, setSortBy] = useState('price')

  const [hasSearched, setHasSearched] = useState(false)
  const [searchKey, setSearchKey] = useState(0)
  const [page, setPage] = useState(1)
  const [rawTours, setRawTours] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamStatus, setStreamStatus] = useState('')
  const [error, setError] = useState('')
  const streamAbortRef = useRef(null)
  const searchGenerationRef = useRef(0)

  const {
    cities,
    loading: citiesLoading,
    error: citiesError,
  } = useTourCities(toCountryId)
  const { hotels: allHotels, loading: hotelsLoading, error: hotelsError } = useTourHotels(toCountryId)

  const hotels = useMemo(
    () => filterHotelsByStars(allHotels, selectedStarIds),
    [allHotels, selectedStarIds],
  )

  const catalog = useMemo(() => ({ countries, cities }), [countries, cities])

  useEffect(() => {
    if (selectedStarIds.size === 0) return
    setSelectedHotelIds((prev) => {
      const next = new Set(
        [...prev].filter((id) => {
          const hotel = allHotels.find((h) => h.id === id)
          return hotel && selectedStarIds.has(String(hotel.stars))
        }),
      )
      if (next.size === prev.size && [...next].every((id) => prev.has(id))) return prev
      return next
    })
  }, [selectedStarIds, allHotels])

  const filterState = useMemo(
    () => ({
      departureCityId,
      toCountryId,
      dateFrom,
      dateTo,
      nightsFrom,
      nightsTo,
      adults,
      children: childrenCount,
      priceMin,
      priceMax,
      selectedHotelIds,
      hotelOptions: allHotels,
      selectedCityIds,
      selectedStarIds,
      selectedMealIds,
      sortBy,
    }),
    [
      departureCityId,
      toCountryId,
      dateFrom,
      dateTo,
      nightsFrom,
      nightsTo,
      adults,
      childrenCount,
      priceMin,
      priceMax,
      selectedHotelIds,
      allHotels,
      selectedCityIds,
      selectedStarIds,
      selectedMealIds,
      sortBy,
    ],
  )

  const mapToursToOffers = useCallback((tours) => {
    const offers = []
    for (const tour of tours) {
      try {
        offers.push(mapTourToOffer(tour))
      } catch {
        /* bitta tour xato bo‘lsa qolganlarini ko‘rsatamiz */
      }
    }
    return offers
  }, [])

  const tourDedupeKey = useCallback((tour) => {
    const room = tour.roomType ?? tour.roomCategory ?? ''
    return tour.externalId != null
      ? `${tour.externalId}-${room}`
      : `${tour.hotelName ?? tour.hotel}-${tour.departureDate ?? ''}-${room}`
  }, [])

  const results = useMemo(
    () => mapToursToOffers(applyDisplayFilters(rawTours, filterState, cities)),
    [rawTours, filterState, cities, mapToursToOffers],
  )

  const displayFiltersActive = useMemo(() => hasDisplayFilters(filterState), [filterState])

  const appendTours = useCallback(
    
    (incoming) => {
      console.log('appendTours called', incoming?.length)

      if (!incoming?.length) return

      setRawTours((prev) => {
        const seen = new Set(prev.map(tourDedupeKey))
        const next = [...prev]
        for (const tour of incoming) {
          const key = tourDedupeKey(tour)
          if (!seen.has(key)) {
            seen.add(key)
            next.push(tour)
          }
        }
        return next
      })
    },
    [tourDedupeKey],
  )

  const fetchTours = useCallback(
    async (pageNum) => {
      streamAbortRef.current?.abort()
      const abortController = new AbortController()
      streamAbortRef.current = abortController
      const searchId = searchGenerationRef.current + 1
      searchGenerationRef.current = searchId

      setLoading(true)
      setStreaming(true)
      setError('')
      const validationError = validateParserSearchFilters(filterState)
      if (validationError) {
        setError(validationError)
        setLoading(false)
        setStreaming(false)
        return
      }

      setStreamStatus('Operatorlardan qidirilmoqda...')
      setRawTours([])
      setTotal(0)
      setTotalPages(1)

      const { path, params } = buildParserStreamParams(filterState, pageNum, {
        limit: TOURS_PAGE_SIZE,
      })

      try {
        await streamParserTours({
          path,
          params,
          token,
          signal: abortController.signal,
          handlers: {
            onProgress: (event) => {
              if (searchId !== searchGenerationRef.current) return
              const source = event.source === 'kompas' ? 'Kompas' : event.source === 'easybooking' ? 'EasyBooking' : ''
              const text = event.message ?? ''
              setStreamStatus(source ? `${source}: ${text}` : text)
            },
            onTour: (tour) => {
              if (searchId !== searchGenerationRef.current) return
              appendTours([tour])
            },
            onResult: (payload) => {
              if (searchId !== searchGenerationRef.current) return
              const tours = Array.isArray(payload?.tours) ? payload.tours : []
              setRawTours(tours)
              setTotal(payload?.total ?? tours.length)
              setTotalPages(payload?.totalPages ?? 1)
              setPage(payload?.page ?? pageNum)
            },
          },
        })
      } catch (err) {
        if (err?.name === 'AbortError') return
        if (searchId !== searchGenerationRef.current) return

        setRawTours([])
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
        if (searchId !== searchGenerationRef.current) return
        if (streamAbortRef.current === abortController) {
          streamAbortRef.current = null
        }
        setStreaming(false)
        setStreamStatus('')
        setLoading(false)
      }
    },
    [filterState, token, appendTours],
  )

  const sidebarFiltersKey = useMemo(
    () =>
      [
        [...selectedCityIds].sort().join(','),
        [...selectedStarIds].sort().join(','),
        [...selectedMealIds].sort().join(','),
        [...selectedHotelIds].sort().join(','),
      ].join('|'),
    [selectedCityIds, selectedStarIds, selectedMealIds, selectedHotelIds],
  )

  useEffect(() => {
    if (!hasSearched) return
    setPage(1)
    fetchTours(1)
  }, [sidebarFiltersKey, fetchTours])

  const setToCountry = useCallback((countryId) => {
    setToCountryId(countryId)
    setSelectedCityIds(new Set())
    setSelectedStarIds(new Set())
    setSelectedHotelIds(new Set())
  }, [])

  const toggleHotel = useCallback((hotelId, checked) => {
    setSelectedHotelIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(hotelId)
      else next.delete(hotelId)
      return next
    })
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
      else if (type === 'hotel') toggleHotel(valueId, false)
    },
    [setToCountry, toggleCity, toggleStar, toggleMeal, toggleHotel],
  )

  const clearFilters = useCallback(() => {
    setToCountryId('')
    setSelectedCityIds(new Set())
    setSelectedStarIds(new Set())
    setSelectedMealIds(new Set())
    setSelectedHotelIds(new Set())
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
      departureCities,
      departureCityId,
      setDepartureCityId,
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
      hotels,
      hotelsLoading,
      hotelsError,
      selectedHotelIds,
      toggleHotel,
      selectedCityIds,
      toggleCity,
      selectedStarIds,
      toggleStar,
      selectedMealIds,
      toggleMeal,
      sortBy,
      setSortBy,
      clearFilters,
      removeFilter,
      hasSearched,
      submitSearch,
      searchKey,
      page,
      goToPage,
      results,
      rawToursCount: rawTours.length,
      displayFiltersActive,
      total,
      totalPages,
      loading,
      streaming,
      streamStatus,
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
      departureCities,
      departureCityId,
      toCountryId,
      dateFrom,
      dateTo,
      nightsFrom,
      nightsTo,
      adults,
      childrenCount,
      priceMin,
      priceMax,
      allHotels,
      hotels,
      hotelsLoading,
      hotelsError,
      selectedHotelIds,
      toggleHotel,
      selectedCityIds,
      selectedStarIds,
      selectedMealIds,
      sortBy,
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
      rawTours,
      displayFiltersActive,
      total,
      totalPages,
      loading,
      streaming,
      streamStatus,
      error,
      fetchTours,
    ],
  )

  return <ToursContext.Provider value={value}>{children}</ToursContext.Provider>
}

export const useTours = () => {
  const ctx = useContext(ToursContext)
  if (!ctx) {
    throw new Error('useTours ToursProvider ichida ishlatilishi kerak')
  }
  return ctx
}

