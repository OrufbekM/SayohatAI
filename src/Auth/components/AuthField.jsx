import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function AuthField({
  id,
  label,
  required,
  icon: Icon,
  type = 'text',
  error,
  className,
  inputClassName,
  ...inputProps
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-slate-400" />
        )}
        <Input
          id={id}
          type={inputType}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-11 rounded-xl border-slate-200 bg-slate-50 text-base md:text-sm',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200',
            inputClassName,
          )}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
          >
            {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function AuthTextarea({
  id,
  label,
  required,
  error,
  className,
  ...props
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-[88px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm',
          error && 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-200',
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
