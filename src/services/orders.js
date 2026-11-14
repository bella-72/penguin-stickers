import { supabase } from '@/lib/supabase'

export const ordersService = {
  async cancelOrder(orderId, userId = null) {
    if (!orderId) {
      throw new Error('Missing order id')
    }

    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId)

    if (itemsError) throw itemsError

    let orderQuery = supabase.from('orders').delete().eq('id', orderId)

    if (userId) {
      orderQuery = orderQuery.eq('user_id', userId)
    }

    const { error: orderError } = await orderQuery

    if (orderError) throw orderError

    return { deleted: true }
  },


  async create(orderData) {
    const { data, error } = await supabase.rpc('create_order_with_items', {
      p_order: orderData,
    })

    if (error) throw error
    return data
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), users(full_name, phone)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getStats() {
    const { data: orders } = await supabase.from('orders').select('total, status, created_at')
    const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0
    const totalOrders = orders?.length || 0
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0

    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders?.filter(o => o.created_at?.startsWith(today)).length || 0

    return { totalRevenue, totalOrders, pendingOrders, todayOrders }
  }
}
