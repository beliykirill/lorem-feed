import type { StateStorage } from 'zustand/middleware';

export type HydrationTracker = {
  // A factory: persist calls the returned callback after hydration.
  // Generic, otherwise it makes persist infer the store state as unknown.
  onRehydrateStorage: <S>() => (state: S | undefined, error?: unknown) => void;
  // Unlike persist.hasHydrated(), also true after recovery from an error.
  isDone: () => boolean;
  subscribe: (listener: () => void) => () => void;
};

// Corrupt data counts as no data: the key is removed, and zustand has already
// left the store in its initial state. The callback runs before create()
// returns, so it must not touch the store.
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
