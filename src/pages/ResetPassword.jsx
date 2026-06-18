import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const ResetPassword = () => {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const { error } =
        await supabase.auth.updateUser({
          password
        })

      if (error) throw error

      toast.success('Password updated successfully')

      navigate('/login')

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6">
          Create New Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            type="password"
            label="New Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <Input
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            Update Password
          </Button>

        </form>
      </div>
    </div>
  )
}

export default ResetPassword