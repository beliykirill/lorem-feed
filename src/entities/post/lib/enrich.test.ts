import { faker } from '@faker-js/faker/locale/base';

import { buildImageUrl } from './buildImageUrl';
import { enrichPosts, SEED_LENGTH, toPostDetails } from './enrich';

const dtos = [1, 2, 3].map(id => ({
  id,
  title: `title ${id}`,
  body: `body ${id}`,
}));

describe('enrichPosts', () => {
  beforeEach(() => faker.seed(42));

  it('gives every post a seed and a 32x32 URL built from it', () => {
    const posts = enrichPosts(dtos);
    posts.forEach((post, i) => {
      expect(post).toMatchObject(dtos[i]);
      expect(post.seed).toMatch(new RegExp(`^[a-zA-Z0-9]{${SEED_LENGTH}}$`));
      expect(post.thumbnailUrl).toBe(buildImageUrl(post.seed, 32, 32));
    });
  });

  it('gives different posts different seeds', () => {
    const seeds = enrichPosts(dtos).map(post => post.seed);
    expect(new Set(seeds).size).toBe(seeds.length);
  });
});

describe('toPostDetails', () => {
  beforeEach(() => faker.seed(42));

  it('builds the 300x300 URL from the seed of the same post as the 32x32 one', () => {
    const [post] = enrichPosts(dtos);
    const details = toPostDetails(dtos[0], post);
    expect(details).toEqual({
      ...dtos[0],
      imageUrl: buildImageUrl(post.seed, 300, 300),
    });
    expect(details.imageUrl).toBe(
      `https://picsum.photos/seed/${post.seed}/300/300`,
    );
    expect(post.thumbnailUrl).toBe(
      `https://picsum.photos/seed/${post.seed}/32/32`,
    );
  });
});
