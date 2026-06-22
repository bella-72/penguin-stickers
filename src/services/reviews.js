import { supabase } from '@/lib/supabase'

export const reviewsService = {
  // Fetch all reviews
  async getReviews(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, user_id, user_name')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
  },

  // Create a new review
  async createReview(userName, rating, comment) {
    try {
      if (!userName) {
        throw new Error('Please provide a name')
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_name: userName.trim(),
          rating: Math.min(5, Math.max(1, parseInt(rating))),
          comment: comment.trim(),
          created_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return { success: true, data: data?.[0] }
    } catch (error) {
      console.error('Error creating review:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user's existing review if any
  async getUserReview(userName) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_name', userName)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    } catch (error) {
      console.error('Error fetching user review:', error)
      return null
    }
  },

  // Update existing review
  async updateReview(reviewId, rating, comment) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating: Math.min(5, Math.max(1, parseInt(rating))),
          comment: comment.trim()
        })
        .eq('id', reviewId)
        .select()

      if (error) throw error
      return { success: true, data: data?.[0] }
    } catch (error) {
      console.error('Error updating review:', error)
      return { success: false, error: error.message }
    }
  }
}
