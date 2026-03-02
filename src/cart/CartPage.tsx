import { useState } from 'react'
import { useCart } from './CartContext'
import { formatInr } from '../utils/currency'
import { useAuth } from '../auth/AuthContext'
import { saveOrderForUser } from '../orders/orderStorage'

export const CartPage = () => {
  const { items, total, increment, decrement, remove, clear } = useCart()
  const { user } = useAuth()
  const [showThankYou, setShowThankYou] = useState(false)

  const hasItems = items.length > 0

  const handleCheckout = () => {
    if (!hasItems) return
    if (user?.email) {
      saveOrderForUser(user.email, {
        id: `${Date.now()}`,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })),
        total,
        createdAt: new Date().toISOString(),
      })
    }
    setShowThankYou(true)
    clear()
  }

  return (
    <div className="space-y-5 relative">
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-700 p-6 shadow-2xl text-center space-y-3">
            <h2 className="text-lg font-semibold text-slate-50">Thanks for shopping!</h2>
            <p className="text-sm text-slate-300">
              Your demo order has been placed successfully. You saved up to{' '}
              <span className="font-semibold text-emerald-400">20–30% </span>
              on this cart compared to MRP.
            </p>
            <p className="text-xs text-slate-500">
              This is a practice project, so no real payment was processed. You can keep exploring
              products and add new items to your cart.
            </p>
            <button
              type="button"
              onClick={() => setShowThankYou(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-xs font-medium text-white hover:bg-sky-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Cart</h2>
          <p className="text-xs text-slate-400">
            Manage quantities, remove items, and view cart totals.
          </p>
        </div>
        {hasItems && (
          <button
            onClick={clear}
            className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            Clear cart
          </button>
        )}
      </div>

      {!hasItems && (
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 text-sm text-slate-300 text-center shadow-lg shadow-slate-950/60">
          Your cart is empty. Browse products and add items to see them here.
        </div>
      )}

      {hasItems && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2.1fr),minmax(0,1fr)]">
          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 shadow-lg shadow-slate-950/60"
              >
                <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-100 line-clamp-2">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Price:{' '}
                    <span className="font-semibold text-emerald-400">
                      {formatInr(item.price)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900">
                    <button
                      onClick={() => decrement(item.id)}
                      className="px-2 py-1 text-xs text-slate-100 hover:bg-slate-800 rounded-l-lg"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-xs font-medium text-slate-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increment(item.id)}
                      className="px-2 py-1 text-xs text-slate-100 hover:bg-slate-800 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">
                    Subtotal:{' '}
                    <span className="font-semibold text-emerald-400">
                      {formatInr(item.price * item.quantity)}
                    </span>
                  </p>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-xs text-rose-300 hover:text-rose-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-xl shadow-slate-950/70">
            <h3 className="text-sm font-semibold text-slate-100 mb-1">Order Summary</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Items</span>
              <span className="text-slate-100">{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total</span>
              <span className="font-semibold text-emerald-400">{formatInr(total)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!hasItems}
              className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-white hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

