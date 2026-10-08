import { memo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { RemoteImage, StarIcon } from '@/shared/ui';

import { THUMBNAIL_SIZE } from '../config/image-sizes';

type Props = {
  id: number;
  title: string;
  body: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  onPress: (id: number) => void;
};

function PostCardRow({
  id,
  title,
  body,
  thumbnailUrl,
  isFavorite,
  onPress,
}: Props) {
  const { colors, spacing, typography } = useTheme();
  const background = isFavorite ? colors.favoriteTint : colors.background;

  return (
    <Pressable
      onPress={() => onPress(id)}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? `${title}, favorite` : title}
      android_ripple={{ color: colors.pressed }}
      style={({ pressed }) => [
        styles.row,
        {
          gap: spacing.md,
          paddingLeft: spacing.lg,
          backgroundColor:
            pressed && Platform.OS === 'ios' ? colors.pressed : background,
        },
      ]}
    >
      <RemoteImage
        uri={thumbnailUrl}
        size={THUMBNAIL_SIZE}
        radius={THUMBNAIL_SIZE / 2}
      />
      {/* The bottom border lives here so the separator starts at the text. */}
      <View
        style={[
          styles.content,
          {
            gap: spacing.md,
            paddingVertical: spacing.md,
            paddingRight: spacing.lg,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={[styles.text, { gap: spacing.xs }]}>
          <Text
            style={[typography.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[typography.body, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {body}
          </Text>
        </View>
        {isFavorite && <StarIcon filled size={18} />}
      </View>
    </Pressable>
  );
}

// Primitive props only: the list rebuilds item objects on every favorites change.
export const PostCard = memo(PostCardRow);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1 },
});
