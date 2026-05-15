import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Sparkles, Clock, Leaf } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Input'
import toast from 'react-hot-toast'

const finishOptions = [
  { value: 'matte', label: 'Matte', icon: '🎨', desc: 'Smooth, non-reflective' },
  { value: 'glossy', label: 'Glossy', icon: '✨', desc: 'Shiny, vibrant colors' },
  { value: 'holographic', label: 'Holographic', icon: '🌈', desc: 'Rainbow shimmer' },
]

const CustomSticker = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [stickerName, setStickerName] = useState('')
  const [finish, setFinish] = useState('matte')
  const [quantity, setQuantity] = useState(50)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const pricePerSticker = 0.45
  const totalEstimate = (quantity * pricePerSticker).toFixed(2)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0])
  }, [])

  const processFile = (f) => {
    if (!f.type.startsWith('image/')) { toast.error('Please upload an image file'); return }
    if (f.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please upload an image'); return }
    if (!stickerName) { toast.error('Please enter a sticker name'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setSubmitted(true)
    setLoading(false)
    toast.success('Custom sticker request submitted!')
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md p-8">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-outfit text-3xl font-bold mb-3">Request Submitted! ✨</h2>
          <p className="text-brand-gray-500 mb-6">We'll review your design and get back to you within 24 hours with a proof.</p>
          <Button onClick={() => { setSubmitted(false); setFile(null); setPreview(null); setStickerName(''); setNotes('') }}>
            Submit Another
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-dark to-[#1a2e1a] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-outfit text-4xl md:text-5xl font-bold mb-4">
            Create Your Own Magic
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/70 max-w-lg mx-auto">
            Upload your designs and turn them into premium, die-cut stickers with our professional-grade custom builder.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left - Upload & Options */}
            <div className="space-y-6">
              {/* Upload Area */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                <h3 className="font-outfit font-semibold text-lg mb-4">Upload Artwork</h3>
                <div
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    dragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-gray-200 dark:border-brand-gray-700 hover:border-brand-primary/50'
                  }`}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input id="file-upload" type="file" className="hidden" accept="image/*"
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null) }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-brand-gray-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-brand-gray-600 dark:text-brand-gray-300">Drag and drop your file here</p>
                      <p className="text-xs text-brand-gray-400 mt-1">Supports PNG, JPG, AI, SVG (Max 10MB)</p>
                      <Button type="button" size="sm" className="mt-4">Browse Files</Button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Sticker Name */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                <Input label="Sticker Name" value={stickerName} onChange={(e) => setStickerName(e.target.value)} placeholder="E.g., Pastel Space Whale" />
              </motion.div>

              {/* Finish Options */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                <p className="text-sm font-semibold text-brand-gray-700 dark:text-brand-gray-300 mb-3">Finish Option</p>
                <div className="grid grid-cols-3 gap-3">
                  {finishOptions.map((f) => (
                    <button key={f.value} type="button" onClick={() => setFinish(f.value)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        finish === f.value ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-gray-200 dark:border-brand-gray-700'
                      }`}>
                      <span className="text-xl">{f.icon}</span>
                      <p className={`text-xs font-medium mt-1 ${finish === f.value ? 'text-brand-primary' : ''}`}>{f.label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Quantity */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                <p className="text-sm font-semibold text-brand-gray-700 dark:text-brand-gray-300 mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-brand-gray-50 dark:bg-brand-gray-800 rounded-full p-1">
                    <button type="button" onClick={() => setQuantity(Math.max(10, quantity - 10))} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700">−</button>
                    <span className="w-14 text-center font-medium">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(quantity + 10)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-brand-gray-700">+</button>
                  </div>
                  <span className="text-sm text-brand-gray-400">${pricePerSticker} per sticker</span>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                <Textarea label="Customization Notes (Optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add specific cutting instructions or color notes..." rows={4} />
              </motion.div>
            </div>

            {/* Right - Preview */}
            <div>
              <div className="sticky top-28 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                  <p className="text-xs text-brand-gray-400 text-center mb-4">See your die-cut sticker come to life</p>
                  <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-brand-gray-50 to-brand-gray-100 dark:from-brand-gray-800 dark:to-brand-gray-900 flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <div className="relative w-3/4 h-3/4 rounded-full bg-white dark:bg-brand-dark shadow-xl flex items-center justify-center overflow-hidden">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <ImageIcon className="w-16 h-16 text-brand-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-brand-gray-400">Upload an image to preview</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Price & Submit */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-brand-gray-400 uppercase tracking-wider">Total Estimate</p>
                      <p className="font-outfit text-3xl font-bold text-brand-primary">${totalEstimate}</p>
                    </div>
                    <Button type="submit" size="lg" loading={loading}>Add To Cart</Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-brand-gray-100 dark:border-brand-gray-700">
                    {[
                      { icon: Sparkles, label: 'Free Proofs' },
                      { icon: Clock, label: '3-Day Turnaround' },
                      { icon: Leaf, label: 'Eco-Friendly Ink' },
                    ].map((b) => (
                      <div key={b.label} className="text-center">
                        <b.icon className="w-4 h-4 text-brand-primary mx-auto mb-1" />
                        <p className="text-[10px] text-brand-gray-500">{b.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomSticker
