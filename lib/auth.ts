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
  login: async (
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> => {
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

  logout: async () => {
    return await authStorage.clearAuth();
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

  updateCurrentUser: async (
    id: string,
    data: Partial<User>,
    token: string,
  ): Promise<{ user: User }> => {
    console.log(id);
    console.log(data);
    const formData = new FormData();
    if (data.id) formData.append('id', String(data.id));
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);

    if (data.profilePicture) {
      const uriParts = data.profilePicture.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('profilePicture', {
        uri: data.profilePicture,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }
    const response = await fetch(`${BACKEND_URL}/auth/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },
};
