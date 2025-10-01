import { authStorage } from '@/lib/auth';
import { scanApi } from '@/lib/scan';
import { useAuthStore } from '@/stores/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCurrentUserQuery } from './useAuth';

interface TextInputProps {
  symptoms: string;
}

export const useScanHistory = () => {
  return useQuery({
    queryKey: ['get-scan-history'],
    queryFn: async () => {
      const token = await authStorage.getToken();
      return scanApi.scanHistory(token!);
    },
  });
};

export const useTextScan = () => {
  const { data: user } = useCurrentUserQuery();
  return useMutation({
    mutationKey: ['get-text-scan'],
    mutationFn: async ({ symptoms }: TextInputProps) => {
      const token = await authStorage.getToken();
      if (!token || !user) return;
      return scanApi.textUpload(token, symptoms, user?.id);
    },
  });
};
