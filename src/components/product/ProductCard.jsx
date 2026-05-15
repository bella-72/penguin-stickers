import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

const ProductCard = ({ product, index = 0 }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#fff',
        color: '#212529',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      },
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isWishlisted ? '💔' : '❤️',
      style: { borderRadius: '12px' },
    })
  }

  const imageUrl = product.images?.[0] || product.image || '/stickers/placeholder.webp'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <Link to={`/product/${product.slug || product.id}`}>
        <div className="bg-white dark:bg-brand-dark rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-brand-gray-50 dark:bg-brand-gray-800">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=400&background=2ECC71&color=fff&font-size=0.33`
                setImageLoaded(true)
              }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.is_new && (
                <span className="px-2.5 py-0.5 bg-gradient-mint text-white text-xs font-medium rounded-full">
                  NEW
                </span>
              )}
              {product.original_price && (
                <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                  -{Math.round((1 - product.price / product.original_price) * 100)}%
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-gray-600'
                }`}
              />
            </button>

            {/* Quick Add */}
            <motion.button
              onClick={handleAddToCart}
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-mint opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <p className="text-xs text-brand-gray-400 font-medium uppercase tracking-wide">
              {product.categories?.name || 'Stickers'}
            </p>
            <h3 className="font-outfit font-semibold text-brand-gray-800 dark:text-brand-gray-200 group-hover:text-brand-primary transition-colors line-clamp-1">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-brand-gray-600 dark:text-brand-gray-400">
                {product.rating || '4.5'}
              </span>
              <span className="text-xs text-brand-gray-400">
                ({product.review_count || 0})
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="font-outfit font-bold text-brand-primary">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-xs text-brand-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
