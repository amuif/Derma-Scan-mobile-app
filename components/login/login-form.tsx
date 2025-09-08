import { TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useLoginMutation } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function LoginForm() {
  const router = useRouter();
  const [email, onChangeemail] = useState('');
  const [password, onChangePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login } = useLoginMutation();

  async function handleSubmit() {
    try {
      await login({ email, password });
      console.log('Signed in');
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Error logging user', error);
    }
  }
  return (
    <ThemedView className="w-full">
      <TextInput
        style={styles.input}
        onChangeText={onChangeemail}
        value={email}
        placeholder="Enter your name here"
      />

      <ThemedView style={styles.passwordContainer}>
        <TextInput
          id="passwordInput"
          style={[{ flex: 1, marginRight: 0 }]}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          {showPassword ? (
            <Entypo name="eye-with-line" size={24} color="black" />
          ) : (
            <Entypo name="eye" size={24} color="black" />
          )}
        </TouchableOpacity>
      </ThemedView>
      <ThemedView className="mt-auto ">
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <ThemedText>Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    borderWidth: 1,
    borderRadius: 5,
    paddingRight: 10,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
});
