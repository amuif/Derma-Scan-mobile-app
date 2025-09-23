import Constants from 'expo-constants';

export const getBaseUrl = () => {
  if (__DEV__) {
    const debuggerHost =
      Constants.manifest?.debuggerHost ||
      Constants.manifest2?.extra?.expoGo?.debuggerHost;

    if (debuggerHost) {
      const hostname = debuggerHost.split(':')[0];
      return `http://${hostname}:4000`;
    }

    return 'http://10.210.144.83:4000'; // fallback
  } else {
    return 'https://derma-scan-backend-h0vm.onrender.com';
  }
};

export const API_URL = `${getBaseUrl()}/api`;  
export const FILES_URL = getBaseUrl();  
