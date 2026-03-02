import type { CartItem } from '../cart/CartContext'

export type OrderItem = Pick<CartItem, 'id' | 'title' | 'price' | 'image' | 'quantity'>

export type Order = {
  id: string
  items: OrderItem[]
  total: number
  createdAt: string
}

type OrdersByUser = {
  [email: string]: Order[]
}

const STORAGE_KEY = 'ecom_orders'

const loadAllOrders = (): OrdersByUser => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as OrdersByUser
  } catch {
    return {}
  }
}

const saveAllOrders = (data: OrdersByUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const saveOrderForUser = (email: string, order: Order) => {
  if (!email) return
  const all = loadAllOrders()
  const existing = all[email] ?? []
  all[email] = [...existing, order]
  saveAllOrders(all)
}

export const getOrdersForUser = (email: string): Order[] => {
  if (!email) return []
  const all = loadAllOrders()
  return all[email] ?? []
}

