import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, ArrowUpRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { formatPrice } from '@/utils/helpers'

const chartData = [
  { name: 'Jan', revenue: 4200, orders: 45 },
  { name: 'Feb', revenue: 5800, orders: 62 },
  { name: 'Mar', revenue: 7100, orders: 78 },
  { name: 'Apr', revenue: 6300, orders: 70 },
  { name: 'May', revenue: 8900, orders: 95 },
  { name: 'Jun', revenue: 10200, orders: 112 },
]

const stats = [
  { label: 'Total Revenue', value: '42,500 EGP', change: '+12.5%', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
  { label: 'Orders Today', value: '23', change: '+8.2%', icon: ShoppingBag, color: 'from-blue-500 to-cyan-600' },
  { label: 'Products', value: '156', change: '+3', icon: Package, color: 'from-purple-500 to-violet-600' },
  { label: 'Customers', value: '1,240', change: '+18.7%', icon: Users, color: 'from-orange-500 to-amber-600' },
]

const recentOrders = [
  { id: 'ORD-1001', customer: 'Sarah M.', total: 190, status: 'processing', date: '2 min ago' },
  { id: 'ORD-1002', customer: 'Ahmed K.', total: 85, status: 'pending', date: '15 min ago' },
  { id: 'ORD-1003', customer: 'Nour A.', total: 320, status: 'shipped', date: '1 hour ago' },
  { id: 'ORD-1004', customer: 'Youssef H.', total: 55, status: 'delivered', date: '3 hours ago' },
]

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
}

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-outfit text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-400 text-sm">Welcome back! Here's what's happening.</p>
    </div>

    {/* Stats */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-[#141428] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <span className="flex items-center gap-1 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" /> {stat.change}
            </span>
          </div>
          <p className="text-2xl font-outfit font-bold">{stat.value}</p>
          <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-[#141428] rounded-2xl p-5 border border-white/5">
        <h3 className="font-outfit font-semibold mb-4">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4a" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Bar dataKey="revenue" fill="#2ECC71" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#141428] rounded-2xl p-5 border border-white/5">
        <h3 className="font-outfit font-semibold mb-4">Orders Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4a" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Line type="monotone" dataKey="orders" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: '#4ECDC4' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Recent Orders */}
    <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-outfit font-semibold">Recent Orders</h3>
        <a href="/admin/orders" className="text-xs text-brand-primary flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-gray-400 text-xs uppercase">
            <th className="text-left px-5 py-3">Order ID</th>
            <th className="text-left px-5 py-3">Customer</th>
            <th className="text-left px-5 py-3">Total</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Time</th>
          </tr></thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 font-medium">{order.id}</td>
                <td className="px-5 py-3">{order.customer}</td>
                <td className="px-5 py-3 font-medium">{formatPrice(order.total)}</td>
                <td className="px-5 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>{order.status}</span></td>
                <td className="px-5 py-3 text-gray-400">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

export default AdminDashboard
