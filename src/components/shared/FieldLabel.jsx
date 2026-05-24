import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function FieldLabel({ children, className, ...props }) {
  return (
    <Label
      className={cn('mb-1.5 block text-xs font-medium text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Label>
  )
}
