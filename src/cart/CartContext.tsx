import React, { createContext, useContext, useMemo, useReducer } from 'react'

export type CartItem = {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'INCREMENT'; payload: { id: number } }
  | { type: 'DECREMENT'; payload: { id: number } }
  | { type: 'REMOVE'; payload: { id: number } }
  | { type: 'CLEAR' }

type CartContextValue = {
  items: CartItem[]
  total: number
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  increment: (id: number) => void
  decrement: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

const STORAGE_KEY = 'ecom_cart'

const CartContext = createContext<CartContextValue | undefined>(undefined)

const loadInitialState = (): CartState => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { items: [] }
  try {
    const parsed = JSON.parse(raw) as CartState
    return { items: parsed.items ?? [] }
  } catch {
    return { items: [] }
  }
}

const persistState = (state: CartState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        const items = state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        const next = { items }
        persistState(next)
        return next
      }
      const items = [...state.items, { ...action.payload, quantity: 1 }]
      const next = { items }
      persistState(next)
      return next
    }
    case 'INCREMENT': {
      const items = state.items.map(i =>
        i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
      )
      const next = { items }
      persistState(next)
      return next
    }
    case 'DECREMENT': {
      const items = state.items
        .map(i => (i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
      const next = { items }
      persistState(next)
      return next
    }
    case 'REMOVE': {
      const items = state.items.filter(i => i.id !== action.payload.id)
      const next = { items }
      persistState(next)
      return next
    }
    case 'CLEAR': {
      const next = { items: [] }
      persistState(next)
      return next
    }
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  const total = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  )

  const contextValue: CartContextValue = useMemo(
    () => ({
      items: state.items,
      total,
      addToCart: item => dispatch({ type: 'ADD_ITEM', payload: item }),
      increment: id => dispatch({ type: 'INCREMENT', payload: { id } }),
      decrement: id => dispatch({ type: 'DECREMENT', payload: { id } }),
      remove: id => dispatch({ type: 'REMOVE', payload: { id } }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.items, total]
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

