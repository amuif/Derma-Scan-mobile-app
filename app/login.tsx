import LoginFooter from '@/components/login/login-footer';
import LoginForm from '@/components/login/login-form';
import LoginHeader from '@/components/login/login-header';
import { View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-col gap-3 items-center justify-center  px-2 min-h-screen">
      <LoginHeader />
      <LoginForm />
      <LoginFooter />
    </View>
  );
}
