import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function CheckboxList({ items, selected, onToggle, getLabel = (item) => item.name }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => {
        const inputId = `check-${item.id}`
        return (
          <li key={item.id} className="flex items-center gap-2">
            <Checkbox
              id={inputId}
              checked={selected.has(item.id)}
              onCheckedChange={(value) => onToggle(item.id, value === true)}
            />
            <Label htmlFor={inputId} className="cursor-pointer font-normal">
              {getLabel(item)}
            </Label>
          </li>
        )
      })}
    </ul>
  )
}
