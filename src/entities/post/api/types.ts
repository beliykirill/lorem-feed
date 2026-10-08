export type PostDto = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type ValidatedPostDto = Pick<PostDto, 'id' | 'title' | 'body'>;
