import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
export default function LoginHeader() {
  return (
    <ThemedView>
      <ThemedText className="text-5xl font-bold capitalize">Log in</ThemedText>
    </ThemedView>
  );
}
