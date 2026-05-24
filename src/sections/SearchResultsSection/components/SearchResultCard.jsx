import {
  Calendar,
  CheckCircle2,
  MapPin,
  Moon,
  Plane,
  Star,
  Users,
  UtensilsCrossed,
  Zap,
} from 'lucide-react'
import { formatPrice } from '@/lib/format-price'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { StarRating } from './StarRating'

const CARD_BORDER = {
  'eng-arzon': 'border-2 border-emerald-500',
  tavsiya: 'border border-gray-200',
  default: 'border border-gray-200',
}

function FeatureItem({ text }) {
  if (text.includes('Maxsus')) {
    return (
      <li className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <Star className="size-3.5 shrink-0 fill-emerald-500 text-emerald-500" />
        {text}
      </li>
    )
  }
  if (text.includes('Tezkor')) {
    return (
      <li className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <Zap className="size-3.5 shrink-0 fill-emerald-500 text-emerald-500" />
        {text}
      </li>
    )
  }
  return (
    <li className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
      {text}
    </li>
  )
}

export function SearchResultCard({ offer }) {
  const isCheapest = offer.badge === 'eng-arzon'
  const isRecommended = offer.badge === 'tavsiya'
  const accentIcon = isCheapest ? 'text-orange-500' : 'text-muted-foreground'
  const tripText = isCheapest ? 'text-blue-800' : 'text-foreground'

  return (
    <article className="relative pt-2">
      {offer.badgeLabel && (
        <span className="absolute top-0 left-4 z-10 rounded bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          {offer.badgeLabel}
        </span>
      )}

      <div
        className={cn(
          'relative rounded-lg bg-white p-4 sm:p-5',
          CARD_BORDER[offer.badge] ?? CARD_BORDER.default,
          offer.badgeLabel && 'pt-5',
        )}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center lg:gap-6">
          <div className="space-y-2">
            <StarRating count={offer.stars} />
            <h3 className="text-base font-bold text-blue-800 sm:text-lg">{offer.hotelName}</h3>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className={cn('size-3.5 shrink-0', accentIcon)} />
              {offer.location}
            </p>
            <p className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs text-muted-foreground">
              {offer.flightInfo}
            </p>
            <div className={cn('flex flex-wrap items-center gap-4 pt-1 text-xs font-medium', tripText)}>
              <span className="flex items-center gap-1">
                <Calendar className={cn('size-3.5', accentIcon)} />
                {offer.date}
              </span>
              <span className="flex items-center gap-1">
                <Plane className={cn('size-3.5', accentIcon)} />
                {offer.flightTime}
              </span>
              <span className="flex items-center gap-1">
                <Moon className={cn('size-3.5', accentIcon)} />
                {offer.duration}
              </span>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-4 lg:border-t-0 lg:border-l lg:border-gray-100 lg:pt-0 lg:pl-6">
            <p className="text-sm font-bold tracking-wide text-foreground uppercase">
              {offer.roomType}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-3.5" />
              {offer.occupancy}
            </p>
            <p className="inline-flex items-center gap-1.5 rounded-md bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
              <UtensilsCrossed className="size-3.5" />
              {offer.mealPlan}
            </p>
            <ul
              className={cn(
                'space-y-1.5',
                (isCheapest || isRecommended) && 'border-t border-dashed border-gray-300 pt-3',
              )}
            >
              {offer.features.map((feature) => (
                <FeatureItem key={feature} text={feature} />
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-stretch gap-3 border-t border-gray-100 pt-4 lg:min-w-[260px] lg:border-t-0 lg:border-l lg:border-gray-100 lg:pt-0 lg:pl-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">2 kattalar uchun jami narx</p>
              <p className="text-xl font-bold text-foreground tabular-nums sm:text-2xl">
                {formatPrice(offer.price, offer.currency)}
              </p>
            </div>
            <Button
              type="button"
              className="h-13 w-full rounded-lg bg-orange-500 px-6 text-lg font-semibold text-white hover:bg-orange-600 lg:min-w-[190px]"
            >
              Bron qilish
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
