import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/services/api-client'
import { getTopDestinationCountries } from '@/lib/travel-catalog'
import { normalizeTourOptions } from '@/services/tour-catalog'
import { fetchTourCountries } from '@/services/tours-service'
import { useAuth } from '@/hooks/Auth'

const FALLBACK_COUNTRIES = getTopDestinationCountries()

export function useTourCountries() {
  const { token } = useAuth()
  const [countries, setCountries] = useState(FALLBACK_COUNTRIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchTourCountries(token)
      const normalized = normalizeTourOptions(data)
      setCountries(normalized.length > 0 ? normalized.slice(0, 10) : FALLBACK_COUNTRIES)
    } catch (err) {
      setCountries(FALLBACK_COUNTRIES)
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (!(err instanceof TypeError)) {
        setError('Davlatlar ro\'yxatini yuklab bo\'lmadi')
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  return { countries, loading, error, refetch: load }
}
