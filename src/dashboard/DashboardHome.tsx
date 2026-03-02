import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'
import { formatInr } from '../utils/currency'
import { getOrdersForUser, type Order } from '../orders/orderStorage'

export const DashboardHome = () => {
  const { user } = useAuth()
  const { items, total } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const uniqueProducts = items.length
  const averagePrice = items.length ? total / totalItems : 0
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U'
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user?.email) {
      setOrders(getOrdersForUser(user.email))
    } else {
      setOrders([])
    }
  }, [user?.email])

  const lastOrder = useMemo(
    () => (orders.length ? orders[orders.length - 1] : null),
    [orders]
  )

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-900/80 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl shadow-slate-950/60">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-60">
          <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>

        <div className="relative grid gap-4 md:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)] items-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 flex items-center justify-center text-sm font-semibold text-slate-950">
                {initial}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Overview</p>
                <h2 className="text-2xl md:text-2xl font-semibold text-white">
                  Welcome back, <span className="text-sky-400">{user?.name}</span> 👋
                </h2>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              This dashboard brings together authentication, product browsing, cart management, and
              profile editing into a single, modern e‑commerce experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Link
                to="/app/products"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-1.5 text-xs font-medium text-white shadow-md shadow-sky-500/40 hover:bg-sky-400 transition-colors"
              >
                <span className="h-5 w-5 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">
                  P
                </span>
                Browse products
              </Link>
              <Link
                to="/app/cart"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition-colors"
              >
                <span className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                  C
                </span>
                View cart
              </Link>
              <Link
                to="/app/profile"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition-colors"
              >
                <span className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                  U
                </span>
                Edit profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          to="/app/products"
          className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 hover:border-sky-500/70 hover:bg-slate-900/80 transition-colors shadow-lg shadow-slate-950/50"
        >
          <h3 className="text-sm font-semibold text-slate-100 mb-1">Products</h3>
          <p className="text-xs text-slate-400">
            Browse products from a free public API with loading states and graceful error handling.
          </p>
        </Link>
        <Link
          to="/app/cart"
          className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 hover:border-sky-500/70 hover:bg-slate-900/80 transition-colors shadow-lg shadow-slate-950/50"
        >
          <h3 className="text-sm font-semibold text-slate-100 mb-1">Cart</h3>
          <p className="text-xs text-slate-400">
            Add items to your cart, manage quantities, and view totals in real time.
          </p>
        </Link>
        <Link
          to="/app/profile"
          className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 hover:border-sky-500/70 hover:bg-slate-900/80 transition-colors shadow-lg shadow-slate-950/50"
        >
          <h3 className="text-sm font-semibold text-slate-100 mb-1">Profile</h3>
          <p className="text-xs text-slate-400">
            View and edit your account details stored in localStorage.
          </p>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr,1fr]">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-100">Cart snapshot</h3>
            <span className="text-[11px] text-slate-400">
              Live data from your current session
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Total items</p>
              <p className="text-lg font-semibold text-slate-50">{totalItems}</p>
              <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: `${Math.min(100, totalItems * 15)}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Unique products</p>
              <p className="text-lg font-semibold text-slate-50">{uniqueProducts}</p>
              <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${Math.min(100, uniqueProducts * 20)}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-400">Average price</p>
              <p className="text-lg font-semibold text-emerald-400">
                {averagePrice ? formatInr(averagePrice) : '—'}
              </p>
              <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${Math.min(100, (averagePrice / 200) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 md:p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-100">Recent order</h3>
          {lastOrder ? (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Placed on</span>
                <span className="font-medium text-slate-100">
                  {new Date(lastOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Items</span>
                <span className="font-medium text-slate-100">
                  {lastOrder.items.reduce((sum, item) => sum + item.quantity, 0)} products
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total paid</span>
                <span className="font-semibold text-emerald-400">
                  {formatInr(lastOrder.total)}
                </span>
              </div>
              <p className="pt-1 text-[11px] text-slate-400">
                This summary is stored in your browser only for this demo account.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              You haven&apos;t placed any demo orders yet. Checkout from your cart to see order
              details here.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

