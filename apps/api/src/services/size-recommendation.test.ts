import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { recommendSize } from './size-recommendation.js';

describe('Size Recommendation', () => {
  it('recommends from bra size', () => {
    const result = recommendSize({ existingBraSize: '36B' });
    assert.equal(result.recommendedSize, 'M');
    assert.ok(result.confidence >= 80);
  });

  it('recommends from measurements', () => {
    const result = recommendSize({ bust: 86, waist: 68, hip: 92 });
    assert.ok(['S', 'M', 'L'].includes(result.recommendedSize));
    assert.ok(result.confidence > 0);
  });

  it('adjusts for relaxed fit', () => {
    const result = recommendSize({ existingBraSize: '36B', preferredFit: 'relaxed' });
    assert.ok(['L', 'XL'].includes(result.recommendedSize) || result.alternativeSize === 'L');
  });

  it('provides reason', () => {
    const result = recommendSize({ bust: 86, waist: 68 });
    assert.ok(result.reason.length > 10);
  });
});
