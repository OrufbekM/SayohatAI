import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ResultsPagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Sahifalar"
      className="flex items-center justify-center gap-1 pt-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex size-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-40"
        aria-label="Oldingi sahifa"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={cn(
            'flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
            p === page
              ? 'border-orange-500 bg-orange-500 text-white'
              : 'border-black/[0.08] bg-white text-foreground hover:bg-muted/50',
          )}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex size-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-40"
        aria-label="Keyingi sahifa"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
