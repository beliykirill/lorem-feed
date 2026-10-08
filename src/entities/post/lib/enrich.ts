// Invariant 2: the only module allowed to import faker (lint-enforced).
// The base locale covers string.alphanumeric and keeps locales out of the bundle.
import { faker } from '@faker-js/faker/locale/base';

import type { ValidatedPostDto } from '../api/types';
import { IMAGE_SIZE, THUMBNAIL_SIZE } from '../config/image-sizes';
import type { Post, PostDetails } from '../model/types';
import { buildImageUrl } from './build-image-url';
import { mapPostDto } from './map-post-dto';

export const SEED_LENGTH = 10;

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

export function toPostDetails(dto: ValidatedPostDto, post: Post): PostDetails {
  return {
    ...mapPostDto(dto),
    imageUrl: buildImageUrl(post.seed, IMAGE_SIZE, IMAGE_SIZE),
  };
}
