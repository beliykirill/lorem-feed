import { NavigationContainer } from '@react-navigation/native';
import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HydrationGate } from '../hydration/ui/hydration-gate';

// Invariant 4: the gate wraps the navigation container, so no screen or
// loading hook exists before every store has hydrated.
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <HydrationGate>
        <NavigationContainer>{children}</NavigationContainer>
      </HydrationGate>
    </SafeAreaProvider>
  );
}
