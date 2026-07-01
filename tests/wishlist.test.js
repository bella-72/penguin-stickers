import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeProductId } from '../src/utils/helpers.js'

test('normalizeProductId preserves UUID strings and converts numbers to strings', () => {
  assert.equal(normalizeProductId('123e4567-e89b-12d3-a456-426614174000'), '123e4567-e89b-12d3-a456-426614174000')
  assert.equal(normalizeProductId(7), '7')
  assert.equal(normalizeProductId('7'), '7')
})
