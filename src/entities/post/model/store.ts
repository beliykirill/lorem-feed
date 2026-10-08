import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createHydrationTracker, mmkvStorage } from '@/shared/lib/storage';

import type { ListStatus, Post, PostDetails } from './types';

const STORAGE_KEY = 'post-store';

export type PostState = {
  posts: Post[];
  isListLoaded: boolean;
  detailsById: Record<number, PostDetails>;
  listStatus: ListStatus;
  setListStatus: (status: ListStatus) => void;
  saveList: (posts: Post[]) => void;
  saveDetails: (postId: number, details: PostDetails) => void;
};

export const postStoreHydration = createHydrationTracker(
  mmkvStorage,
  STORAGE_KEY,
);

export const usePostStore = create<PostState>()(
  persist(
    set => ({
      posts: [],
      isListLoaded: false,
      detailsById: {},
      listStatus: 'idle',
      setListStatus: listStatus => set({ listStatus }),
      saveList: posts => set({ posts, isListLoaded: true, listStatus: 'idle' }),
      saveDetails: (postId, details) =>
        set(state => ({
          detailsById: { ...state.detailsById, [postId]: details },
        })),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => mmkvStorage),
      // Statuses are transient and never persisted.
      partialize: ({ posts, isListLoaded, detailsById }) => ({
        posts,
        isListLoaded,
        detailsById,
      }),
      onRehydrateStorage: postStoreHydration.onRehydrateStorage,
    },
  ),
);
