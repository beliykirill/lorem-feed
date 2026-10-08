import { useCallback } from 'react';

import { selectIsFavorite, useFavoriteStore } from '@/entities/favorite';

export function useToggleFavorite(postId: number) {
  const isFavorite = useFavoriteStore(selectIsFavorite(postId));
  const toggleFavorite = useFavoriteStore(state => state.toggle);

  const toggle = useCallback(
    () => toggleFavorite(postId),
    [toggleFavorite, postId],
  );

  return { isFavorite, toggle };
}
