import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InlineSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Tanlang',
  icon: Icon,
  allowEmpty = false,
  className,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()

  const selected = options.find((o) => o.id === value)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleSelect = (id) => {
    onValueChange(id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-white px-2.5 text-sm',
          'transition-colors outline-none hover:bg-muted/30',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        )}
      >
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
        <span className={cn('min-w-0 flex-1 truncate text-left', !selected && 'text-muted-foreground')}>
          {selected?.name ?? placeholder}
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className={cn(
            'absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto',
            'rounded-lg border border-black/[0.08] bg-white py-1',
          )}
        >
          {allowEmpty && (
            <li role="option" aria-selected={!value}>
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/60',
                  !value && 'bg-muted/50',
                )}
              >
                <span className="text-muted-foreground">{placeholder}</span>
                {!value && <Check className="size-4 text-foreground" />}
              </button>
            </li>
          )}
          {options.map((option) => {
            const isSelected = value === option.id
            return (
              <li key={option.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted/60',
                    isSelected && 'bg-muted/50',
                  )}
                >
                  <span>{option.name}</span>
                  {isSelected && <Check className="size-4 shrink-0 text-foreground" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
