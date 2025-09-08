import { Platform } from 'react-native';

export const getBackendUrl = () => {
  if (__DEV__) {
    console.log(Platform.OS);
    // Development - connect to local machine
    if (Platform.OS === 'android') {
      return 'http://10.210.144.247:4000/api'; // Android emulator
    } else {
      return 'http://localhost:4000/api'; // iOS simulator
    }
  } else {
    // Production - use your deployed backend
    return 'https://your-production-api.com/api';
  }
};

export const BACKEND_URL = getBackendUrl();

export const BACKEND_BASE =
  __DEV__ && Platform.OS === 'android'
    ? 'http://10.210.144.247:4000'
    : 'http://localhost:4000';
