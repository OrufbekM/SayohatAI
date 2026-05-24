import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LoginForm } from '@/Auth/components/LoginForm'
import { RegisterForm } from '@/Auth/components/RegisterForm'
import { AUTH_LOGIN_PATH, AUTH_REGISTER_PATH } from '@/Auth/routes'

const TABS = [
  { id: 'login', label: 'Kirish', to: AUTH_LOGIN_PATH },
  { id: 'register', label: "Ro'yxatdan o'tish", to: AUTH_REGISTER_PATH },
]

export function AuthPage() {
  const { pathname } = useLocation()
  const isLogin = pathname === AUTH_LOGIN_PATH

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-100 px-4 py-8">
      <div className="flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/10">
        <div className="overflow-y-auto px-6 py-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Tizimga kirish' : "Ro'yxatdan o'tish"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {isLogin
                ? 'Agentlik akkauntingizga kiring'
                : 'Yangi agentlik akkauntini yarating'}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              {TABS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors',
                      isActive
                        ? 'border border-slate-200 bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </header>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}
