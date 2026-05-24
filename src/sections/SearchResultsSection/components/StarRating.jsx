import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({ count = 5, className }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}
