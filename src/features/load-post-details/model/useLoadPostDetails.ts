import { useEffect } from 'react';

import { fetchPost, savePostDetails, usePostStore } from '@/entities/post';

import { loadPostDetails } from './loadPostDetails';

const deps = {
  getDetails: (postId: number) => usePostStore.getState().detailsById[postId],
  fetchPost,
  savePostDetails,
  inFlight: new Set<number>(),
};

// Background request: nothing about it is rendered (I-1).
export function useLoadPostDetails(postId: number): void {
  useEffect(() => {
    loadPostDetails(postId, deps);
  }, [postId]);
}
