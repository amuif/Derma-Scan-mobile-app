import LoginForm from '@/components/login/login-form';
import LoginHeader from '@/components/login/login-header';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  return (
    <ThemedView className="flex-col gap-3 items-center justify-between px-2 min-h-screen pt-24">
      <LoginHeader />
      <LoginForm />
    </ThemedView>
  );
}
