import { type FormEvent, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      ...(password ? { password } : {}),
    })
    setPassword('')
    setMessage('Profile updated successfully. Changes are saved in localStorage.')
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <p className="text-xs text-slate-400">
            View and edit your account details. This data is stored locally for demo purposes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 flex items-center justify-center text-sm font-semibold text-slate-950">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="text-xs text-right">
            <p className="text-slate-100">{user?.name}</p>
            <p className="text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-4 max-w-xl shadow-xl shadow-slate-950/70"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

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
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-200" htmlFor="password">
            New Password (optional)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Leave blank to keep current password"
            minLength={6}
          />
        </div>

        {message && (
          <p className="text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-700 rounded-md px-3 py-2">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-sky-400 transition-colors"
        >
          Save changes
        </button>
      </form>
    </div>
  )
}

