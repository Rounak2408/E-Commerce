import { Link, Outlet, useLocation } from 'react-router-dom'

export const AuthLayout = () => {
  const location = useLocation()
  const isLogin = location.pathname.includes('login')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 text-slate-900 dark:bg-transparent dark:text-slate-50">
      <div className="w-full max-w-4xl grid gap-10 md:grid-cols-[1.1fr,0.9fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200 px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Authentication-based E‑Commerce Dashboard
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Shop smarter with a modern{' '}
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                React
              </span>{' '}
              experience.
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-md">
              {isLogin
                ? 'Securely sign in to access your personalized dashboard, cart, and profile.'
                : 'Create your account in seconds and explore a fully protected e‑commerce dashboard.'}
            </p>
          </div>
          <div className="hidden md:flex gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex-1 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/70 p-3">
              <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">Real‑world flows</p>
              <p>Registration, login, session expiry, and protected routes built with React Router.</p>
            </div>
            <div className="flex-1 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/70 p-3">
              <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">Beautiful UI</p>
              <p>Responsive Tailwind design that feels like a production app.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 text-slate-900 dark:bg-slate-950/80 dark:border-slate-800/80 dark:text-slate-50 rounded-2xl shadow-2xl backdrop-blur-lg p-6 md:p-7 space-y-4">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isLogin
                ? 'Enter your details to continue.'
                : 'It only takes a moment to get started.'}
            </p>
          </div>

          <Outlet />

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <Link to="/auth/register" className="text-sky-400 hover:text-sky-300 font-medium">
                  Register
                </Link>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <Link to="/auth/login" className="text-sky-400 hover:text-sky-300 font-medium">
                  Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

