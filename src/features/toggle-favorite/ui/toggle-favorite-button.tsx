import { Button } from 'react-native';

import { useToggleFavorite } from '../model/use-toggle-favorite';

type Props = { postId: number };

export function ToggleFavoriteButton({ postId }: Props) {
  const { isFavorite, toggle } = useToggleFavorite(postId);

  return (
    <Button
      title={isFavorite ? '★ In favorites' : '☆ Add to favorites'}
      onPress={toggle}
    />
  );
}
