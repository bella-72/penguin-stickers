-- Seed existing storefront products into Supabase public.products
-- Run this in the Supabase SQL Editor.

-- 0) Allow authenticated inserts/updates needed for product seeding and wishlist-backed upserts
DROP POLICY IF EXISTS "Authenticated users can upsert categories" ON public.categories;
CREATE POLICY "Authenticated users can upsert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can upsert products" ON public.products;
CREATE POLICY "Authenticated users can upsert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 1) Upsert categories used by the frontend catalog
INSERT INTO public.categories (id, name, slug, image_url)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Animals', 'animals', NULL),
  ('22222222-2222-4222-8222-222222222222', 'Nature', 'nature', NULL),
  ('33333333-3333-4333-8333-333333333333', 'Lifestyle', 'lifestyle', NULL),
  ('44444444-4444-4444-8444-444444444444', 'Washi Collection', 'washi', NULL),
  ('55555555-5555-4555-8555-555555555555', 'Fantasy', 'fantasy', NULL),
  ('66666666-6666-4666-8666-666666666666', 'Exclusive', 'exclusive', NULL),
  ('77777777-7777-4777-8777-777777777777', 'Korean Style', 'korean-style', NULL),
  ('88888888-8888-4888-8888-888888888888', 'Minimal', 'minimal', NULL)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    image_url = EXCLUDED.image_url;

-- 2) Upsert products from the existing frontend catalog
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;

INSERT INTO public.products (
  id,
  name,
  slug,
  description,
  price,
  original_price,
  category_id,
  image,
  images,
  finish_types,
  stock,
  rating,
  review_count,
  is_featured,
  is_new
)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    'Artisan Penguin',
    'artisan-penguin',
    'A beautifully crafted penguin sticker with watercolor art style. Perfect for notebooks and laptops. Premium vinyl with waterproof finish.',
    35,
    45,
    '11111111-1111-4111-8111-111111111111',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['matte','glossy','holographic']::text[],
    150,
    4.8,
    124,
    true,
    false
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Lunar Bloom',
    'lunar-bloom',
    'Ethereal moon and flower design with silver accents. Holographic finish available for extra magic.',
    55,
    NULL,
    '22222222-2222-4222-8222-222222222222',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['matte','glossy','holographic']::text[],
    80,
    4.9,
    89,
    true,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Cafe Aesthetic',
    'cafe-aesthetic',
    'Cozy cafe vibes with warm tones and delicate illustrations. A must-have for coffee lovers.',
    30,
    40,
    '33333333-3333-4333-8333-333333333333',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['matte','glossy']::text[],
    200,
    4.7,
    156,
    true,
    false
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Tropical Vibes',
    'tropical-vibes',
    'Bright tropical leaves and flowers. Bring summer to your everyday items with these vibrant stickers.',
    40,
    NULL,
    '22222222-2222-4222-8222-222222222222',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['matte','glossy','holographic']::text[],
    120,
    4.6,
    67,
    true,
    true
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Holographic Penguin Pack',
    'holographic-penguin-pack',
    'Our signature penguin collection with stunning holographic finish. Includes 5 unique penguin designs.',
    60,
    75,
    '66666666-6666-4666-8666-666666666666',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['holographic']::text[],
    50,
    5.0,
    203,
    true,
    false
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Midnight Mint Tape',
    'midnight-mint-tape',
    'Washi tape inspired sticker strips in our signature mint color palette. Decorative and versatile.',
    45,
    NULL,
    '44444444-4444-4444-8444-444444444444',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['matte','glossy']::text[],
    300,
    4.5,
    98,
    true,
    false
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    'Pastel Galaxy',
    'pastel-galaxy',
    'Dreamy pastel space designs with stars, planets, and cosmic dust. Perfect for journaling.',
    50,
    65,
    '55555555-5555-4555-8555-555555555555',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['matte','glossy','holographic']::text[],
    90,
    4.8,
    145,
    false,
    true
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    'Sakura Dreams',
    'sakura-dreams',
    'Delicate cherry blossom designs inspired by Japanese art. Elegant and minimalist.',
    38,
    NULL,
    '22222222-2222-4222-8222-222222222222',
    '/7665.png',
    ARRAY['/7665.png']::text[],
    ARRAY['matte','glossy']::text[],
    160,
    4.9,
    112,
    false,
    true
  )
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    category_id = EXCLUDED.category_id,
    image = EXCLUDED.image,
    images = EXCLUDED.images,
    finish_types = EXCLUDED.finish_types,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_featured = EXCLUDED.is_featured,
    is_new = EXCLUDED.is_new;

-- 3) Fix legacy wishlist rows that still use the old numeric product IDs
UPDATE public.wishlist
SET product_id = CASE product_id::text
  WHEN '1' THEN '11111111-1111-4111-8111-111111111111'
  WHEN '2' THEN '22222222-2222-4222-8222-222222222222'
  WHEN '3' THEN '33333333-3333-4333-8333-333333333333'
  WHEN '4' THEN '44444444-4444-4444-8444-444444444444'
  WHEN '5' THEN '55555555-5555-4555-8555-555555555555'
  WHEN '6' THEN '66666666-6666-4666-8666-666666666666'
  WHEN '7' THEN '77777777-7777-4777-8777-777777777777'
  WHEN '8' THEN '88888888-8888-4888-8888-888888888888'
  ELSE product_id
END
WHERE product_id::text IN ('1','2','3','4','5','6','7','8');

-- 4) Verify the seeded data
SELECT 'categories' AS table_name, COUNT(*) AS row_count FROM public.categories
UNION ALL
SELECT 'products' AS table_name, COUNT(*) AS row_count FROM public.products
UNION ALL
SELECT 'wishlist' AS table_name, COUNT(*) AS row_count FROM public.wishlist;

SELECT p.id, p.name, p.slug, p.category_id
FROM public.products p
ORDER BY p.name;
