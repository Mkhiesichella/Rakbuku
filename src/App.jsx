import { Library, ChartColumn, UserRound } from 'lucide-react'
import { useBooks } from './hooks/useBooks'
import { useHashRoute } from './hooks/useHashRoute'
import Rak from './pages/Rak'
import Statistik from './pages/Statistik'
import Profil from './pages/Profil'
import PWABadge from './components/PWABadge'

const ROUTES = [
  { id: 'rak', label: 'Rak', icon: Library },
  { id: 'statistik', label: 'Statistik', icon: ChartColumn },
  { id: 'profil', label: 'Profil', icon: UserRound },
]

function Brand() {
  return (
    <a href="#/rak" className="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="" width="32" height="32" />
      <span className="font-display text-xl font-bold">Rak Baca</span>
    </a>
  )
}

export default function App() {
  const route = useHashRoute()
  const data = useBooks()
  const current = ROUTES.some((r) => r.id === route) ? route : 'rak'

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Brand />
          <nav className="hidden gap-1 md:flex" aria-label="Navigasi utama">
            {ROUTES.map(({ id, label }) => (
              <a
                key={id}
                href={`#/${id}`}
                aria-current={current === id ? 'page' : undefined}
                className={`rounded-lg px-4 py-2 font-medium ${current === id ? 'bg-plum text-white' : 'text-mute hover:bg-card'}`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-28 pt-8 md:pb-12">
        {current === 'rak' && <Rak data={data} />}
        {current === 'statistik' && <Statistik data={data} />}
        {current === 'profil' && <Profil />}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Navigasi utama"
      >
        <ul className="mx-auto flex max-w-3xl">
          {ROUTES.map(({ id, label, icon: Icon }) => (
            <li key={id} className="flex-1">
              <a
                href={`#/${id}`}
                aria-current={current === id ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${current === id ? 'text-plum' : 'text-mute'}`}
              >
                <Icon size={22} />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <PWABadge />
    </div>
  )
}
