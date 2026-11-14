import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CUSTOM_STICKER_PRICE, getShippingRate } from '@/utils/helpers'
import {
  canAddFreeSticker,
  countFreeStickerUnits,
  countPaidStickerUnits,
  getFreeStickerAllowance,
  hasBundleFreeShipping,
} from '@/utils/stickerBundles'

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
            (item) => item.id === product.id && item.finish_type === finishType && !item.is_free_gift
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.finish_type === finishType && !item.is_free_gift
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          const isCustom = Boolean(product.isCustom)
          const price = isCustom ? CUSTOM_STICKER_PRICE : product.price
          const cartProduct = isCustom ? { ...product, price } : product

          return {
            items: [...state.items, {
              id: product.id,
              product_id: product.id,
              product: cartProduct,
              name: product.name,
              price,
              original_price: isCustom ? null : (product.original_price ?? null),
              isCustom,
              image: product.images?.[0] || product.image || '',
              quantity,
              finish_type: finishType,
              category: product.categories?.name || ''
            }],
          }
        })
      },

      addFreeGift: (product, finishType = 'matte') => {
        set((state) => {
          const giftCount = countFreeStickerUnits(state.items)
          const allowance = getFreeStickerAllowance(countPaidStickerUnits(state.items))
          if (!canAddFreeSticker(giftCount, allowance)) return state

          const existing = state.items.find(
            (item) => item.id === product.id && item.finish_type === finishType && item.is_free_gift
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item === existing ? { ...item, quantity: item.quantity + 1 } : item
              ),
            }
          }

          return {
            items: [...state.items, {
              id: product.id,
              product_id: product.id,
              product,
              name: product.name,
              price: 0,
              original_price: null,
              isCustom: false,
              is_free_gift: true,
              image: product.images?.[0] || product.image || '',
              quantity: 1,
              finish_type: finishType,
              category: product.categories?.name || '',
            }],
          }
        })
      },

      removeItem: (id, finishType, isFreeGift = false) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.finish_type === finishType && Boolean(item.is_free_gift) === isFreeGift)
          ),
        }))
      },

      updateQuantity: (id, finishType, quantity, isFreeGift = false) => {
        if (quantity <= 0) {
          get().removeItem(id, finishType, isFreeGift)
          return
        }
        const item = get().items.find(
          (entry) => entry.id === id && entry.finish_type === finishType && Boolean(entry.is_free_gift) === isFreeGift
        )
        if (isFreeGift) {
          const otherGiftCount = countFreeStickerUnits(get().items) - (item?.quantity || 0)
          const allowance = getFreeStickerAllowance(countPaidStickerUnits(get().items))
          if (otherGiftCount + quantity > allowance) return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.finish_type === finishType && Boolean(item.is_free_gift) === isFreeGift
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      syncProductPrices: (products) => {
        const pricesById = new Map(products.map((product) => [
          product.id,
          { price: Number(product.price), original_price: product.original_price },
        ]))
        set((state) => ({
          items: state.items.map((item) => {
            if (item.is_free_gift) return item
            const productPrices = pricesById.get(item.product_id || item.id)
            if (productPrices === undefined) return item
            return {
              ...item,
              ...productPrices,
              product: item.product ? { ...item.product, ...productPrices } : item.product,
            }
          }),
        }))
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.is_free_gift ? 0 : item.price * item.quantity), 0)
      },

      getShipping: () => {
        const subtotal = get().getSubtotal()
        if (hasBundleFreeShipping(countPaidStickerUnits(get().items))) return 0
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

      getPaidStickerCount: () => countPaidStickerUnits(get().items),
      getFreeStickerCount: () => countFreeStickerUnits(get().items),
      getFreeStickerAllowance: () => getFreeStickerAllowance(countPaidStickerUnits(get().items)),
    }),
    {
      name: 'penguin-cart',
      version: 3,
      migrate: (persistedState) => ({
        ...persistedState,
        items: (persistedState.items || []).map((item) => {
          if (item.is_free_gift) {
            return {
              ...item,
              price: 0,
              original_price: null,
              isCustom: false,
            }
          }
          const isCustom = item.isCustom || item.product?.isCustom || item.id?.startsWith('custom-')
          if (!isCustom) return item

          return {
            ...item,
            price: CUSTOM_STICKER_PRICE,
            original_price: null,
            isCustom: true,
            product: item.product
              ? { ...item.product, price: CUSTOM_STICKER_PRICE }
              : item.product,
          }
        }),
      }),
    }
  )
)
