import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/hooks/Auth'
import { AuthPage } from '@/Auth/AuthPage'
import { GuestRoute } from '@/Auth/GuestRoute'
import { ProtectedRoute } from '@/Auth/ProtectedRoute'
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH } from '@/Auth/routes'
import { HomePage } from '@/pages/HomePage'
import { ToursProvider } from '@/hooks/Tours'
import { TopLoader } from './components/TopLoader'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToursProvider>
        <TopLoader />
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path={AUTH_LOGIN_PATH} element={<AuthPage />} />
              <Route path={AUTH_REGISTER_PATH} element={<AuthPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </ToursProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
