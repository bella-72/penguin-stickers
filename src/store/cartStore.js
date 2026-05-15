import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
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
        return subtotal >= 300 ? 0 : 35
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
