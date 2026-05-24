const FOOTER_LINKS = [
  { label: 'Yordam markazi', href: '#' },
  { label: 'Maxfiylik siyosati', href: '#' },
  { label: 'Foydalanish shartlari', href: '#' },
  { label: "Biz bilan bog'lanish", href: '#' },
]

const Footer = () => {
  return (
    <footer className="mt-8 border-t border-black/[0.08] bg-gradient-to-b from-slate-100/80 to-slate-100">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-bold tracking-wide text-orange-500 uppercase">Sayohat AI</p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            © 2026 Sayohat AI Bron Qilish Tizimi. Barcha huquqlar himoyalangan.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-end">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
