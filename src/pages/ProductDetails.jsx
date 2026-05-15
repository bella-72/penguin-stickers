import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Minus, Plus, Star, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react'
import Button from '@/components/ui/Button'
import { StarRating } from '@/components/ui/Elements'
import ProductCard from '@/components/product/ProductCard'
import { useCartStore } from '@/store/cartStore'
import { demoProducts, demoReviews, formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

const ProductDetails = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedFinish, setSelectedFinish] = useState('matte')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    const found = demoProducts.find(p => p.slug === slug || p.id === slug)
    setProduct(found || demoProducts[0])
    window.scrollTo(0, 0)
  }, [slug])

  if (!product) return null

  const relatedProducts = demoProducts.filter(p => p.id !== product.id).slice(0, 4)
  const finishes = [
    { value: 'matte', label: 'Matte', icon: '🎨' },
    { value: 'glossy', label: 'Glossy', icon: '✨' },
    { value: 'holographic', label: 'Holographic', icon: '🌈' },
  ]

  const handleAddToCart = () => {
    addItem(product, quantity, selectedFinish)
    toast.success(`${product.name} added to cart!`, { icon: '🛒' })
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-brand-gray-400">
          <Link to="/" className="hover:text-brand-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-brand-primary">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-gray-700 dark:text-brand-gray-300">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-3xl bg-brand-gray-50 dark:bg-brand-dark overflow-hidden shadow-card">
              <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=600&background=2ECC71&color=fff&font-size=0.25` }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-sm font-medium text-brand-primary mb-1">{product.categories?.name}</p>
              <h1 className="font-outfit text-3xl md:text-4xl font-bold text-brand-gray-900 dark:text-white">{product.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-brand-gray-500">{product.rating} ({product.review_count} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-outfit text-3xl font-bold text-brand-primary">{formatPrice(product.price)}</span>
              {product.original_price && <span className="text-lg text-brand-gray-400 line-through">{formatPrice(product.original_price)}</span>}
            </div>
            <p className="text-brand-gray-600 dark:text-brand-gray-400 leading-relaxed">{product.description}</p>

            <div>
              <p className="text-sm font-semibold text-brand-gray-700 dark:text-brand-gray-300 mb-3">Finish Option</p>
              <div className="flex gap-3">
                {finishes.filter(f => product.finish_types?.includes(f.value)).map((f) => (
                  <button key={f.value} onClick={() => setSelectedFinish(f.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${selectedFinish === f.value ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-brand-gray-200 dark:border-brand-gray-700 hover:border-brand-gray-300'}`}>
                    <span>{f.icon}</span> {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 bg-brand-gray-50 dark:bg-brand-gray-800 rounded-full p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700"><Minus className="w-4 h-4" /></button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700"><Plus className="w-4 h-4" /></button>
              </div>
              <Button size="lg" className="flex-1" icon={ShoppingCart} onClick={handleAddToCart}>Add To Cart</Button>
              <button onClick={() => { setIsWishlisted(!isWishlisted); toast.success(isWishlisted ? 'Removed' : 'Added to wishlist') }}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${isWishlisted ? 'border-red-400 bg-red-50' : 'border-brand-gray-200 dark:border-brand-gray-700'}`}>
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-gray-400'}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-brand-gray-100 dark:border-brand-gray-800">
              {[{ icon: Truck, label: 'Free Shipping 300+ EGP' }, { icon: Shield, label: 'Quality Guarantee' }, { icon: RotateCcw, label: 'Easy Returns' }].map((b) => (
                <div key={b.label} className="text-center p-3"><b.icon className="w-5 h-5 text-brand-primary mx-auto mb-1.5" /><p className="text-[11px] text-brand-gray-500">{b.label}</p></div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="font-outfit text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {demoReviews.map((r) => (
              <div key={r.id} className="bg-white dark:bg-brand-dark rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-mint flex items-center justify-center text-white font-bold text-sm">{r.user_name[0]}</div>
                  <div><p className="font-medium text-sm">{r.user_name}</p><StarRating rating={r.rating} size="xs" /></div>
                </div>
                <p className="text-sm text-brand-gray-600 dark:text-brand-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-outfit text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
