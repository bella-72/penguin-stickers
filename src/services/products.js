import { supabase } from '@/lib/supabase'

export const productsService = {
  async getAll({ category, search, sort, page = 1, limit = 12 } = {}) {
    let query = supabase.from('products').select('*, categories(name, slug)', { count: 'exact' })

    if (category) query = query.eq('categories.slug', category)
    if (search) query = query.ilike('name', `%${search}%`)

    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (sort === 'rating') query = query.order('rating', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { products: data, total: count }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_featured', true)
      .limit(8)
    if (error) throw error
    return data
  },

  async getNewArrivals() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(8)
    if (error) throw error
    return data
  },

  async getRelated(categoryId, excludeId) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('category_id', categoryId)
      .neq('id', excludeId)
      .limit(4)
    if (error) throw error
    return data
  },

  async create(product) {
    const { data, error } = await supabase.from('products').insert(product).select().single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  }
}
