import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IMAGE_SIZE, usePostView } from '@/entities/post';
import { useLoadPostDetails } from '@/features/load-post-details';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import type { ROUTES, RootStackParamList } from '@/shared/config/navigation';
import { useTheme } from '@/shared/theme';
import { RemoteImage, StateView } from '@/shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.Details>;

export function DetailsScreen({ route }: Props) {
  const { postId } = route.params;
  const post = usePostView(postId);
  const insets = useSafeAreaInsets();
  const { colors, radius, spacing, typography } = useTheme();

  useLoadPostDetails(postId);

  // Unreachable: details open only from the list, so the post is in the store.
  if (!post) {
    return <StateView message="Post not found" />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          gap: spacing.lg,
          padding: spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
    >
      <RemoteImage uri={post.imageUrl} size={IMAGE_SIZE} radius={radius.lg} />
      <Text style={[typography.heading, styles.text, { color: colors.text }]}>
        {post.title}
      </Text>
      <Text style={[typography.body, styles.text, { color: colors.text }]}>
        {post.body}
      </Text>
      <ToggleFavoriteButton postId={postId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center' },
  text: { alignSelf: 'stretch' },
});
