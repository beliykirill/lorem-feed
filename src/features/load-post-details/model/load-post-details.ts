import type { PostDetails, ValidatedPostDto } from '@/entities/post';

export type LoadPostDetailsDeps = {
  getDetails: (postId: number) => PostDetails | undefined;
  fetchPost: (postId: number) => Promise<ValidatedPostDto>;
  savePostDetails: (postId: number, dto: ValidatedPostDto) => void;
  // Dedupes concurrent calls, e.g. the StrictMode double effect.
  inFlight: Set<number>;
};

// Invariant 3. Errors are only logged (I-1): the next open retries.
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
