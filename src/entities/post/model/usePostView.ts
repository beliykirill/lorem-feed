import { useMemo } from 'react';

import { IMAGE_SIZE } from '../config/imageSizes';
import { buildImageUrl } from '../lib/buildImageUrl';
import { selectDetails, selectPost } from './selectors';
import { usePostStore } from './store';

export type PostView = { title: string; body: string; imageUrl: string };

// Cached details win; otherwise the list post and a URL from its stored seed.
// Two plain subscriptions: a selector returning a new object would loop.
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
