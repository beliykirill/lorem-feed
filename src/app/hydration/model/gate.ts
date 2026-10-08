import { useSyncExternalStore } from 'react';

import { favoriteStoreHydration } from '@/entities/favorite';
import { postStoreHydration } from '@/entities/post';

import { createHydrationGate } from './hydrationGate';

// One gate per app, created at module level: a stable subscribe for useSyncExternalStore.
const hydrationGate = createHydrationGate([
  postStoreHydration,
  favoriteStoreHydration,
]);

export function useStoresHydrated(): boolean {
  return useSyncExternalStore(
    hydrationGate.subscribe,
    hydrationGate.getSnapshot,
  );
}
