import { Star } from 'lucide-react'

export const StarRating = ({ rating, size = 'sm', interactive = false, onChange }) => {
  const sizeMap = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <Star
            className={`${sizeMap[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-brand-gray-300 dark:text-brand-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-brand-gray-100 text-brand-gray-700 dark:bg-brand-gray-800 dark:text-brand-gray-300',
    primary: 'bg-brand-primary/10 text-brand-primary',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    new: 'bg-gradient-mint text-white',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export const QuantitySelector = ({ value, onChange, min = 1, max = 99 }) => (
  <div className="flex items-center gap-1 bg-brand-gray-50 dark:bg-brand-gray-800 rounded-full p-0.5">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-brand-gray-700 transition-colors text-brand-gray-600 dark:text-brand-gray-300"
    >
      −
    </button>
    <span className="w-8 text-center text-sm font-medium">{value}</span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-brand-gray-700 transition-colors text-brand-gray-600 dark:text-brand-gray-300"
    >
      +
    </button>
  </div>
)

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {Icon && (
      <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-brand-primary" />
      </div>
    )}
    <h3 className="font-outfit text-xl font-semibold text-brand-gray-800 dark:text-brand-gray-200 mb-2">{title}</h3>
    {description && (
      <p className="text-brand-gray-500 dark:text-brand-gray-400 max-w-md mb-6">{description}</p>
    )}
    {action}
  </div>
)
