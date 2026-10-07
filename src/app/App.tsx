import { RootStack } from './navigation/RootStack';
import { AppProviders } from './providers/AppProviders';

// The hydration gate wraps RootStack at the data & state stage.
export function App() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
