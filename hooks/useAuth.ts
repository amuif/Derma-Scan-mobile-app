import { authApi, authStorage } from '@/lib/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (data) => {
      await authStorage.setToken(data.access_token);
      await authStorage.setUser(data.user);

      queryClient.setQueryData(authQueryKeys.token(), data.access_token);
      queryClient.setQueryData(authQueryKeys.user(), data.user);
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

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
      await authStorage.setToken(data.access_token);
      await authStorage.setUser(data.user);

      queryClient.setQueryData(authQueryKeys.token(), data.access_token);
      queryClient.setQueryData(authQueryKeys.user(), data.user);
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user);
    },
    onError: (error) => {
      console.error('Registration error:', error);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const tokenQuery = useTokenQuery();

  return useMutation({
    mutationFn: () => authApi.logout(tokenQuery.data!),
    onSuccess: async () => {
      await authStorage.clearAuth();
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
export const authQueryKeys = {
  all: ['auth'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
  token: () => [...authQueryKeys.all, 'token'] as const,
  currentUser: () => [...authQueryKeys.all, 'current-user'] as const,
};
