import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import './global.css';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTokenQuery } from '@/hooks/useAuth';
import { ThemedText } from '@/components/ThemedText';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { data: token, isLoading } = useTokenQuery();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (!token && pathname !== '/login') {
    return <Redirect href="/login" />;
  }

  if (isLoading) {
    return <ThemedText>Loading.......</ThemedText>;
  }

  return (
     <GluestackUIProvider config={config}>

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar />
    </ThemeProvider>
        </GluestackUIProvider>
  );
}
