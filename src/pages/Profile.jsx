import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Heart, Palette, Settings, LogOut, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { EmptyState, Badge } from '@/components/ui/Elements'
import { useAuthStore } from '@/store/authStore'
import { formatPrice, formatDate, getStatusColor, demoProducts } from '@/utils/helpers'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'custom', label: 'Custom Requests', icon: Palette },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const demoOrders = [
  { id: 'ORD-001', created_at: '2024-03-15', status: 'delivered', total: 190, order_items: [{ product_name: 'Holographic Penguin Pack', quantity: 2, price: 60 }, { product_name: 'Midnight Mint Tape', quantity: 1, price: 45 }] },
  { id: 'ORD-002', created_at: '2024-03-20', status: 'processing', total: 95, order_items: [{ product_name: 'Lunar Bloom', quantity: 1, price: 55 }, { product_name: 'Cafe Aesthetic', quantity: 1, price: 30 }] },
]

const Profile = () => {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders')
  const { user, profile, signOut, updateProfile } = useAuthStore()
  const navigate = useNavigate()
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    governorate: profile?.governorate || 'Cairo',
  })

  if (!user) { navigate('/login'); return null }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
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
              {demoOrders.length > 0 ? demoOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-brand-dark rounded-2xl p-5 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-outfit font-semibold">{order.id}</p>
                      <p className="text-xs text-brand-gray-400">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                      <span className="font-outfit font-bold text-brand-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.order_items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-brand-gray-600 dark:text-brand-gray-400">
                        <span>{item.product_name} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {demoProducts.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
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
