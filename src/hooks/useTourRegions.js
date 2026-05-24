import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/services/api-client'
import { normalizeTourOptions } from '@/services/tour-catalog'
import { fetchTourRegions } from '@/services/tours-service'
import { useAuth } from '@/hooks/Auth'

export function useTourRegions() {
  const { token } = useAuth()
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchTourRegions(token)
      const normalized = normalizeTourOptions(data)
      setRegions(normalized)
    } catch (err) {
      setRegions([])
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof TypeError) {
        setError('Regionlar ro\'yxatini yuklab bo\'lmadi')
      } else {
        setError('Regionlar ro\'yxatini yuklab bo\'lmadi')
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  return { regions, loading, error, refetch: load }
}
