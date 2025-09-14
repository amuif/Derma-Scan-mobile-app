import { useRegisterMutation } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { ThemedText } from '../ThemedText';

const SignInForm = () => {
  const { mutateAsync: registerUser } = useRegisterMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', name: '' });

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const placeholderColor = isDark ? '#aaa' : '#777';
  const iconColor = isDark ? '#ccc' : '#777';
  const inputTextColor = isDark ? '#fff' : '#000';
  const borderColor = isDark ? '#444' : '#ddd';
  const dividerColor = isDark ? '#555' : '#ddd';

  // Validation function
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', name: '' };

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

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

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      console.log(email, password, name);
      await registerUser({ email, password, name });
    } catch (error: any) {
      console.log('Error creating user', error);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
      <View
        style={[
          styles.inputContainer,
          { borderColor: errors.email ? '#ef4444' : borderColor },
        ]}
      >
        <Ionicons
          name="mail-outline"
          size={20}
          color={iconColor}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: inputTextColor }]}
          placeholder="Enter your email"
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      {/* Name */}
      <ThemedText style={styles.inputLabel}>Full name</ThemedText>
      <View
        style={[
          styles.inputContainer,
          { borderColor: errors.name ? '#ef4444' : borderColor },
        ]}
      >
        <Ionicons
          name="person-outline"
          size={20}
          color={iconColor}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: inputTextColor }]}
          placeholder="Enter your name"
          placeholderTextColor={placeholderColor}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      {/* Password */}
      <ThemedText style={styles.inputLabel}>Password</ThemedText>
      <View
        style={[
          styles.inputContainer,
          { borderColor: errors.password ? '#ef4444' : borderColor },
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={iconColor}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: inputTextColor }]}
          placeholder="Enter your password"
          placeholderTextColor={placeholderColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={iconColor}
          />
        </TouchableOpacity>
      </View>
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.signInButtonText}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
        <Text style={[styles.dividerText, { color: iconColor }]}>OR</Text>
        <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
      </View>

      <View style={styles.signUpContainer}>
        <ThemedText>Already have an account? </ThemedText>
        <Link href="/login" style={styles.signUpContainer}>
          <ThemedText style={styles.signupLink}>Sign in</ThemedText>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  signInButton: {
    marginTop: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 3,
  },
  signupLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default SignInForm;
