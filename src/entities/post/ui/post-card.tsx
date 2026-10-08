import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(id)}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? `${title}, favorite` : title}
      style={({ pressed }) => [
        styles.row,
        {
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomColor: colors.border,
          backgroundColor: isFavorite
            ? colors.favoriteBackground
            : colors.background,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <RemoteImage uri={thumbnailUrl} size={THUMBNAIL_SIZE} radius={radius.sm} />
      <View style={[styles.text, { gap: spacing.xs }]}>
        <Text style={[typography.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[typography.caption, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {body}
        </Text>
      </View>
      {isFavorite && <StarIcon filled size={18} />}
    </Pressable>
  );
}

// Primitive props only: the list rebuilds item objects on every favorites change.
export const PostCard = memo(PostCardRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1 },
});
