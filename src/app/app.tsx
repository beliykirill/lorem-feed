import { RootStack } from './navigation/root-stack';
import { AppProviders } from './providers/app-providers';

export function App() {
  return (
    <AppProviders>
      <RootStack />
    </AppProviders>
  );
}
