import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'

const About = () => (
  <div className="min-h-screen">
    <div className="bg-gradient-to-br from-mint-50 to-brand-light dark:from-brand-dark dark:to-[#0f0f1a] py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-outfit text-4xl md:text-5xl font-bold text-brand-gray-900 dark:text-white mb-4">About Penguin Stick</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-brand-gray-500 dark:text-brand-gray-400 max-w-xl mx-auto text-lg">
          We're a Cairo-based sticker studio passionate about creating premium, die-cut vinyl stickers that bring joy to everyday life.
        </motion.p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-outfit text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-brand-gray-600 dark:text-brand-gray-400 leading-relaxed mb-4">
            Penguin Stick started with a simple idea: stickers should be more than decorative — they should be an expression of who you are.
          </p>
          <p className="text-brand-gray-600 dark:text-brand-gray-400 leading-relaxed">
            We use premium vinyl materials, eco-friendly inks, and precision die-cutting to create stickers that last. Every design is crafted with love and attention to detail.
          </p>
        </div>
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-mint-100 to-mint-50 dark:from-mint-900/20 dark:to-brand-dark flex items-center justify-center">
          <span className="text-8xl">🐧</span>
        </div>
      </section>

      <section>
        <h2 className="font-outfit text-2xl font-bold mb-6 text-center">Get In Touch</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MapPin, label: 'Location', value: 'Cairo, Egypt' },
            { icon: Mail, label: 'Email', value: 'hello@penguinstick.com' },
            { icon: Phone, label: 'Phone', value: '+20 123 456 7890' },
            { icon: Clock, label: 'Hours', value: 'Sat-Thu, 10AM-6PM' },
          ].map((item) => (
            <div key={item.label} className="bg-white dark:bg-brand-dark rounded-2xl p-5 shadow-card text-center">
              <item.icon className="w-6 h-6 text-brand-primary mx-auto mb-3" />
              <p className="text-xs text-brand-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
)

export default About
