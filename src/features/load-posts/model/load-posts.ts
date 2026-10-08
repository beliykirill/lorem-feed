import type { PostState, ValidatedPostDto } from '@/entities/post';

export type LoadPostsDeps = {
  getState: () => Pick<
    PostState,
    'isListLoaded' | 'listStatus' | 'setListStatus'
  >;
  fetchPosts: () => Promise<ValidatedPostDto[]>;
  savePostList: (dtos: ValidatedPostDto[]) => void;
};

// Invariant 1. Hydration is not checked here: the gate guarantees it (invariant 4).
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
    // A failed save lands here too, so the status never stays 'loading'.
    if (__DEV__) {
      console.warn('Loading posts failed', error);
    }
    setListStatus('error');
  }
}
