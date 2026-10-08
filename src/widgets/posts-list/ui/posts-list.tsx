import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLoadPosts } from '@/features/load-posts';

import { useSortedPosts } from '../model/use-sorted-posts';

type Props = { onPostPress: (postId: number) => void };

export function PostsList({ onPostPress }: Props) {
  const { status, isListLoaded, retry } = useLoadPosts();
  const posts = useSortedPosts();

  if (!isListLoaded) {
    if (status === 'error' || status === 'empty') {
      return (
        <View style={styles.center}>
          <Text>
            {status === 'error' ? 'Something went wrong' : 'No posts'}
          </Text>
          <Button title="Retry" onPress={retry} />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={post => String(post.id)}
      renderItem={({ item }) => (
        <Pressable style={styles.row} onPress={() => onPostPress(item.id)}>
          <Text>{item.isFavorite ? '★' : '☆'}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { flex: 1 },
});
