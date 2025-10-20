import Constants from 'expo-constants';

export const getBaseUrl = () => {
  if (__DEV__) {
    const debuggerHost =
      Constants.manifest?.debuggerHost ||
      Constants.manifest2?.extra?.expoGo?.debuggerHost;

    return 'https://derma-scan-backend-zcmz.onrender.com';
  } else {
    return 'https://derma-scan-backend-h0vm.onrender.com';
  }
};

export const API_URL = `${getBaseUrl()}/api`;
export const FILES_URL = getBaseUrl();
