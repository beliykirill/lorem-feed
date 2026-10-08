import type { ValidatedPostDto } from '../api/types';
import type { PostFields } from '../model/types';

export function mapPostDto({ id, title, body }: ValidatedPostDto): PostFields {
  return { id, title, body };
}
