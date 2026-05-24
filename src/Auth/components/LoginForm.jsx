import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/Auth'
import { AUTH_REGISTER_PATH } from '@/Auth/routes'
import { validateLogin } from '@/Auth/validation'
import { AuthField } from '@/Auth/components/AuthField'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const fieldErrors = validateLogin({ email, password })
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    setSubmitting(true)
    const result = await login({ email, password })
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    const from = location.state?.from || '/'
    navigate(from, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthField
        id="login-email"
        label="Email"
        required
        icon={Mail}
        type="email"
        placeholder="email@company.uz"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <div className="space-y-2">
        <AuthField
          id="login-password"
          label="Parol"
          required
          icon={Lock}
          type="password"
          placeholder="Parolni kiriting"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
          >
            Parolni unutdingizmi?
          </button>
        </div>
      </div>

      {formError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full gap-2 rounded-xl bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
      >
        Kirish
        <ArrowRight className="size-5" />
      </Button>

      <p className="text-center text-sm text-slate-500">
        Akkauntingiz yo&apos;qmi?{' '}
        <Link
          to={AUTH_REGISTER_PATH}
          className="font-medium text-orange-500 transition-colors hover:text-orange-600"
        >
          Ro&apos;yxatdan o&apos;ting
        </Link>
      </p>
    </form>
  )
}
