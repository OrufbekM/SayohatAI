export const AUTH_LOGIN_PATH = '/login'
export const AUTH_REGISTER_PATH = '/register'

export const AUTH_PATHS = [AUTH_LOGIN_PATH, AUTH_REGISTER_PATH]

export function isAuthPath(pathname) {
  return AUTH_PATHS.includes(pathname)
}
