import { authApi, authStorage } from '@/lib/auth';
import { useAuthStore } from '@/stores/auth';
import { User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export const useTokenQuery = () => {
  return useQuery({
    queryKey: authQueryKeys.token(),
    queryFn: authStorage.getToken,
    staleTime: Infinity,
  });
};

export const useUserQuery = () => {
  const tokenQuery = useTokenQuery();

  return useQuery({
    queryKey: authQueryKeys.user(),
    queryFn: authStorage.getUser,
    staleTime: Infinity,
    enabled: !!tokenQuery.data,
  });
};

export const useCurrentUserQuery = () => {
  const tokenQuery = useTokenQuery();

  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: () => authApi.getCurrentUser(tokenQuery.data!),
    enabled: !!tokenQuery.data,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (data) => {
      await authStorage.setToken(data.accessToken);
      setUser(data.user);

      queryClient.setQueryData(authQueryKeys.token(), data.accessToken);
      queryClient.setQueryData(authQueryKeys.user(), data.user);
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user);
    },
    onError: (error) => {
      console.error('Login error:', error.message);
    },
  });
};

export const useUpdateCurrentUser = () => {
  const { setUser, user } = useAuthStore();
  return useMutation({
    mutationKey: ['update-current-user'],
    mutationFn: async (data: Partial<User>) => {
      const token = await authStorage.getToken();
      if (!token) {
        throw new Error('No user found in storage');
      }
      const response = authApi.updateCurrentUser(user?.id!, data, token);
      return response;
    },
    onSuccess: async (data) => {
      console.log(data);
      setUser(data.user);

      // Also update the user in SecureStore to keep it in sync
      authStorage.setUser(data.user);
    },
    onError: (error) => {
      console.error('user update error:', error.message);
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      email,
      password,
      name,
      profilePicture,
    }: {
      email: string;
      password: string;
      name: string;
      profilePicture?: string;
    }) => authApi.register(email, password, name, profilePicture),
    onSuccess: async (data) => {
      console.log(data);
      await authStorage.setToken(data.accessToken);
      await authStorage.setUser(data.user);

      queryClient.setQueryData(authQueryKeys.token(), data.accessToken);
      queryClient.setQueryData(authQueryKeys.user(), data.user);
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user);
      router.replace('/(tabs)');
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      router.replace('/login');

      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
    onError: async (error) => {
      console.error('Logout error:', error);
      // Still clear local auth even if server logout fails
      await authStorage.clearAuth();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
  });
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await authStorage.getToken();
      authApi.deleteCurrentUser(id, token!);
    },
    onSuccess: async () => {
      router.replace('/login');

      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
    onError: async (error) => {
      console.error('Delete Current user error', error);
      await authStorage.clearAuth();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
  });
};

export const useImageUploadMutation = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await authStorage.getToken();
      return authApi.uploadImage(token!, formData);
    },
    onSuccess: async () => {
      console.log('uploaded successfully!');
    },
    onError: async (error) => {
      console.error('Error uploading image', error);
    },
  });
};
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  token: () => [...authQueryKeys.all, 'token'] as const,
  currentUser: () => [...authQueryKeys.all, 'current-user'] as const,
};
