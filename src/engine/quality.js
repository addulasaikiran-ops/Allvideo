export function createQualityScaler({ targetFps = 50, sampleSize = 90 } = {}) {
  let frames = 0;
  let totalMs = 0;
  let quality = 'high';

  return {
    getQuality: () => quality,
    sample(deltaSeconds) {
      if (!(deltaSeconds > 0) || !Number.isFinite(deltaSeconds)) return quality;
      frames += 1;
      totalMs += deltaSeconds * 1000;
      if (frames < sampleSize) return quality;

      const averageFps = 1000 / (totalMs / frames);
      if (averageFps < targetFps * 0.72) quality = quality === 'high' ? 'medium' : 'low';
      else if (averageFps > targetFps * 0.94) quality = quality === 'low' ? 'medium' : 'high';

      frames = 0;
      totalMs = 0;
      return quality;
    },
  };
}
