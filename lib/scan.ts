import { API_URL } from '@/constants/backend-url';
import { Scan } from '@/types/scan';

export const scanApi = {
  uploadImage: async (
    token: string,
    imageFile: File,
    userId: string,
    symptoms?: string,
  ) => {
    const form = new FormData();

    console.log('userId', userId);

    form.append('file', imageFile);

    form.append('userId', userId);

    if (symptoms) {
      form.append('symptoms', symptoms);
    }

    try {
      const response = await fetch(`${API_URL}/models/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error('Error uploading image', error);
      throw error;
    }
  },

  textUpload: async (token: string, prompt: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/models/text`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, userId }),
      });
      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.log('Error sending text to the backend:', error);
    }
  },
  scanHistory: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/models/history`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as Scan[];
      console.log(result);
      return result;
    } catch (error) {
      console.log('Error fetching scan history', error);
      throw error;
    }
  },
};
