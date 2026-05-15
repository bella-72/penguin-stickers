import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 
            bg-white dark:bg-brand-dark
            border border-brand-gray-200 dark:border-brand-gray-700
            rounded-xl text-sm
            text-brand-gray-800 dark:text-brand-gray-200
            placeholder:text-brand-gray-400 dark:placeholder:text-brand-gray-500
            focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input

export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-3 
          bg-white dark:bg-brand-dark
          border border-brand-gray-200 dark:border-brand-gray-700
          rounded-xl text-sm resize-none
          text-brand-gray-800 dark:text-brand-gray-200
          placeholder:text-brand-gray-400
          focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
          transition-all duration-200
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5 
          bg-white dark:bg-brand-dark
          border border-brand-gray-200 dark:border-brand-gray-700
          rounded-xl text-sm appearance-none
          text-brand-gray-800 dark:text-brand-gray-200
          focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
          transition-all duration-200
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
})

Select.displayName = 'Select'
