import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const Signup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signUp } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error(t('auth.fill_all_fields')); return }
    if (form.password !== form.confirmPassword) { toast.error(t('auth.password_mismatch')); return }
    if (form.password.length < 6) { toast.error(t('auth.password_min_length')); return }
    if (!agreed) { toast.error(t('auth.accept_terms')); return }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.name)
      toast.success(t('auth.signup_success'))
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-accent/20 via-mint-100 to-brand-light dark:from-brand-dark dark:to-brand-dark relative overflow-hidden items-center justify-center">
        <div className="relative z-10 text-center px-12">
          <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity }}
            className="mx-auto mb-8 flex items-center justify-center">
            <img src="/7665.png" alt="Penguin Stick" className="w-48 h-auto object-contain" />
          </motion.div>
          <h2 className="font-outfit text-4xl font-bold text-brand-primary mb-3">{t('home.collect_joy')}</h2>
          <p className="text-brand-gray-600 dark:text-brand-gray-400">{t('home.premium_stickers')}</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="font-outfit text-3xl font-bold text-brand-gray-900 dark:text-white mb-2">{t('auth.create_account')}</h1>
          <p className="text-brand-gray-500 mb-8">{t('auth.join_community')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t('auth.full_name')} icon={User} name="name" value={form.name} onChange={handleChange} placeholder={t('auth.enter_full_name')} />
            <Input label={t('auth.email')} icon={Mail} type="email" name="email" value={form.email} onChange={handleChange} placeholder={t('auth.email_placeholder')} />
            <div>
              <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder={t('auth.min_6_chars')}
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-brand-dark border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Input label={t('auth.confirm_password')} icon={Lock} type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder={t('auth.re_enter_password')} />

            <label className="flex items-start gap-2 text-sm text-brand-gray-600 dark:text-brand-gray-400 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary" />
              <span>{t('auth.agree_terms')} <a href="#" className="text-brand-primary">{t('auth.terms_of_service')}</a> {t('common.and')} <a href="#" className="text-brand-primary">{t('auth.privacy_policy')}</a></span>
            </label>

            <Button type="submit" className="w-full" size="lg" loading={loading}>{t('auth.create_account')}</Button>
          </form>

          <p className="text-center text-sm text-brand-gray-500 mt-8">
            {t('auth.have_account')} <Link to="/login" className="text-brand-primary font-medium hover:underline">{t('auth.signin')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
