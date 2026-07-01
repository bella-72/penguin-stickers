import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Image, Check, X } from 'lucide-react'
import { adminProductsService } from '@/services/adminService'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import { formatPrice } from '@/utils/helpers'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [categories, setCategories] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category_id: '',
  })
  const limit = 10

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await adminProductsService.getAll({
        page,
        limit,
        search,
      })
      setProducts(data.products)
      setTotal(data.total)
    } catch (err) {
      console.error('Error fetching products:', err)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const resetForm = () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl('')
    setImageFile(null)
    setFormData({ name: '', description: '', price: '', original_price: '', stock: '', category_id: '' })
  }

  const openForm = (product = null) => {
    resetForm()
    if (product) {
      setEditingId(product.id)
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        stock: product.stock || '',
        category_id: product.category_id || '',
      })
      const existingImage = product.images?.[0] || ''
      setPreviewUrl(existingImage)
    } else {
      setEditingId(null)
      setFormData({ name: '', description: '', price: '', original_price: '', stock: '', category_id: '' })
    }
    setShowForm(true)
  }

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [page, search])

  useRealtimeSync({
    table: 'products',
    event: '*',
    onInsert: () => fetchProducts(),
    onUpdate: () => fetchProducts(),
    onDelete: () => fetchProducts(),
    showToast: false,
  })

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const ensureProductsBucket = async () => {
    try {
      await supabase.storage.createBucket('products', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024,
      })
    } catch (error) {
      const message = error?.message || ''
      if (!message.toLowerCase().includes('already exists') && !message.toLowerCase().includes('exists')) {
        console.warn('Bucket check skipped or failed:', error)
      }
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Product name is required')
      return
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Price is required')
      return
    }

    if (!formData.category_id) {
      toast.error('Please select a category')
      return
    }

    if (!imageFile && !previewUrl) {
      toast.error('Please select an image')
      return
    }

    try {
      setUploading(true)

      let images = []
      if (imageFile) {
        await ensureProductsBucket()

        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(uploadData.path)
        images = [publicUrlData.publicUrl]
      } else if (previewUrl) {
        images = [previewUrl]
      }

      const payload = {
        name: formData.name.trim(),
        slug: formData.name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock || 0, 10),
        category_id: formData.category_id,
        images,
      }

      if (editingId) {
        await adminProductsService.update(editingId, payload)
        toast.success('Product updated!')
      } else {
        await adminProductsService.create(payload)
        toast.success('Product added!')
      }

      setShowForm(false)
      setEditingId(null)
      resetForm()
      fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err)
      toast.error(err?.message || 'Failed to save product')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    const productId = typeof id === 'string' || typeof id === 'number' ? String(id) : ''

    if (!productId || productId === 'undefined' || productId === 'null') {
      console.error('Delete aborted: invalid product id', id)
      toast.error('Failed to delete product')
      return
    }

    if (!window.confirm('Are you sure?')) return

    try {
      console.log('Deleting product from admin:', productId)
      await adminProductsService.delete(productId)

      setProducts((prevProducts) => prevProducts.filter((product) => String(product.id) !== productId))
      setTotal((prevTotal) => Math.max(prevTotal - 1, 0))
      toast.success('Product deleted!')
    } catch (err) {
      console.error('Error deleting product:', err, { productId })
      toast.error(err?.message || 'Failed to delete product')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-gray-400 text-sm mt-1">Add, edit, and manage product inventory</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-mint text-white rounded-lg hover:opacity-90 transition-opacity font-medium w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Grid or Table */}
      <div className="bg-[#141428] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden md:table-cell">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold hidden lg:table-cell">Stock</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">No products found</td>
                </tr>
              ) : (
                products.map((product, i) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.categories?.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell font-semibold">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${product.stock > 20 ? 'bg-green-500/20 text-green-400' : product.stock > 5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                      <button onClick={() => openForm(product)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product?.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141428] rounded-2xl p-6 max-w-2xl w-full border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add Product'}</h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (EGP)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Original Price (Before Discount)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-mint file:text-white file:cursor-pointer"
                  />
                </div>
              </div>

              {previewUrl && (
                <div className="rounded-xl border border-white/10 p-3 bg-white/5">
                  <p className="text-sm text-gray-400 mb-2">Image Preview</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=Product&size=400&background=2ECC71&color=fff'
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-gradient-mint text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-60"
                >
                  {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
