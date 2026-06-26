import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, User, Menu, X, Moon, Sun, Heart, LogOut, LayoutDashboard } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const itemCount = useCartStore((s) => s.getItemCount())
  const { user, isAdmin, signOut } = useAuthStore()
  const { darkMode, toggleDarkMode, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()

  const navLinks = [
    { name: 'Shop All', path: '/shop' },
    { name: 'Custom Sticker', path: '/custom' },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'About Us', path: '/about' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    closeMobileMenu()
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-brand-dark/80 backdrop-blur-xl shadow-glass border-b border-brand-gray-100/50 dark:border-brand-gray-800/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-gradient-mint flex items-center justify-center shadow-mint group-hover:shadow-mint-lg transition-shadow overflow-hidden">
                <img src="/7665.png" alt="Penguin Stick Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="font-outfit font-bold text-xl text-brand-primary">
                Penguin Stick
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    location.pathname === link.path
                      ? 'text-brand-primary'
                      : 'text-brand-gray-600 dark:text-brand-gray-300 hover:text-brand-primary'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-primary rounded-full transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-brand-gray-100 dark:hover:bg-brand-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-brand-gray-500" />}
              </button>

              <Link
                to="/cart"
                className="relative p-2 rounded-xl hover:bg-brand-gray-100 dark:hover:bg-brand-gray-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-brand-gray-600 dark:text-brand-gray-300" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => user ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
                  className="p-2 rounded-xl hover:bg-brand-gray-100 dark:hover:bg-brand-gray-800 transition-colors"
                >
                  <User className="w-5 h-5 text-brand-gray-600 dark:text-brand-gray-300" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-brand-dark rounded-2xl shadow-glass-lg border border-brand-gray-100 dark:border-brand-gray-700 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-brand-gray-100 dark:border-brand-gray-700">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <p className="text-xs text-brand-gray-500">
                          {isAdmin ? 'Administrator' : 'Customer'}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800 transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <Link to="/profile?tab=wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800 transition-colors">
                          <Heart className="w-4 h-4" /> Wishlist
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-primary hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-xl hover:bg-brand-gray-100 dark:hover:bg-brand-gray-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-40 bg-white dark:bg-brand-dark pt-20 px-6 md:hidden"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-brand-gray-700 dark:text-brand-gray-300 hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-base font-medium bg-gradient-mint text-white text-center mt-4"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
