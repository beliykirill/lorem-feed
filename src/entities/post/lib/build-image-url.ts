// picsum /seed/ URLs are deterministic: one seed gives one image in any size.
export function buildImageUrl(
  seed: string,
  width: number,
  height: number,
): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
