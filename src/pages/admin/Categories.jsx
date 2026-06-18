import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '' })

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({ name: formData.name, slug: formData.slug })
          .eq('id', editingId)
        if (error) throw error
        toast.success('Category updated!')
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({ name: formData.name, slug: formData.slug.toLowerCase().replace(/\s+/g, '-') })
        if (error) throw error
        toast.success('Category added!')
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', slug: '' })
      fetchCategories()
    } catch (err) {
      console.error('Error saving category:', err)
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      toast.success('Category deleted!')
      fetchCategories()
    } catch (err) {
      console.error('Error deleting category:', err)
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: '', slug: '' })
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-mint text-white rounded-lg hover:opacity-90 transition-opacity font-medium w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-8">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">No categories found</div>
        ) : (
          categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#141428] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{category.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData({ name: category.name, slug: category.slug })
                      setEditingId(category.id)
                      setShowForm(true)
                    }}
                    className="p-2 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141428] rounded-2xl p-6 max-w-md w-full border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Category' : 'Add Category'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }}
                  className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-[#141428] border border-white/10 rounded-lg focus:border-gradient-mint focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-mint text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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

       
export default AdminCategories
