import { supabase } from '@/lib/supabase'
import { normalizeProductId } from '@/utils/helpers'
import { productsService } from '@/services/products'

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
      .select('id, product_id, products(id, name, price, images, image, category_id, categories(name))')
      .eq('user_id', userId)
      .order('id', { ascending: false })

    if (error) throw error
    return data || []
  },


  async add(userId, productId) {
    const normalizedProductId = normalizeProductId(productId)
    if (!userId || !normalizedProductId) return null

    await productsService.ensureDemoProduct(normalizedProductId)

    const existing = await this.check(userId, normalizedProductId)
    if (existing) return { alreadyExists: true }

    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: userId,
        product_id: normalizedProductId
      })
      .select()

    if (error) throw error

    return data
  },


  async remove(userId, productId) {
    const normalizedProductId = normalizeProductId(productId)
    if (!userId || !normalizedProductId) return

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', normalizedProductId)

    if (error) throw error
  },


  async check(userId, productId) {
    const normalizedProductId = normalizeProductId(productId)
    if (!userId || !normalizedProductId) return false

    const { data, error } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', normalizedProductId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return !!data
  }

}



export const storageService = {

  async uploadImage(bucket, file, path) {

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
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


    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)


    if (!publicData?.publicUrl) {
      throw new Error('Storage upload completed but no public URL was returned')
    }


    return publicData.publicUrl
  }

}