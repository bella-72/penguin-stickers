import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const COUPON_CODE = 'PENGUIN15'
const POPUP_CLOSED_KEY = 'coupon_popup_closed'
const BAR_CLOSED_KEY = 'coupon_bar_closed'

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

const CouponHelper = () => {
  const location = useLocation()
  const [popupClosed, setPopupClosed] = useState(false)
  const [barClosed, setBarClosed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    const popup = window.localStorage.getItem(POPUP_CLOSED_KEY) === 'true'
    const bar = window.localStorage.getItem(BAR_CLOSED_KEY) === 'true'
    setPopupClosed(popup)
    setBarClosed(bar)
  }, [])

  const showPopup = hydrated && !popupClosed && !barClosed && location.pathname === '/'
  const showBar = hydrated && !barClosed && popupClosed

  const handlePopupCopy = async () => {
    await copyToClipboard(COUPON_CODE)
    toast.success('تم نسخ الكود 🎉')
    setPopupClosed(true)
    window.localStorage.setItem(POPUP_CLOSED_KEY, 'true')
  }

  const handlePopupClose = () => {
    setPopupClosed(true)
    window.localStorage.setItem(POPUP_CLOSED_KEY, 'true')
  }

  const handleBarCopy = async () => {
    await copyToClipboard(COUPON_CODE)
    toast.success('تم نسخ الكود 🎉')
    setBarClosed(true)
    window.localStorage.setItem(BAR_CLOSED_KEY, 'true')
  }

  return (
    <>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
          >
            <div className="absolute inset-0 bg-brand-gray-950/30 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg rounded-[32px] bg-white border border-brand-gray-200 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
              <button
                type="button"
                onClick={handlePopupClose}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gray-100 text-brand-gray-600 transition hover:bg-brand-gray-200"
                aria-label="Close coupon popup"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-5 pt-2 text-center">
                <div className="rounded-3xl bg-brand-primary/10 px-4 py-4 text-brand-primary text-base font-semibold">
                  🎁 عندك خصم 15% على أول أوردر
                </div>
                <div className="space-y-3 text-sm text-brand-gray-700">
                  <p>انسخ الكود:</p>
                  <div className="mx-auto inline-flex rounded-full bg-brand-gray-100 px-4 py-2 text-sm font-semibold text-brand-primary">
                    {COUPON_CODE}
                  </div>
                  <p className="text-brand-gray-500">ومتنساش تدوس Apply بعد ما تكتبه ✨</p>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="mx-auto rounded-full px-6 py-3"
                  onClick={handlePopupCopy}
                >
                  نسخ الكود
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: 96, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-5xl rounded-t-3xl bg-white border border-brand-gray-200 shadow-[0_-18px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-2 text-sm font-semibold text-brand-primary">
                  🎟️ {COUPON_CODE}
                </span>
                <Button
                  type="button"
                  size="md"
                  className="w-full rounded-full px-5 py-3 sm:w-auto"
                  onClick={handleBarCopy}
                >
                  نسخ
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CouponHelper
