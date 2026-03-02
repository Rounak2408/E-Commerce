import { FormEvent, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const redirectTimeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        window.clearTimeout(redirectTimeout.current)
      }
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
      setShowSuccess(true)
      const redirectTo = location.state?.from?.pathname || '/app'
      redirectTimeout.current = window.setTimeout(() => {
        navigate(redirectTo, { replace: true })
      }, 1200)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-slate-950 border border-emerald-600 px-6 py-4 shadow-2xl text-center space-y-2 max-w-xs">
            <p className="text-sm font-semibold text-emerald-300">Successfully logged in</p>
            <p className="text-xs text-slate-300">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-rose-400 bg-rose-950/50 border border-rose-800 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </form>
    </>
  )
}

