import type { PostState } from './store';

export const selectPost = (id: number) => (state: PostState) =>
  state.posts.find(post => post.id === id);

export const selectDetails = (id: number) => (state: PostState) =>
  state.detailsById[id];
