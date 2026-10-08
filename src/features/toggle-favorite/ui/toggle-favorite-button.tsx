import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/shared/theme';
import { StarIcon } from '@/shared/ui';

import { useToggleFavorite } from '../model/use-toggle-favorite';

type Props = { postId: number };

export function ToggleFavoriteButton({ postId }: Props) {
  const { isFavorite, toggle } = useToggleFavorite(postId);
  const { colors, radius, spacing, typography } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 80,
      useNativeDriver: true,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

  const label = isFavorite ? 'In favorites' : 'Add to favorites';
  const foreground = isFavorite ? colors.onPrimary : colors.primary;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={toggle}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isFavorite }}
        style={[
          styles.button,
          {
            gap: spacing.sm,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.lg,
            borderColor: colors.primary,
            backgroundColor: isFavorite ? colors.primary : colors.background,
          },
        ]}
      >
        <StarIcon filled={isFavorite} size={20} color={foreground} />
        <Text style={[typography.title, { color: foreground }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
