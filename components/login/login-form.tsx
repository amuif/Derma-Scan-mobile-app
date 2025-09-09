import { TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useLoginMutation } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { IconMail, IconLock, IconArrowRight } from '@tabler/icons-react-native';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { mutateAsync: login } = useLoginMutation();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  async function handleSubmit() {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      console.log('Signed in successfully');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Error logging user', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log("Navigate to forgot password");
    Alert.alert('Forgot Password', 'Password reset functionality would be implemented here.');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Email Input */}
      <ThemedView style={styles.inputContainer}>
        <ThemedView style={styles.inputLabelContainer}>
          <IconMail size={16} color="#6b7280" />
          <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
        </ThemedView>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter your email address"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        {errors.email ? (
          <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
        ) : null}
      </ThemedView>

      {/* Password Input */}
      <ThemedView style={styles.inputContainer}>
        <ThemedView style={styles.inputLabelContainer}>
          <IconLock size={16} color="#6b7280" />
          <ThemedText style={styles.inputLabel}>Password</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={setPassword}
            value={password}
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            disabled={isLoading}
          >
            {showPassword ? (
              <Entypo name="eye-with-line" size={20} color="#6b7280" />
            ) : (
              <Entypo name="eye" size={20} color="#6b7280" />
            )}
          </TouchableOpacity>
        </ThemedView>
        {errors.password ? (
          <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
        ) : null}
        
        {/* Forgot Password Link */}
        <TouchableOpacity 
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <ThemedText style={styles.forgotPasswordText}>Forgot your password?</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Login Button */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            <IconArrowRight size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <ThemedView style={styles.dividerContainer}>
        <ThemedView style={styles.dividerLine} />
        <ThemedText style={styles.dividerText}>or</ThemedText>
        <ThemedView style={styles.dividerLine} />
      </ThemedView>

      {/* Sign Up Prompt */}
      <ThemedView style={styles.signupContainer}>
        <ThemedText style={styles.signupText}>Don&apos;t have an account? </ThemedText>
        <TouchableOpacity 
          onPress={() => console.log("Navigate to sign up")}
          disabled={isLoading}
        >
          <ThemedText style={styles.signupLink}>Sign up</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 24,
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupText: {
    color: '#6b7280',
  },
  signupLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
