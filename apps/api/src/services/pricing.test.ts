import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Unit tests for pricing logic (pure functions)

function calculateDiscount(type: 'PERCENT' | 'FIXED', value: number, subtotal: number, maxDiscount?: number) {
  let discount = type === 'PERCENT' ? Math.floor(subtotal * value / 100) : value;
  if (maxDiscount) discount = Math.min(discount, maxDiscount);
  return discount;
}

function calculateShipping(subtotal: number, discount: number, freeThreshold: number, defaultCost: number) {
  return subtotal - discount >= freeThreshold ? 0 : defaultCost;
}

describe('Pricing', () => {
  it('calculates percent discount', () => {
    assert.equal(calculateDiscount('PERCENT', 10, 1000), 100);
  });

  it('calculates fixed discount', () => {
    assert.equal(calculateDiscount('FIXED', 100, 1000), 100);
  });

  it('respects max discount cap', () => {
    assert.equal(calculateDiscount('PERCENT', 50, 1000, 200), 200);
  });

  it('free shipping above threshold', () => {
    assert.equal(calculateShipping(1000, 0, 999, 79), 0);
  });

  it('charges shipping below threshold', () => {
    assert.equal(calculateShipping(500, 0, 999, 79), 79);
  });

  it('free shipping after discount', () => {
    assert.equal(calculateShipping(1100, 100, 999, 79), 0);
  });
});
