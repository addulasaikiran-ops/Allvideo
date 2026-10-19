import { createStore } from './store.js';
import { createInput } from './input.js';
import { createPlayerState, stepPlayer } from './physics.js';

const initialState = {
  status: 'ready',
  elapsedSeconds: 0,
  checkpointId: 'start',
  assistMode: false,
  player: createPlayerState(),
};

export function createGameEngine({ onFrame = () => {}, now = () => performance.now(), inputTarget } = {}) {
  const store = createStore({ ...initialState, player: createPlayerState() });
  const input = createInput({ target: inputTarget ?? globalThis.window });
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

    const current = store.getState();
    stepPlayer(current.player, input.read(), deltaSeconds, current.assistMode);

    if (Math.floor(elapsedSeconds) > lastPublishedSecond) {
      lastPublishedSecond = Math.floor(elapsedSeconds);
      store.setState((state) => ({
        ...state,
        elapsedSeconds: lastPublishedSecond,
        checkpointId: state.player.checkpointId,
      }));
    }

    onFrame({ deltaSeconds, elapsedSeconds, player: current.player, state: store.getState() });
    frameHandle = requestAnimationFrame(frame);
  }

  return {
    store,
    input,
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
    resetToCheckpoint() {
      const player = store.getState().player;
      player.x = player.checkpointX;
      player.y = 0;
      player.velocityY = 0;
      player.grounded = true;
      player.respawnFlash = 0.45;
      store.setState((state) => ({ ...state, status: 'playing' }));
    },
    setAssistMode(enabled) {
      store.setState((state) => ({ ...state, assistMode: Boolean(enabled) }));
    },
    destroy() {
      this.stop();
      input.destroy();
    },
  };
}
