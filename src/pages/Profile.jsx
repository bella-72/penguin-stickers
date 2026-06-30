import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Heart, Palette, Settings, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/Elements'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, formatDate, getStatusColor } from '@/utils/helpers'
import { ordersService } from '@/services/orders'
import { wishlistService } from '@/services/api'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'custom', label: 'Custom Requests', icon: Palette },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const Profile = () => {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders')
  const { user, profile, signOut, updateProfile } = useAuthStore()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    governorate: profile?.governorate || 'Cairo',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.id || activeTab !== 'orders') return

      setOrdersLoading(true)
      try {
        const userOrders = await ordersService.getByUser(user.id)
        setOrders(userOrders || [])
      } catch (error) {
        console.error('Failed to load profile orders:', error)
        toast.error('Failed to load your orders')
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchUserOrders()
  }, [user?.id, activeTab])

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id || activeTab !== 'wishlist') return

      setWishlistLoading(true)
      try {
        const items = await wishlistService.get(user.id)
        setWishlistItems(items || [])
      } catch (error) {
        console.error('Failed to load wishlist:', error)
        toast.error('Failed to load your wishlist')
        setWishlistItems([])
      } finally {
        setWishlistLoading(false)
      }
    }

    fetchWishlist()
  }, [user?.id, activeTab])

  if (!user) return null

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
  }

  const handleCancelOrder = async (orderId) => {
    if (!user?.id) return

    const confirmed = window.confirm('Cancel this order?')
    if (!confirmed) return

    try {
      await ordersService.deleteOrder(orderId, user.id)
      setOrders((prev) => prev.filter((order) => order.id !== orderId))
      toast.success('Order cancelled successfully')
    } catch (error) {
      console.error('Failed to cancel order:', error)
      toast.error('Failed to cancel order')
    }
  }

  const paymentMethodLabels = {
    cod: 'Cash on Delivery',
    vodafone: 'Vodafone Cash',
    instapay: 'InstaPay',
  }

  const handleRemoveWishlist = async (entry) => {
    if (!user?.id) return

    try {
      await wishlistService.remove(user.id, entry.product_id)
      setWishlistItems((prev) => prev.filter((item) => item.id !== entry.id))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Failed to remove wishlist item:', error)
      toast.error('Failed to remove item')
    }
  }

  const handleAddWishlistProductToCart = (product) => {
    addItem(product)
    toast.success(`${product.name} added to cart!`, { icon: '🛒' })
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-mint flex items-center justify-center text-white text-2xl font-bold shadow-mint">
              {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-outfit text-2xl font-bold">{profile?.full_name || 'User'}</h1>
              <p className="text-sm text-brand-gray-500">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" icon={LogOut} onClick={async () => { await signOut(); navigate('/') }}>
            Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto no-scrollbar bg-white dark:bg-brand-dark rounded-2xl p-1.5 shadow-card">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-brand-primary text-white shadow-mint' : 'text-brand-gray-500 hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="bg-white dark:bg-brand-dark rounded-2xl p-5 shadow-card text-sm text-brand-gray-500">Loading your orders...</div>
              ) : orders.length > 0 ? orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-brand-dark rounded-2xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-4 gap-3">
                    <div>
                      <p className="font-outfit font-semibold">{order.id}</p>
                      <p className="text-xs text-brand-gray-400">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                      <span className="font-outfit font-bold text-brand-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-sm text-brand-gray-500 dark:text-brand-gray-400">
                    <span>Payment: {paymentMethodLabels[order.payment_method] || order.payment_method || '—'}</span>
                    {order.status === 'pending' && (
                      <Button variant="ghost" onClick={() => handleCancelOrder(order.id)}>
                        Cancel Order
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(order.order_items || []).map((item, i) => (
                      <div key={`${order.id}-${i}`} className="flex justify-between text-sm text-brand-gray-600 dark:text-brand-gray-400">
                        <span>{item.product_name || 'Product'} x{item.quantity}</span>
                        <span>{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <EmptyState icon={Package} title="No orders yet" description="Start shopping and your orders will appear here!" />
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {wishlistLoading ? (
                <div className="md:col-span-2 xl:col-span-3 bg-white dark:bg-brand-dark rounded-2xl p-5 shadow-card text-sm text-brand-gray-500">Loading your wishlist...</div>
              ) : wishlistItems.length > 0 ? wishlistItems.map((entry) => {
                const product = entry.products
                const imageUrl = product?.images?.[0] || product?.image || '/stickers/placeholder.webp'

                return (
                  <div key={entry.id} className="bg-white dark:bg-brand-dark rounded-2xl overflow-hidden shadow-card">
                    <div className="aspect-square overflow-hidden bg-brand-gray-50 dark:bg-brand-gray-800">
                      <img src={imageUrl} alt={product?.name || 'Wishlist item'} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-brand-gray-400">{product?.categories?.name || 'Stickers'}</p>
                        <h3 className="font-outfit font-semibold text-brand-gray-800 dark:text-brand-gray-200">{product?.name || 'Product'}</h3>
                      </div>
                      <div className="font-outfit font-bold text-brand-primary">{formatPrice(product?.price)}</div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleAddWishlistProductToCart(product)}>
                          Add to Cart
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveWishlist(entry)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="md:col-span-2 xl:col-span-3">
                  <EmptyState icon={Heart} title="No wishlist items" description="Save your favorite stickers and they will appear here." />
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <EmptyState icon={Palette} title="No custom requests" description="Create your first custom sticker!"
              action={<Button onClick={() => navigate('/custom')}>Create Custom Sticker</Button>} />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card max-w-2xl space-y-5">
              <h2 className="font-outfit text-xl font-semibold">Profile Settings</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} />
                <Input label="Phone" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                <Input label="Address" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300">Governorate</label>
                  <select value={editForm.governorate} onChange={(e) => setEditForm({...editForm, governorate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm">
                    {['Cairo','Giza','Alexandria','Dakahlia','Red Sea','Beheira','Fayoum','Gharbia','Ismailia','Menofia','Minya','Qalyubia'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
