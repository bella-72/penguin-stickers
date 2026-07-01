import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * AdminRoute Component
 * 
 * Protects admin routes by checking user role.
 * Only users with role = 'admin' can access admin pages.
 * Non-admin users are redirected to home page.
 * 
 * Usage: Wrap admin layout/routes with this component
 */
export const AdminRoute = ({ children }) => {
  const navigate = useNavigate()
  const { user, profile, isAdmin, loading, isAuthLoading } = useAuthStore()

  useEffect(() => {
    if (isAuthLoading || loading) return

    // Redirect if not authenticated or not admin
    if (!user || !isAdmin) {
      navigate('/', { replace: true })
    }
  }, [user, isAdmin, loading, navigate])

  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-mint flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
              <ellipse cx="12" cy="12" rx="5" ry="7" fill="white"/>
              <circle cx="10" cy="10" r="1" fill="#1a1a2e"/>
              <circle cx="14" cy="10" r="1" fill="#1a1a2e"/>
              <polygon points="12,12 11,13.5 13,13.5" fill="#F39C12"/>
            </svg>
          </div>
          <p className="text-sm text-white/60 animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return children
}

export default AdminRoute
