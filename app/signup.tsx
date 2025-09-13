import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import SignInHeader from '@/components/signup/signup-header';
import SignInForm from '@/components/signup/signup-form';
import { ThemedView } from '@/components/ThemedView';

const SignUpScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView className="flex-col gap-3 items-center justify-center px-2 h-full pt-24 ">
          <SignInHeader />
          <SignInForm />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default SignUpScreen;
