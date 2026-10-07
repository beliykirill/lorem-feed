import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import type { ROUTES, RootStackParamList } from '@/shared/config/navigation';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.Details>;

// Scaffold placeholder: post details arrive at the UI stage.
export function DetailsScreen({ route }: Props) {
  return (
    <View style={styles.container}>
      <Text>Details of post {route.params.postId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
