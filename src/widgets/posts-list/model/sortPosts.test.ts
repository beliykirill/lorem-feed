import type { Post } from '@/entities/post';

import { sortPosts } from './sortPosts';

const posts: Post[] = [1, 2, 3, 4, 5].map(id => ({
  id,
  title: `title ${id}`,
  body: `body ${id}`,
  seed: `seed${id}`,
  thumbnailUrl: `url${id}`,
}));

const ids = (sorted: { id: number }[]) => sorted.map(post => post.id);

describe('sortPosts', () => {
  it('keeps the API order without favorites', () => {
    const sorted = sortPosts(posts, {});
    expect(ids(sorted)).toEqual([1, 2, 3, 4, 5]);
    expect(sorted.every(post => !post.isFavorite)).toBe(true);
  });

  it('puts favorites first, most recently added on top, the rest in API order', () => {
    const sorted = sortPosts(posts, { 4: 100, 2: 300, 5: 200 });
    expect(ids(sorted)).toEqual([2, 5, 4, 1, 3]);
    expect(sorted.map(post => post.isFavorite)).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]);
  });

  it('returns a post removed from favorites to its original place', () => {
    expect(ids(sortPosts(posts, { 3: 100 }))).toEqual([3, 1, 2, 4, 5]);
    expect(ids(sortPosts(posts, {}))).toEqual([1, 2, 3, 4, 5]);
    expect(ids(sortPosts(posts, { 5: 100, 3: 200 }))).toEqual([3, 5, 1, 2, 4]);
    expect(ids(sortPosts(posts, { 5: 100 }))).toEqual([5, 1, 2, 3, 4]);
  });

  it('does not mutate the input', () => {
    const input = [...posts];
    const snapshot = JSON.stringify(input);
    sortPosts(input, { 5: 1 });
    expect(JSON.stringify(input)).toBe(snapshot);
    expect(input.map(post => post.id)).toEqual([1, 2, 3, 4, 5]);
  });
});
