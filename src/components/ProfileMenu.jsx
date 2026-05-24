import { useEffect, useRef, useState } from 'react'
import { Building2, CircleUser, LogOut, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/Auth'
import { AUTH_LOGIN_PATH } from '@/Auth/routes'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

function getInitials(name) {
  if (!name?.trim()) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
        <Icon className="size-4" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value || '—'}</p>
      </div>
    </div>
  )
}

export function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate(AUTH_LOGIN_PATH, { replace: true })
  }

  const contactPerson = user?.contactPerson ?? ''
  const companyName = user?.companyName ?? ''
  const email = user?.email ?? ''

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        aria-label="Profil"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setOpen((prev) => !prev)}
      >
        <CircleUser className="size-6" strokeWidth={1.5} />
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Profil ma'lumotlari"
          className="absolute right-0 top-full z-50 mt-2 w-80 origin-top-right rounded-xl border border-black/[0.06] bg-white p-4 shadow-lg shadow-black/10"
        >
          <div className="mb-4 flex items-center gap-3 border-b border-black/[0.06] pb-4">
            <Avatar className="size-11">
              <AvatarFallback className="bg-orange-100 text-sm font-semibold text-orange-600">
                {getInitials(contactPerson)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">{contactPerson || 'Foydalanuvchi'}</p>
              <p className="truncate text-sm text-muted-foreground">{companyName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <ProfileRow icon={User} label="Ism familiya" value={contactPerson} />
            <ProfileRow icon={Building2} label="Kompaniya nomi" value={companyName} />
            <ProfileRow icon={Mail} label="Email" value={email} />
          </div>

          <Button
            type="button"
            variant="ghost"
            className="mt-4 h-10 w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Chiqish
          </Button>
        </div>
      )}
    </div>
  )
}
