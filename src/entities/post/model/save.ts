import type { ValidatedPostDto } from '../api/types';
import { enrichPosts, toPostDetails } from '../lib/enrich';
import { usePostStore } from './store';

// Enrich and save. The only way out of the slice to the enrichment.
export function savePostList(dtos: ValidatedPostDto[]): void {
  usePostStore.getState().saveList(enrichPosts(dtos));
}

export function savePostDetails(postId: number, dto: ValidatedPostDto): void {
  const { posts, saveDetails } = usePostStore.getState();
  const post = posts.find(item => item.id === postId);
  // Unreachable today: details open only from the list. Without the post there is no seed.
  if (!post) {
    if (__DEV__) {
      console.warn(`Post ${postId} is not in the list, details are not saved`);
    }
    return;
  }
  saveDetails(postId, toPostDetails(dto, post));
}
