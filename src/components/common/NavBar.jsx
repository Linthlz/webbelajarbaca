import { NavLink } from 'react-router-dom'
import { BookOpen, Gamepad2, Star, User } from 'lucide-react'

const ITEMS = [
  { to: '/belajar', label: 'Belajar', Icon: BookOpen, active: 'bg-coral text-white' },
  { to: '/bermain', label: 'Bermain', Icon: Gamepad2, active: 'bg-mint text-white' },
  { to: '/bintang', label: 'Bintang', Icon: Star, active: 'bg-sun text-ink' },
  { to: '/profil', label: 'Profil', Icon: User, active: 'bg-sky text-white' },
]

/** Navigasi utama: hanya empat tombol besar berikon. */
export default function NavBar() {
  return (
    <nav aria-label="Menu utama" className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-xl grid-cols-4 gap-1 px-2 py-2">
        {ITEMS.map(({ to, label, Icon, active }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2 font-display text-sm font-extrabold transition-colors ${isActive ? active : 'text-ink/60 hover:bg-ink/5'}`
              }
            >
              <Icon size={30} strokeWidth={2.5} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
