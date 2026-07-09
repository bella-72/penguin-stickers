import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AdminRoute from '@/components/AdminRoute'
import DiscountCodes from './pages/admin/DiscountCodes'
// Lazy load pages for performance
const Home = lazy(() => import('@/pages/Home'))
const Shop = lazy(() => import('@/pages/Shop'))
const CustomSticker = lazy(() => import('@/pages/CustomSticker'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword'))
const Profile = lazy(() => import('@/pages/Profile'))
const About = lazy(() => import('@/pages/About'))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminOrders = lazy(() => import('@/pages/admin/Orders'))
const AdminProducts = lazy(() => import('@/pages/admin/Products'))
const AdminCustomers = lazy(() => import('@/pages/admin/Customers'))
const AdminCategories = lazy(() => import('@/pages/admin/Categories'))
const AdminCustomRequests = lazy(() => import('@/pages/admin/CustomRequests'))
const AdminAnalytics = lazy(() => import('@/pages/admin/Analytics'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-light dark:bg-[#0f0f1a]">
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-mint flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
          <ellipse cx="12" cy="12" rx="5" ry="7" fill="white"/>
          <circle cx="10" cy="10" r="1" fill="#1a1a2e"/>
          <circle cx="14" cy="10" r="1" fill="#1a1a2e"/>
          <polygon points="12,12 11,13.5 13,13.5" fill="#F39C12"/>
        </svg>
      </div>
      <p className="text-sm text-brand-gray-400 animate-pulse">
        Loading...
      </p>
    </div>
  </div>
)

function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          success: {
            duration: 2500,
          },
          error: {
            duration: 3500,
          },
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Main pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/custom" element={<CustomSticker />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Admin pages */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="custom-requests" element={<AdminCustomRequests />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route
  path="discount-codes"
  element={<DiscountCodes />}
/>
          </Route>

        </Routes>
      </Suspense>
    </Router>
  )
}

export default App