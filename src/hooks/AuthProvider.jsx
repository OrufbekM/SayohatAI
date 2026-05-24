import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ApiError } from '@/services/api-client'
import { loginUser, registerUser } from '@/services/auth-service'

const STORAGE_KEY = 'sayohat-auth'

const AuthContext = createContext(null)

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function toAuthError(error, fallback) {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof TypeError) {
    return 'Serverga ulanib bo\'lmadi. Internet aloqasini tekshiring'
  }
  return fallback
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession())

  const user = session?.user ?? null
  const token = session?.token ?? null
  const isAuthenticated = Boolean(user && token)

  const setAuthSession = useCallback((user, token) => {
    const next = { user, token }
    setSession(next)
    writeSession(next)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    try {
      const data = await loginUser({ email, password })
      setAuthSession(data.user, data.token)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: toAuthError(error, 'Kirish amalga oshmadi') }
    }
  }, [setAuthSession])

  const register = useCallback(async (data) => {
    try {
      await registerUser(data)
      const loginData = await loginUser({
        email: data.email,
        password: data.password,
      })
      setAuthSession(loginData.user, loginData.token)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: toAuthError(error, 'Ro\'yxatdan o\'tish amalga oshmadi') }
    }
  }, [setAuthSession])

  const logout = useCallback(() => {
    setSession(null)
    writeSession(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, isAuthenticated, login, register, logout }),
    [user, token, isAuthenticated, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak')
  }
  return ctx
}
