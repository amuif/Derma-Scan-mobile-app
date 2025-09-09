import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import './global.css';
import { ReactQueryProvider } from '@/providers/authProviders';
import AppLayout from './app';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <ReactQueryProvider>
      <AppLayout />
    </ReactQueryProvider>
  );
}
