import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Package, ShoppingBag, FolderTree, Palette, 
  BarChart3, LogOut, ChevronLeft, Menu, X, Users 
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Toaster } from 'react-hot-toast'

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Custom Requests', path: '/admin/custom-requests', icon: Palette },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white flex">
      <Toaster position="top-right" />

      {/* Sidebar - Desktop */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 72 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-[#141428] border-r border-white/5"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-mint flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <ellipse cx="12" cy="12" rx="5" ry="7" fill="white"/>
                <circle cx="10" cy="10" r="1" fill="#1a1a2e"/>
                <circle cx="14" cy="10" r="1" fill="#1a1a2e"/>
                <polygon points="12,12 11,13.5 13,13.5" fill="#F39C12"/>
              </svg>
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-outfit font-bold text-lg"
              >
                Admin
              </motion.span>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-primary/15 text-brand-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{link.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/5 space-y-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="relative w-64 bg-[#141428] h-full flex flex-col"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
              <span className="font-outfit font-bold">Admin Panel</span>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-2 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    location.pathname === link.path
                      ? 'bg-brand-primary/15 text-brand-primary'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{link.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-[#141428] border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <Link to="/" className="text-xs text-gray-400 hover:text-brand-primary transition-colors">
              ← Back to Store
            </Link>
            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
