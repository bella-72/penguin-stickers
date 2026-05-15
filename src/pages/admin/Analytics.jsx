import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const monthlyData = [
  { name: 'Jan', revenue: 4200, orders: 45, customers: 32 },
  { name: 'Feb', revenue: 5800, orders: 62, customers: 41 },
  { name: 'Mar', revenue: 7100, orders: 78, customers: 55 },
  { name: 'Apr', revenue: 6300, orders: 70, customers: 48 },
  { name: 'May', revenue: 8900, orders: 95, customers: 67 },
  { name: 'Jun', revenue: 10200, orders: 112, customers: 82 },
]

const categoryData = [
  { name: 'Animals', value: 35, color: '#2ECC71' },
  { name: 'Nature', value: 25, color: '#4ECDC4' },
  { name: 'Lifestyle', value: 20, color: '#3498DB' },
  { name: 'Fantasy', value: 12, color: '#9B59B6' },
  { name: 'Exclusive', value: 8, color: '#E67E22' },
]

const topProducts = [
  { name: 'Holographic Penguin Pack', sales: 203, revenue: 12180 },
  { name: 'Cafe Aesthetic', sales: 156, revenue: 4680 },
  { name: 'Pastel Galaxy', sales: 145, revenue: 7250 },
  { name: 'Artisan Penguin', sales: 124, revenue: 4340 },
  { name: 'Sakura Dreams', sales: 112, revenue: 4256 },
]

const tooltipStyle = { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }

const AdminAnalytics = () => (
  <div className="space-y-6">
    <div><h1 className="font-outfit text-2xl font-bold">Analytics</h1><p className="text-gray-400 text-sm">Performance insights and trends</p></div>

    <div className="grid lg:grid-cols-2 gap-4">
      {/* Revenue Chart */}
      <div className="bg-[#141428] rounded-2xl p-5 border border-white/5">
        <h3 className="font-outfit font-semibold mb-4">Monthly Revenue (EGP)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4a" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill="#2ECC71" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-[#141428] rounded-2xl p-5 border border-white/5">
        <h3 className="font-outfit font-semibold mb-4">Sales by Category</h3>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                <span className="text-gray-400">{cat.name}</span>
                <span className="ml-auto font-medium">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Growth */}
      <div className="bg-[#141428] rounded-2xl p-5 border border-white/5">
        <h3 className="font-outfit font-semibold mb-4">Customer Growth</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4a" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="customers" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: '#4ECDC4' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-[#141428] rounded-2xl p-5 border border-white/5">
        <h3 className="font-outfit font-semibold mb-4">Top Products</h3>
        <div className="space-y-3">
          {topProducts.map((product, i) => (
            <div key={product.name} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-brand-primary">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sales} sales</p>
              </div>
              <span className="text-sm font-medium text-brand-primary">{product.revenue.toLocaleString()} EGP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default AdminAnalytics
