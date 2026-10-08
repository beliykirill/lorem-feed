// Pure: the same seed always gives the same picsum image.
export function buildImageUrl(
  seed: string,
  width: number,
  height: number,
): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
