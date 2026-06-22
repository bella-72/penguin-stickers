export const formatPrice = (price) => {
  return `${Number(price).toFixed(0)} EGP`
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    in_production: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const shippingRates = {
  // 65 EGP Governorates
  Cairo: 65,
  Giza: 65,
  Qalyubia: 65,
  
  // 75 EGP Governorates
  Sharkia: 75,
  Alexandria: 75,
  Dakahlia: 75,
  Gharbia: 75,
  Damietta: 75,
  'Menofia': 75,
  'Kafr El Sheikh': 75,
  Beheira: 75,
  
  // 80 EGP Governorates
  Ismailia: 80,
  
  // 85 EGP Governorates
  Suez: 85,
  
  // 90 EGP Governorates
  Fayoum: 90,
  'Assiut': 90,
  Minya: 90,
  'Beni Suef': 90,
  
  // 115 EGP Governorates
  Aswan: 115,
  Luxor: 115,
  'Red Sea': 115,
  Qena: 115,
  
  // 125 EGP Governorates
  'New Valley': 125,
  'South Sinai': 125,
  Matrouh: 125,
}

export const getShippingRate = (governorate) => {
  return shippingRates[governorate] || 65
}

export const governorates = [
  'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira',
  'Fayoum', 'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qalyubia',
  'New Valley', 'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said',
  'Damietta', 'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matrouh',
  'Luxor', 'Qena', 'North Sinai', 'Sohag'
]

// Demo products for when Supabase is not configured
export const demoProducts = [
  {
    id: '1',
    name: 'Artisan Penguin',
    slug: 'artisan-penguin',
    description: 'A beautifully crafted penguin sticker with watercolor art style. Perfect for notebooks and laptops. Premium vinyl with waterproof finish.',
    price: 35,
    original_price: 45,
    images: ['/stickers/penguin-artisan.webp'],
    rating: 4.8,
    review_count: 124,
    is_featured: true,
    is_new: false,
    finish_types: ['matte', 'glossy', 'holographic'],
    stock: 150,
    category_id: 'cat1',
    categories: { name: 'Animals', slug: 'animals' }
  },
  {
    id: '2',
    name: 'Lunar Bloom',
    slug: 'lunar-bloom',
    description: 'Ethereal moon and flower design with silver accents. Holographic finish available for extra magic.',
    price: 55,
    original_price: null,
    images: ['/stickers/lunar-bloom.webp'],
    rating: 4.9,
    review_count: 89,
    is_featured: true,
    is_new: true,
    finish_types: ['matte', 'glossy', 'holographic'],
    stock: 80,
    category_id: 'cat2',
    categories: { name: 'Nature', slug: 'nature' }
  },
  {
    id: '3',
    name: 'Cafe Aesthetic',
    slug: 'cafe-aesthetic',
    description: 'Cozy cafe vibes with warm tones and delicate illustrations. A must-have for coffee lovers.',
    price: 30,
    original_price: 40,
    images: ['/stickers/cafe-aesthetic.webp'],
    rating: 4.7,
    review_count: 156,
    is_featured: true,
    is_new: false,
    finish_types: ['matte', 'glossy'],
    stock: 200,
    category_id: 'cat3',
    categories: { name: 'Lifestyle', slug: 'lifestyle' }
  },
  {
    id: '4',
    name: 'Tropical Vibes',
    slug: 'tropical-vibes',
    description: 'Bright tropical leaves and flowers. Bring summer to your everyday items with these vibrant stickers.',
    price: 40,
    original_price: null,
    images: ['/stickers/tropical.webp'],
    rating: 4.6,
    review_count: 67,
    is_featured: true,
    is_new: true,
    finish_types: ['matte', 'glossy', 'holographic'],
    stock: 120,
    category_id: 'cat2',
    categories: { name: 'Nature', slug: 'nature' }
  },
  {
    id: '5',
    name: 'Holographic Penguin Pack',
    slug: 'holographic-penguin-pack',
    description: 'Our signature penguin collection with stunning holographic finish. Includes 5 unique penguin designs.',
    price: 60,
    original_price: 75,
    images: ['/stickers/holo-penguin.webp'],
    rating: 5.0,
    review_count: 203,
    is_featured: true,
    is_new: false,
    finish_types: ['holographic'],
    stock: 50,
    category_id: 'cat1',
    categories: { name: 'Exclusive', slug: 'exclusive' }
  },
  {
    id: '6',
    name: 'Midnight Mint Tape',
    slug: 'midnight-mint-tape',
    description: 'Washi tape inspired sticker strips in our signature mint color palette. Decorative and versatile.',
    price: 45,
    original_price: null,
    images: ['/stickers/mint-tape.webp'],
    rating: 4.5,
    review_count: 98,
    is_featured: true,
    is_new: false,
    finish_types: ['matte', 'glossy'],
    stock: 300,
    category_id: 'cat4',
    categories: { name: 'Washi Collection', slug: 'washi' }
  },
  {
    id: '7',
    name: 'Pastel Galaxy',
    slug: 'pastel-galaxy',
    description: 'Dreamy pastel space designs with stars, planets, and cosmic dust. Perfect for journaling.',
    price: 50,
    original_price: 65,
    images: ['/stickers/pastel-galaxy.webp'],
    rating: 4.8,
    review_count: 145,
    is_featured: false,
    is_new: true,
    finish_types: ['matte', 'glossy', 'holographic'],
    stock: 90,
    category_id: 'cat5',
    categories: { name: 'Fantasy', slug: 'fantasy' }
  },
  {
    id: '8',
    name: 'Sakura Dreams',
    slug: 'sakura-dreams',
    description: 'Delicate cherry blossom designs inspired by Japanese art. Elegant and minimalist.',
    price: 38,
    original_price: null,
    images: ['/stickers/sakura.webp'],
    rating: 4.9,
    review_count: 112,
    is_featured: false,
    is_new: true,
    finish_types: ['matte', 'glossy'],
    stock: 160,
    category_id: 'cat2',
    categories: { name: 'Nature', slug: 'nature' }
  },
]

export const demoCategories = [
  { id: 'cat1', name: 'Animals', slug: 'animals', image_url: null },
  { id: 'cat2', name: 'Nature', slug: 'nature', image_url: null },
  { id: 'cat3', name: 'Lifestyle', slug: 'lifestyle', image_url: null },
  { id: 'cat4', name: 'Washi Collection', slug: 'washi', image_url: null },
  { id: 'cat5', name: 'Fantasy', slug: 'fantasy', image_url: null },
  { id: 'cat6', name: 'Exclusive', slug: 'exclusive', image_url: null },
  { id: 'cat7', name: 'Korean Style', slug: 'korean-style', image_url: null },
  { id: 'cat8', name: 'Minimal', slug: 'minimal', image_url: null },
]

export const demoReviews = [
  {
    id: 'r1',
    user_name: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely love these stickers! The quality is incredible and the holographic finish is stunning. Will definitely order again! 🐧',
    created_at: '2024-03-15'
  },
  {
    id: 'r2',
    user_name: 'Ahmed K.',
    rating: 5,
    comment: 'Best sticker shop in Egypt! The colors are so vibrant and they are truly waterproof. My laptop looks amazing now.',
    created_at: '2024-03-10'
  },
  {
    id: 'r3',
    user_name: 'Nour A.',
    rating: 4,
    comment: 'Great quality stickers, fast delivery to Alexandria. The matte finish gives a really premium feel. Highly recommend!',
    created_at: '2024-03-05'
  },
]
