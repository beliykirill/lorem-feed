import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStoresHydrated } from '../model/gate';

// Renders children only after every persist store has hydrated (invariant 4).
// The themed background arrives with shared/theme at the UI stage.
export function HydrationGate({ children }: PropsWithChildren) {
  const hydrated = useStoresHydrated();
  return hydrated ? children : <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
