import { Bell, Globe, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { ProfileMenu } from '@/components/ProfileMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const CURRENCIES = [
  { code: 'USD', value: '12 640', trend: 'up' },
  { code: 'EUR', value: '13 710', trend: 'down' },
  { code: 'KZT', value: '28.40', trend: 'up' },
  { code: 'RUB', value: '138.50', trend: 'flat' },
]

function TrendIcon({ trend }) {
  if (trend === 'up') {
    return <TrendingUp className="size-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
  }
  if (trend === 'down') {
    return <TrendingDown className="size-3.5 shrink-0 text-red-500" strokeWidth={2.5} />
  }
  return <Minus className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2.5} />
}

function CurrencyTicker() {
  return (
    <div className="hidden items-center gap-4 rounded-full border rounded-md border-black/[0.06] bg-muted/40 px-4 py-1.5 text-sm lg:flex">
      <span className="shrink-0 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Valyuta kurslari
      </span>
      <span className="h-4 w-px shrink-0 bg-border" aria-hidden />
      <div className="flex items-center gap-5">
        {CURRENCIES.map((item) => (
          <div key={item.code} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-xs font-medium text-muted-foreground">{item.code}</span>
            <span className="font-semibold text-foreground tabular-nums">{item.value}</span>
            <TrendIcon trend={item.trend} />
          </div>
        ))}
      </div>
    </div>
  )
}

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <Avatar className="size-9 rounded-md after:rounded-md">
            <AvatarImage
              src="data:image/png;base64,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"
              alt="Sayohat AI"
              className="rounded-md"
            />
            <AvatarFallback className="rounded-md bg-orange-100 text-sm font-semibold text-orange-600">
              SA
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-bold tracking-tight text-orange-500">Sayohat AI</span>
        </a>

        <CurrencyTicker />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            className="hidden gap-2 text-foreground sm:inline-flex"
            type="button"
          >
            <Globe className="size-[18px] text-muted-foreground" />
            <span className="text-sm font-medium">O&apos;zbekcha</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            type="button"
            aria-label="Bildirishnomalar"
          >
            <Bell className="size-5" />
          </Button>

          <ProfileMenu />
        </div>
      </nav>

      <div className="border-t border-black/[0.06] px-4 py-2 lg:hidden">
        <div className="flex gap-4 overflow-x-auto pb-1 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CURRENCIES.map((item) => (
            <div key={item.code} className="flex shrink-0 items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">{item.code}</span>
              <span className="font-semibold tabular-nums">{item.value}</span>
              <TrendIcon trend={item.trend} />
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Navbar
