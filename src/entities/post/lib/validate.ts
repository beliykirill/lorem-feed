import type { ValidatedPostDto } from '../api/types';

function toValidatedPost(item: unknown): ValidatedPostDto {
  if (typeof item !== 'object' || item === null) {
    throw new Error('Invalid post: not an object');
  }
  const { id, title, body } = item as Record<string, unknown>;
  if (
    typeof id !== 'number' ||
    typeof title !== 'string' ||
    typeof body !== 'string'
  ) {
    throw new Error('Invalid post: id, title or body has a wrong type');
  }
  // A new object: fields outside the model (userId) are dropped.
  return { id, title, body };
}

// Checks structure only. An empty array is valid here; load-posts rejects it.
export function validatePosts(data: unknown): ValidatedPostDto[] {
  if (!Array.isArray(data)) {
    throw new Error('Invalid posts response: not an array');
  }
  return data.map(toValidatedPost);
}

export function validatePost(
  data: unknown,
  expectedId: number,
): ValidatedPostDto {
  const post = toValidatedPost(data);
  if (post.id !== expectedId) {
    throw new Error(
      `Invalid post response: id ${post.id}, expected ${expectedId}`,
    );
  }
  return post;
}
