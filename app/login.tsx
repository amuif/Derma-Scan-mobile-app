import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import LoginForm from '@/components/login/login-form';
import LoginHeader from '@/components/login/login-header';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className='bg-transparent'
      >
        <ThemedView className="flex-col gap-3 items-center justify-center px-2 h-full pt-24 ">
          <LoginHeader />
          <LoginForm />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
