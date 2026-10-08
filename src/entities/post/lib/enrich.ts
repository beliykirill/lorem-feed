// The only module allowed to import faker (invariant 2, lint-enforced).
// The base locale is enough for string.alphanumeric and keeps locales out of the bundle.
import { faker } from '@faker-js/faker/locale/base';

import type { ValidatedPostDto } from '../api/types';
import { IMAGE_SIZE, THUMBNAIL_SIZE } from '../config/imageSizes';
import type { Post, PostDetails } from '../model/types';
import { buildImageUrl } from './buildImageUrl';
import { mapPostDto } from './mapPostDto';

export const SEED_LENGTH = 10;

// Generates the image seed once per post; called only when saving the list.
export function enrichPosts(dtos: ValidatedPostDto[]): Post[] {
  return dtos.map(dto => {
    const seed = faker.string.alphanumeric(SEED_LENGTH);
    return {
      ...mapPostDto(dto),
      seed,
      thumbnailUrl: buildImageUrl(seed, THUMBNAIL_SIZE, THUMBNAIL_SIZE),
    };
  });
}

// The 300x300 URL comes from the seed stored with the post.
export function toPostDetails(dto: ValidatedPostDto, post: Post): PostDetails {
  return {
    ...mapPostDto(dto),
    imageUrl: buildImageUrl(post.seed, IMAGE_SIZE, IMAGE_SIZE),
  };
}
