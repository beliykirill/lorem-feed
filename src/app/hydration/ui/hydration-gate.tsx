import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { useStoresHydrated } from '../model/gate';

export function HydrationGate({ children }: PropsWithChildren) {
  const hydrated = useStoresHydrated();
  const { colors } = useTheme();

  return hydrated ? (
    children
  ) : (
    <View style={[styles.container, { backgroundColor: colors.background }]} />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
