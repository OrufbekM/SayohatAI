import { useTours } from '@/hooks/Tours'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared/FieldLabel'
import { CARD_SURFACE } from '@/lib/card-styles'

export function HotelNames() {
  const { hotelNameQuery, setHotelNameQuery } = useTours()

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold">Mehmonxona nomi</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <FieldLabel>Nomi bo&apos;yicha qidirish</FieldLabel>
        <Input
          className="mt-2 border rounded-md"
          type="search"
          placeholder="Masalan: Rixos"
          value={hotelNameQuery}
          onChange={(e) => setHotelNameQuery(e.target.value)}
        />
      </CardContent>
    </Card>
  )
}

export default HotelNames
