import { useState } from 'react'
import { Calendar, Plane, Search } from 'lucide-react'
import { useSearch } from '@/context/SearchContext'
import { countries } from '@/data/countries'
import { uzbekistanCities } from '@/data/uzbekistan-cities'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PANEL_SURFACE } from '@/lib/card-styles'
import { cn } from '@/lib/utils'
import { SearchField } from './SearchField'
import { SearchSelectField } from './SearchSelectField'

export function SearchSection() {
  const { fromCityId, setFromCityId, toCountryId, setToCountry, submitSearch } = useSearch()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [nightsFrom, setNightsFrom] = useState('7')
  const [nightsTo, setNightsTo] = useState('14')

  return (
    <section aria-label="Qidiruv">
      <Card className={cn(PANEL_SURFACE, 'overflow-visible')}>
        <CardContent className="overflow-visible p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:items-start">
              <SearchSelectField
                label="Qayerdan"
                icon={Plane}
                placeholder="Shahar tanlang"
                value={fromCityId}
                onValueChange={setFromCityId}
                options={uzbekistanCities}
              />
              <SearchSelectField
                label="Qayerga"
                icon={Plane}
                placeholder="Davlat tanlang"
                value={toCountryId}
                onValueChange={setToCountry}
                options={countries}
                allowEmpty
              />
              <SearchField
                label="Qachondan"
                icon={Calendar}
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <SearchField
                label="Qachongacha"
                icon={Calendar}
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
              <SearchField
                label="Tun (dan)"
                type="number"
                min={1}
                value={nightsFrom}
                onChange={(e) => setNightsFrom(e.target.value)}
                inputClassName="text-center"
              />
              <SearchField
                label="Tun (gacha)"
                type="number"
                min={1}
                value={nightsTo}
                onChange={(e) => setNightsTo(e.target.value)}
                inputClassName="text-center"
              />
            </div>

            <Button
              type="button"
              onClick={submitSearch}
              className={cn(
                'h-8 shrink-0 gap-2 rounded-md bg-orange-500 px-8 text-white hover:bg-orange-600',
                'w-full xl:w-auto',
              )}
            >
              <Search className="size-4" />
              Qidirish
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default SearchSection
