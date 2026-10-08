// The /posts response item as the API returns it.
export type PostDto = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Only the fields the app uses, after validation.
export type ValidatedPostDto = Pick<PostDto, 'id' | 'title' | 'body'>;
