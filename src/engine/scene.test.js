import { describe, expect, it } from 'vitest';
import { createQualityScaler } from './quality.js';

describe('world renderer prerequisites', () => {
  it('uses a conservative quality mode until enough frame samples exist', () => {
    const quality = createQualityScaler({ sampleSize: 2 });
    expect(quality.getQuality()).toBe('high');
    expect(quality.sample(1 / 60)).toBe('high');
    expect(quality.sample(1 / 60)).toBe('high');
  });
});
