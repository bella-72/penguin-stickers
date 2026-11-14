import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { flushSync } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Gift, Minus, Plus, ShoppingCart, Trash2, Truck, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/helpers'
import { getStickerBundleProgress } from '@/utils/stickerBundles'

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const selectedGovernorate = useCartStore((state) => state.selectedGovernorate)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const subtotal = useCartStore((state) => state.getSubtotal())
  const shipping = useCartStore((state) => state.getShipping())
  const total = useCartStore((state) => state.getTotal())
  const paidStickerCount = useCartStore((state) => state.getPaidStickerCount())
  const freeGiftCount = useCartStore((state) => state.getFreeStickerCount())
  const freeGiftAllowance = useCartStore((state) => state.getFreeStickerAllowance())
  const bundleProgress = getStickerBundleProgress(paidStickerCount)
  const giftsOverAllowance = freeGiftCount > freeGiftAllowance

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const goToCheckout = () => {
    flushSync(onClose)
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Dismiss cart backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] cursor-default bg-black/35 backdrop-blur-[1px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-y-0 right-0 z-[61] flex h-[100dvh] w-full flex-col bg-white shadow-2xl dark:bg-brand-dark sm:w-[min(26rem,92vw)]"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-brand-gray-100 px-4 py-4 dark:border-brand-gray-700 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <ShoppingCart className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="cart-drawer-title" className="font-outfit text-lg font-bold text-brand-gray-900 dark:text-white">
                    Your Cart
                  </h2>
                  <p className="text-xs text-brand-gray-500 dark:text-brand-gray-400">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full text-brand-gray-500 transition hover:bg-brand-gray-100 dark:text-brand-gray-300 dark:hover:bg-brand-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gray-50 text-brand-gray-400 dark:bg-brand-gray-800">
                  <ShoppingCart className="h-7 w-7" />
                </span>
                <p className="font-semibold text-brand-gray-800 dark:text-white">Your cart is empty</p>
                <p className="mt-1 text-sm text-brand-gray-500 dark:text-brand-gray-400">Find something you love in the shop.</p>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-sm font-semibold text-white transition hover:bg-brand-secondary"
                >
                  Continue shopping <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
                  <section className="rounded-xl border border-brand-primary/15 bg-brand-primary/5 px-3 py-2.5 dark:bg-brand-primary/10">
                    <div className="flex items-start gap-2">
                      <Gift className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-brand-gray-800 dark:text-white">
                          {bundleProgress.message}
                        </p>
                        {freeGiftAllowance > 0 && (
                          <p className="mt-1 text-[11px] text-brand-gray-600 dark:text-brand-gray-300">
                            {freeGiftAllowance} free {freeGiftAllowance === 1 ? 'gift' : 'gifts'} unlocked · {freeGiftCount} selected · {Math.max(0, freeGiftAllowance - freeGiftCount)} remaining
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-gray-200 dark:bg-brand-gray-700"
                      role="progressbar"
                      aria-label="Sticker offer progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(bundleProgress.progressPercent)}
                    >
                      <div
                        className="h-full rounded-full bg-brand-primary transition-[width] duration-300"
                        style={{ width: `${bundleProgress.progressPercent}%` }}
                      />
                    </div>
                    {freeGiftAllowance > 0 && (
                      <p className="mt-1.5 text-[10px] text-brand-gray-500 dark:text-brand-gray-400">
                        Browse the shop and add any sticker as a free gift.
                      </p>
                    )}
                  </section>
                  {giftsOverAllowance && (
                    <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      Your cart now qualifies for {freeGiftAllowance} free stickers, but {freeGiftCount} are selected. Remove {freeGiftCount - freeGiftAllowance} extra {freeGiftCount - freeGiftAllowance === 1 ? 'gift' : 'gifts'} to continue.
                    </p>
                  )}
                  {items.map((item) => {
                    const image = item.image || item.product?.images?.[0] || item.product?.image || '/stickers/placeholder.webp'
                    const name = item.name || item.product?.name || 'Sticker'
                    const isFreeGift = Boolean(item.is_free_gift)

                    return (
                      <article
                        key={`${item.id}-${item.finish_type}-${isFreeGift ? 'gift' : 'paid'}`}
                        className="flex gap-3 rounded-2xl border border-brand-gray-100 bg-white p-3 dark:border-brand-gray-700 dark:bg-white/5"
                      >
                        <img
                          src={image}
                          alt={name}
                          className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-xl bg-brand-gray-50 object-cover dark:bg-brand-gray-800"
                          onError={(event) => {
                            event.currentTarget.src = '/stickers/placeholder.webp'
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-brand-gray-800 dark:text-white">{name}</h3>
                              {item.finish_type && (
                                <p className="mt-0.5 text-xs capitalize text-brand-gray-500 dark:text-brand-gray-400">
                                  {item.finish_type}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id, item.finish_type, isFreeGift)}
                              aria-label={`Remove ${name}`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-2 flex items-end justify-between gap-2">
                            <div>
                              {isFreeGift ? (
                                <span className="inline-flex rounded-full bg-brand-primary/10 px-2 py-1 text-[10px] font-bold text-brand-primary">FREE · 0 EGP</span>
                              ) : (
                                <>
                                  <p className="text-xs text-brand-gray-500 dark:text-brand-gray-400">
                                    {formatPrice(item.price)} each
                                  </p>
                                  <p className="text-sm font-bold text-brand-primary">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </>
                              )}
                            </div>
                            <div className="flex h-9 items-center rounded-full bg-brand-gray-50 p-0.5 dark:bg-brand-gray-800">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.finish_type, item.quantity - 1, isFreeGift)}
                                aria-label={`Decrease ${name} quantity`}
                                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white dark:hover:bg-brand-gray-700"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.finish_type, item.quantity + 1, isFreeGift)}
                                aria-label={`Increase ${name} quantity`}
                                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white dark:hover:bg-brand-gray-700"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <footer className="shrink-0 border-t border-brand-gray-100 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 dark:border-brand-gray-700 dark:bg-brand-dark sm:px-6">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-brand-gray-600 dark:text-brand-gray-300">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-brand-gray-600 dark:text-brand-gray-300">
                      <span className="flex items-center gap-1.5"><Truck className="h-4 w-4" /> Shipping</span>
                      <span>
                        {shipping > 0
                          ? formatPrice(shipping)
                          : subtotal >= 500 || paidStickerCount >= 50
                            ? 'Free'
                            : selectedGovernorate
                              ? formatPrice(shipping)
                              : 'At checkout'}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-brand-gray-100 pt-3 text-base font-bold text-brand-gray-900 dark:border-brand-gray-700 dark:text-white">
                      <span>Total</span>
                      <span className="text-brand-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={goToCheckout}
                    disabled={giftsOverAllowance}
                    className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-mint px-5 text-sm font-semibold text-white shadow-mint transition hover:shadow-mint-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
