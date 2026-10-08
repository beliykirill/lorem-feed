import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IMAGE_SIZE, usePostView } from '@/entities/post';
import { useLoadPostDetails } from '@/features/load-post-details';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import type { ROUTES, RootStackParamList } from '@/shared/config/navigation';
import { useTheme } from '@/shared/theme';
import { RemoteImage, StateView } from '@/shared/ui';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.Details>;

export function DetailsScreen({ navigation, route }: Props) {
  const { postId } = route.params;
  const post = usePostView(postId);
  const insets = useSafeAreaInsets();
  const { colors, radius, spacing, typography } = useTheme();

  useLoadPostDetails(postId);

  const headerRight = useCallback(
    () => <ToggleFavoriteButton postId={postId} />,
    [postId],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation, headerRight]);

  // Unreachable: details open only from the list, so the post is in the store.
  if (!post) {
    return <StateView message="Post not found" />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingBottom: insets.bottom + spacing.xl,
      }}
    >
      {/* Shadow on a wrapper: the image clips its own overflow for the radius. */}
      <View
        style={[
          styles.imageShadow,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            marginBottom: spacing.xl,
          },
        ]}
      >
        <RemoteImage uri={post.imageUrl} size={IMAGE_SIZE} radius={radius.lg} />
      </View>
      <Text
        style={[
          typography.caption,
          { color: colors.textSecondary, marginBottom: spacing.xs },
        ]}
      >
        Post #{postId}
      </Text>
      <Text
        style={[
          typography.heading,
          { color: colors.text, marginBottom: spacing.md },
        ]}
      >
        {post.title}
      </Text>
      <Text style={[typography.article, { color: colors.textSecondary }]}>
        {post.body}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageShadow: {
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
});
