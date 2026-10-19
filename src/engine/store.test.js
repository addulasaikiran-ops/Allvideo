import { describe, expect, it, vi } from 'vitest';
import { createStore } from './store.js';

describe('createStore', () => {
  it('updates state and notifies subscribers', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.setState({ count: 1 });

    expect(store.getState()).toEqual({ count: 1 });
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.setState({ count: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('supports functional updates and ignores identical state references', () => {
    const initial = { ready: false };
    const store = createStore(initial);
    const listener = vi.fn();
    store.subscribe(listener);

    store.setState((state) => ({ ...state, ready: true }));
    expect(store.getState()).toEqual({ ready: true });
    store.setState(store.getState());
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
