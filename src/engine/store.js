/**
 * Tiny framework-independent external store.
 * The engine owns state updates; UI consumers subscribe at a UI-appropriate cadence.
 */
export function createStore(initialState = {}) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    setState(update) {
      const nextState = typeof update === 'function' ? update(state) : update;
      if (Object.is(nextState, state)) return state;
      state = nextState;
      for (const listener of listeners) listener();
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
