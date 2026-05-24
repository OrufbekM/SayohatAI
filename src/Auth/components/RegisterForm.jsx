import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  FileText,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/Auth'
import { AUTH_LOGIN_PATH } from '@/Auth/routes'
import { validateRegister } from '@/Auth/validation'
import { AuthField, AuthTextarea } from '@/Auth/components/AuthField'

const INITIAL = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  licenseNumber: '',
  website: '',
  description: '',
}

export function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const fieldErrors = validateRegister(form)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    setSubmitting(true)
    const result = await register(form)
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthField
        id="register-companyName"
        label="Sayohat agentligi nomi"
        required
        icon={Building2}
        placeholder="Masalan: Sayohat Plus"
        value={form.companyName}
        onChange={update('companyName')}
        error={errors.companyName}
      />

      <AuthField
        id="register-contactPerson"
        label="Mas'ul shaxs ismi"
        required
        icon={User}
        placeholder="To'liq ism"
        value={form.contactPerson}
        onChange={update('contactPerson')}
        error={errors.contactPerson}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          id="register-email"
          label="Email manzili"
          required
          icon={Mail}
          type="email"
          placeholder="email@company.uz"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
        />

        <AuthField
          id="register-phone"
          label="Telefon raqami"
          required
          icon={Phone}
          type="tel"
          placeholder="+998901234567"
          value={form.phone}
          onChange={update('phone')}
          error={errors.phone}
        />
      </div>

      <AuthField
        id="register-address"
        label="Agentlik manzili"
        required
        icon={MapPin}
        placeholder="Shahar, ko'cha, uy"
        value={form.address}
        onChange={update('address')}
        error={errors.address}
      />

      <AuthField
        id="register-password"
        label="Parol"
        required
        icon={Lock}
        type="password"
        placeholder="Masalan: Password123!"
        autoComplete="new-password"
        value={form.password}
        onChange={update('password')}
        error={errors.password}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField
          id="register-licenseNumber"
          label="Agentlik litsenziya raqami"
          icon={FileText}
          placeholder="Ixtiyoriy"
          value={form.licenseNumber}
          onChange={update('licenseNumber')}
          error={errors.licenseNumber}
        />

        <AuthField
          id="register-website"
          label="Veb-sayt manzili"
          icon={Globe}
          type="url"
          placeholder="https://company.uz"
          value={form.website}
          onChange={update('website')}
          error={errors.website}
        />
      </div>

      <AuthTextarea
        id="register-description"
        label="Agentlik haqida"
        placeholder="Agentlik faoliyati haqida qisqacha (ixtiyoriy)"
        value={form.description}
        onChange={update('description')}
        error={errors.description}
      />

      {formError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full gap-2 rounded-xl bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
      >
        Ro&apos;yxatdan o&apos;tish
        <ArrowRight className="size-5" />
      </Button>

      <p className="text-center text-sm text-slate-500">
        Akkauntingiz bormi?{' '}
        <Link
          to={AUTH_LOGIN_PATH}
          className="font-medium text-orange-500 transition-colors hover:text-orange-600"
        >
          Kirish
        </Link>
      </p>
    </form>
  )
}
