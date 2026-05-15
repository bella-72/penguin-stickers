export const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'skeleton rounded-xl animate-pulse'
  
  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />
  }
  
  if (variant === 'text') {
    return <div className={`${base} h-4 ${className}`} />
  }

  return <div className={`${base} ${className}`} />
}

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-brand-dark rounded-2xl overflow-hidden shadow-card">
    <Skeleton className="w-full h-52" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="text" className="w-1/3" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>
    </div>
  </div>
)

export const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
    <Skeleton className="w-64 h-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
)
