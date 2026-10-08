import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createHydrationTracker, mmkvStorage } from '@/shared/lib/storage';

import type { FavoritesMap } from './types';

const STORAGE_KEY = 'favorite-store';

export type FavoriteState = {
  favorites: FavoritesMap;
  toggle: (postId: number) => void;
};

export const favoriteStoreHydration = createHydrationTracker(
  mmkvStorage,
  STORAGE_KEY,
);

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    set => ({
      favorites: {},
      toggle: postId =>
        set(({ favorites }) => {
          if (favorites[postId] !== undefined) {
            const rest = { ...favorites };
            delete rest[postId];
            return { favorites: rest };
          }
          return { favorites: { ...favorites, [postId]: Date.now() } };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: ({ favorites }) => ({ favorites }),
      onRehydrateStorage: favoriteStoreHydration.onRehydrateStorage,
    },
  ),
);

export const selectIsFavorite = (id: number) => (state: FavoriteState) =>
  state.favorites[id] !== undefined;
