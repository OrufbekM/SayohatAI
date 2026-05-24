import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared/FieldLabel'
import { cn } from '@/lib/utils'

export function SearchField({
  label,
  icon: Icon,
  className,
  inputClassName,
  ...inputProps
}) {
  return (
    <div className={cn('min-w-0 flex-1', className)}>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input className={cn(Icon && 'pl-8', inputClassName)} {...inputProps} />
      </div>
    </div>
  )
}
