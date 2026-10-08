import { API_BASE_URL, fetchJson } from '@/shared/api';

import { validatePost, validatePosts } from '../lib/validate';
import type { ValidatedPostDto } from './types';

// Throws on network, HTTP or validation errors.
export async function fetchPosts(): Promise<ValidatedPostDto[]> {
  return validatePosts(await fetchJson(`${API_BASE_URL}/posts`));
}

// Throws as fetchPosts, and when the response id differs from postId.
export async function fetchPost(postId: number): Promise<ValidatedPostDto> {
  return validatePost(
    await fetchJson(`${API_BASE_URL}/posts/${postId}`),
    postId,
  );
}
