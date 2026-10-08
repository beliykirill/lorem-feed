import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStoresHydrated } from '../model/gate';

export function HydrationGate({ children }: PropsWithChildren) {
  const hydrated = useStoresHydrated();

  // No theme background yet: shared/theme arrives at the UI stage.
  return hydrated ? children : <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
