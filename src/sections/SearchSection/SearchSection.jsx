import { Plane, Search } from 'lucide-react'
import { useTours } from '@/hooks/Tours'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PANEL_SURFACE } from '@/lib/card-styles'
import { cn } from '@/lib/utils'
import { SearchDateField } from './components/SearchDateField'
import { SearchField } from './components/SearchField'
import { SearchSelectField } from './components/SearchSelectField'

export function SearchSection() {
  const {
    departureCity,
    setDepartureCity,
    toCountryId,
    setToCountry,
    countries,
    countriesLoading,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    nightsFrom,
    setNightsFrom,
    nightsTo,
    setNightsTo,
    submitSearch,
    loading,
  } = useTours()

  return (
    <section aria-label="Qidiruv">
      <Card className={cn(PANEL_SURFACE, 'overflow-visible')}>
        <CardContent className="overflow-visible p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:items-start">
              <SearchField
                label="Qayerdan"
                icon={Plane}
                placeholder="Masalan: Toshkent"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
              />
              <SearchSelectField
                label="Qayerga"
                icon={Plane}
                placeholder={countriesLoading ? 'Yuklanmoqda...' : 'Davlat tanlang'}
                value={toCountryId}
                onValueChange={setToCountry}
                options={countries}
                allowEmpty
              />
              <SearchDateField
                label="Qachondan"
                value={dateFrom}
                onChange={(v) => {
                  setDateFrom(v)
                  if (v && dateTo && dateTo < v) setDateTo('')
                }}
              />
              <SearchDateField
                label="Qachongacha"
                value={dateTo}
                onChange={setDateTo}
                min={dateFrom || undefined}
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
              disabled={loading}
              className={cn(
                'h-8 shrink-0 gap-2 rounded-md bg-orange-500 px-8 text-white hover:bg-orange-600',
                'w-full xl:w-auto',
              )}
            >
              <Search className="size-4" />
              {loading ? 'Qidirilmoqda...' : 'Qidirish'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default SearchSection
