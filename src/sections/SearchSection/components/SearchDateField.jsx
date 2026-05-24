import { useEffect, useId, useRef, useState } from 'react'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { FieldLabel } from '@/components/shared/FieldLabel'
import {
  buildCalendarCells,
  formatDisplayDate,
  formatMonthYear,
  getWeekdayLabels,
  isBeforeDay,
  isSameDay,
  normalizeMonthYear,
  parseIsoDate,
  toIsoDate,
} from '@/lib/date-utils'
import { cn } from '@/lib/utils'

const WEEKDAYS = getWeekdayLabels()

export function SearchDateField({
  label,
  value,
  onChange,
  placeholder = 'Sanani tanlang',
  min,
  className,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()
  const today = new Date()
  const selected = parseIsoDate(value)
  const minDate = parseIsoDate(min)

  const initialView = selected ?? today
  const [viewYear, setViewYear] = useState(initialView.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialView.getMonth())

  useEffect(() => {
    if (!open) return
    const anchor = selected ?? today
    setViewYear(anchor.getFullYear())
    setViewMonth(anchor.getMonth())
  }, [open, value])

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

  const goMonth = (delta) => {
    const next = normalizeMonthYear(viewYear, viewMonth + delta)
    setViewYear(next.year)
    setViewMonth(next.month)
  }

  const handleSelect = (year, month, day) => {
    const date = new Date(year, month, day)
    if (minDate && isBeforeDay(date, minDate)) return
    onChange(toIsoDate(date))
    setOpen(false)
  }

  const display = formatDisplayDate(value)
  const cells = buildCalendarCells(viewYear, viewMonth)

  return (
    <div ref={rootRef} className={cn('relative min-w-0 flex-1', className)}>
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-white px-2.5 text-sm',
          'transition-colors outline-none hover:bg-muted/30',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        )}
      >
        <Calendar className="size-4 shrink-0 text-muted-foreground" />
        <span className={cn('min-w-0 flex-1 truncate text-left', !display && 'text-muted-foreground')}>
          {display ?? placeholder}
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          id={listId}
          role="dialog"
          aria-label={label}
          className={cn(
            'absolute top-full right-0 left-0 z-50 mt-1.5 min-w-[17.5rem]',
            'rounded-xl border border-black/[0.08] bg-white p-3 shadow-lg shadow-black/5',
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground capitalize">
              {formatMonthYear(viewYear, viewMonth)}
            </p>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                aria-label="Oldingi oy"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => goMonth(1)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                aria-label="Keyingi oy"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="py-1 text-center text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell, index) => {
              const cellDate = new Date(cell.year, cell.month, cell.day)
              const isSelected = selected && isSameDay(cellDate, selected)
              const isToday = isSameDay(cellDate, today)
              const isDisabled = minDate && isBeforeDay(cellDate, minDate)

              return (
                <button
                  key={`${cell.year}-${cell.month}-${cell.day}-${index}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelect(cell.year, cell.month, cell.day)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                    cell.outside && 'text-muted-foreground/50',
                    !cell.outside && !isSelected && 'text-foreground hover:bg-muted/60',
                    isToday && !isSelected && 'font-semibold text-orange-600',
                    isSelected && 'bg-orange-500 font-semibold text-white hover:bg-orange-600',
                    isDisabled && 'cursor-not-allowed opacity-30 hover:bg-transparent',
                  )}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-black/[0.06] pt-2.5">
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Tozalash
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(toIsoDate(today))
                setOpen(false)
              }}
              className="text-xs font-medium text-orange-600 transition-colors hover:text-orange-700"
            >
              Bugun
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
