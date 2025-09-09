import React, { useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import SignInHeader from '@/components/signup/signup-header';
import SignInForm from '@/components/signup/signup-form';
import { ThemedView } from '@/components/ThemedView';

const SignUpScreen = () => {
  useEffect(() => {
    console.log('signin lela ngr');
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView className="flex-col gap-3 items-center justify-center px-2 min-h-screen pt-24 ">
          <SignInHeader />
          <SignInForm />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default SignUpScreen;
