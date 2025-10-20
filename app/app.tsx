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

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { data: token, isLoading } = useTokenQuery();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const publicRoutes = ['/login', '/signup'];

  if (!loaded || isLoading) {
    // Async font loading only occurs in development.
    return null;
  }

  if (!token && !publicRoutes.includes(pathname)) {
    return <Redirect href="/login" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="(tabs)"   />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="history" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar />
    </ThemeProvider>
  );
}
