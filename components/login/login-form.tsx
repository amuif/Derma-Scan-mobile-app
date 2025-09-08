import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';

export default function LoginForm() {
  const [name, onChangeName] = useState('');
  const [password, onChangePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full">
      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Enter your name here"
      />

      <View style={styles.passwordContainer}>
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
      </View>
      <View className="mt-auto bg-">
        <TouchableOpacity>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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
});
