import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { usePostView } from '@/entities/post';
import { useLoadPostDetails } from '@/features/load-post-details';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import type { ROUTES, RootStackParamList } from '@/shared/config/navigation';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.Details>;

export function DetailsScreen({ route }: Props) {
  const { postId } = route.params;
  const post = usePostView(postId);

  useLoadPostDetails(postId);

  return (
    <View style={styles.container}>
      <Text>{post?.title ?? `Post ${postId}`}</Text>
      <ToggleFavoriteButton postId={postId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
});
