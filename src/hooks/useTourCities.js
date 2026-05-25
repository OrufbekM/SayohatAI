import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiError } from '@/services/api-client'
import { getCitiesForCountry, getCountryName } from '@/lib/travel-catalog'
import { normalizeTourOptions } from '@/services/tour-catalog'
import { fetchTourCities } from '@/services/tours-service'
import { useAuth } from '@/hooks/Auth'

export function useTourCities(countryId) {
  const { token } = useAuth()
  const catalogCities = useMemo(() => getCitiesForCountry(countryId), [countryId])
  const countryName = useMemo(() => getCountryName(countryId), [countryId])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!countryId) {
      setCities([])
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = countryName ? await fetchTourCities(countryName, token) : []
      const normalized = normalizeTourOptions(data)
      setCities(normalized.length > 0 ? normalized : catalogCities)
    } catch (err) {
      setCities(catalogCities)
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (!(err instanceof TypeError)) {
        setError('Shaharlar ro\'yxatini yuklab bo\'lmadi')
      }
    } finally {
      setLoading(false)
    }
  }, [countryId, countryName, token, catalogCities])

  useEffect(() => {
    ;(async () => { await load() })()
  }, [load])

  return { cities, loading, error, refetch: load }
}
