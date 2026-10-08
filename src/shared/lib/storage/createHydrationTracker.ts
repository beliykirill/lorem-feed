import type { StateStorage } from 'zustand/middleware';

export type HydrationTracker = {
  // Pass to persist options. The returned callback runs after hydration.
  // Generic so that it does not drive persist's state type inference.
  onRehydrateStorage: <S>() => (state: S | undefined, error?: unknown) => void;
  // Hydration finished: successfully or after recovery.
  isDone: () => boolean;
  subscribe: (listener: () => void) => () => void;
};

// Tracks hydration of one persist store. On a hydration error the stored key is
// removed: corrupt data counts as no data, and the store keeps its initial state.
// The callback runs before create() returns, so it must not touch the store.
export function createHydrationTracker(
  storage: StateStorage,
  storageKey: string,
): HydrationTracker {
  let done = false;
  const listeners = new Set<() => void>();

  return {
    onRehydrateStorage: () => (_state, error) => {
      if (error) {
        storage.removeItem(storageKey);
        if (__DEV__) {
          console.warn(
            `Hydration of "${storageKey}" failed, data reset`,
            error,
          );
        }
      }
      done = true;
      listeners.forEach(listener => listener());
    },
    isDone: () => done,
    subscribe: listener => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
