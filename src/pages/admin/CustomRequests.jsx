import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, CheckCircle, Clock } from 'lucide-react'
import { adminCustomStickersService } from '@/services/adminService'
import { formatPrice } from '@/utils/helpers'
import toast from 'react-hot-toast'

const AdminCustomRequests = () => {
  const [requests, setRequests] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const limit = 10

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await adminCustomStickersService.getAll({
        status: statusFilter,
        page,
        limit,
      })
      setRequests(data.requests)
      setTotal(data.total)
    } catch (err) {
      console.error('Error fetching requests:', err)
      toast.error('Failed to load custom requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  useEffect(() => {
    fetchRequests()
  }, [page, statusFilter])

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setNewStatus(request.status)
    setAdminNotes(request.admin_notes || '')
    setShowModal(true)
  }

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return
    try {
      await adminCustomStickersService.updateStatus(selectedRequest.id, newStatus, adminNotes)
      toast.success('Request updated!')
      setShowModal(false)
      fetchRequests()
    } catch (err) {
      console.error('Error updating request:', err)
      toast.error('Failed to update request')
    }
  }

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    reviewing: 'bg-blue-500/20 text-blue-400',
    approved: 'bg-green-500/20 text-green-400',
    in_production: 'bg-purple-500/20 text-purple-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Custom Sticker Requests</h1>
        <p className="text-gray-400 text-sm mt-1">Manage customer custom sticker orders</p>
      </div>

      {/* Filter */}
      <div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="approved">Approved</option>
          <option value="in_production">In Production</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden md:table-cell">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell">Estimated Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No requests found</td>
                </tr>
              ) : (
                requests.map((request, i) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{request.users?.full_name}</p>
                        <p className="text-xs text-gray-400">{request.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">{request.quantity} units</td>
                    <td className="px-6 py-4 hidden lg:table-cell font-semibold">{request.estimated_price ? formatPrice(request.estimated_price) : 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
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

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141428] rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Request Details</h2>

            {/* Image */}
            {selectedRequest.image_url && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Uploaded Image</p>
                <img src={selectedRequest.image_url} alt="" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Customer Name</p>
                <p className="font-semibold">{selectedRequest.users?.full_name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-semibold text-sm">{selectedRequest.users?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Quantity</p>
                <p className="font-semibold">{selectedRequest.quantity} units</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Estimated Price</p>
                <p className="font-semibold">{selectedRequest.estimated_price ? formatPrice(selectedRequest.estimated_price) : 'N/A'}</p>
              </div>
            </div>

            {/* Notes */}
            {selectedRequest.notes && (
              <div className="mb-6">
                <p className="text-gray-400 text-sm">Customer Notes</p>
                <p className="text-sm bg-white/5 p-3 rounded-lg">{selectedRequest.notes}</p>
              </div>
            )}

            {/* Status Update */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Update Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none mb-4"
              >
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="in_production">In Production</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <label className="block text-sm text-gray-400 mb-2">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none resize-none"
                rows="3"
                placeholder="Add notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdateRequest}
                className="flex-1 px-4 py-2 bg-gradient-mint text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Update Request
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

export default AdminCustomRequests
          