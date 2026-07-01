import { create } from 'zustand'
import { authService } from '@/services/auth'
import { supabase } from '@/lib/supabase'

let authListenerInitialized = false

const syncAuthState = async (set, session) => {
  const user = session?.user ?? null

  if (!user) {
    set({ user: null, profile: null, isAdmin: false, loading: false, isAuthLoading: false })
    return
  }

  try {
    const profile = await authService.getUserProfile(user.id)
    const isAdmin = profile?.role === 'admin'
    set({ user, profile, isAdmin, loading: false, isAuthLoading: false })
  } catch {
    set({ user, profile: null, isAdmin: false, loading: false, isAuthLoading: false })
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  isAuthLoading: true,

  initialize: async () => {
    if (authListenerInitialized) {
      const session = await authService.getSession()
      await syncAuthState(set, session)
      return
    }

    authListenerInitialized = true

    try {
      const session = await authService.getSession()
      await syncAuthState(set, session)
    } catch {
      set({ user: null, profile: null, isAdmin: false, loading: false, isAuthLoading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncAuthState(set, session)
    })
  },

  signIn: async (email, password) => {
    try {
      const { user } = await authService.signIn(email, password)
      const profile = await authService.getUserProfile(user.id)
      const isAdmin = profile?.role === 'admin'

      set({
        user,
        profile,
        isAdmin,
        loading: false,
        isAuthLoading: false,
      })

      return {
        user,
        profile,
        isAdmin,
      }
    } catch (error) {
      console.error('STORE LOGIN ERROR:', error)
      throw error
    }
  },

  signUp: async (email, password, fullName) => {
    const { user } = await authService.signUp(email, password, fullName)
    const profile = await authService.getUserProfile(user?.id)
    const isAdmin = profile?.role === 'admin'
    set({ user, profile, isAdmin, loading: false, isAuthLoading: false })
    return user
  },

  signOut: async () => {
    await authService.signOut()
    set({ user: null, profile: null, isAdmin: false, loading: false, isAuthLoading: false })
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return
    const profile = await authService.updateProfile(user.id, updates)
    set({ profile })
    return profile
  },
}))
