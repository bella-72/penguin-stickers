import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CouponHelper from '@/components/CouponHelper'
import { Toaster } from 'react-hot-toast'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light dark:bg-[#0f0f1a] transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      <Navbar />
      <motion.main
        className="flex-1 pt-16 md:pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <CouponHelper />
      <Footer />
    </div>
  )
}

export default MainLayout
