import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme/ThemeContext'
import { convertUsdToInr, formatInr } from '../utils/currency'

type ApiProduct = {
  id: number
  title: string
  price: number
  image: string
  category: string
}

type LandingCategory = 'all' | 'men' | 'women' | 'accessories' | 'tech'

const mapCategory = (apiCategory: string): LandingCategory => {
  if (apiCategory.toLowerCase().includes("men")) return "men"
  if (apiCategory.toLowerCase().includes("women")) return "women"
  if (apiCategory.toLowerCase().includes("jewel")) return "accessories"
  if (apiCategory.toLowerCase().includes("elect")) return "tech"
  return "all"
}

export const HomePage = () => {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<LandingCategory>('all')
  const { theme, toggleTheme } = useTheme()

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
        setError(err.message || 'Something went wrong while loading products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (category !== 'all') {
      list = list.filter(p => mapCategory(p.category) === category)
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(term)
        const categoryMatch = mapCategory(p.category).toLowerCase().includes(term)
        return titleMatch || categoryMatch
      })
    }

    return list
  }, [products, category, search])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
      {/* Top marketing navbar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 text-xs font-bold text-slate-950">
                EC
              </span>
              <span className="text-sm font-semibold tracking-tight">Ecom Studio</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setCategory('men')}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                category === 'men'
                  ? 'bg-sky-500 text-white'
                  : 'bg-transparent text-slate-200 hover:bg-slate-800'
              }`}
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => setCategory('women')}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                category === 'women'
                  ? 'bg-sky-500 text-white'
                  : 'bg-transparent text-slate-200 hover:bg-slate-800'
              }`}
            >
              Women
            </button>
            <button
              type="button"
              onClick={() => setCategory('accessories')}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                category === 'accessories'
                  ? 'bg-sky-500 text-white'
                  : 'bg-transparent text-slate-200 hover:bg-slate-800'
              }`}
            >
              Accessories
            </button>
            <button
              type="button"
              onClick={() => setCategory('tech')}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                category === 'tech'
                  ? 'bg-sky-500 text-white'
                  : 'bg-transparent text-slate-200 hover:bg-slate-800'
              }`}
            >
              Tech
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search demo products..."
                className="bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <Link
              to="/auth/login"
              className="inline-flex items-center rounded-full bg-sky-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-400 transition-colors"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-800/90 dark:border-slate-600"
            >
              {theme === 'dark' ? 'Light' : 'Dark'} mode
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Hero */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-center">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Modern authentication‑based store
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Discover curated looks with a{' '}
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Snitch‑style
              </span>{' '}
              experience.
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              This is a demo front page that showcases products from a public API. To access your
              real dashboard, cart, and profile, continue to login.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link
                to="/auth/login"
                className="inline-flex items-center rounded-full bg-sky-500 px-4 py-1.5 font-medium text-white hover:bg-sky-400 transition-colors"
              >
                Login to start shopping
              </Link>
              <a
                href="#demo-products"
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 font-medium text-slate-100 hover:bg-slate-800 transition-colors"
              >
                View demo collection
              </a>
            </div>
          </div>

          <div className="relative h-52 md:h-56 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden">
            <div className="absolute -right-10 top-6 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="relative h-full w-full flex items-center justify-center">
              <p className="text-xs text-slate-300 max-w-xs text-center">
                After logging in, you&apos;ll see a protected dashboard with live products, cart
                management, and profile editing.
              </p>
            </div>
          </div>
        </section>

        {/* Demo products */}
        <section id="demo-products" className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">Featured demo products</h2>
            <p className="text-[11px] text-slate-500">
              Showing {filteredProducts.length || products.length} items from the public API
            </p>
          </div>

          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div
                  key={idx}
                  className="flex flex-col bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[3/4] bg-slate-900/80" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-slate-800" />
                    <div className="h-3 w-1/3 rounded bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-rose-950/60 border border-rose-800 rounded-xl p-4 text-xs text-rose-200">
              {error}
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="group flex flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-sky-500/70 transition-all shadow-lg shadow-slate-950/70"
                >
                  <div className="relative aspect-[3/4] bg-slate-900">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-100 border border-slate-700">
                      {mapCategory(product.category)}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide line-clamp-1">
                      Demo product
                    </h3>
                    <p className="text-sm font-semibold text-slate-50 line-clamp-2">
                      {product.title}
                    </p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {formatInr(convertUsdToInr(product.price))}
                    </p>
                    <button
                      type="button"
                      disabled
                      className="mt-auto inline-flex items-center justify-center rounded-full bg-slate-800/90 px-3 py-2 text-[11px] font-medium text-slate-300 cursor-not-allowed"
                    >
                      Login to add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

