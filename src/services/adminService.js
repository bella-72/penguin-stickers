import { supabase } from '@/lib/supabase'
import { ordersService } from '@/services/orders'

/**
 * Admin Orders Service
 * Handles all admin order operations with real-time capabilities
 */
const paymentProofColumnCandidates = [
  'payment_proof_url',
  'payment_screenshot',
  'screenshot_url',
  'payment_image',
  'payment_proof',
  'payment_proofUrl',
  'paymentProofUrl',
]

export const adminOrdersService = {
  async getAll({ status, page = 1, limit = 10, search = '' } = {}) {
    const baseSelect = `
      id,
      user_id,
      full_name,
      phone,
      address,
      governorate,
      total,
      status,
      created_at,
      payment_method,
      payment_proof_url,
      notes,
      users!user_id(full_name, phone, address, governorate)
    `

    let query = supabase
      .from('orders')
      .select(baseSelect, { count: 'exact' })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (!error) {
      return { orders: data || [], total: count || 0 }
    }

    console.log(error.message)
    console.log(error.details)
    console.log(error.hint)

    const fallbackQuery = supabase
      .from('orders')
      .select('id, user_id, full_name, phone, address, governorate, total, status, created_at, payment_method, payment_proof_url, notes', { count: 'exact' })

    if (status && status !== 'all') {
      fallbackQuery.eq('status', status)
    }

    if (search) {
      fallbackQuery.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    const { data: fallbackData, error: fallbackError, count: fallbackCount } = await fallbackQuery
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, (page - 1) * limit + limit - 1)

    if (fallbackError) {
      console.log(fallbackError.message)
      console.log(fallbackError.details)
      console.log(fallbackError.hint)
      return { orders: [], total: 0 }
    }

    return { orders: fallbackData || [], total: fallbackCount || 0 }
  },

  async getById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        user_id,
        full_name,
        phone,
        address,
        governorate,
        total,
        status,
        created_at,
        payment_method,
        payment_proof_url,
        notes,
        users!user_id(full_name, phone, address, governorate),
        order_items(
          id,
          product_id,
          product_name,
          product_image,
          quantity,
          price,
          finish_type
        )
        `
      )
      .eq('id', orderId)
      .single()

    if (!error) {
      return data
    }

    console.log(error.message)
    console.log(error.details)
    console.log(error.hint)

    const [{ data: orderData, error: orderError }, { data: orderItemsData, error: orderItemsError }] = await Promise.all([
      supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single(),
      supabase
        .from('order_items')
        .select('id, product_id, product_name, product_image, quantity, price, finish_type')
        .eq('order_id', orderId)
    ])

    if (orderError || orderItemsError) {
      console.log(orderError?.message)
      console.log(orderError?.details)
      console.log(orderError?.hint)
      console.log(orderItemsError?.message)
      console.log(orderItemsError?.details)
      console.log(orderItemsError?.hint)
      return null
    }

    return {
      ...orderData,
      order_items: orderItemsData || [],
      users: null,
    }
  },

  async updateStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteOrder(orderId) {
    return ordersService.deleteOrder(orderId)
  },

  async getStats() {
    // Total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })

    // Order by status
    const { data: statusData } = await supabase
      .from('orders')
      .select('status')

    const statusCounts = {
      pending: statusData?.filter(o => o.status === 'pending').length || 0,
      processing: statusData?.filter(o => o.status === 'processing').length || 0,
      shipped: statusData?.filter(o => o.status === 'shipped').length || 0,
      delivered: statusData?.filter(o => o.status === 'delivered').length || 0,
      cancelled: statusData?.filter(o => o.status === 'cancelled').length || 0,
    }

    // Total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total')
      .neq('status', 'cancelled')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0

    return {
      totalOrders,
      statusCounts,
      totalRevenue,
    }
  },

  subscribeToChanges(callback) {
    const subscription = supabase
      .channel('admin-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        callback(payload)
      })
      .subscribe()

    return subscription
  },
}

/**
 * Admin Products Service
 * Handles all admin product operations with real-time capabilities
 */
export const adminProductsService = {
  async getAll({ category, page = 1, limit = 10, search = '' } = {}) {
    let query = supabase
      .from('products')
      .select('*, categories(name, slug)', { count: 'exact' })

    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { products: data, total: count }
  },

  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(productId, updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateStock(productId, quantity) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock: quantity, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async toggleFeatured(productId, isFeatured) {
    return this.update(productId, { is_featured: isFeatured })
  },

  async toggleNew(productId, isNew) {
    return this.update(productId, { is_new: isNew })
  },

  async delete(productId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    if (error) throw error
  },

  async getStats() {
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact' })

    const { data: stockData } = await supabase
      .from('products')
      .select('stock')

    const lowStock = stockData?.filter(p => p.stock < 10).length || 0
    const totalStock = stockData?.reduce((sum, p) => sum + p.stock, 0) || 0

    return {
      totalProducts,
      lowStock,
      totalStock,
    }
  },

  subscribeToChanges(callback) {
    const subscription = supabase
      .channel('admin-products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        callback(payload)
      })
      .subscribe()

    return subscription
  },
}

/**
 * Admin Customers Service
 * Handles customer data access for admins
 */
export const adminCustomersService = {
  async getAll({ page = 1, limit = 10, search = '' } = {}) {
    let query = supabase
      .from('users')
      .select('id, full_name, email, phone, address, governorate, created_at, role', { count: 'exact' })
      .eq('role', 'customer')

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { customers: data, total: count }
  },

  async getById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select(
        `
        *,
        orders(
          id,
          total,
          status,
          created_at
        )
        `
      )
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  async getStats() {
    const { count: totalCustomers } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'customer')

    const { data: orderData } = await supabase
      .from('orders')
      .select('user_id')

    const uniqueCustomersWithOrders = new Set(orderData?.map(o => o.user_id) || []).size

    return {
      totalCustomers,
      customersWithOrders: uniqueCustomersWithOrders,
    }
  },
}

/**
 * Admin Analytics Service
 * Handles analytics data for dashboard
 */
export const adminAnalyticsService = {
  async getMonthlyRevenue(months = 6) {
    const { data: orders } = await supabase
      .from('orders')
      .select('total, created_at')
      .neq('status', 'cancelled')

    // Group by month
    const monthlyData = {}
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
      monthlyData[monthKey] = 0
    }

    orders?.forEach(order => {
      const date = new Date(order.created_at)
      const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' })
      if (monthKey in monthlyData) {
        monthlyData[monthKey] += parseFloat(order.total)
      }
    })

    return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }))
  },

  async getTopSellingProducts(limit = 5) {
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity')

    // Group by product
    const productSales = {}
    orderItems?.forEach(item => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          productId: item.product_id,
          productName: item.product_name,
          quantity: 0,
        }
      }
      productSales[item.product_id].quantity += item.quantity
    })

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit)
  },

  async getRecentOrders(limit = 5) {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        full_name,
        total,
        status,
        created_at
        `
      )
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },

  async getDashboardStats() {
    // Parallel requests for better performance
    const [
      { count: totalOrders },
      { data: deliveredOrders },
      { data: products },
      { count: totalCustomers },
      { data: revenueData },
    ] = await Promise.all([
      supabase
        .from('orders')
        .select('*', { count: 'exact' }),
      supabase
        .from('orders')
        .select('total')
        .eq('status', 'delivered'),
      supabase
        .from('products')
        .select('stock'),
      supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('role', 'customer'),
      supabase
        .from('orders')
        .select('total')
        .neq('status', 'cancelled'),
    ])

    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0
    const deliveredRevenue = deliveredOrders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0

    return {
      totalOrders,
      totalRevenue,
      totalProducts: products?.length || 0,
      totalCustomers,
      deliveredRevenue,
      completionRate: totalOrders ? ((deliveredOrders?.length || 0) / totalOrders * 100).toFixed(1) : 0,
    }
  },
}

/**
 * Admin Custom Stickers Service
 * Handles custom sticker request management
 */
export const adminCustomStickersService = {
  async getAll({ status, page = 1, limit = 10 } = {}) {
    let query = supabase
      .from('custom_stickers')
      .select(
        `
        *,
        users(full_name, email, phone)
        `,
        { count: 'exact' }
      )

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { requests: data, total: count }
  },

  async updateStatus(requestId, status, adminNotes = null) {
    const { data, error } = await supabase
      .from('custom_stickers')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async addNotes(requestId, notes) {
    const { data, error } = await supabase
      .from('custom_stickers')
      .update({
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
