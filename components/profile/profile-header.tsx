import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';

// import { Container } from './styles';

export default function ProfileHeader() {
  return (
    <ThemedView className='pt-5'>
      <ThemedText className="text-lg text-amber-800">Profile</ThemedText>
    </ThemedView>
  );
}
