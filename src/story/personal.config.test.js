import { describe, expect, it } from 'vitest';
import { personalConfig } from './personal.config.js';

describe('Memory Lane personal configuration', () => {
  it('provides four editable memory scenes with unique ids and safe empty photo defaults', () => {
    expect(personalConfig.memoryScenes).toHaveLength(4);
    expect(personalConfig.memoryScenes.map((scene) => scene.id)).toEqual([
      'first-meeting', 'rainy-umbrella', 'shared-meal', 'stargazing-night',
    ]);
    expect(new Set(personalConfig.memoryScenes.map((scene) => scene.id)).size).toBe(4);
    for (const scene of personalConfig.memoryScenes) {
      expect(scene.title).toBeTruthy();
      expect(scene.caption).toBeTruthy();
      expect(typeof scene.date).toBe('string');
      expect(scene.photo).toBe('');
    }
  });
});
