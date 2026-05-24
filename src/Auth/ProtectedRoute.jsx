import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/Auth'
import { AUTH_LOGIN_PATH } from '@/Auth/routes'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={AUTH_LOGIN_PATH} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
