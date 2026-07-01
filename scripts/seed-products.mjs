import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { demoProducts, demoCategories } from '../src/utils/helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const envFile = readFileSync(path.join(projectRoot, '.env'), 'utf8')
const env = Object.fromEntries(
  envFile
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf('=')
      return [line.slice(0, index), line.slice(index + 1)]
    })
)

const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(env.VITE_SUPABASE_URL, serviceRoleKey || env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const guessContentType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.webp') return 'image/webp'
  if (extension === '.svg') return 'image/svg+xml'
  return 'application/octet-stream'
}

const resolveImagePath = (product) => {
  const candidate = product.images?.[0] || product.image || null
  if (!candidate) return null

  const normalized = candidate.startsWith('/') ? candidate.slice(1) : candidate
  const localPath = path.join(projectRoot, 'public', normalized)
  if (existsSync(localPath)) return localPath

  const fallback = path.join(projectRoot, 'public', '7665.png')
  if (existsSync(fallback)) return fallback
  return null
}

const uploadImage = async (product) => {
  const localPath = resolveImagePath(product)
  if (!localPath) return null

  const fileBuffer = readFileSync(localPath)
  const fileName = `${product.slug || product.id}-${path.basename(localPath)}`
  const storagePath = `products/${fileName}`
  const { data, error } = await supabase.storage.from('products').upload(storagePath, fileBuffer, {
    upsert: true,
    contentType: guessContentType(localPath),
  })

  if (error) throw error

  const { data: publicData } = supabase.storage.from('products').getPublicUrl(data.path)
  return publicData?.publicUrl || null
}

const seedCategories = async () => {
  const mapped = demoCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image_url: category.image_url,
  }))

  const { error } = await supabase.from('categories').upsert(mapped, { onConflict: 'id' })
  if (error) throw error
}

const seedProducts = async () => {
  const mapped = []

  for (const product of demoProducts) {
    const imageUrl = await uploadImage(product)
    mapped.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      category_id: product.category_id,
      image: imageUrl || (product.images?.[0] || product.image || null),
      images: imageUrl ? [imageUrl] : (product.images || []),
      finish_types: product.finish_types || ['matte', 'glossy', 'holographic'],
      stock: product.stock ?? 0,
      rating: product.rating ?? 0,
      review_count: product.review_count ?? 0,
      is_featured: product.is_featured ?? false,
      is_new: product.is_new ?? false,
    })
  }

  const { error } = await supabase.from('products').upsert(mapped, { onConflict: 'id' })
  if (error) throw error
}

const main = async () => {
  await seedCategories()
  await seedProducts()
  console.log(`Seeded ${demoProducts.length} products into Supabase.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
