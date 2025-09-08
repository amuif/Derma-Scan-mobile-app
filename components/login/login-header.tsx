import { ThemedView } from '../ThemedView';
import { Text } from 'react-native';
export default function LoginHeader() {
  return (
    <ThemedView>
      <Text className="text-5xl  font-bold capitalize  ">Log in</Text>
    </ThemedView>
  );
}
