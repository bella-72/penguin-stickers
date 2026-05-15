import { create } from 'zustand'
import { authService } from '@/services/auth'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,

  initialize: async () => {
    try {
      const session = await authService.getSession()
      if (session?.user) {
        const profile = await authService.getUserProfile(session.user.id).catch(() => null)
        const isAdmin = profile?.role === 'admin'
        set({ user: session.user, profile, isAdmin, loading: false })
      } else {
        set({ user: null, profile: null, isAdmin: false, loading: false })
      }
    } catch {
      set({ loading: false })
    }
  },

  signIn: async (email, password) => {
    const { user } = await authService.signIn(email, password)
    const profile = await authService.getUserProfile(user.id).catch(() => null)
    const isAdmin = profile?.role === 'admin'
    set({ user, profile, isAdmin })
    return { user, profile, isAdmin }
  },

  signUp: async (email, password, fullName) => {
    const { user } = await authService.signUp(email, password, fullName)
    set({ user, profile: { full_name: fullName, role: 'customer' }, isAdmin: false })
    return user
  },

  signOut: async () => {
    await authService.signOut()
    set({ user: null, profile: null, isAdmin: false })
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return
    const profile = await authService.updateProfile(user.id, updates)
    set({ profile })
    return profile
  },
}))
