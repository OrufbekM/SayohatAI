import { useEffect, useMemo, useState } from 'react'
import { useTours } from '@/hooks/Tours'
import { filterByQuery } from '@/lib/list-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckboxList } from '@/components/shared/CheckboxList'
import { CARD_SURFACE } from '@/lib/card-styles'

export function HotelNames() {
  const { toCountryId, selectedHotelIds, selectedStarIds, toggleHotel, hotels, hotelsLoading } =
    useTours()
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSearch('')
  }, [toCountryId])

  const visibleHotels = useMemo(
    () => filterByQuery(hotels, search, ['name']),
    [hotels, search],
  )

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold">Mehmonxona nomi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <Input
          className="border rounded-md"
          type="search"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!toCountryId}
        />
        <div className="max-h-40 overflow-y-auto pr-1">
          {!toCountryId ? (
            <p className="text-sm text-muted-foreground">Avval &quot;Qayerga&quot; dan davlat tanlang</p>
          ) : hotelsLoading ? (
            <p className="text-sm text-muted-foreground">Mehmonxonalar yuklanmoqda...</p>
          ) : visibleHotels.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {selectedStarIds.size > 0
                ? 'Tanlangan yulduz bo\'yicha mehmonxona topilmadi'
                : 'Mehmonxona topilmadi'}
            </p>
          ) : (
            <CheckboxList
              items={visibleHotels}
              selected={selectedHotelIds}
              onToggle={toggleHotel}
              getLabel={(hotel) =>
                hotel.stars ? `${hotel.name} (${hotel.stars}*)` : hotel.name
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelNames
