import { useMemo } from 'react'
import { getHotelsForCountry } from '@/lib/travel-catalog'

export function useTourHotels(countryId) {
  const hotels = useMemo(() => getHotelsForCountry(countryId), [countryId])
  const loading = false
  const error = ''

  return { hotels, loading, error }
}
