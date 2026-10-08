import { useCallback, useEffect } from 'react';

import { fetchPosts, savePostList, usePostStore } from '@/entities/post';

import { loadPosts } from './loadPosts';

const deps = { getState: usePostStore.getState, fetchPosts, savePostList };

export function useLoadPosts() {
  const status = usePostStore(state => state.listStatus);
  const isListLoaded = usePostStore(state => state.isListLoaded);

  useEffect(() => {
    loadPosts(deps);
  }, []);

  const retry = useCallback(() => {
    loadPosts(deps);
  }, []);

  return { status, isListLoaded, retry };
}
