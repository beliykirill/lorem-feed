import { Button } from 'react-native';

import { useToggleFavorite } from '../model/use-toggle-favorite';

type Props = { postId: number };

// Placeholder for the data & state stage: StarIcon, animation and styling
// arrive at the UI stage.
export function ToggleFavoriteButton({ postId }: Props) {
  const { isFavorite, toggle } = useToggleFavorite(postId);
  return (
    <Button
      title={isFavorite ? '★ In favorites' : '☆ Add to favorites'}
      onPress={toggle}
    />
  );
}
