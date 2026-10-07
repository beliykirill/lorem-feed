import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ROUTES } from '@/shared/config/navigation';

// Scaffold placeholder: the posts list arrives at the UI stage.
export function PostsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Posts</Text>
      <Button
        title="Open details"
        onPress={() => navigation.navigate(ROUTES.Details, { postId: 1 })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
