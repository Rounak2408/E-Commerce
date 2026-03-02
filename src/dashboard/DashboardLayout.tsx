import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useMemo, useState } from 'react'
import { useTheme } from '../theme/ThemeContext'

const navLinkBase =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors'

export const DashboardLayout = () => {
  const { user, logout, remainingSeconds } = useAuth()
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U'
  const { theme, toggleTheme } = useTheme()

  const timeLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [remainingSeconds])

  const handleLogout = () => {
    logout()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50 flex flex-col">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/app" className="font-semibold text-lg tracking-tight flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 text-xs font-bold">
                EC
              </span>
              <span>Ecom Dashboard</span>
            </Link>
            <span className="hidden md:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Auth Protected
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile session timer */}
            <span
              className={`md:hidden text-xs font-mono px-2 py-1 rounded-md border ${
                remainingSeconds <= 30
                  ? 'border-rose-500 text-rose-300 bg-rose-950/60'
                  : 'border-emerald-500 text-emerald-300 bg-emerald-950/50'
              }`}
            >
              {timeLabel}
            </span>
            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800/90 md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setNavOpen(open => !open)}
            >
              <span className="block h-0.5 w-4 bg-slate-100 rounded-sm" />
              <span className="block h-0.5 w-4 bg-slate-100 rounded-sm my-0.5" />
              <span className="block h-0.5 w-4 bg-slate-100 rounded-sm" />
            </button>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 flex items-center justify-center text-xs font-semibold text-slate-950">
                  {initial}
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`text-sm font-mono px-2 py-1 rounded-md border ${
                    remainingSeconds <= 30
                      ? 'border-rose-500 text-rose-300 bg-rose-950/60'
                      : 'border-emerald-500 text-emerald-300 bg-emerald-950/50'
                  }`}
                >
                  {timeLabel}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition-colors"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition-colors"
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-40 -right-32 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 -left-32 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
          {/* Mobile dropdown nav (hamburger) */}
          {navOpen && (
            <nav className="md:hidden bg-slate-950/95 border border-slate-800/80 rounded-2xl p-3 space-y-1 shadow-xl shadow-slate-950/60">
              <NavLink
                to="/app"
                end
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  } w-full justify-start`
                }
              >
                <span>Overview</span>
              </NavLink>
              <NavLink
                to="/app/products"
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  } w-full justify-start`
                }
              >
                <span>Products</span>
              </NavLink>
              <NavLink
                to="/app/cart"
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  } w-full justify-start`
                }
              >
                <span>Cart</span>
              </NavLink>
              <NavLink
                to="/app/profile"
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  } w-full justify-start`
                }
              >
                <span>Profile</span>
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  setNavOpen(false)
                  handleLogout()
                }}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition-colors"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleTheme()
                  setNavOpen(false)
                }}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition-colors"
              >
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                All features are protected. You need an active session to access products, cart, and
                profile pages.
              </p>
            </nav>
          )}

          {/* Desktop nav bar */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <nav className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-1.5 flex items-center gap-1 shadow-xl shadow-slate-950/60">
              <NavLink
                to="/app"
                end
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <span>Overview</span>
              </NavLink>
              <NavLink
                to="/app/products"
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <span>Products</span>
              </NavLink>
              <NavLink
                to="/app/cart"
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <span>Cart</span>
              </NavLink>
              <NavLink
                to="/app/profile"
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? 'bg-sky-500 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <span>Profile</span>
              </NavLink>
            </nav>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              All features are protected. You need an active session to access products, cart, and
              profile pages.
            </p>
          </div>

          <main className="space-y-4">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 shadow-[0_18px_45px_rgba(15,23,42,0.9)] p-4 md:p-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

