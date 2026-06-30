import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, ArrowUpRight, Zap } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { adminAnalyticsService, adminOrdersService } from '@/services/adminService'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import { formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [statusCounts, setStatusCounts] = useState({ pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [dashStats, monthly, recent, topProducts, orderStats] = await Promise.all([
        adminAnalyticsService.getDashboardStats(),
        adminAnalyticsService.getMonthlyRevenue(6),
        adminAnalyticsService.getRecentOrders(5),
        adminAnalyticsService.getTopSellingProducts(5),
        adminOrdersService.getStats(),
      ])

      setStats(dashStats)
      setMonthlyData(monthly)
      setRecentOrders(recent)
      setTopProducts(topProducts)
      setStatusCounts(orderStats?.statusCounts || { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 })
    } catch (err) {
      console.error('Dashboard error:', err)
      setError(err.message)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Real-time sync for orders
  useRealtimeSync({
    table: 'orders',
    event: 'UPDATE',
    onUpdate: () => {
      fetchDashboardData()
    },
    showToast: false,
  })

  // Real-time sync for products
  useRealtimeSync({
    table: 'products',
    event: 'UPDATE',
    onUpdate: () => {
      fetchDashboardData()
    },
    showToast: false,
  })

  const statConfigs = [
    {
      label: 'Total Revenue',
      value: stats?.totalRevenue ? `${formatPrice(stats.totalRevenue)}` : '0 EGP',
      change: stats?.completionRate ? `${stats.completionRate}% delivered` : '0% delivered',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || '0',
      change: `${statusCounts.delivered || 0} delivered`,
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts || '0',
      change: `${topProducts.length || 0} top sellers`,
      icon: Package,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Total Customers',
      value: stats?.totalCustomers || '0',
      change: `${statusCounts.pending || 0} pending`,
      icon: Users,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-500/10',
    },
  ]

  const orderStatusColors = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    processing: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    shipped: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    delivered: { bg: 'bg-green-500/20', text: 'text-green-400' },
    cancelled: { bg: 'bg-red-500/20', text: 'text-red-400' },
  }

  const chartColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back! Here's your business overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfigs.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#141428] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</p>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#141428] rounded-2xl p-6 border border-white/5"
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Revenue
          </h3>
          {monthlyData.length > 0 ? (
            <div className="h-80 -mx-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="white/10" />
                  <XAxis dataKey="month" stroke="white/40" />
                  <YAxis stroke="white/40" />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid white/10' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">No data available</div>
          )}
        </motion.div>

        {/* Order Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141428] rounded-2xl p-6 border border-white/5"
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Order Status
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: statusCounts.pending, color: 'bg-yellow-500', width: stats?.totalOrders ? `${(statusCounts.pending / stats.totalOrders) * 100}%` : '0%' },
              { label: 'Processing', value: statusCounts.processing, color: 'bg-blue-500', width: stats?.totalOrders ? `${(statusCounts.processing / stats.totalOrders) * 100}%` : '0%' },
              { label: 'Shipped', value: statusCounts.shipped, color: 'bg-purple-500', width: stats?.totalOrders ? `${(statusCounts.shipped / stats.totalOrders) * 100}%` : '0%' },
              { label: 'Delivered', value: statusCounts.delivered, color: 'bg-green-500', width: stats?.totalOrders ? `${(statusCounts.delivered / stats.totalOrders) * 100}%` : '0%' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">{item.label}</span>
                  <span className={`font-semibold ${item.label === 'Delivered' ? 'text-green-400' : ''}`}>{item.value}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#141428] rounded-2xl p-6 border border-white/5"
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Recent Orders
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{order.full_name}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${orderStatusColors[order.status]?.bg} ${orderStatusColors[order.status]?.text}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#141428] rounded-2xl p-6 border border-white/5"
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top Selling Products
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div key={product.productId} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${chartColors[i]}, ${chartColors[(i + 1) % chartColors.length]})` }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.productName}</p>
                    <p className="text-xs text-gray-400">{product.quantity} sold</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No products sold yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
    