import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/services/api-client'
import { normalizeTourOptions } from '@/services/tour-catalog'
import { fetchTourCities } from '@/services/tours-service'
import { useAuth } from '@/hooks/Auth'

export function useTourCities(countryName) {
  const { token } = useAuth()
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!countryName) {
      setCities([])
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await fetchTourCities(countryName, token)
      const normalized = normalizeTourOptions(data)
      setCities(normalized)
    } catch (err) {
      setCities([])
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof TypeError) {
        setError('Shaharlar ro\'yxatini yuklab bo\'lmadi')
      } else {
        setError('Shaharlar ro\'yxatini yuklab bo\'lmadi')
      }
    } finally {
      setLoading(false)
    }
  }, [countryName, token])

  useEffect(() => {
    load()
  }, [load])

  return { cities, loading, error, refetch: load }
}
