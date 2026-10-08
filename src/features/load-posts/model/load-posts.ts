import type { PostState, ValidatedPostDto } from '@/entities/post';

export type LoadPostsDeps = {
  getState: () => Pick<
    PostState,
    'isListLoaded' | 'listStatus' | 'setListStatus'
  >;
  fetchPosts: () => Promise<ValidatedPostDto[]>;
  savePostList: (dtos: ValidatedPostDto[]) => void;
};

// Fetches /posts until the first non-empty valid response, then never again
// (invariant 1). Hydration is guaranteed by the gate, not checked here.
export async function loadPosts({
  getState,
  fetchPosts,
  savePostList,
}: LoadPostsDeps): Promise<void> {
  const { isListLoaded, listStatus, setListStatus } = getState();
  if (isListLoaded || listStatus === 'loading') {
    return;
  }

  setListStatus('loading');
  try {
    const dtos = await fetchPosts();
    if (dtos.length === 0) {
      setListStatus('empty');
      return;
    }
    savePostList(dtos);
  } catch (error) {
    // Network, HTTP, validation, or a failed save: nothing is stored, retry is possible.
    if (__DEV__) {
      console.warn('Loading posts failed', error);
    }
    setListStatus('error');
  }
}
