import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type User = {
  name: string
  email: string
}

type StoredUser = User & {
  password: string
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  expiresAt: number | null
  remainingSeconds: number
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: { name?: string; email?: string; password?: string }) => void
}

const SESSION_KEY = 'ecom_session'
const USER_KEY = 'ecom_user'
const SESSION_DURATION_MS = 5 * 60 * 1000

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

const setStoredUser = (user: StoredUser | null) => {
  if (!user) {
    localStorage.removeItem(USER_KEY)
    return
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const getStoredSession = (): { email: string; expiresAt: number } | null => {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { email: string; expiresAt: number }
  } catch {
    return null
  }
}

const setStoredSession = (session: { email: string; expiresAt: number } | null) => {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = getStoredUser()
    const session = getStoredSession()
    const now = Date.now()

    if (storedUser && session && session.expiresAt > now && session.email === storedUser.email) {
      setUser({ name: storedUser.name, email: storedUser.email })
      setExpiresAt(session.expiresAt)
    } else {
      setStoredSession(null)
    }
  }, [])

  // Session countdown + auto logout
  useEffect(() => {
    if (!expiresAt) {
      setRemainingSeconds(0)
      return
    }

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, expiresAt - now)
      setRemainingSeconds(Math.floor(diff / 1000))
      if (diff <= 0) {
        setUser(null)
        setExpiresAt(null)
        setStoredSession(null)
      }
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [expiresAt])

  const login = async (email: string, password: string) => {
    const stored = getStoredUser()
    if (!stored || stored.email !== email || stored.password !== password) {
      throw new Error('Invalid email or password')
    }

    const expires = Date.now() + SESSION_DURATION_MS
    setUser({ name: stored.name, email: stored.email })
    setExpiresAt(expires)
    setStoredSession({ email: stored.email, expiresAt: expires })
  }

  const register = async (name: string, email: string, password: string) => {
    const existing = getStoredUser()
    if (existing && existing.email === email) {
      throw new Error('User with this email already exists')
    }

    const newUser: StoredUser = { name, email, password }
    setStoredUser(newUser)
  }

  const logout = () => {
    setUser(null)
    setExpiresAt(null)
    setStoredSession(null)
  }

  const updateProfile = (updates: { name?: string; email?: string; password?: string }) => {
    const stored = getStoredUser()
    if (!stored) return

    const updated: StoredUser = {
      ...stored,
      ...('name' in updates ? { name: updates.name ?? stored.name } : {}),
      ...('email' in updates ? { email: updates.email ?? stored.email } : {}),
      ...('password' in updates ? { password: updates.password ?? stored.password } : {}),
    }

    setStoredUser(updated)
    setUser({ name: updated.name, email: updated.email })

    const session = getStoredSession()
    if (session) {
      setStoredSession({ ...session, email: updated.email })
    }
  }

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && !!expiresAt && expiresAt > Date.now(),
      expiresAt,
      remainingSeconds,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, expiresAt, remainingSeconds]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

