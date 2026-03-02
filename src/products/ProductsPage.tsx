import { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '../cart/CartContext'
import { convertUsdToInr, formatInr } from '../utils/currency'

type ApiProduct = {
  id: number
  title: string
  price: number
  image: string
  category: string
}

type SortOption = 'featured' | 'price_low_high' | 'price_high_low'

export const ProductsPage = () => {
  const { addToCart, items: cartItems } = useCart()
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimeout = useRef<number | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('https://fakestoreapi.com/products')
        if (!res.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = (await res.json()) as ApiProduct[]
        setProducts(data)
      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))),
    [products]
  )

  const showToast = (message: string) => {
    if (toastTimeout.current) {
      window.clearTimeout(toastTimeout.current)
    }
    setToast(message)
    toastTimeout.current = window.setTimeout(() => {
      setToast(null)
    }, 2000)
  }

  const handleAddToCart = (product: ApiProduct) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: convertUsdToInr(product.price),
      image: product.image,
    })
    showToast('Your item successfully added to cart.')
  }

  const displayedProducts = useMemo(() => {
    let list = products

    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory)
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(term)
        const categoryMatch = p.category.toLowerCase().includes(term)
        return titleMatch || categoryMatch
      })
    }

    if (sortBy === 'price_low_high') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_high_low') {
      list = [...list].sort((a, b) => b.price - a.price)
    }

    return list
  }, [products, selectedCategory, search, sortBy])

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/80 px-4 py-3 text-sm text-emerald-50 shadow-xl shadow-emerald-500/20">
            {toast}
          </div>
        </div>
      )}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-5 md:px-6 md:py-6 shadow-xl shadow-slate-950/70">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-60">
          <div className="absolute -top-8 right-0 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />
          <div className="absolute bottom-0 right-12 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Collection</p>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Curated looks from Fake Store
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-300 max-w-xl">
              Browse a Snitch‑style product grid powered by a public API. Filter by category, search
              by name, and add pieces straight to your cart.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <label className="text-[11px] text-slate-400" htmlFor="search">
              Search products
            </label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full md:w-64 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                selectedCategory === category
                  ? 'border-sky-500 bg-sky-500 text-white'
                  : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {category.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Sort by</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="featured">Featured</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
          </select>
        </div>
      </section>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className="flex flex-col bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[3/4] bg-slate-900/80" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-1/4 rounded bg-slate-800" />
                <div className="h-3 w-3/4 rounded bg-slate-800" />
                <div className="h-3 w-1/3 rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-rose-950/50 border border-rose-800 rounded-xl p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      {!loading && !error && displayedProducts.length === 0 && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 text-sm text-slate-300 text-center">
          No products found. Try changing your category, search term, or sort order.
        </div>
      )}

      {!loading && !error && displayedProducts.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map(product => {
            const inCart = cartItems.some(i => i.id === product.id)
            return (
              <div
                key={product.id}
                className="group flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-sky-500/70 hover:-translate-y-1 transition-all shadow-lg shadow-slate-950/70"
              >
                <div className="relative aspect-[3/4] bg-slate-900">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-100 border border-slate-700">
                    {product.category.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide line-clamp-1">
                    Fake Store
                  </h3>
                  <p className="text-sm font-semibold text-slate-50 line-clamp-2">
                    {product.title}
                  </p>
                  <p className="text-sm font-semibold text-emerald-400">
                    {formatInr(convertUsdToInr(product.price))}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-auto inline-flex items-center justify-center rounded-full bg-sky-500 px-3 py-2 text-xs font-medium text-white hover:bg-sky-400 transition-colors disabled:opacity-60"
                    disabled={inCart}
                  >
                    {inCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

