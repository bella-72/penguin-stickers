import { formatDate } from '@/utils/helpers'

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
  approved: 'bg-green-500/20 text-green-400',
  in_production: 'bg-orange-500/20 text-orange-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

const demoRequests = [
  { id: 'CR-001', user_name: 'Sarah M.', name: 'Custom Logo Sticker', quantity: 100, finish_type: 'holographic', status: 'pending', created_at: '2024-03-15' },
  { id: 'CR-002', user_name: 'Ahmed K.', name: 'Birthday Party Pack', quantity: 50, finish_type: 'glossy', status: 'reviewing', created_at: '2024-03-14' },
  { id: 'CR-003', user_name: 'Nour A.', name: 'Pet Portrait Stickers', quantity: 200, finish_type: 'matte', status: 'approved', created_at: '2024-03-13' },
]

const AdminCustomRequests = () => (
  <div className="space-y-6">
    <div><h1 className="font-outfit text-2xl font-bold">Custom Sticker Requests</h1><p className="text-gray-400 text-sm">Review and manage custom orders</p></div>

    <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-gray-400 text-xs uppercase border-b border-white/5">
            <th className="text-left px-5 py-3">ID</th>
            <th className="text-left px-5 py-3">Customer</th>
            <th className="text-left px-5 py-3">Sticker Name</th>
            <th className="text-left px-5 py-3">Qty</th>
            <th className="text-left px-5 py-3">Finish</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Date</th>
          </tr></thead>
          <tbody>
            {demoRequests.map((req) => (
              <tr key={req.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 font-medium text-brand-primary">{req.id}</td>
                <td className="px-5 py-3">{req.user_name}</td>
                <td className="px-5 py-3 font-medium">{req.name}</td>
                <td className="px-5 py-3">{req.quantity}</td>
                <td className="px-5 py-3 capitalize text-gray-400">{req.finish_type}</td>
                <td className="px-5 py-3">
                  <select defaultValue={req.status} className={`px-3 py-1 rounded-full text-xs font-medium capitalize bg-transparent border border-white/10 cursor-pointer ${statusColors[req.status]}`}>
                    {Object.keys(statusColors).map(s => <option key={s} value={s} className="bg-[#141428] text-white">{s.replace('_', ' ')}</option>)}
                  </select>
                </td>
                <td className="px-5 py-3 text-gray-400">{formatDate(req.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

export default AdminCustomRequests
