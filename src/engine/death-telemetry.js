const STORAGE_KEY = 'allvideo.death-telemetry.v1';

/** Anonymous, local-only hotspot counters. Never records names, input, or session identifiers. */
export function createDeathTelemetry({ storage = globalThis.localStorage, key = STORAGE_KEY } = {}) {
  function read() {
    try {
      const value = JSON.parse(storage?.getItem(key) ?? '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }
  function locationKey(chapter, x, y) {
    const bucketX = Math.floor((Number(x) || 0) / 5) * 5;
    const bucketY = Math.floor((Number(y) || 0) / 3) * 3;
    return `${chapter || 'unknown'} · x ${bucketX}–${bucketX + 5}, y ${bucketY}–${bucketY + 3}`;
  }
  function record({ chapter, x, y } = {}) {
    const data = read();
    const location = locationKey(chapter, x, y);
    data[location] = { deaths: (Number(data[location]?.deaths) || 0) + 1, lastSeen: Date.now() };
    try { storage?.setItem(key, JSON.stringify(data)); } catch { /* Telemetry is optional when storage is blocked. */ }
    return { location, deaths: data[location].deaths };
  }
  function hotspots() {
    return Object.entries(read()).map(([location, value]) => ({ location, deaths: Number(value?.deaths) || 0, lastSeen: Number(value?.lastSeen) || 0 }))
      .sort((a, b) => b.deaths - a.deaths || b.lastSeen - a.lastSeen);
  }
  function clear() { try { storage?.removeItem(key); } catch { /* Optional local storage. */ } }
  return { record, hotspots, clear, locationKey };
}
