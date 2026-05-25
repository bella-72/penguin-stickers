import { supabase } from '@/lib/supabase'

export const authService = {
  async signUp(email, password, fullName) {

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) throw error

    return {
      user: data.user,
      session: data.session
    }
  },

  async signIn(email, password) {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      throw new Error(error.message)
    }

    return {
      user: data.user,
      session: data.session
    }
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

    const {
      data: { session }
    } = await supabase.auth.getSession()

    return session
  },

  async getUser() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    return user
  },

  async getUserProfile(userId) {

    const { data, error } =
      await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) return null

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