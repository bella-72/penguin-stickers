import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Eye, Trash2, MoreVertical, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { adminOrdersService } from '@/services/adminService'
import { formatPrice } from '@/utils/helpers'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const limit = 10

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const data = await adminOrdersService.getAll({
        status: statusFilter,
        page,
        limit,
        search,
      })
      setOrders(data.orders || [])
      setTotal(data.total || 0)

      const { data: freshOrders, error } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })

      console.log('Admin fetched orders:', freshOrders, error)

      if (!error) {
        setOrders(freshOrders || [])
      }

      if (selectedOrder && !data.orders?.some((order) => order.id === selectedOrder.id)) {
        setSelectedOrder(null)
        setShowModal(false)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, selectedOrder, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useAutoRefresh(fetchOrders, 5000)

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return

    try {
      if (newStatus === 'cancelled') {
        await adminOrdersService.updateStatus(selectedOrder.id, 'cancelled')
        toast.success('Order cancelled successfully')
      } else {
        await adminOrdersService.updateStatus(selectedOrder.id, newStatus)
        toast.success('Order status updated!')
      }

      setShowModal(false)
      setSelectedOrder(null)
      fetchOrders()
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update order status')
    }
  }

  const handleViewOrder = async (orderId) => {
    try {
      const order = await adminOrdersService.getById(orderId)
      console.log(order.payment_proof_url)
      console.log('resolved payment proof url:', getPaymentProofUrl(order))
      setSelectedOrder(order)
      setNewStatus(order.status)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching order details:', err)
      toast.error('Failed to load order details')
    }
  }

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  }

  const paymentMethodLabels = {
    cod: 'Cash on Delivery',
    vodafone: 'Vodafone Cash',
    instapay: 'InstaPay',
  }

  const getPaymentProofUrl = (order) => {
    const candidates = [
      order?.payment_proof_url,
      order?.payment_screenshot,
      order?.screenshot_url,
      order?.payment_image,
      order?.payment_proof,
      order?.payment_proofUrl,
      order?.paymentProofUrl,
    ]

    return candidates.find((value) => typeof value === 'string' && value.trim()) || null
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-gray-400 text-sm mt-1">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden md:table-cell">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden md:table-cell">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => {
                  const customerName = order.users?.full_name || order.full_name
                  const customerEmail = order.users?.email || ''
                  const customerPhone = order.users?.phone || order.phone

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-left hover:text-blue-300 transition-colors"
                        >
                          <p className="font-medium text-sm">{customerName}</p>
                          <p className="text-xs text-gray-400">{customerPhone}</p>
                        </button>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-300">
                        {customerEmail || '—'}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-300">
                        {paymentMethodLabels[order.payment_method] || order.payment_method || '—'}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="font-semibold">{formatPrice(order.total)}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/5">
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors text-sm"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141428] rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Customer Name</p>
                <p className="font-semibold">{selectedOrder.users?.full_name || selectedOrder.full_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-semibold">{selectedOrder.users?.email || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="font-semibold">{selectedOrder.users?.phone || selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Payment Method</p>
                <p className="font-semibold">{paymentMethodLabels[selectedOrder.payment_method] || selectedOrder.payment_method || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Shipping Address</p>
                <p className="font-semibold text-sm">{selectedOrder.address}, {selectedOrder.governorate}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="font-semibold text-lg text-green-400">{formatPrice(selectedOrder.total)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className={`font-semibold px-3 py-1 rounded inline-block ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Notes</p>
                <p className="font-semibold text-sm">{selectedOrder.notes || '—'}</p>
              </div>
            </div>

            {/* Products Ordered */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Products Ordered</h3>
              <div className="space-y-3 bg-white/5 rounded-lg p-4">
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                    <img
                      src={item.product_image || item.products?.image || 'https://ui-avatars.com/api/?name=Product&size=80'}
                      alt={item.product_name}
                      className="w-14 h-14 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=Product&size=80'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatPrice(item.price)}</p>
                      <p className="text-xs text-gray-400">{formatPrice(Number(item.price) * Number(item.quantity))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(selectedOrder.payment_method === 'vodafone' || selectedOrder.payment_method === 'instapay') && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Payment Proof</h3>
                <div className="rounded-lg bg-white/5 p-4">
                  {(() => {
                    const proof = getPaymentProofUrl(selectedOrder)
                    return proof ? (
                      <a href={proof} target="_blank" rel="noreferrer">
                        <img src={proof} alt="Payment proof" className="max-h-64 rounded-lg object-contain cursor-pointer" />
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">No payment proof uploaded yet.</p>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Status Update */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleStatusChange}
                className="flex-1 px-4 py-2 bg-gradient-mint text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Update Status
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
