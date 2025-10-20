import { authStorage } from '@/lib/auth';
import { scanApi } from '@/lib/scan';
import { useMutation, useQuery } from '@tanstack/react-query';

interface UploadVariables {
  uri: string;
  symptoms: string;
  consent: string;
}
interface TextInputProps {
  symptoms: string;
  consent: string;
}

export const useCheckImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const token = await authStorage.getToken();
      const user = await authStorage.getUser();

      console.log('user', user, 'token', token);
      if (!user || !token) return;
      return scanApi.checkImage(token, file);
    },
  });
};
export const useImageUploadMutation = () => {
  return useMutation({
    mutationFn: async ({ uri, consent, symptoms }: UploadVariables) => {
      const token = await authStorage.getToken();
      const user = await authStorage.getUser();
      if (!user) return;

      return scanApi.uploadImage(token!, uri, consent, user?.id!, symptoms);
    },
    onSuccess: () => {
      console.log('uploaded successfully!');
    },
    onError: (error) => {
      console.error('Error uploading image', error);
    },
  });
};
export const useTextScan = () => {
  return useMutation({
    mutationKey: ['get-text-scan'],
    mutationFn: async ({ symptoms, consent }: TextInputProps) => {
      const token = await authStorage.getToken();
      const user = await authStorage.getUser();
      if (!token || !user) return;
      return scanApi.textUpload(token, symptoms, consent, user?.id);
    },
  });
};
export const useScanHistory = () => {
  return useQuery({
    queryKey: ['get-scan-history'],
    queryFn: async () => {
      const token = await authStorage.getToken();
      return scanApi.scanHistory(token!);
    },
  });
};
