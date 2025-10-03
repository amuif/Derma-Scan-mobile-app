import * as FileSystem from 'expo-file-system';
import { ImageResult } from 'expo-image-manipulator';

export const ImageValidation = async (file: ImageResult) => {
  try {
    // 1. Check resolution
    if (file.width < 300 || file.height < 300) {
      return 'Poor'; // too small
    }

    // 2. Check aspect ratio (example: reject extreme panoramas)
    const aspectRatio = file.width / file.height;
    if (aspectRatio < 0.5 || aspectRatio > 2) {
      return 'Poor'; // weird ratio
    }

    // 3. Check file size
    const fileInfo = await FileSystem.getInfoAsync(file.uri);
    if (fileInfo.exists && fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
      return 'Poor'; // > 5MB
    }

    return 'Good';
  } catch (error) {
    console.warn('Image validation failed:', error);
    return 'Poor';
  }
};
