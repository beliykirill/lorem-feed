export type PostFields = { id: number; title: string; body: string };

export type Post = PostFields & {
  seed: string;
  thumbnailUrl: string;
};

export type PostDetails = PostFields & {
  imageUrl: string;
};

export type ListStatus = 'idle' | 'loading' | 'error' | 'empty';
