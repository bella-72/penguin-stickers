import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Droplets, Award, Truck, Leaf, Star, ChevronRight, Mail } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'
import { demoProducts, demoReviews } from '@/utils/helpers'

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
              <span className="text-sm font-medium text-brand-primary">New Collection 2024</span>
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

/* ─── Testimonials ──────── */
const Testimonials = () => (
  <Section className="py-20 bg-brand-gray-50/50 dark:bg-brand-dark/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-sm font-medium text-brand-primary uppercase tracking-wider mb-2">Social proof</p>
      <h2 className="font-outfit text-3xl md:text-4xl font-bold text-brand-gray-900 dark:text-white mb-4">
        What Our Stick-Fans Say
      </h2>
      <p className="text-brand-gray-500 dark:text-brand-gray-400 mb-12">
        Join over 10,000+ happy customers who love their stickers.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {demoReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-white dark:bg-brand-dark rounded-2xl p-6 shadow-card text-left"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-brand-gray-600 dark:text-brand-gray-300 leading-relaxed mb-4">
              "{review.comment}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-mint flex items-center justify-center text-white font-bold text-sm">
                {review.user_name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-gray-800 dark:text-white">{review.user_name}</p>
                <p className="text-xs text-brand-gray-400">Verified Buyer</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
)

/* ─── Newsletter ──────── */
const Newsletter = () => {
  const [email, setEmail] = useState('')
  return (
    <Section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-3xl p-8 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold">Stay In The Loop</h2>
            <p className="text-white/80">
              Get 15% off your first order and be the first to know about new designs, sales, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-brand-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <button className="px-6 py-3 bg-white text-brand-primary font-semibold rounded-full hover:bg-white/90 transition-colors text-sm whitespace-nowrap">
                Subscribe
              </button>
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
      <Testimonials />
      <Newsletter />
    </>
  )
}

export default Home
