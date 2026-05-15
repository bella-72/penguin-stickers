import { supabase } from '@/lib/supabase'

export const ordersService = {
  async create(orderData) {
    const { items, ...order } = orderData

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map(item => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      price: item.price,
      finish_type: item.finish_type
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    return newOrder
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
