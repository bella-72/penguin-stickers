import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { wishlistService } from '@/services/api'
import { formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

const ProductCard = ({ product, index = 0 }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const user = useAuthStore((s) => s.user)

  const handleQuantityChange = (delta, e) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, quantity)
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

  useEffect(() => {
    const syncWishlistState = async () => {
      if (!user?.id || !product?.id) return
      try {
        const exists = await wishlistService.check(user.id, product.id)
        setIsWishlisted(exists)
      } catch (error) {
        console.error('Failed to sync wishlist state:', error)
      }
    }

    syncWishlistState()
  }, [user?.id, product?.id])

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user?.id) {
      toast.error('Please sign in to save wishlist items')
      return
    }

    try {
      if (isWishlisted) {
        await wishlistService.remove(user.id, product.id)
        setIsWishlisted(false)
        toast.success('Removed from wishlist', { icon: '💔', style: { borderRadius: '12px' } })
      } else {
        await wishlistService.add(user.id, product.id)
        setIsWishlisted(true)
        toast.success('Added to wishlist', { icon: '❤️', style: { borderRadius: '12px' } })
      }
    } catch (error) {
      console.error('Wishlist toggle failed:', error)
      toast.error('Wishlist update failed')
    }
  }

  const imageUrl = product.images?.[0] || product.image || '/stickers/placeholder.webp'
  const hasOriginalPrice = Number(product.original_price) > 0
  const discountPercent = hasOriginalPrice && Number(product.price) > 0
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
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
              {hasOriginalPrice && discountPercent > 0 && (
                <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                  -{discountPercent}%
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

            <div className="flex items-center justify-between pt-1 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-outfit font-bold text-brand-primary">
                  {formatPrice(product.price)}
                </span>
                {hasOriginalPrice && (
                  <span className="text-xs text-brand-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center rounded-full border border-brand-gray-200 dark:border-brand-gray-700 bg-brand-gray-50 dark:bg-brand-gray-800 p-1">
                <button
                  onClick={(e) => handleQuantityChange(-1, e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={(e) => handleQuantityChange(1, e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-3 py-2 text-sm font-medium text-white shadow-mint transition-all hover:opacity-90"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
    </motion.div>
  )
}

export default ProductCard
