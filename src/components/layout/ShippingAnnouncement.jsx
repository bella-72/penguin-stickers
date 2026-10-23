import { Truck } from 'lucide-react'

const ShippingAnnouncement = () => (
  <div className="sticky top-0 z-50 flex h-8 items-center justify-center gap-2 whitespace-nowrap bg-mint-100 px-2 text-[11px] font-medium text-brand-gray-800 sm:text-xs md:h-9 md:text-sm dark:bg-brand-dark">
    <Truck className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
    <span>Free Shipping on Orders Over 500 EGP 🎉</span>
  </div>
)

export default ShippingAnnouncement
