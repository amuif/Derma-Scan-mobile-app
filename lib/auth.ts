import { User } from '@/types/user';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '@/constants/backend-url';

export const authStorage = {
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Error retrieving token from storage', error);
      return null;
    }
  },
  setToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync('authToken', token);
    } catch (error) {
      console.error('Error setting token', error);
    }
  },
  getUser: async (): Promise<User | null> => {
    try {
      const userString = await SecureStore.getItemAsync('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error retrieving user', error);
      return null;
    }
  },
  setUser: async (user: User): Promise<void> => {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  },
  clearAuth: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  register: async (
    email: string,
    password: string,
    name: string,
    profilePicture?: string,
  ) => {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, profilePicture }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  },

  logout: async (token: string) => {
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  },

  getCurrentUser: async (token: string) => {
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },
};
