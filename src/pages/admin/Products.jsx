import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { demoProducts, formatPrice, demoCategories } from '@/utils/helpers'

const AdminProducts = () => {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [products, setProducts] = useState(demoProducts)

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-outfit text-2xl font-bold">Products</h1><p className="text-gray-400 text-sm">Manage your sticker catalog</p></div>
        <Button icon={Plus} onClick={() => { setEditProduct(null); setShowModal(true) }}>Add Product</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#141428] border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary/30 transition-all" />
      </div>

      <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 text-xs uppercase border-b border-white/5">
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Stock</th>
              <th className="text-left px-5 py-3">Rating</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden shrink-0">
                        <img src={product.images?.[0]} alt="" className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=80&background=2ECC71&color=fff` }} />
                      </div>
                      <div><p className="font-medium">{product.name}</p>{product.is_featured && <span className="text-[10px] text-brand-primary">Featured</span>}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{product.categories?.name}</td>
                  <td className="px-5 py-3 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3"><span className={product.stock < 50 ? 'text-yellow-400' : 'text-green-400'}>{product.stock}</span></td>
                  <td className="px-5 py-3">⭐ {product.rating}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditProduct(product); setShowModal(true) }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProduct ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="space-y-4">
          <Input label="Product Name" defaultValue={editProduct?.name || ''} placeholder="Sticker name" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (EGP)" type="number" defaultValue={editProduct?.price || ''} placeholder="0" />
            <Input label="Stock" type="number" defaultValue={editProduct?.stock || ''} placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select defaultValue={editProduct?.categories?.slug || ''} className="w-full px-4 py-2.5 border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm bg-white dark:bg-brand-dark">
              {demoCategories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea defaultValue={editProduct?.description || ''} rows={3} placeholder="Product description..."
              className="w-full px-4 py-3 border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl text-sm resize-none bg-white dark:bg-brand-dark" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={() => setShowModal(false)}>
              {editProduct ? 'Save Changes' : 'Add Product'}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminProducts
