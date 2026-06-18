import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, ShoppingBag, Package } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { adminAnalyticsService } from '@/services/adminService'
import { formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

const AdminAnalytics = () => {
  const [monthlyData, setMonthlyData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const [monthly, topProd, dashStats] = await Promise.all([
        adminAnalyticsService.getMonthlyRevenue(6),
        adminAnalyticsService.getTopSellingProducts(5),
        adminAnalyticsService.getDashboardStats(),
      ])

      setMonthlyData(monthly)
      setTopProducts(topProd)
      setStats(dashStats)
    } catch (err) {
      console.error('Analytics error:', err)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const analyticsCards = [
    {
      label: 'Total Sales',
      value: stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '0 EGP',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Avg Order Value',
      value: stats?.totalOrders ? formatPrice(stats.totalRevenue / stats.totalOrders) : '0 EGP',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-600',
    },
    {
      label: 'Completion Rate',
      value: `${stats?.completionRate || 0}%`,
      icon: Package,
      color: 'from-orange-500 to-amber-600',
    },
  ]

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">View sales and performance metrics</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#141428] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-2">{card.label}</p>
                <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#141428] rounded-2xl p-6 border border-white/5"
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Revenue (Last 6 Months)
          </h3>
          {monthlyData.length > 0 ? (
            <div className="h-80 -mx-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141428] rounded-2xl p-6 border border-white/5"
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top Selling Products
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {topProducts.length > 0 ? (
              topProducts.map((product, i) => (
                <div key={product.productId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-mint flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.productName}</p>
                    <p className="text-xs text-gray-400">{product.quantity} sold</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No data available</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Revenue Breakdown Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#141428] rounded-2xl p-6 border border-white/5"
      >
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Revenue Comparison
        </h3>
        {monthlyData.length > 0 ? (
          <div className="h-80 -mx-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="white/10" />
                <XAxis dataKey="month" stroke="white/40" />
                <YAxis stroke="white/40" />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid white/10' }} />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400">No data available</div>
        )}
      </motion.div>
    </div>
  )
}


export default AdminAnalytics
