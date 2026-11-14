import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gift, Truck, X } from 'lucide-react'

const offers = [
  { quantity: '5 + 1', description: 'مع شراء 5 ملصقات، ملصق إضافي هدية' },
  { quantity: '10 + 3', description: 'مع شراء 10 ملصقات، 3 ملصقات هدية' },
  { quantity: '20 + 7', description: 'مع شراء 20 ملصقًا، 7 ملصقات هدية' },
  {
    quantity: '50 + 20',
    description: 'مع شراء 50 ملصقًا، 20 ملصقًا هدية',
    freeShipping: true,
  },
]

const OffersPopup = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-modal="false"
            id="offers-popup-panel"
            aria-labelledby="offers-popup-title"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-16 right-0 max-h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto rounded-3xl border border-brand-gray-200 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.16)] dark:border-brand-gray-700 dark:bg-brand-dark"
          >
            <div className="bg-gradient-mint-soft px-5 pb-4 pt-5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-brand-gray-600 transition hover:bg-white dark:bg-brand-dark/70 dark:text-brand-gray-300 dark:hover:bg-brand-dark"
                aria-label="إغلاق العروض"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 pr-10">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-primary shadow-sm dark:bg-brand-dark">
                  <Gift className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="offers-popup-title" className="font-outfit text-lg font-bold text-brand-gray-900 dark:text-white">
                    عروض الملصقات
                  </h2>
                  <p className="mt-0.5 text-xs text-brand-gray-600 dark:text-brand-gray-300">
                    هدايا أكثر مع الكميات الأكبر
                  </p>
                </div>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-2.5 p-4">
              {offers.map((offer) => (
                <li
                  key={offer.quantity}
                  className="rounded-2xl border border-brand-gray-100 bg-brand-gray-50/80 p-3 dark:border-brand-gray-700 dark:bg-white/5"
                >
                  <p dir="ltr" className="text-center text-xl font-extrabold text-brand-primary">
                    {offer.quantity}
                  </p>
                  <p className="mt-1.5 text-center text-xs leading-5 text-brand-gray-700 dark:text-brand-gray-200">
                    {offer.description}
                  </p>
                  {offer.freeShipping && (
                    <p className="mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold text-brand-secondary dark:text-mint-300">
                      <Truck className="h-3.5 w-3.5" />
                      شحن مجاني
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="offers-popup-panel"
        className="flex items-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-mint transition hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/30"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
        {isOpen ? 'إغلاق العروض' : 'العروض'}
      </button>
    </div>
  )
}

export default OffersPopup
