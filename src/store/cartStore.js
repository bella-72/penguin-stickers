import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getShippingRate } from '@/utils/helpers'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      selectedGovernorate: '',
      
      setGovernorate: (governorate) => {
        set({ selectedGovernorate: governorate })
      },
      
      addItem: (product, quantity = 1, finishType = 'matte') => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.id === product.id && item.finish_type === finishType
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.finish_type === finishType
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return {
            items: [...state.items, {
              id: product.id,
              product_id: product.id,
              product,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || product.image || '',
              quantity,
              finish_type: finishType,
              category: product.categories?.name || ''
            }],
          }
        })
      },

      removeItem: (id, finishType) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.finish_type === finishType)
          ),
        }))
      },

      updateQuantity: (id, finishType, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, finishType)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.finish_type === finishType
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        // Free shipping for orders >= 500 EGP
        if (subtotal >= 500) return 0
        
        const governorate = get().selectedGovernorate
        // Return 0 if no governorate selected yet
        if (!governorate) return 0
        return getShippingRate(governorate)
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShipping()
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'penguin-cart',
    }
  )
)
