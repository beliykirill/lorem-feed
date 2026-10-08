import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { ROUTES } from '@/shared/config/navigation';
import { PostsList } from '@/widgets/posts-list';

export function PostsScreen() {
  const navigation = useNavigation();

  const onPostPress = useCallback(
    (postId: number) => navigation.navigate(ROUTES.Details, { postId }),
    [navigation],
  );

  return <PostsList onPostPress={onPostPress} />;
}
