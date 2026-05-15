import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { demoProducts, demoCategories } from '@/utils/helpers'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const isNew = searchParams.get('filter') === 'new'

  const filteredProducts = useMemo(() => {
    let products = [...demoProducts]

    if (isNew) products = products.filter(p => p.is_new)
    if (selectedCategory !== 'all') {
      products = products.filter(p => p.categories?.slug === selectedCategory)
    }
    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    switch (sortBy) {
      case 'price_asc': products.sort((a, b) => a.price - b.price); break
      case 'price_desc': products.sort((a, b) => b.price - a.price); break
      case 'rating': products.sort((a, b) => b.rating - a.rating); break
      default: break
    }

    return products
  }, [selectedCategory, searchQuery, sortBy, isNew])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-mint-50 to-brand-light dark:from-brand-dark dark:to-[#0f0f1a] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-outfit text-4xl md:text-5xl font-bold text-brand-gray-900 dark:text-white mb-4">
              {isNew ? 'New Arrivals' : 'Shop All Stickers'}
            </h1>
            <p className="text-brand-gray-500 dark:text-brand-gray-400 max-w-md mx-auto">
              Browse our collection of premium die-cut stickers. Waterproof, durable, and irresistibly cute.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400" />
            <input
              type="text"
              placeholder="Search stickers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden px-3 py-2.5 rounded-xl border transition-all ${
                showFilters ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white dark:bg-brand-dark border-brand-gray-200 dark:border-brand-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <div className="hidden md:flex bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-brand-primary text-white' : ''}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-brand-primary text-white' : ''}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Categories Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
            <div className="bg-white dark:bg-brand-dark rounded-2xl p-4 shadow-card sticky top-28">
              <h3 className="font-outfit font-semibold text-sm mb-3 text-brand-gray-800 dark:text-white">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory('all'); setShowFilters(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === 'all' ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-brand-gray-600 dark:text-brand-gray-400 hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800'
                  }`}
                >
                  All Stickers
                </button>
                {demoCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.slug ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-brand-gray-600 dark:text-brand-gray-400 hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="text-sm text-brand-gray-400 mb-4">{filteredProducts.length} products</p>

            {filteredProducts.length > 0 ? (
              <div className={`grid gap-5 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-outfit text-xl font-semibold text-brand-gray-800 dark:text-white mb-2">No stickers found</h3>
                <p className="text-brand-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
