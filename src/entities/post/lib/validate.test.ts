import { validatePost, validatePosts } from './validate';

const item = { userId: 1, id: 1, title: 'title', body: 'body' };

describe('validatePosts', () => {
  it('rejects a response that is not an array', () => {
    expect(() => validatePosts({ posts: [item] })).toThrow();
    expect(() => validatePosts(null)).toThrow();
  });

  it.each([
    ['no numeric id', { ...item, id: '1' }],
    ['no id', { title: 'title', body: 'body' }],
    ['no string title', { ...item, title: 1 }],
    ['no string body', { ...item, body: undefined }],
    ['not an object', 'post'],
  ])('rejects an item with %s', (_case, bad) => {
    expect(() => validatePosts([item, bad])).toThrow();
  });

  it('accepts a valid response', () => {
    expect(validatePosts([item, { ...item, id: 2 }])).toEqual([
      { id: 1, title: 'title', body: 'body' },
      { id: 2, title: 'title', body: 'body' },
    ]);
  });

  it('accepts an empty array: emptiness is decided by loadPosts', () => {
    expect(validatePosts([])).toEqual([]);
  });

  it('ignores extra fields and does not copy them', () => {
    const [post] = validatePosts([{ ...item, extra: true }]);
    expect(post).not.toHaveProperty('userId');
    expect(post).not.toHaveProperty('extra');
    expect(post).not.toBe(item);
  });
});

describe('validatePost', () => {
  it('accepts a valid post with the expected id and drops userId', () => {
    expect(validatePost(item, 1)).toEqual({
      id: 1,
      title: 'title',
      body: 'body',
    });
  });

  it('rejects an id that differs from the expected one', () => {
    expect(() => validatePost(item, 2)).toThrow();
  });

  it.each([
    ['not an object', [item]],
    ['no numeric id', { ...item, id: '1' }],
    ['no string title', { ...item, title: null }],
    ['no string body', { ...item, body: 1 }],
  ])('rejects %s', (_case, bad) => {
    expect(() => validatePost(bad, 1)).toThrow();
  });
});
