import { useEffect, useRef } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useLocation } from 'react-router-dom'
import { useTours } from '@/hooks/Tours'

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 })

export function TopLoader() {
  const { loading } = useTours()
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    NProgress.done()
  }, [location.pathname])

  useEffect(() => {
    if (loading) NProgress.start()
    else NProgress.done()
  }, [loading])

  return null
}