import { useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostCard } from '@/entities/post';
import { useLoadPosts } from '@/features/load-posts';
import { useTheme } from '@/shared/theme';
import { StateView } from '@/shared/ui';

import type { SortedPost } from '../model/sort-posts';
import { useSortedPosts } from '../model/use-sorted-posts';

type Props = { onPostPress: (postId: number) => void };

const keyExtractor = (post: SortedPost) => String(post.id);

export function PostsList({ onPostPress }: Props) {
  const { status, isListLoaded, retry } = useLoadPosts();
  const posts = useSortedPosts();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const renderItem: ListRenderItem<SortedPost> = useCallback(
    ({ item }) => (
      <PostCard
        id={item.id}
        title={item.title}
        body={item.body}
        thumbnailUrl={item.thumbnailUrl}
        isFavorite={item.isFavorite}
        onPress={onPostPress}
      />
    ),
    [onPostPress],
  );

  if (!isListLoaded) {
    if (status === 'error') {
      return <StateView message="Something went wrong" onAction={retry} />;
    }

    if (status === 'empty') {
      return <StateView message="No posts" onAction={retry} />;
    }

    return <StateView loading />;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
    />
  );
}
