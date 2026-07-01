import { supabase } from '@/lib/supabase'

const normalizeError = (error) => {
  if (!error) return new Error('Authentication failed')

  if (typeof error === 'string') return new Error(error)
  if (error.message) return error

  return new Error('Authentication failed')
}

const ensureUserProfile = async (user, fullName = null) => {
  if (!user?.id) return null

  const { data: existingProfile, error: fetchError } = await supabase
    .from('users')
    .select('id, full_name, role')
    .eq('id', user.id)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Profile lookup failed:', fetchError)
    return null
  }

  if (existingProfile) {
    return existingProfile
  }

  const profilePayload = {
    id: user.id,
    full_name: fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    role: 'customer',
  }

  const { data, error } = await supabase.from('users').insert(profilePayload).select().single()

  if (error) {
    console.error('Profile creation failed:', error)
    return null
  }

  return data
}

export const authService = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw normalizeError(error)

    if (data.user) {
      await ensureUserProfile(data.user, fullName)
    }

    return {
      user: data.user,
      session: data.session,
    }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw normalizeError(error)

    if (data.user) {
      await ensureUserProfile(data.user)
    }

    return {
      user: data.user,
      session: data.session,
    }
  },

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) throw normalizeError(error)
  },
  async signOut() {

    const { error } =
      await supabase.auth.signOut()

    if (error) throw error
  },

  async resetPassword(email) {

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            'https://penguin-stickers.vercel.app/reset-password'
        }
      )

    if (error) throw error
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw normalizeError(error)
    return session
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw normalizeError(error)
    return user
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('getUserProfile failed:', error)
      return null
    }

    return data
  },

  async updateProfile(userId, updates) {

    const { data, error } =
      await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error

    return data
  },

  async isAdmin(userId) {

    const { data } =
      await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    return data?.role === 'admin'
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
  
}