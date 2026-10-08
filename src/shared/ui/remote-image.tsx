import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/shared/theme';

type Props = { uri: string; size: number; radius?: number };

type Status = 'loading' | 'loaded' | 'error';

const LARGE_SIZE = 64;

// Decorative: hidden from screen readers.
export function RemoteImage({ uri, size, radius = 0 }: Props) {
  const { colors, typography } = useTheme();

  const [state, setState] = useState<{ uri: string; status: Status }>({
    uri,
    status: 'loading',
  });

  // Reset during render when the uri changes, without an extra effect pass.
  const status = state.uri === uri ? state.status : 'loading';

  if (state.uri !== uri) {
    setState({ uri, status: 'loading' });
  }

  const isLarge = size >= LARGE_SIZE;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.surface,
        },
      ]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {status !== 'error' && (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          onLoad={() => setState({ uri, status: 'loaded' })}
          onError={() => setState({ uri, status: 'error' })}
        />
      )}
      {status === 'loading' && isLarge && (
        <ActivityIndicator color={colors.textSecondary} />
      )}
      {status === 'error' && isLarge && (
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Image unavailable
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
