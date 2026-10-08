import type { FavoritesMap } from '@/entities/favorite';
import type { Post } from '@/entities/post';

export type SortedPost = Post & { isFavorite: boolean };

// Favorites first, most recently added on top; the rest keep the API order.
// Does not mutate the input.
export function sortPosts(
  posts: readonly Post[],
  favorites: FavoritesMap,
): SortedPost[] {
  const favorite: SortedPost[] = [];
  const rest: SortedPost[] = [];
  for (const post of posts) {
    if (favorites[post.id] !== undefined) {
      favorite.push({ ...post, isFavorite: true });
    } else {
      rest.push({ ...post, isFavorite: false });
    }
  }
  favorite.sort((a, b) => favorites[b.id] - favorites[a.id]);
  return [...favorite, ...rest];
}
