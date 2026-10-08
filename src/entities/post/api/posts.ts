import { API_BASE_URL, fetchJson } from '@/shared/api';

import { validatePost, validatePosts } from '../lib/validate';
import type { ValidatedPostDto } from './types';

export async function fetchPosts(): Promise<ValidatedPostDto[]> {
  return validatePosts(await fetchJson(`${API_BASE_URL}/posts`));
}

// Also throws when the response id differs from postId (R-3).
export async function fetchPost(postId: number): Promise<ValidatedPostDto> {
  return validatePost(
    await fetchJson(`${API_BASE_URL}/posts/${postId}`),
    postId,
  );
}
