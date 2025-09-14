import {
  useTokenQuery,
  useUserQuery,
  useCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  authQueryKeys,
} from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const queryClient = useQueryClient();

  // Queries
  const tokenQuery = useTokenQuery();
  const userQuery = useUserQuery();
  const currentUserQuery = useCurrentUserQuery();

  // Mutations
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  // Check if user is authenticated
  const isAuthenticated = !!tokenQuery.data && !!userQuery.data;

  // Combined loading state
  const isLoading = tokenQuery.isLoading || userQuery.isLoading;

  // Login function
  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  };

  // Register function
  const register = async (
    email: string,
    password: string,
    name: string,
    profilePicture?: string,
  ) => {
    return registerMutation.mutateAsync({
      email,
      password,
      name,
      profilePicture,
    });
  };

  // Logout function
  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  // Refresh user data
  const refreshUser = async () => {
    return queryClient.refetchQueries({
      queryKey: authQueryKeys.currentUser(),
    });
  };

  return {
    // State
    user: currentUserQuery.data || userQuery.data,
    token: tokenQuery.data,
    isAuthenticated,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,

    // Auth status queries
    tokenQuery,
    userQuery,
    currentUserQuery,

    // Actions
    login,
    register,
    logout,
    refreshUser,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
