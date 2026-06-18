import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Mail, MapPin, Phone, Eye } from 'lucide-react'
import { adminCustomersService } from '@/services/adminService'
import { formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const limit = 10

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await adminCustomersService.getAll({
        page,
        limit,
        search,
      })
      setCustomers(data.customers)
      setTotal(data.total)
    } catch (err) {
      console.error('Error fetching customers:', err)
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    fetchCustomers()
  }, [page, search])

  const handleViewCustomer = async (customerId) => {
    try {
      const customer = await adminCustomersService.getById(customerId)
      setSelectedCustomer(customer)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching customer:', err)
      toast.error('Failed to load customer details')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Customers Management</h1>
        <p className="text-gray-400 text-sm mt-1">View and manage all registered customers</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          className="w-full pl-10 pr-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden md:table-cell">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden sm:table-cell">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No customers found</td>
                </tr>
              ) : (
                customers.map((customer, i) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{customer.full_name || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-400">{customer.email}</td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-400">{customer.phone || 'N/A'}</td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-400">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewCustomer(customer.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/5">
            <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 text-sm">Previous</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 text-sm">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141428] rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="font-semibold">{selectedCustomer.full_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-semibold text-sm">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="font-semibold">{selectedCustomer.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="font-semibold text-sm">{selectedCustomer.governorate || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order History */}
            {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order History</h3>
                <div className="space-y-2 bg-white/5 rounded-lg p-4 max-h-48 overflow-y-auto">
                  {selectedCustomer.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between text-sm pb-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-medium">{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <span className="text-xs text-gray-400">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminCustomers
