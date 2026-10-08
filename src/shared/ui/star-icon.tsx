import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

type Props = { filled: boolean; size?: number; color?: string };

// U+2605/U+2606 rather than the ⭐ emoji: an emoji ignores the text color (R-6).
export function StarIcon({ filled, size = 16, color }: Props) {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        styles.star,
        { fontSize: size, lineHeight: size * 1.2, color: color ?? colors.star },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {filled ? '★' : '☆'}
    </Text>
  );
}

const styles = StyleSheet.create({
  star: { includeFontPadding: false },
});
