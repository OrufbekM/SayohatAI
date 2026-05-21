import { useEffect, useMemo, useState } from 'react'
import { useSearch } from '@/context/SearchContext'
import { filterHotels } from '@/data/hotels'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckboxList } from '@/components/shared/CheckboxList'
import { CARD_SURFACE } from '@/lib/card-styles'

export function HotelNames() {
  const { selectedCityIds, selectedStarIds, selectedHotelIds, toggleHotel } = useSearch()
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSearch('')
  }, [selectedCityIds, selectedStarIds])

  const visibleHotels = useMemo(
    () => filterHotels(search, selectedCityIds, selectedStarIds),
    [search, selectedCityIds, selectedStarIds],
  )

  const emptyMessage = (() => {
    if (selectedCityIds.size === 0) return 'Avval boradigan shaharni tanlang'
    if (selectedStarIds.size > 0 && visibleHotels.length === 0) {
      return 'Tanlangan yulduz uchun mehmonxona topilmadi'
    }
    return 'Mehmonxona topilmadi'
  })()

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold">Mehmonxona nomi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <Input
          className="border rounded-md"
          type="search"
          placeholder="Nomi bo'yicha saralash..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={selectedCityIds.size === 0}
        />
        <div className="max-h-40 overflow-y-auto pr-1">
          {selectedCityIds.size === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          ) : visibleHotels.length === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            <CheckboxList
              items={visibleHotels}
              selected={selectedHotelIds}
              onToggle={toggleHotel}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default HotelNames
