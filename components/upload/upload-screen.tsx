import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useImageUploadMutation } from '@/hooks/useAuth';
import { ThemedView } from '../ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { CameraType, useCameraPermissions } from 'expo-camera';

interface PredictionResult {
  label: string;
  score: number;
}

const SkinLesionUploadScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const { mutateAsync: upload } = useImageUploadMutation();

  const takePhoto = async () => {
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const selectFromGallery = async (): Promise<void> => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      console.log(image);
      setSelectedImage(image!);
    }
  };

  const uploadImage = async (): Promise<void> => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const uriParts = selectedImage.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        name: selectedImage.fileName ?? 'upload',
        type: `image/${fileType}`,
      } as any);

      formData.append('additionalInformation', 'testing');

      const data = await upload(formData);
      console.log(data);

      // if (data.success) {
      //   setResults(data.predictions);
      // } else {
      //   Alert.alert('Upload Failed', data.error || 'Failed to analyze image');
      // }
      //
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Error',
        'Failed to upload image. Please check your connection.',
      );
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = (): void => {
    setSelectedImage(null);
    setResults(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Skin Lesion Analysis</Text>
      <Text style={styles.subtitle}>
        Upload an image for AI-powered analysis
      </Text>

      {selectedImage ? (
        <ThemedView style={styles.imageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <View style={styles.placeholderContainer}>
          <Icon name="photo-camera" size={60} color="#007AFF" />
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={takePhoto}
          disabled={uploading}
        >
          <Icon
            name="camera-alt"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          onPress={selectFromGallery}
          disabled={uploading}
        >
          <Icon
            name="photo-library"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <TouchableOpacity
          style={[
            styles.button,
            styles.uploadButton,
            uploading && styles.uploadButtonDisabled,
          ]}
          onPress={uploadImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon
                name="cloud-upload"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Analyze Image</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Analysis Results</Text>
          {results.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultLabel}>{result.label}</Text>
              <Text style={styles.resultScore}>
                {Math.round(result.score * 100)}% confidence
              </Text>
            </View>
          ))}
        </View>
      )}

      {!selectedImage && (
        <ThemedView style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips for Best Results:</Text>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#007AFF" />
            <Text style={styles.tipText}>Ensure good lighting</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#007AFF" />
            <Text style={styles.tipText}>Focus clearly on the lesion</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color="#007AFF" />
            <Text style={styles.tipText}>Include some surrounding skin</Text>
          </View>
        </ThemedView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 300,
    aspectRatio: 1,
    borderRadius: 12,
  },
  clearButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  placeholderText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 160,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  galleryButton: {
    backgroundColor: '#007AFF',
  },
  uploadButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    marginBottom: 20,
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  resultScore: {
    fontSize: 14,
    color: '#007AFF',
  },
  tipsContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default SkinLesionUploadScreen;
