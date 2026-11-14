import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Minus, Plus, Gift } from 'lucide-react'
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
  const addFreeGift = useCartStore((s) => s.addFreeGift)
  const freeGiftCount = useCartStore((s) => s.getFreeStickerCount())
  const freeGiftAllowance = useCartStore((s) => s.getFreeStickerAllowance())
  const user = useAuthStore((s) => s.user)
  const canAddGift = freeGiftCount < freeGiftAllowance

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

  const handleAddAsFreeGift = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (freeGiftCount >= freeGiftAllowance) {
      toast.error('You have selected all eligible free stickers.')
      return
    }

    addFreeGift(product)
    toast.success(`${product.name} added as a free gift!`, { icon: '🎁' })
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
            className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 sm:object-cover ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading={index < 4 ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x600?text=Sticker"
              setImageLoaded(true)
            }}
          />

          <div className="absolute left-2 top-2 flex flex-col gap-2 sm:left-3 sm:top-3">
            {hasOriginalPrice && discountPercent > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] text-white sm:px-2.5 sm:text-xs">
                -{discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 opacity-100 backdrop-blur transition sm:right-3 sm:top-3 sm:opacity-0 sm:group-hover:opacity-100"
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

        <div className="p-2.5 sm:p-4">

          <p className="mb-1.5 text-[9px] uppercase tracking-wider text-gray-400 sm:mb-3 sm:text-xs">
            {product.categories?.name || "Sticker"}
          </p>

          <div className="mb-2 flex items-center justify-between sm:mb-4">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 sm:gap-x-2">
              <span className="text-sm font-bold text-brand-primary sm:text-lg">
                {formatPrice(product.price)}
              </span>

              {hasOriginalPrice && (
                <span className="line-through text-xs sm:text-sm text-gray-400">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">

           <div className="flex items-center border rounded-full p-0.5 sm:p-1 flex-shrink-0">

              <button
                onClick={(e) => handleQuantityChange(-1, e)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <Minus size={14} />
              </button>

              <span               className="w-5 text-center text-xs sm:w-8 sm:text-sm">
                {quantity}
              </span>

              <button
                onClick={(e) => handleQuantityChange(1, e)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <Plus size={14} />
              </button>

            </div>

          <button
  onClick={handleAddToCart}
  className="min-h-9 min-w-0 flex-1 flex items-center justify-center gap-1 rounded-full bg-brand-primary px-1.5 py-2 text-[11px] font-medium text-white sm:px-3 sm:text-sm"
>
  <ShoppingCart size={14} />
  <span>Add</span>
</button>

          </div>
          {canAddGift && (
            <button
              type="button"
              onClick={handleAddAsFreeGift}
              className="mt-2 flex min-h-8 w-full items-center justify-center gap-1 rounded-full border border-brand-primary/30 px-2 py-1.5 text-[10px] font-semibold text-brand-primary transition hover:bg-brand-primary/5 sm:text-xs"
            >
              <Gift size={13} />
              Add as Free Gift
            </button>
          )}

        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard