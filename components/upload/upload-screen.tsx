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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useImageUploadMutation } from '@/hooks/useAuth';
import { ThemedView } from '../ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { ThemedText } from '../ThemedText';

interface PredictionResult {
  conditions: string[];
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  symptomNote: string;
  timestamp: string;
}

const SkinLesionUploadScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { mutateAsync: upload } = useImageUploadMutation();

  const takePhoto = async () => {
    if (!permission || !permission.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Camera access is required to take photos.',
        );
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setSelectedImage(image!);
    }
  };

  const selectFromGallery = async (): Promise<void> => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      setSelectedImage(image!);
    }
  };

  const uploadImage = async (): Promise<void> => {
    if (uploading) {
      return;
    }
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }
    setUploading(true);

    const { uri } = selectedImage;
    if (!(await checkImageQuality(uri))) return;
    const symptoms = 'itching, redness';

    try {
      const data = await upload({ uri, symptoms });
      console.table(data);
      setResults(data);
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
        <ThemedView style={styles.resultsContainer}>
          <ThemedText style={styles.resultsTitle}>Analysis Results</ThemedText>

          <ThemedView
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
          >
            {results.conditions.map((c, idx) => (
              <ThemedText key={idx} style={styles.conditionBadge}>
                {c}
              </ThemedText>
            ))}
          </ThemedView>

          <Text style={styles.resultScore}>
            Confidence: {Math.round(results.confidence * 100)}%
          </Text>

          <Text
            style={[
              styles.resultRisk,
              results.risk === 'low' && styles.riskLow,
              results.risk === 'medium' && styles.riskMedium,
              results.risk === 'high' && styles.riskHigh,
            ]}
          >
            {results.risk.toUpperCase()} RISK
          </Text>

          {results.symptomNote && (
            <Text style={styles.resultNote}>💡 {results.symptomNote}</Text>
          )}
          <Text style={styles.resultTimestamp}>
            {new Date(results.timestamp).toLocaleString()}
          </Text>
        </ThemedView>
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
  container: { flex: 1 },
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
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 320,
    aspectRatio: 1,
    borderRadius: 16,
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,122,255,0.05)',
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 160,
    elevation: 2,
  },
  cameraButton: { backgroundColor: '#007AFF' },
  galleryButton: { backgroundColor: '#007AFF' },
  uploadButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    marginBottom: 20,
    elevation: 3,
  },
  uploadButtonDisabled: { backgroundColor: '#ccc' },
  buttonIcon: { marginRight: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  resultsContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  conditionBadge: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    color: '#007AFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  resultScore: { fontSize: 14, color: '#007AFF' },
  resultRisk: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  riskLow: { backgroundColor: 'rgba(52,199,89,0.15)', color: '#34C759' },
  riskMedium: { backgroundColor: 'rgba(255,204,0,0.15)', color: '#FFCC00' },
  riskHigh: { backgroundColor: 'rgba(255,59,48,0.15)', color: '#FF3B30' },
  resultNote: { fontSize: 14, color: '#666', marginTop: 5 },
  resultTimestamp: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 10,
    textAlign: 'center',
  },

  tipsContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    backgroundColor: 'rgba(0,122,255,0.05)',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tipText: { marginLeft: 10, fontSize: 14, color: '#444' },
});

export default SkinLesionUploadScreen;

async function checkImageQuality(uri: string) {
  const { width, height } = await ImageManipulator.manipulateAsync(uri, [], {
    format: ImageManipulator.SaveFormat.JPEG,
  });
  if (width < 224 || height < 224) {
    alert('Image resolution too low. Please use a higher-quality photo.');
    return false;
  }
  return true;
}
