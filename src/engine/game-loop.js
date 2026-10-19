export const FIXED_STEP = 1 / 60;
const MAX_FRAME_DELTA = 0.25;
const MAX_STEPS_PER_FRAME = 8;

/** Fixed 60Hz simulation loop with interpolated rendering and frame-gap protection. */
export function createGameLoop({
  update,
  render,
  requestFrame = globalThis.requestAnimationFrame?.bind(globalThis),
  cancelFrame = globalThis.cancelAnimationFrame?.bind(globalThis),
  now = () => globalThis.performance?.now?.() ?? Date.now(),
  step = FIXED_STEP,
} = {}) {
  if (typeof update !== 'function' || typeof render !== 'function') throw new TypeError('Game loop requires update and render callbacks.');
  let running = false;
  let frameHandle = null;
  let lastTime = null;
  let accumulator = 0;
  let simulationTime = 0;
  let droppedTime = 0;

  function frame(timestamp) {
    if (!running) return;
    const current = Number.isFinite(timestamp) ? timestamp : now();
    const rawDelta = lastTime === null ? 0 : Math.max(0, (current - lastTime) / 1000);
    lastTime = current;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    droppedTime += Math.max(0, rawDelta - delta);
    accumulator += delta;
    let steps = 0;
    while (accumulator >= step && steps < MAX_STEPS_PER_FRAME) {
      update(step);
      simulationTime += step;
      accumulator -= step;
      steps += 1;
    }
    if (accumulator >= step) {
      const retained = accumulator % step;
      droppedTime += accumulator - retained;
      accumulator = retained;
    }
    render(accumulator / step, { deltaSeconds: delta, rawDeltaSeconds: rawDelta, simulationTime, steps, droppedTime });
    if (running && requestFrame) frameHandle = requestFrame(frame);
  }
  return {
    start() {
      if (running) return;
      if (typeof requestFrame !== 'function') throw new Error('requestAnimationFrame is unavailable; provide requestFrame.');
      running = true;
      lastTime = null;
      frameHandle = requestFrame(frame);
    },
    stop() {
      running = false;
      if (frameHandle !== null && typeof cancelFrame === 'function') cancelFrame(frameHandle);
      frameHandle = null;
      lastTime = null;
    },
    advance(timestamp) { if (!running) running = true; frame(timestamp); },
    get running() { return running; },
    get simulationTime() { return simulationTime; },
    get droppedTime() { return droppedTime; },
    get interpolationAlpha() { return accumulator / step; },
  };
}
