import { useMemo } from 'react';

import { useFavoriteStore } from '@/entities/favorite';
import { usePostStore } from '@/entities/post';

import { sortPosts } from './sort-posts';

export function useSortedPosts() {
  const posts = usePostStore(state => state.posts);
  const favorites = useFavoriteStore(state => state.favorites);

  return useMemo(() => sortPosts(posts, favorites), [posts, favorites]);
}
