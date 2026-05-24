import { InlineSelect } from '@/components/shared/InlineSelect'
import { FieldLabel } from '@/components/shared/FieldLabel'
import { cn } from '@/lib/utils'

export function SearchSelectField({
  label,
  icon,
  placeholder,
  value,
  onValueChange,
  options,
  allowEmpty = false,
  className,
}) {
  return (
    <div className={cn('min-w-0 flex-1', className)}>
      <FieldLabel>{label}</FieldLabel>
      <InlineSelect
        value={value}
        onValueChange={onValueChange}
        options={options}
        placeholder={placeholder}
        icon={icon}
        allowEmpty={allowEmpty}
      />
    </div>
  )
}
