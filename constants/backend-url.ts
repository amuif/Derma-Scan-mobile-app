import Constants from 'expo-constants';

export const getBackendUrl = () => {
  if (__DEV__) {
    // Get the IP automatically from Expo
    const debuggerHost =
      Constants.manifest?.debuggerHost ||
      Constants.manifest2?.extra?.expoGo?.debuggerHost;

    if (debuggerHost) {
      const hostname = debuggerHost.split(':')[0];
      return `http://${hostname}:4000/api`;
    }

    // Fallback to your known IP
    return 'http://10.216.60.83:4000/api';
  } else {
    return 'https://derma-scan-backend-h0vm.onrender.com/api';
  }
};

export const BACKEND_URL = getBackendUrl();
