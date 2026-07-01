import { supabase } from '@/lib/supabase'
import { demoCategories, demoProducts, normalizeProductId } from '@/utils/helpers'

export const productsService = {
  async getAll({ category, search, sort, page = 1, limit = 12 } = {}) {
    let query = supabase.from('products').select('*, categories(name)', { count: 'exact' })

    if (category) query = query.eq('category_id', category)
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
  },

  async ensureDemoProduct(productId) {
    const normalizedProductId = normalizeProductId(productId)
    if (!normalizedProductId) return null

    const demoProduct = demoProducts.find((product) => product.id === normalizedProductId)
    if (!demoProduct) return null

    const { data: existingProduct, error: existingError } = await supabase
      .from('products')
      .select('id')
      .eq('id', normalizedProductId)
      .maybeSingle()

    if (existingError && existingError.code !== 'PGRST116') throw existingError
    if (existingProduct) return existingProduct

    const category = demoCategories.find((entry) => entry.id === demoProduct.category_id)
    if (category) {
      const { error: categoryError } = await supabase.from('categories').upsert(
        {
          id: category.id,
          name: category.name,
          slug: category.slug,
          image_url: category.image_url,
        },
        { onConflict: 'id' }
      )
      if (categoryError) throw categoryError
    }

    const { data, error } = await supabase
      .from('products')
      .upsert(
        {
          id: normalizedProductId,
          name: demoProduct.name,
          slug: demoProduct.slug,
          description: demoProduct.description,
          price: demoProduct.price,
          original_price: demoProduct.original_price,
          category_id: demoProduct.category_id,
          images: demoProduct.images || [],
          finish_types: demoProduct.finish_types || ['matte', 'glossy', 'holographic'],
          stock: demoProduct.stock ?? 0,
          rating: demoProduct.rating ?? 0,
          review_count: demoProduct.review_count ?? 0,
          is_featured: demoProduct.is_featured ?? false,
          is_new: demoProduct.is_new ?? false,
        },
        { onConflict: 'id' }
      )
      .select('id')
      .single()

    if (error) throw error
    return data
  }
}
