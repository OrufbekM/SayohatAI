import { useEffect, useMemo, useState } from 'react'
import { useSearch } from '@/context/SearchContext'
import { filterCities } from '@/data/cities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckboxList } from '@/components/shared/CheckboxList'
import { CARD_SURFACE } from '@/lib/card-styles'

export function DestinationCities() {
  const { toCountryId, selectedCityIds, toggleCity } = useSearch()
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSearch('')
  }, [toCountryId])

  const visibleCities = useMemo(
    () => filterCities(search, toCountryId),
    [search, toCountryId],
  )

  return (
    <Card className={CARD_SURFACE}>
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle className="text-sm font-semibold">Boradigan shaharlar</CardTitle>
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
          ) : visibleCities.length === 0 ? (
            <p className="text-sm text-muted-foreground">Shahar topilmadi</p>
          ) : (
            <CheckboxList
              items={visibleCities}
              selected={selectedCityIds}
              onToggle={toggleCity}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DestinationCities
