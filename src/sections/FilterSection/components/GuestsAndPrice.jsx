import { useTours } from '@/hooks/Tours'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared/FieldLabel'
import { CARD_SURFACE } from '@/lib/card-styles'

export function GuestsAndPrice() {
  const {
    adults,
    setAdults,
    childrenCount,
    setChildrenCount,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
  } = useTours()

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold text-foreground">
          Mehmonlar va narx
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Kattalar</FieldLabel>
            <Input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              className="text-center border rounded-md"
            />
          </div>
          <div>
            <FieldLabel>Bolalar</FieldLabel>
            <Input
              type="number"
              min={0}
              value={childrenCount}
              onChange={(e) => setChildrenCount(e.target.value)}
              className="text-center border rounded-md"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Narx oralig&apos;i (1 kishi)</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min narx"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="border rounded-md"
            />
            <Input
              type="number"
              min={0}
              placeholder="Max narx"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="border rounded-md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GuestsAndPrice
