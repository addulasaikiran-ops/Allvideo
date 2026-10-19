import { useSyncExternalStore } from 'react';

/**
 * React subscribes to discrete engine state changes, never to the render loop itself.
 * Components should select only the state they need and avoid publishing every frame.
 */
export function useEngineStore(store) {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
