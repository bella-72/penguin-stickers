import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-brand-dark border-t border-brand-gray-100 dark:border-brand-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-mint flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <ellipse cx="12" cy="12" rx="5" ry="7" fill="white"/>
                  <circle cx="10" cy="10" r="1" fill="#1a1a2e"/>
                  <circle cx="14" cy="10" r="1" fill="#1a1a2e"/>
                  <polygon points="12,12 11,13.5 13,13.5" fill="#F39C12"/>
                </svg>
              </div>
              <span className="font-outfit font-bold text-xl text-brand-primary">Penguin Stick</span>
            </Link>
            <p className="text-sm text-brand-gray-500 dark:text-brand-gray-400 leading-relaxed">
              Premium custom die-cut stickers. Made with love for stationery enthusiasts. Waterproof, vinyl, eco-friendly.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/penguin.stick/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-gray-100 dark:bg-brand-gray-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 text-brand-gray-500">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61583595386505&rdid=kzJqx3NPyebdYMwj&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DxbzqNYRq%2F#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-gray-100 dark:bg-brand-gray-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 text-brand-gray-500">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-outfit font-semibold text-sm uppercase tracking-wider text-brand-gray-800 dark:text-brand-gray-200 mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {['All Stickers', 'New Arrivals', 'Best Sellers', 'Custom Stickers', 'Sale'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-sm text-brand-gray-500 dark:text-brand-gray-400 hover:text-brand-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-outfit font-semibold text-sm uppercase tracking-wider text-brand-gray-800 dark:text-brand-gray-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Privacy Policy', path: '/about' },
                { name: 'Terms of Service', path: '/about' },
                { name: 'Shipping & Returns', path: '/about' },
                { name: 'Contact Us', path: '/about' },
                { name: 'FAQ', path: '/about' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-brand-gray-500 dark:text-brand-gray-400 hover:text-brand-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-outfit font-semibold text-sm uppercase tracking-wider text-brand-gray-800 dark:text-brand-gray-200 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-brand-gray-500 dark:text-brand-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                Cairo, Egypt
              </li>
              <li className="flex items-start gap-3 text-sm text-brand-gray-500 dark:text-brand-gray-400">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="tel:01143608754" className="hover:text-brand-primary transition-colors">01143608754</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-brand-gray-500 dark:text-brand-gray-400">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="mailto:mbasmla76@gmail.com" className="hover:text-brand-primary transition-colors">mbasmla76@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-gray-100 dark:border-brand-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-brand-gray-400">
            © 2026 Penguin Stick. Made with love for stationery enthusiasts.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Contact Us', 'FAQ'].map((item) => (
              <Link key={item} to="/about" className="text-xs text-brand-gray-400 hover:text-brand-primary transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
