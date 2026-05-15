import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { demoCategories } from '@/utils/helpers'

const AdminCategories = () => {
  const [categories, setCategories] = useState(demoCategories)
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [name, setName] = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    if (editCat) {
      setCategories(categories.map(c => c.id === editCat.id ? { ...c, name, slug: name.toLowerCase().replace(/\s+/g, '-') } : c))
    } else {
      setCategories([...categories, { id: `cat-${Date.now()}`, name, slug: name.toLowerCase().replace(/\s+/g, '-'), image_url: null }])
    }
    setShowModal(false)
    setName('')
    setEditCat(null)
  }

  const handleDelete = (id) => setCategories(categories.filter(c => c.id !== id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-outfit text-2xl font-bold">Categories</h1><p className="text-gray-400 text-sm">Organize your products</p></div>
        <Button icon={Plus} onClick={() => { setEditCat(null); setName(''); setShowModal(true) }}>Add Category</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#141428] rounded-2xl p-5 border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-gray-500">/{cat.slug}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditCat(cat); setName(cat.name); setShowModal(true) }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editCat ? 'Edit Category' : 'Add Category'} size="sm">
        <div className="space-y-4">
          <Input label="Category Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="E.g., Korean Style" />
          <div className="flex gap-3"><Button className="flex-1" onClick={handleSave}>Save</Button><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button></div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminCategories
