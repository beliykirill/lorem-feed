import { NavigationContainer } from '@react-navigation/native';
import type { PropsWithChildren } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

import { HydrationGate } from '../hydration/ui/hydration-gate';
import { darkNavigationTheme, lightNavigationTheme } from './navigation-theme';

// Invariant 4: the gate wraps the navigation container, so no screen or
// loading hook exists before every store has hydrated.
export function AppProviders({ children }: PropsWithChildren) {
  const { isDark } = useTheme();

  return (
    <SafeAreaProvider>
      {/* RN core StatusBar: Info.plist disables view-controller-based status bar appearance. */}
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <HydrationGate>
        <NavigationContainer
          theme={isDark ? darkNavigationTheme : lightNavigationTheme}
        >
          {children}
        </NavigationContainer>
      </HydrationGate>
    </SafeAreaProvider>
  );
}
