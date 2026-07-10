import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Banknote, Smartphone, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { ordersService } from '@/services/orders'
import { storageService } from '@/services/api'
import { formatPrice, governorates } from '@/utils/helpers'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { discountCodesService } from "@/services/discountCodes";
const normalizePaymentMethod = (value) => {
  if (value === 'vodafone' || value === 'instapay' || value === 'cod') return value
  if (value === 'cash') return 'cod'
  return 'cod'
}

const Checkout = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { items, getSubtotal, getShipping, getTotal, clearCart, setGovernorate, selectedGovernorate } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')

const paymentMethods = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: Banknote,
    desc: 'Pay when your order arrives'
  },
  { id: 'vodafone', name: t('cash'), icon: Smartphone, desc: t('checkout.vodafone_desc') },
  { id: 'instapay', name: t('instapay'), icon: CreditCard, desc: t('checkout.instapay_desc') },
]
  const [form, setForm] = useState({
    fullName: '', phone: '', address: '', governorate: '', notes: ''
  })
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    screenshot: null,
    screenshotPreview: ''
  })
const [couponCode, setCouponCode] = useState("");

const [coupon, setCoupon] = useState(null);
const [couponLoading, setCouponLoading] = useState(false);
const discount = coupon
  ? Math.round((getSubtotal() * coupon.discount_percent) / 100)
  : 0;
const finalTotal =
  getSubtotal() +
  getShipping() -
  discount;
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // Update cart store with selected governorate
    if (name === 'governorate' && value) {
      setGovernorate(value)
    }
  }

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target
    setPaymentDetails({ ...paymentDetails, [name]: value })
  }

  const handleScreenshotUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setPaymentDetails({
          ...paymentDetails,
          screenshot: file,
          screenshotPreview: event.target?.result || ''
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadPaymentProof = async (file) => {
    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const safeName = (file.name || 'payment-proof').replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `payment-proofs/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`

    console.log('Uploading payment proof to Supabase Storage:', { bucket: 'payment-proofs', storagePath })

    try {
      const uploadedUrl = await storageService.uploadImage('payment-proofs', file, storagePath)
      console.log('uploaded payment proof url:', uploadedUrl)
      return uploadedUrl
    } catch (error) {
      console.error('Payment proof upload failed:', error)
      throw error
    }
  }
const applyCoupon = async () => {
  setCoupon(null);
  if (!couponCode.trim()) {
    return toast.error("Please enter coupon code");
  }

  try {
    setCouponLoading(true);

    const data = await discountCodesService.getByCode(
      couponCode.toUpperCase()
    );

    if (!data) {
      return toast.error("Coupon not found");
    }
    
    
if (data.expires_at && new Date(data.expires_at) < new Date()) {
  return toast.error("Coupon expired");
}
if (data.discount_percent <= 0) {
  return toast.error("Invalid discount");
}
    setCoupon(data);

    toast.success("Coupon applied 🎉");
  } catch (error) {
    console.error(error);
    toast.error("Invalid coupon");
  } finally {
    setCouponLoading(false);
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.address) {
      toast.error('Please fill in all required fields')
      return
    }
    if (!form.governorate) {
      toast.error('Please select a governorate')
      return
    }
    
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod)

    // Validate payment method specific fields
    if (normalizedPaymentMethod === 'vodafone' || normalizedPaymentMethod === 'instapay') {
      if (!paymentDetails.transactionId) {
        toast.error('Please enter the transaction ID')
        return
      }
      if (!paymentDetails.screenshot) {
        toast.error('Please upload a payment screenshot')
        return
      }
    }
    
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      let paymentProofUrl = null

      if ((normalizedPaymentMethod === 'vodafone' || normalizedPaymentMethod === 'instapay') && paymentDetails.screenshot) {
        paymentProofUrl = await uploadPaymentProof(paymentDetails.screenshot)
        console.log('uploaded payment proof url:', paymentProofUrl)
      }

      console.log('PAYMENT IMAGE URL BEFORE ORDER:', paymentProofUrl)
      const subtotal = getSubtotal();
      const shipping = getShipping();
      const total = subtotal + shipping - discount;

      const orderPayload = {
        user_id: user?.id ?? null,
        full_name: form.fullName,
        phone: form.phone,
        address: form.address,
        governorate: form.governorate,
        notes: form.notes || null,
        payment_method: normalizedPaymentMethod,
        payment_proof_url: paymentProofUrl ?? null,
       subtotal,
       shipping,
discount_code: coupon?.code ?? null,
discount_percent: coupon?.discount_percent ?? 0,
discount_amount: discount,
total,
status: 'pending',
        items: items.map(item => ({
          product_id: item.product_id || item.id,
          product_name: item.name,
          product_image: item.image || null,
          quantity: item.quantity,
          price: item.price,
          finish_type: item.finish_type || 'matte',
        })),
      }

      console.log(orderPayload)

      await ordersService.create(orderPayload)


      console.log('Checkout order inserted successfully')

      clearCart()
      setCoupon(null);
setCouponCode("");
      setOrderPlaced(true)
    } catch (error) {
      console.log('supabase error:', error)
      console.log(error?.message)
      console.log(error?.details)
      console.log(error?.hint)
      toast.error(error?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="font-outfit text-3xl font-bold text-brand-gray-900 dark:text-white mb-3">Order Placed! 🎉</h2>
          <p className="text-brand-gray-500 dark:text-brand-gray-400 mb-6">
            Thank you for your order! We'll start preparing your stickers right away. You'll receive updates via SMS.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/shop')} iconRight={ArrowRight}>Continue Shopping</Button>
            <Button variant="secondary" onClick={() => navigate('/profile')}>View Orders</Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-outfit text-3xl md:text-4xl font-bold text-brand-gray-900 dark:text-white mb-8">
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-8">
              {/* Shipping */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                <h2 className="font-outfit text-xl font-semibold mb-5">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your name" required />
                  <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+20 123 456 7890" required />
                </div>
                <div className="mt-4">
                  <Input label="Address Details" name="address" value={form.address} onChange={handleChange} placeholder="Building, Street, Apartment" required />
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300">Governorate *</label>
                    <select name="governorate" value={form.governorate} onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      required>
                      <option value="">Select a governorate...</option>
                      {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <Textarea label="Notes (Optional)" name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions..." rows={3} />
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                <h2 className="font-outfit text-xl font-semibold mb-5">Payment Method</h2>
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  {paymentMethods.map((pm) => (
                    <button key={pm.id} type="button" onClick={() => setPaymentMethod(pm.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === pm.id
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-brand-gray-200 dark:border-brand-gray-700 hover:border-brand-gray-300'
                      }`}>
                      <pm.icon className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === pm.id ? 'text-brand-primary' : 'text-brand-gray-400'}`} />
                      <p className={`text-sm font-medium ${paymentMethod === pm.id ? 'text-brand-primary' : 'text-brand-gray-700 dark:text-brand-gray-300'}`}>{pm.name}</p>
                      <p className="text-xs text-brand-gray-400 mt-0.5">{pm.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Vodafone Cash Details */}
                {paymentMethod === 'vodafone' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-gray-50 dark:bg-brand-gray-800/50 rounded-xl p-5 mb-6 border border-brand-gray-100 dark:border-brand-gray-700">
                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-brand-dark rounded-lg border border-brand-gray-200 dark:border-brand-gray-700">
                        <p className="text-xs text-brand-gray-500 mb-1">Vodafone Cash Number</p>
                        <p className="font-mono text-lg font-semibold text-brand-primary">+20 10 21602374</p>
                      </div>
                      <div className="p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                        <p className="text-sm text-brand-gray-700 dark:text-brand-gray-300">
                          📱 Send <span className="font-semibold">{formatPrice(getTotal())}</span> to this number and provide your transaction ID below.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">Transaction ID *</label>
                        <input type="text" name="transactionId" value={paymentDetails.transactionId} onChange={handlePaymentDetailsChange}
                          placeholder="Enter your Vodafone Cash transaction ID" 
                          className="w-full px-4 py-2.5 border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl bg-white dark:bg-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">Payment Screenshot *</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 px-4 py-3 border-2 border-dashed border-brand-gray-200 dark:border-brand-gray-700 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                            <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                            <p className="text-sm text-center">
                              {paymentDetails.screenshot ? (
                                <span className="text-brand-primary font-medium">✓ Screenshot uploaded</span>
                              ) : (
                                <span className="text-brand-gray-500">Click to upload screenshot</span>
                              )}
                            </p>
                          </label>
                        </div>
                        {paymentDetails.screenshotPreview && (
                          <div className="mt-3 p-2 bg-brand-gray-50 dark:bg-brand-gray-800/50 rounded-lg">
                            <img src={paymentDetails.screenshotPreview} alt="Payment screenshot" className="w-full max-h-32 object-contain rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* InstaPay Details */}
                {paymentMethod === 'instapay' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-gray-50 dark:bg-brand-gray-800/50 rounded-xl p-5 mb-6 border border-brand-gray-100 dark:border-brand-gray-700">
                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-brand-dark rounded-lg border border-brand-gray-200 dark:border-brand-gray-700">
                        <p className="text-xs text-brand-gray-500 mb-1">InstaPay Account Information</p>
                        <p className="font-mono text-lg font-semibold text-brand-primary">+20 1143608754</p>
                        <p className="text-xs text-brand-gray-400 mt-1">Account Holder: Penguin Stick Egypt</p>
                      </div>
                      <div className="p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                        <p className="text-sm text-brand-gray-700 dark:text-brand-gray-300">
                          🏦 Transfer <span className="font-semibold">{formatPrice(getTotal())}</span> via InstaPay and provide your transaction ID below.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">Transaction ID *</label>
                        <input type="text" name="transactionId" value={paymentDetails.transactionId} onChange={handlePaymentDetailsChange}
                          placeholder="Enter your InstaPay transaction ID" 
                          className="w-full px-4 py-2.5 border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl bg-white dark:bg-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-2">Payment Screenshot *</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 px-4 py-3 border-2 border-dashed border-brand-gray-200 dark:border-brand-gray-700 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                            <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                            <p className="text-sm text-center">
                              {paymentDetails.screenshot ? (
                                <span className="text-brand-primary font-medium">✓ Screenshot uploaded</span>
                              ) : (
                                <span className="text-brand-gray-500">Click to upload screenshot</span>
                              )}
                            </p>
                          </label>
                        </div>
                        {paymentDetails.screenshotPreview && (
                          <div className="mt-3 p-2 bg-brand-gray-50 dark:bg-brand-gray-800/50 rounded-lg">
                            <img src={paymentDetails.screenshotPreview} alt="Payment screenshot" className="w-full max-h-32 object-contain rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card sticky top-28">
                <h2 className="font-outfit text-xl font-semibold mb-5">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.finish_type}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-brand-gray-50 dark:bg-brand-gray-800 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=100&background=2ECC71&color=fff` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-brand-gray-400">x{item.quantity} • {item.finish_type}</p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    
                  ))}
                  <div className="border-t border-brand-gray-100 dark:border-brand-gray-700 pt-4 mb-4">

  <label className="block text-sm font-medium mb-2">
    Discount Coupon
  </label>

  <div className="flex gap-2">

    <input
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
      placeholder="Enter coupon"
      className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700"
    />

    <Button
      type="button"
      loading={couponLoading}
      onClick={applyCoupon}
    >
      Apply
    </Button>

  </div>

  {coupon && (
    <p className="mt-2 text-green-500 text-sm">
      Coupon applied ({coupon.discount_percent}% OFF)
    </p>
  )}

</div>
                </div>
                <div className="border-t border-brand-gray-100 dark:border-brand-gray-700 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-brand-gray-500"><span>Subtotal</span><span>{formatPrice(getSubtotal())}</span></div>
                  <div className="flex justify-between text-brand-gray-500"><span>Shipping</span><span>{form.governorate ? (getShipping() === 0 ? 'Free Shipping' : formatPrice(getShipping())) : 'Select governorate'}</span></div>
                  {coupon && (
  <div className="flex justify-between text-green-600">
    <span>Discount ({coupon.discount_percent}%)</span>
    <span>-{formatPrice(discount)}</span>
  </div>
)}
                  <div className="flex justify-between items-center pt-2 border-t border-brand-gray-100 dark:border-brand-gray-700">
                    <span className="font-medium">Total</span>
                    <span className="font-outfit text-2xl font-bold text-brand-primary">
  {form.governorate
    ? formatPrice(finalTotal)
    : "-"}
</span>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-6" size="lg" loading={loading} iconRight={ArrowRight}>
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout
