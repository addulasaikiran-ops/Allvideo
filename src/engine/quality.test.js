import { describe, expect, it } from 'vitest';
import { createQualityScaler } from './quality.js';

describe('quality scaler', () => {
  it('lowers quality when frame times are consistently slow', () => {
    const scaler = createQualityScaler({ sampleSize: 3 });
    scaler.sample(0.04);
    scaler.sample(0.04);
    expect(scaler.sample(0.04)).toBe('medium');
  });

  it('ignores invalid frame samples', () => {
    const scaler = createQualityScaler();
    expect(scaler.sample(0)).toBe('high');
    expect(scaler.sample(Number.NaN)).toBe('high');
  });
});
