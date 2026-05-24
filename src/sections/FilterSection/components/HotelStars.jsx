import { useTours } from '@/hooks/Tours'
import { HOTEL_STAR_OPTIONS } from '@/lib/filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CARD_SURFACE } from '@/lib/card-styles'
import { cn } from '@/lib/utils'

export function HotelStars() {
  const { selectedStarIds, toggleStar } = useTours()

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold">Mehmonxona yulduzi</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {HOTEL_STAR_OPTIONS.map((star) => {
            const isActive = selectedStarIds.has(star.id)
            return (
              <button
                key={star.id}
                type="button"
                onClick={() => toggleStar(star.id)}
                className={cn(
                  'flex size-11 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                  isActive
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-black/[0.08] bg-background text-foreground hover:border-orange-300',
                )}
              >
                {star.name}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelStars
