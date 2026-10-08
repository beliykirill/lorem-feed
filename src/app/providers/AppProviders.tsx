import { NavigationContainer } from '@react-navigation/native';
import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HydrationGate } from '../hydration/ui/HydrationGate';

// The navigation container, and with it every screen and loading hook,
// renders only after the hydration gate opens (invariant 4).
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <HydrationGate>
        <NavigationContainer>{children}</NavigationContainer>
      </HydrationGate>
    </SafeAreaProvider>
  );
}
