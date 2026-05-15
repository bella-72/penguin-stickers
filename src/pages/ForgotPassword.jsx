import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="font-outfit text-2xl font-bold mb-3">Check Your Email</h1>
            <p className="text-brand-gray-500 mb-6">We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login"><Button variant="secondary">Back to Login</Button></Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-brand-gray-500 hover:text-brand-primary mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
            <h1 className="font-outfit text-3xl font-bold text-brand-gray-900 dark:text-white mb-2">Forgot Password?</h1>
            <p className="text-brand-gray-500 mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email Address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" />
              <Button type="submit" className="w-full" size="lg" loading={loading}>Send Reset Link</Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default ForgotPassword
