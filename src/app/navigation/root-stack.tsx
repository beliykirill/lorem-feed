import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DetailsScreen } from '@/pages/details';
import { PostsScreen } from '@/pages/posts';
import { ROUTES, type RootStackParamList } from '@/shared/config/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.Posts}>
      <Stack.Screen
        name={ROUTES.Posts}
        component={PostsScreen}
        options={{ title: 'Posts', headerLargeTitleEnabled: true }}
      />
      <Stack.Screen
        name={ROUTES.Details}
        component={DetailsScreen}
        options={{ title: 'Post' }}
      />
    </Stack.Navigator>
  );
}
