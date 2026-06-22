import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Droplets, Award, Truck, Leaf, Star, ChevronRight, Send } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import { demoProducts } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'
import { reviewsService } from '@/services/reviews'
import toast from 'react-hot-toast'

/* ─── Animated Section Wrapper ──────── */
const Section = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ─── Hero ──────── */
const Hero = () => (
  <section className="relative overflow-hidden min-h-[90vh] flex items-center">
    {/* Background decorations */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-brand-primary/5 blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl" />
      
      {/* Floating stickers */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[15%] w-20 h-20 rounded-2xl bg-gradient-to-br from-mint-100 to-mint-200 dark:from-mint-900/30 dark:to-mint-800/20 shadow-lg opacity-60 flex items-center justify-center"
      >
        <span className="text-3xl">🐧</span>
      </motion.div>
      <motion.div
        animate={{ y: [10, -15, 10], rotate: [3, -3, 3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-52 left-[10%] w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 shadow-lg opacity-50 flex items-center justify-center"
      >
        <span className="text-2xl">✨</span>
      </motion.div>
      <motion.div
        animate={{ y: [-8, 12, -8], rotate: [-2, 4, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-40 left-[20%] w-14 h-14 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/20 shadow-md opacity-40 flex items-center justify-center"
      >
        <span className="text-xl">🌿</span>
      </motion.div>
      <motion.div
        animate={{ y: [5, -10, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-40 right-[40%] w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/20 shadow-md opacity-40 flex items-center justify-center"
      >
        <span className="text-lg">💖</span>
      </motion.div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-sm font-medium text-brand-primary">New Collection 2026</span>
            </motion.div>

            <h1 className="font-outfit text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-brand-gray-900 dark:text-white">
              Custom Stickers{' '}
              <br />
              <span className="text-gradient">Made With</span>
              <br />
              Your Style
            </h1>
          </div>

          <p className="text-lg text-brand-gray-500 dark:text-brand-gray-400 max-w-md leading-relaxed">
            Premium die-cut stickers, scratch-resistant, waterproof, and eco-friendly. 
            Crafted with love for notebooks, laptops, and everything you love.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button size="lg" iconRight={ArrowRight}>
                Shop Collection
              </Button>
            </Link>
            <Link to="/custom">
              <Button variant="secondary" size="lg">
                Create Custom Sticker
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 pt-4">
            <div className="text-center">
              <p className="font-outfit font-bold text-2xl text-brand-gray-800 dark:text-white">10K+</p>
              <p className="text-xs text-brand-gray-400">Happy Customers</p>
            </div>
            <div className="w-px h-10 bg-brand-gray-200 dark:bg-brand-gray-700" />
            <div className="text-center">
              <p className="font-outfit font-bold text-2xl text-brand-gray-800 dark:text-white">500+</p>
              <p className="text-xs text-brand-gray-400">Sticker Designs</p>
            </div>
            <div className="w-px h-10 bg-brand-gray-200 dark:bg-brand-gray-700" />
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <p className="font-outfit font-bold text-2xl text-brand-gray-800 dark:text-white">4.9</p>
              <p className="text-xs text-brand-gray-400 ml-1">Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Right - Sticker mockup area */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Main sticker mockup */}
            <div className="absolute inset-8 rounded-3xl bg-gradient-to-br from-mint-100 to-mint-50 dark:from-mint-900/20 dark:to-brand-dark shadow-glass-lg flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-40 h-40 mx-auto rounded-full bg-white dark:bg-brand-dark shadow-xl flex items-center justify-center mb-6 overflow-hidden">
                  <img src="/7665.png" alt="Penguin Stick" className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="font-outfit font-bold text-xl text-brand-gray-700 dark:text-brand-gray-300">Collect Joy.</p>
                <p className="text-sm text-brand-gray-400 mt-1">Premium Die-Cut Stickers</p>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-24 h-24 rounded-2xl bg-white dark:bg-brand-dark shadow-glass p-3 flex items-center justify-center"
            >
              <div className="text-center">
                <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-[10px] font-medium text-brand-gray-500">Waterproof</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-2 -left-2 w-24 h-24 rounded-2xl bg-white dark:bg-brand-dark shadow-glass p-3 flex items-center justify-center"
            >
              <div className="text-center">
                <Leaf className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-[10px] font-medium text-brand-gray-500">Eco-Friendly</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

/* ─── Scrolling Banner ──────── */
const ScrollingBanner = () => {
  const items = ['PREMIUM VINYL', 'WATERPROOF', 'DIE-CUT', 'ECO-FRIENDLY', 'SCRATCH-RESISTANT', 'CUSTOM DESIGNS']
  return (
    <Section className="py-8 border-y border-brand-gray-100 dark:border-brand-gray-800 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="mx-8 text-2xl md:text-3xl font-outfit font-bold text-brand-gray-200 dark:text-brand-gray-700 whitespace-nowrap tracking-wider">
              {item}
              <span className="mx-6 text-brand-primary">•</span>
            </span>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─── Featured Stickers ──────── */
const FeaturedStickers = () => {
  const scrollRef = useRef(null)
  const featured = demoProducts.filter(p => p.is_featured)

  return (
    <Section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-brand-primary uppercase tracking-wider mb-2">Handpicked for you</p>
            <h2 className="font-outfit text-3xl md:text-4xl font-bold text-brand-gray-900 dark:text-white">
              Featured Stickers
            </h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-medium text-brand-primary hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x"
        >
          {featured.map((product, i) => (
            <div key={product.id} className="min-w-[260px] max-w-[260px] snap-start">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>

        <Link to="/shop" className="md:hidden flex items-center justify-center gap-1 text-sm font-medium text-brand-primary mt-6">
          View All Products <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  )
}

/* ─── Custom Orders CTA ──────── */
const CustomOrdersCTA = () => (
  <Section className="py-20 bg-gradient-to-br from-brand-primary to-brand-accent text-white relative overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 blur-2xl" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-outfit text-3xl md:text-4xl font-bold leading-tight">
            Bring Your Vision To Life With{' '}
            <span className="underline decoration-white/30 underline-offset-4">Custom Orders</span>
          </h2>
          <p className="text-white/80 leading-relaxed">
            Whether you're a business owner creating branded merch, or an artist bringing your designs to life — 
            our custom sticker builder makes it easy. Upload your artwork and we'll handle the rest.
          </p>
          <ul className="space-y-3">
            {[
              'Upload any image or artwork',
              'Choose from matte, glossy, or holographic finish',
              'Premium die-cut quality guaranteed',
              'Free proofing before production',
              'Fast 3-day turnaround'
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/custom">
            <Button
              variant="secondary"
              size="lg"
              className="!bg-white !text-brand-primary hover:!bg-white/90 mt-2"
              iconRight={ArrowRight}
            >
              Create Custom Sticker
            </Button>
          </Link>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="relative">
            <div className="w-72 h-72 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-4 border-2 border-dashed border-white/40">
                  <span className="text-4xl">🎨</span>
                </div>
                <p className="font-outfit font-semibold text-lg">Your Design Here</p>
                <p className="text-sm text-white/60 mt-1">Upload & Customize</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <span className="text-2xl">✨</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </Section>
)

/* ─── Why Choose Us ──────── */
const WhyChooseUs = () => {
  const features = [
    { icon: Droplets, title: 'Waterproof', desc: 'Splash-proof vinyl that withstands rain, spills, and daily adventures.' },
    { icon: Award, title: 'Premium Quality', desc: 'Thick, durable vinyl with vibrant colors that won\'t fade over time.' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Quick processing and shipping across Egypt. Free delivery on 300+ EGP.' },
    { icon: Leaf, title: 'Eco-Friendly', desc: 'We use eco-friendly inks and recyclable packaging for a greener world.' },
  ]

  return (
    <Section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-brand-primary uppercase tracking-wider mb-2">Built to last</p>
        <h2 className="font-outfit text-3xl md:text-4xl font-bold text-brand-gray-900 dark:text-white mb-4">
          Why Choose Us
        </h2>
        <p className="text-brand-gray-500 dark:text-brand-gray-400 max-w-xl mx-auto mb-14">
          Our stickers are pretty, but they're also incredibly durable. Here's why 10,000+ customers trust us.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-primary/20 transition-colors">
                <f.icon className="w-7 h-7 text-brand-primary" />
              </div>
              <h3 className="font-outfit font-semibold text-lg mb-2 text-brand-gray-800 dark:text-white">{f.title}</h3>
              <p className="text-sm text-brand-gray-500 dark:text-brand-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─── Customer Feedback & Reviews ──────── */
const CustomerFeedback = () => {
  const { user, profile } = useAuthStore()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userReview, setUserReview] = useState(null)
  const [formData, setFormData] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    const data = await reviewsService.getReviews(6)
    setReviews(data)
    
    if (profile?.full_name) {
      const existing = await reviewsService.getUserReview(profile.full_name)
      setUserReview(existing)
      if (existing) {
        setFormData({ rating: existing.rating, comment: existing.comment })
      }
    }
    setLoading(false)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!profile?.full_name) {
      toast.error('Please log in to submit a review')
      return
    }

    if (!formData.comment.trim()) {
      toast.error('Please write a review')
      return
    }

    setSubmitting(true)
    try {
      let result
      if (userReview) {
        result = await reviewsService.updateReview(userReview.id, formData.rating, formData.comment)
      } else {
        result = await reviewsService.createReview(profile.full_name, formData.rating, formData.comment)
      }

      if (result.success) {
        toast.success(userReview ? 'Review updated!' : 'Review submitted!')
        setFormData({ rating: 5, comment: '' })
        loadReviews()
      } else {
        toast.error(result.error || 'Failed to submit review')
      }
    } catch (error) {
      toast.error('Error submitting review')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section className="py-20 bg-brand-gray-50/50 dark:bg-brand-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-brand-primary uppercase tracking-wider mb-2">Community voices</p>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold text-brand-gray-900 dark:text-white mb-4">
            Customer Feedback & Reviews
          </h2>
          <p className="text-brand-gray-500 dark:text-brand-gray-400 max-w-2xl mx-auto">
            See what 10,000+ happy customers think about Penguin Stick. Share your experience and help others discover their perfect stickers.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reviews Feed */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-brand-dark rounded-2xl p-6 animate-pulse h-32" />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-brand-gray-600 dark:text-brand-gray-300 leading-relaxed mb-4">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-mint flex items-center justify-center text-white font-bold text-xs">
                          {review.user_name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-gray-800 dark:text-white">
                            {review.user_name || 'Customer'}
                          </p>
                          <p className="text-xs text-brand-gray-400">✓ Verified Buyer</p>
                        </div>
                      </div>
                      <p className="text-xs text-brand-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-dark rounded-2xl p-12 text-center">
                <Star className="w-12 h-12 text-brand-gray-300 mx-auto mb-4" />
                <p className="text-brand-gray-500">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card sticky top-28 max-h-[500px] overflow-y-auto">
              <h3 className="font-outfit text-lg font-semibold mb-4 text-brand-gray-900 dark:text-white">
                Share Your Feedback
              </h3>

              {!user ? (
                <div className="text-center py-6">
                  <p className="text-sm text-brand-gray-500 mb-4">Sign in to submit your review</p>
                  <Link to="/login">
                    <Button size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-gray-600 dark:text-brand-gray-300 mb-2 uppercase">
                      Your Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= formData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-brand-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-gray-600 dark:text-brand-gray-300 mb-2 uppercase">
                      Your Review
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Share your experience with Penguin Stick stickers..."
                      maxLength={500}
                      className="w-full px-4 py-3 border border-brand-gray-200 dark:border-brand-gray-700 rounded-xl bg-white dark:bg-brand-dark text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
                      rows={5}
                    />
                    <p className="text-xs text-brand-gray-400 mt-1">
                      {formData.comment.length}/500
                    </p>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-brand-gray-500 mb-3 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-brand-primary/20" />
                      {profile?.full_name}
                    </p>
                    <Button
                      type="submit"
                      disabled={submitting || !formData.comment.trim()}
                      className="w-full"
                      size="sm"
                      icon={Send}
                      loading={submitting}
                    >
                      {userReview ? 'Update Review' : 'Submit Review'}
                    </Button>
                  </div>

                  {userReview && (
                    <p className="text-xs text-brand-gray-400 text-center">
                      You already have a review. Edit it above.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ─── Main Home Page ──────── */
const Home = () => {
  return (
    <>
      <Hero />
      <ScrollingBanner />
      <FeaturedStickers />
      <CustomOrdersCTA />
      <WhyChooseUs />
      <CustomerFeedback />
    </>
  )
}

export default Home
