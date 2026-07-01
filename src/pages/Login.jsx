import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const { isAdmin } = await signIn(email, password)
      toast.success('Login successful')
      navigate(isAdmin ? '/admin' : '/')
    } catch (err) {
      console.error('LOGIN ERROR:', err)

      const message = err?.message || err?.error_description || String(err)
      const normalized = message.toLowerCase()

      if (normalized.includes('invalid login credentials')) {
        toast.error('Invalid email or password')
      } else if (normalized.includes('email not confirmed')) {
        toast.error('Email not confirmed yet')
      } else if (normalized.includes('user not found')) {
        toast.error('No account found with this email')
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mint-200 via-mint-100 to-brand-light dark:from-mint-900 dark:via-brand-dark dark:to-brand-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-20 w-24 h-24 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm shadow-lg flex items-center justify-center rotate-12">
            <span className="text-4xl">💖</span>
          </motion.div>
          <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            className="absolute bottom-32 right-20 w-20 h-20 rounded-full bg-white/20 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl">🐧</span>
          </motion.div>
          <motion.div animate={{ y: [-5, 15, -5] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/2 right-1/3 w-16 h-16 rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center -rotate-12">
            <span className="text-2xl">✨</span>
          </motion.div>
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="mx-auto mb-8 flex items-center justify-center">
            <img src="/7665.png" alt="Penguin Stick" className="w-48 h-auto object-contain" />
          </div>
          <h2 className="font-outfit text-3xl font-bold text-brand-primary mb-3">Collect Joy</h2>
          <p className="text-brand-gray-600 dark:text-brand-gray-400">Premium stickers for everyone</p>
          <p className="font-outfit font-bold text-brand-primary mt-8 text-lg">Penguin Stick</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="font-outfit text-3xl font-bold text-brand-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-brand-gray-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-brand-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-brand-gray-600 dark:text-brand-gray-400 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary" />
              Stay logged in
            </label>

            <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>

            {/* Debug: Test toast notification */}
            <button
              type="button"
              onClick={() => toast.success('Test notification')}
              className="w-full py-2 text-xs text-brand-gray-400 hover:text-brand-gray-600 dark:hover:text-brand-gray-300 transition-colors"
            >
              Test Toast
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-gray-200 dark:border-brand-gray-700" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-light dark:bg-[#0f0f1a] px-4 text-brand-gray-400">Or continue with</span></div>
          </div>

          <div className="flex justify-center">
            <button
  onClick={async () => {
    try {
      await authService.signInWithGoogle()
    } catch (err) {
      toast.error(err.message)
    }
  }}
  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800 transition-colors text-sm font-medium"
>
  
  Google
</button>
          </div>

          <p className="text-center text-sm text-brand-gray-500 mt-8">
            {t('auth.no_account')} <Link to="/signup" className="text-brand-primary font-medium hover:underline">{t('auth.sign_up_free')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
