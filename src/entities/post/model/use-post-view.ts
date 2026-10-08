import { useMemo } from 'react';

import { IMAGE_SIZE } from '../config/image-sizes';
import { buildImageUrl } from '../lib/build-image-url';
import { selectDetails, selectPost } from './selectors';
import { usePostStore } from './store';

export type PostView = { title: string; body: string; imageUrl: string };

// Two plain subscriptions: a zustand selector returning a new object re-renders forever.
export function usePostView(id: number): PostView | undefined {
  const post = usePostStore(selectPost(id));
  const details = usePostStore(selectDetails(id));

  return useMemo(() => {
    if (details) {
      return {
        title: details.title,
        body: details.body,
        imageUrl: details.imageUrl,
      };
    }
    if (post) {
      return {
        title: post.title,
        body: post.body,
        imageUrl: buildImageUrl(post.seed, IMAGE_SIZE, IMAGE_SIZE),
      };
    }

    return undefined;
  }, [post, details]);
}
