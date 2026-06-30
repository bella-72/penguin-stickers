import { supabase } from '@/lib/supabase'

export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async create(category) {
    const { data, error } = await supabase.from('categories').insert(category).select().single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  }
}

export const reviewsService = {
  async getByProduct(productId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(review) {
    const { data, error } = await supabase.from('reviews').insert(review).select().single()
    if (error) throw error
    return data
  }
}

export const customStickersService = {
  async submit(request) {
    const { data, error } = await supabase.from('custom_stickers').insert(request).select().single()
    if (error) throw error
    return data
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from('custom_stickers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('custom_stickers')
      .select('*, users(full_name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('custom_stickers')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const wishlistService = {
  async get(userId) {
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*, categories(name))')
      .eq('user_id', userId)
    if (error) throw error
    return data
  },

  async add(userId, productId) {
    const { error } = await supabase.from('wishlist').insert({ user_id: userId, product_id: productId })
    if (error && error.code !== '23505') throw error
  },

  async remove(userId, productId) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
    if (error) throw error
  },

  async check(userId, productId) {
    const { data } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()
    return !!data
  }
}

export const storageService = {
  async uploadImage(bucket, file, path) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    })

    if (error) {
      console.error('Storage upload failed:', error)
      throw error
    }

    if (!data?.path) {
      throw new Error('Storage upload completed without a returned file path')
    }

    const { data: publicData, error: publicUrlError } = supabase.storage.from(bucket).getPublicUrl(data.path)

    if (publicUrlError) {
      console.error('Failed to get public URL:', publicUrlError)
      throw publicUrlError
    }

    if (!publicData?.publicUrl) {
      throw new Error('Storage upload completed but no public URL was returned')
    }

    return publicData.publicUrl
  }
}
