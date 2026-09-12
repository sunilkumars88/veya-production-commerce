import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Pure scoring logic test
function scoreSupplier(factors: { cost: number; inventory: number; sla: number; quality: number; returnRate: number; rtoRate: number }, weights = { cost: 0.25, inventory: 0.20, deliverySla: 0.20, quality: 0.20, returnRate: 0.075, rtoRate: 0.075 }) {
  return Math.round((
    factors.cost * weights.cost +
    factors.inventory * weights.inventory +
    factors.sla * weights.deliverySla +
    factors.quality * weights.quality +
    factors.returnRate * weights.returnRate +
    factors.rtoRate * weights.rtoRate
  ) * 10) / 10;
}

describe('Supplier Scoring', () => {
  it('scores higher quality supplier better', () => {
    const low = scoreSupplier({ cost: 50, inventory: 50, sla: 50, quality: 70, returnRate: 50, rtoRate: 50 });
    const high = scoreSupplier({ cost: 50, inventory: 50, sla: 50, quality: 95, returnRate: 50, rtoRate: 50 });
    assert.ok(high > low);
  });

  it('scores lower cost supplier better', () => {
    const expensive = scoreSupplier({ cost: 20, inventory: 50, sla: 50, quality: 80, returnRate: 50, rtoRate: 50 });
    const cheap = scoreSupplier({ cost: 90, inventory: 50, sla: 50, quality: 80, returnRate: 50, rtoRate: 50 });
    assert.ok(cheap > expensive);
  });

  it('returns score between 0 and 100', () => {
    const score = scoreSupplier({ cost: 50, inventory: 50, sla: 50, quality: 80, returnRate: 50, rtoRate: 50 });
    assert.ok(score >= 0 && score <= 100);
  });
});
