import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react'
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

    toast.success("Added to cart!", {
      icon: "🛒",
      style: {
        borderRadius: "12px",
        background: "#fff",
        color: "#212529",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
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
        console.error(error)
      }
    }

    syncWishlistState()
  }, [user?.id, product?.id])

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user?.id) {
      toast.error("Please sign in first")
      return
    }

    try {
      if (isWishlisted) {
        await wishlistService.remove(user.id, product.id)
        setIsWishlisted(false)
        toast.success("Removed from wishlist")
      } else {
        await wishlistService.add(user.id, product.id)
        setIsWishlisted(true)
        toast.success("Added to wishlist")
      }
    } catch {
      toast.error("Wishlist update failed")
    }
  }

  const imageUrl =
    product.images?.[0] ||
    product.image ||
    "/stickers/placeholder.webp"

  const hasOriginalPrice = Number(product.original_price) > 0

  const discountPercent =
    hasOriginalPrice && Number(product.price) > 0
      ? Math.round(
          ((Number(product.original_price) - Number(product.price)) /
            Number(product.original_price)) *
            100
        )
      : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <div className="bg-white dark:bg-brand-dark rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1">

        <div className="relative aspect-square overflow-hidden bg-brand-gray-50 dark:bg-brand-gray-800">

          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          <img
            src={imageUrl}
            alt=""
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x600?text=Sticker"
              setImageLoaded(true)
            }}
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="px-2.5 py-1 rounded-full text-xs bg-brand-primary text-white">
                NEW
              </span>
            )}

            {hasOriginalPrice && discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs bg-red-500 text-white">
                -{discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div className="p-4">

          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            {product.categories?.name || "Sticker"}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-primary text-lg">
                {formatPrice(product.price)}
              </span>

              {hasOriginalPrice && (
                <span className="line-through text-sm text-gray-400">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">

            <div className="flex items-center border rounded-full p-1">

              <button
                onClick={(e) => handleQuantityChange(-1, e)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Minus size={14} />
              </button>

              <span className="w-8 text-center">
                {quantity}
              </span>

              <button
                onClick={(e) => handleQuantityChange(1, e)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Plus size={14} />
              </button>

            </div>

            <button
              onClick={handleAddToCart}
             className="flex-1 flex items-center justify-center gap-1 bg-brand-primary text-white rounded-full py-2 px-2 text-[11px] md:text-sm min-w-0"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>

          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard