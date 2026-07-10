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
    const { items, ...order } = orderData
    const proofUrl = order.payment_proof_url ?? order.payment_proofUrl ?? order.payment_screenshot ?? order.screenshot_url ?? order.payment_image ?? order.payment_proof ?? null
    const normalizedPaymentMethod = order.payment_method === 'vodafone' || order.payment_method === 'instapay' || order.payment_method === 'cod'
      ? order.payment_method
      : order.payment_method === 'cash'
        ? 'cod'
        : 'cod'

    const orderInsert = {
      user_id: order.user_id ?? null,
      full_name: order.full_name,
      phone: order.phone,
      address: order.address,
      governorate: order.governorate,
      notes: order.notes || null,
      payment_method: normalizedPaymentMethod,
      payment_proof_url: proofUrl,
      subtotal: Number(order.subtotal || 0),
      shipping: Number(order.shipping || 0),
      discount: Number(order.discount_amount || 0),
      total: Number(order.total || 0),
      status: order.status || 'pending',
    }

    console.log('Creating order payload:', orderInsert)
    console.log('Final order payload before insert:', orderInsert)
    console.log('Payment proof URL in insert payload:', proofUrl)

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select('id, user_id, full_name, phone, address, governorate, total, status, payment_method, payment_proof_url')
      .single()

    console.log('Order insert result:', { newOrder, error: orderError })

    if (orderError) throw orderError

    console.log('cartItems', items)

    const isValidUuid = (value) => {
      if (typeof value !== 'string') return false
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    }

    const orderItems = items.map((item) => {
      const rawProductId = item.product_id || item.productId || item.id || null
      const productId = isValidUuid(rawProductId) ? rawProductId : null

      if (rawProductId && !productId) {
        console.warn('Ignoring non-UUID product id for order_items insert', {
          rawProductId,
          itemName: item.product_name || item.name,
        })
      }

      return {
        order_id: newOrder.id,
        product_id: productId,
        product_name: item.product_name || item.name,
        product_image: item.product_image || item.image || null,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        finish_type: item.finish_type || 'matte',
      }
    })

    console.log('Final order items payload before insert:', orderItems)

    const { data: insertedItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    console.log('Order items insert result:', { insertedItems, error: itemsError })

    if (itemsError) {
      console.error('Order items insert failed:', { itemsError, orderItems })
      throw itemsError
    }

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
