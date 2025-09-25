import { authStorage, scanApi } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';

export const useScanHistory = () => {
  return useQuery({
    queryKey: ['get-scan-history'],
    queryFn: async () => {
      const token = await authStorage.getToken();
      return scanApi.scanHistory(token!);
    },
  });
};
