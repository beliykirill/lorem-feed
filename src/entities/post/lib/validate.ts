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

  // Copy the fields: Pick narrows only the type, userId would stay in the object.
  return { id, title, body };
}

// An empty array is valid here: load-posts decides that it is not a success.
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
