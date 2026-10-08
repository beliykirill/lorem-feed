import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

type Props = { title: string; onPress: () => void };

export function Button({ title, onPress }: Props) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[typography.title, { color: colors.onPrimary }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', minWidth: 120 },
});
