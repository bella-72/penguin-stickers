import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import Button from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Elements'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/helpers'

const Cart = () => {
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getTotal } = useCartStore()
  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any stickers yet. Start exploring our collection!"
          action={
            <Link to="/shop">
              <Button iconRight={ArrowRight}>Browse Stickers</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-outfit text-3xl md:text-4xl font-bold text-brand-gray-900 dark:text-white mb-8"
        >
          Your Cart
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.finish_type}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white dark:bg-brand-dark rounded-2xl p-4 md:p-5 shadow-card flex items-center gap-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-brand-gray-50 dark:bg-brand-gray-800 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=200&background=2ECC71&color=fff`
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-outfit font-semibold text-brand-gray-800 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brand-gray-400 capitalize mt-0.5">
                      {item.category} • {item.finish_type}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 bg-brand-gray-50 dark:bg-brand-gray-800 rounded-full p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.finish_type, item.quantity - 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.finish_type, item.quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-outfit font-bold text-brand-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id, item.finish_type)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-brand-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card sticky top-28">
              <h2 className="font-outfit text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-brand-gray-600 dark:text-brand-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-gray-600 dark:text-brand-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-brand-gray-100 dark:border-brand-gray-700 pt-3 flex justify-between items-center">
                  <span className="font-medium text-brand-gray-800 dark:text-white">Total</span>
                  <span className="font-outfit text-2xl font-bold text-brand-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-6">
                <Button className="w-full" size="lg" iconRight={ArrowRight}>
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-center text-brand-gray-400 mt-3">
                Secure checkout by Penguin Stick SSL
              </p>

              {subtotal < 300 && (
                <div className="mt-4 p-3 rounded-xl bg-mint-50 dark:bg-mint-900/20 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-primary shrink-0" />
                  <p className="text-xs text-brand-primary">
                    Add {formatPrice(300 - subtotal)} more for free delivery!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
