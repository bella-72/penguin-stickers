import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canAddFreeSticker,
  countFreeStickerUnits,
  countPaidStickerUnits,
  getFreeStickerAllowance,
  getStickerBundleOffer,
  getStickerBundleProgress,
  hasBundleFreeShipping,
} from '../src/utils/stickerBundles.js'

test('bundle allowance is the highest single eligible offer, not cumulative', () => {
  assert.equal(getFreeStickerAllowance(4), 0)
  assert.equal(getFreeStickerAllowance(5), 1)
  assert.equal(getFreeStickerAllowance(10), 3)
  assert.equal(getFreeStickerAllowance(20), 7)
  assert.equal(getFreeStickerAllowance(50), 20)
  assert.equal(getFreeStickerAllowance(100), 20)
})

test('paid regular and custom sticker quantities combine; free gifts do not count', () => {
  const fiveStickerCart = [
    { quantity: 4, isCustom: false },
    { quantity: 1, isCustom: true },
    { quantity: 1, is_free_gift: true },
  ]
  const tenStickerCart = [
    { quantity: 8, isCustom: false },
    { quantity: 2, isCustom: true },
  ]

  assert.equal(countPaidStickerUnits(fiveStickerCart), 5)
  assert.equal(countFreeStickerUnits(fiveStickerCart), 1)
  assert.equal(getFreeStickerAllowance(countPaidStickerUnits(fiveStickerCart)), 1)
  assert.equal(countPaidStickerUnits(tenStickerCart), 10)
  assert.equal(getFreeStickerAllowance(countPaidStickerUnits(tenStickerCart)), 3)
})

test('all four offers count mixed regular and custom paid stickers and ignore gifts', () => {
  const expectedOffers = [
    { paidUnits: 5, freeGifts: 1 },
    { paidUnits: 10, freeGifts: 3 },
    { paidUnits: 20, freeGifts: 7 },
    { paidUnits: 50, freeGifts: 20 },
  ]

  for (const offer of expectedOffers) {
    const mixedCart = [
      { quantity: offer.paidUnits - 1, isCustom: false },
      { quantity: 1, isCustom: true },
      { quantity: 20, is_free_gift: true },
    ]

    assert.equal(countPaidStickerUnits(mixedCart), offer.paidUnits)
    assert.equal(getFreeStickerAllowance(countPaidStickerUnits(mixedCart)), offer.freeGifts)
  }
})

test('gift selections cannot exceed the current offer and allowance drops when paid units are removed', () => {
  const paidUnits = 20
  let selectedGifts = 7
  assert.equal(canAddFreeSticker(selectedGifts, getFreeStickerAllowance(paidUnits)), false)

  const remainingPaidUnits = 9
  const newAllowance = getFreeStickerAllowance(remainingPaidUnits)
  assert.equal(newAllowance, 1)
  assert.equal(selectedGifts > newAllowance, true)
  selectedGifts = newAllowance
  assert.equal(canAddFreeSticker(selectedGifts, newAllowance), false)
  assert.equal(canAddFreeSticker(selectedGifts - 1, newAllowance), true)
})

test('50 paid sticker units enable bundle free shipping', () => {
  assert.equal(hasBundleFreeShipping(49), false)
  assert.equal(hasBundleFreeShipping(50), true)
  assert.equal(getStickerBundleOffer(50).freeShipping, true)
})

test('offer progress describes the next tier and exact unlocked tiers', () => {
  assert.equal(getStickerBundleProgress(3).message, 'Add 2 more stickers to unlock 1 free sticker.')
  assert.equal(getStickerBundleProgress(5).message, "You've unlocked 1 free sticker!")
  assert.equal(getStickerBundleProgress(8).message, 'Add 2 more stickers to unlock 3 free stickers.')
  assert.equal(getStickerBundleProgress(10).message, "You've unlocked 3 free stickers!")
  assert.equal(getStickerBundleProgress(18).message, 'Add 2 more stickers to unlock 7 free stickers.')
  assert.equal(getStickerBundleProgress(20).message, "You've unlocked 7 free stickers!")
  assert.equal(getStickerBundleProgress(50).message, "You've unlocked 20 free stickers + FREE SHIPPING!")
})
