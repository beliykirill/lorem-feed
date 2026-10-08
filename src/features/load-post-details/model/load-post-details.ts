import type { PostDetails, ValidatedPostDto } from '@/entities/post';

export type LoadPostDetailsDeps = {
  getDetails: (postId: number) => PostDetails | undefined;
  fetchPost: (postId: number) => Promise<ValidatedPostDto>;
  savePostDetails: (postId: number, dto: ValidatedPostDto) => void;
  // Ids with a request in flight: a second call does not start another one.
  inFlight: Set<number>;
};

// Fetches /posts/{id} only while the details are not cached (invariant 3).
// Errors are not shown and not stored: the next open retries.
export async function loadPostDetails(
  postId: number,
  { getDetails, fetchPost, savePostDetails, inFlight }: LoadPostDetailsDeps,
): Promise<void> {
  if (getDetails(postId) || inFlight.has(postId)) {
    return;
  }

  inFlight.add(postId);
  try {
    const dto = await fetchPost(postId);
    savePostDetails(postId, dto);
  } catch (error) {
    if (__DEV__) {
      console.warn(`Loading details of post ${postId} failed`, error);
    }
  } finally {
    inFlight.delete(postId);
  }
}
