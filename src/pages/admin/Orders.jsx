import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, ChevronDown } from 'lucide-react'
import { formatPrice, formatDate } from '@/utils/helpers'

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

const demoOrders = [
  { id: 'ORD-1001', customer: 'Sarah M.', email: 'sarah@email.com', total: 190, status: 'processing', items: 3, created_at: '2024-03-15', payment: 'cod' },
  { id: 'ORD-1002', customer: 'Ahmed K.', email: 'ahmed@email.com', total: 85, status: 'pending', items: 1, created_at: '2024-03-14', payment: 'vodafone' },
  { id: 'ORD-1003', customer: 'Nour A.', email: 'nour@email.com', total: 320, status: 'shipped', items: 5, created_at: '2024-03-13', payment: 'instapay' },
  { id: 'ORD-1004', customer: 'Youssef H.', email: 'youssef@email.com', total: 55, status: 'delivered', items: 1, created_at: '2024-03-12', payment: 'cod' },
  { id: 'ORD-1005', customer: 'Mona R.', email: 'mona@email.com', total: 410, status: 'pending', items: 7, created_at: '2024-03-11', payment: 'vodafone' },
]

const AdminOrders = () => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = demoOrders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div><h1 className="font-outfit text-2xl font-bold">Orders</h1><p className="text-gray-400 text-sm">Manage and track all orders</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#141428] border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#141428] border border-white/5 rounded-xl text-sm text-white">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 text-xs uppercase border-b border-white/5">
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Items</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Payment</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Date</th>
            </tr></thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-brand-primary">{order.id}</td>
                  <td className="px-5 py-3">
                    <div><p className="font-medium">{order.customer}</p><p className="text-xs text-gray-500">{order.email}</p></div>
                  </td>
                  <td className="px-5 py-3">{order.items}</td>
                  <td className="px-5 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3 capitalize text-gray-400">{order.payment}</td>
                  <td className="px-5 py-3">
                    <select defaultValue={order.status}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize bg-transparent border border-white/10 cursor-pointer ${statusColors[order.status]}`}>
                      {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s} className="bg-[#141428] text-white">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No orders found</p>}
      </div>
    </div>
  )
}

export default AdminOrders
