import { createStore } from './store.js';

const initialState = {
  status: 'ready',
  elapsedSeconds: 0,
  checkpointId: 'start',
  assistMode: false,
};

/**
 * Minimal simulation shell. It deliberately has no React or rendering dependency.
 * The frame callback can run every frame, but UI-facing store updates are throttled
 * to whole elapsed seconds rather than published at display refresh rate.
 */
export function createGameEngine({ onFrame = () => {}, now = () => performance.now() } = {}) {
  const store = createStore({ ...initialState });
  let frameHandle = null;
  let previousTime = 0;
  let elapsedSeconds = 0;
  let lastPublishedSecond = 0;
  let running = false;

  function frame(timestamp) {
    if (!running) return;
    const deltaSeconds = previousTime === 0 ? 0 : Math.min((timestamp - previousTime) / 1000, 0.05);
    previousTime = timestamp;
    elapsedSeconds += deltaSeconds;

    if (Math.floor(elapsedSeconds) > lastPublishedSecond) {
      lastPublishedSecond = Math.floor(elapsedSeconds);
      store.setState((state) => ({ ...state, elapsedSeconds: lastPublishedSecond }));
    }

    onFrame({ deltaSeconds, elapsedSeconds, state: store.getState() });
    frameHandle = requestAnimationFrame(frame);
  }

  return {
    store,
    start() {
      if (running || typeof requestAnimationFrame !== 'function') return;
      running = true;
      previousTime = now();
      frameHandle = requestAnimationFrame(frame);
      store.setState((state) => ({ ...state, status: 'playing' }));
    },
    stop() {
      running = false;
      if (frameHandle !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(frameHandle);
      }
      frameHandle = null;
      previousTime = 0;
      store.setState((state) => ({ ...state, status: 'paused' }));
    },
    resetToCheckpoint(checkpointId = store.getState().checkpointId) {
      store.setState((state) => ({
        ...state,
        status: 'playing',
        checkpointId,
      }));
    },
    setAssistMode(enabled) {
      store.setState((state) => ({ ...state, assistMode: Boolean(enabled) }));
    },
    destroy() {
      this.stop();
    },
  };
}
