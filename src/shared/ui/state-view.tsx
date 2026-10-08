import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { Button } from './button';

type Props = {
  loading?: boolean;
  message?: string;
  actionTitle?: string;
  onAction?: () => void;
};

export function StateView({
  loading = false,
  message,
  actionTitle = 'Retry',
  onAction,
}: Props) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          gap: spacing.lg,
          padding: spacing.xl,
        },
      ]}
    >
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
      {message !== undefined && (
        <Text
          style={[typography.body, styles.message, { color: colors.text }]}
        >
          {message}
        </Text>
      )}
      {onAction && <Button title={actionTitle} onPress={onAction} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  message: { textAlign: 'center' },
});
