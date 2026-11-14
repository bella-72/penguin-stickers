export const stickerBundleOffers = [
  { minimumPaidStickers: 5, freeStickers: 1 },
  { minimumPaidStickers: 10, freeStickers: 3 },
  { minimumPaidStickers: 20, freeStickers: 7 },
  { minimumPaidStickers: 50, freeStickers: 20, freeShipping: true },
]

export const getStickerBundleOffer = (paidStickerCount) =>
  [...stickerBundleOffers]
    .reverse()
    .find((offer) => paidStickerCount >= offer.minimumPaidStickers) || null

export const getFreeStickerAllowance = (paidStickerCount) =>
  getStickerBundleOffer(paidStickerCount)?.freeStickers || 0

export const canAddFreeSticker = (selectedGiftCount, allowance) =>
  selectedGiftCount < allowance

export const hasBundleFreeShipping = (paidStickerCount) =>
  paidStickerCount >= 50

export const getStickerBundleProgress = (paidStickerCount) => {
  const unlockedOffer = stickerBundleOffers.find(
    (offer) => offer.minimumPaidStickers === paidStickerCount
  )

  if (paidStickerCount >= 50) {
    return {
      message: "You've unlocked 20 free stickers + FREE SHIPPING!",
      progressPercent: 100,
    }
  }

  if (unlockedOffer) {
    return {
      message: `You've unlocked ${unlockedOffer.freeStickers} free sticker${unlockedOffer.freeStickers === 1 ? '' : 's'}!`,
      progressPercent: 100,
    }
  }

  const nextOffer = stickerBundleOffers.find(
    (offer) => paidStickerCount < offer.minimumPaidStickers
  )
  const remaining = nextOffer.minimumPaidStickers - paidStickerCount

  return {
    message: `Add ${remaining} more sticker${remaining === 1 ? '' : 's'} to unlock ${nextOffer.freeStickers} free sticker${nextOffer.freeStickers === 1 ? '' : 's'}.`,
    progressPercent: Math.min(100, (paidStickerCount / nextOffer.minimumPaidStickers) * 100),
  }
}

export const countPaidStickerUnits = (items) =>
  items.reduce((count, item) => count + (item.is_free_gift ? 0 : Number(item.quantity) || 0), 0)

export const countFreeStickerUnits = (items) =>
  items.reduce((count, item) => count + (item.is_free_gift ? Number(item.quantity) || 0 : 0), 0)
