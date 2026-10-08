import { RootStack } from './navigation/RootStack';
import { AppProviders } from './providers/AppProviders';

export function App() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
