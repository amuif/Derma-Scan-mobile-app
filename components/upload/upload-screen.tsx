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
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemedView } from '../ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { ThemedText } from '../ThemedText';
import {
  useTextScan,
  useImageUploadMutation,
  useCheckImage,
  useScanHistory,
} from '@/hooks/useScan';
import { useThemeColor } from '@/hooks/useThemeColors';

interface PredictionResult {
  conditions: string[];
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  symptomNote: string;
  timestamp: string;
}

type TabType = 'image' | 'text';

const SkinLesionUploadScreen: React.FC = () => {
  const { refetch } = useScanHistory();
  const { mutateAsync: uploadImage } = useImageUploadMutation();
  const { mutateAsync: uploadText } = useTextScan();
  const { mutateAsync: checkImage } = useCheckImage();

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [symptomsText, setSymptomsText] = useState<string>('');
  const [hasSkinLesion, setHasSkinLesion] = useState<boolean | null>(null);
  const [lastScanType, setLastScanType] = useState<'image' | 'text' | null>(
    null,
  );
  const [sharingToCommunity, setSharingToCommunity] = useState(false);
  const colors = useThemeColor();

  const transformTextResponse = (data: any): PredictionResult => {
    if (data?.analysis) {
      return {
        conditions: data.analysis.conditions || [],
        confidence: data.analysis.confidence || 0,
        risk: data.analysis.risk_level || 'low',
        symptomNote: data.analysis.guidance || 'No specific guidance provided.',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      conditions: data?.conditions || [],
      confidence: data?.confidence || 0,
      risk: data?.risk || 'low',
      symptomNote: data?.symptomNote || 'No specific guidance provided.',
      timestamp: data?.timestamp || new Date().toISOString(),
    };
  };

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

      const compressedFile = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      const file: any = {
        uri: compressedFile.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      };

      setSelectedImage({
        ...image,
        uri: compressedFile.uri,
      });

      setIsAnalyzing(true);
      setHasSkinLesion(null);

      try {
        const response = await checkImage(file);
        if (response && response?.conditions?.length > 0) {
          setHasSkinLesion(true);
        } else {
          setHasSkinLesion(false);
        }
      } catch (error) {
        console.log('Error checking image:', error);
        Alert.alert(
          'Analysis Error',
          'Failed to analyze the image. Please try again.',
        );
        setHasSkinLesion(null);
      } finally {
        setIsAnalyzing(false);
      }
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

      const compressedFile = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 2024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      const file: any = {
        uri: compressedFile.uri,
        type: 'image/jpeg',
        name: image.fileName ?? 'photo.jpg',
      };

      setSelectedImage({
        ...image,
        uri: compressedFile.uri,
      });

      setIsAnalyzing(true);
      setHasSkinLesion(null);

      try {
        const response = await checkImage(file);
        if (response && response?.conditions?.length > 0) {
          setHasSkinLesion(true);
        } else {
          setHasSkinLesion(false);
        }
      } catch (error) {
        console.log('Error checking image:', error);
        Alert.alert(
          'Analysis Error',
          'Failed to analyze the image. Please try again.',
        );
        setHasSkinLesion(null);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleImageUpload = async (): Promise<void> => {
    if (uploading) {
      return;
    }
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    if (hasSkinLesion === false) {
      Alert.alert(
        'No Skin Lesion',
        'Cannot analyze image that does not contain a detectable skin lesion.',
      );
      return;
    }

    setUploading(true);

    const { uri } = selectedImage;
    if (!(await checkImageQuality(uri))) {
      setUploading(false);
      return;
    }

    try {
      const data = await uploadImage({
        uri,
        consent: 'false',
        symptoms: 'itching, redness',
      });
      console.table(data);
      const transformedData = transformTextResponse(data);
      setResults(transformedData);
      setLastScanType('image');
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

  const handleTextUpload = async (): Promise<void> => {
    if (uploading) {
      return;
    }
    if (!symptomsText.trim()) {
      Alert.alert('No Symptoms', 'Please describe your symptoms first');
      return;
    }
    setUploading(true);

    try {
      const data = await uploadText({
        symptoms: symptomsText,
        consent: 'false',
      });
      console.log('Text upload response:', data);

      const transformedData = transformTextResponse(data);
      console.log('Transformed data:', transformedData);

      setResults(transformedData);
      setLastScanType('text');
    } catch (error) {
      console.error('Text upload error:', error);
      Alert.alert(
        'Error',
        'Failed to analyze symptoms. Please check your connection.',
      );
    } finally {
      setUploading(false);
    }
  };
  const handleImageUploadToCommunity = async (): Promise<void> => {
    if (sharingToCommunity) {
      return;
    }

    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    if (hasSkinLesion === false) {
      Alert.alert(
        'No Skin Lesion',
        'Cannot share image that does not contain a detectable skin lesion.',
      );
      return;
    }

    setSharingToCommunity(true);

    try {
      console.log('Starting image share to community...');

      const { uri } = selectedImage;
      if (!(await checkImageQuality(uri))) {
        Alert.alert('Image Quality', 'Please use a higher-quality photo.');
        return;
      }

      // Call the upload function with consent: true
      const data = await uploadImage({
        uri,
        consent: 'true', // This is the key difference
        symptoms: symptomsText.trim() || 'itching, redness', // Use actual symptoms if available
      });

      console.log('Community share successful:', data);

      const transformedData = transformTextResponse(data);
      setResults(transformedData);
      setLastScanType('image');

      Alert.alert('Success', 'Your scan has been shared to the community!');
    } catch (error: any) {
      console.error('Error sharing to community:', error);
      console.error('Error details:', error.response?.data || error.message);

      Alert.alert(
        'Sharing Failed',
        error.response?.data?.message ||
          'Failed to share to community. Please try again.',
      );
    } finally {
      setSharingToCommunity(false);
    }
  };

  const handleTextUploadToCommunity = async (): Promise<void> => {
    if (sharingToCommunity) {
      return;
    }

    if (!symptomsText.trim()) {
      Alert.alert('No Symptoms', 'Please describe your symptoms first');
      return;
    }

    setSharingToCommunity(true);

    try {
      console.log('Starting text share to community...');

      const data = await uploadText({
        symptoms: symptomsText,
        consent: 'true', // This is the key difference
      });

      console.log('Community text share successful:', data);

      const transformedData = transformTextResponse(data);
      setResults(transformedData);
      setLastScanType('text');

      Alert.alert(
        'Success',
        'Your symptoms analysis has been shared to the community!',
      );
    } catch (error: any) {
      console.error('Error sharing text to community:', error);
      console.error('Error details:', error.response?.data || error.message);

      Alert.alert(
        'Sharing Failed',
        error.response?.data?.message ||
          'Failed to share to community. Please try again.',
      );
    } finally {
      setSharingToCommunity(false);
    }
  };

  const handleShareToCommunity = async (): Promise<void> => {
    if (!lastScanType) {
      Alert.alert('Error', 'No scan results available to share.');
      return;
    }

    console.log('Sharing to community, last scan type:', lastScanType);

    try {
      if (lastScanType === 'image') {
        await handleImageUploadToCommunity();
      } else {
        await handleTextUploadToCommunity();
      }

      // Refresh history after successful share
      refetch();
    } catch (error) {
      console.error('Error in handleShareToCommunity:', error);
    }
  };
  const clearSelection = (): void => {
    setSelectedImage(null);
    setSymptomsText('');
    setResults(null);
    setHasSkinLesion(null);
    setLastScanType(null);
  };

  const renderConditions = (conditions: string[] | undefined) => {
    if (!conditions || conditions.length === 0) {
      return (
        <ThemedText
          style={[styles.noConditions, { color: colors.onSurfaceMuted }]}
        >
          No specific conditions identified
        </ThemedText>
      );
    }

    return conditions.map((c, idx) => (
      <View
        key={idx}
        style={[
          styles.conditionBadgeContainer,
          { backgroundColor: colors.conditionBadge },
        ]}
      >
        <Text style={[styles.conditionBadgeText, { color: colors.primary }]}>
          {c}
        </Text>
      </View>
    ));
  };

  const renderImageTab = () => (
    <>
      {selectedImage ? (
        <ThemedView
          style={[styles.imageContainer, { shadowColor: colors.shadow }]}
        >
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>

          {hasSkinLesion !== null && (
            <View
              style={[
                styles.skinDetectionBadge,
                {
                  backgroundColor: hasSkinLesion ? '#4CAF50' : '#FF9800',
                },
              ]}
            >
              <Text style={styles.skinDetectionText}>
                {hasSkinLesion
                  ? 'Skin Lesion Detected'
                  : 'No Skin Lesion Found'}
              </Text>
            </View>
          )}
        </ThemedView>
      ) : (
        <View
          style={[
            styles.placeholderContainer,
            {
              borderColor: colors.primary,
              backgroundColor: colors.tipsBackground,
            },
          ]}
        >
          <Icon name="photo-camera" size={60} color={colors.primary} />
          <Text style={[styles.placeholderText, { color: colors.primary }]}>
            No image selected
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={takePhoto}
          disabled={uploading || isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon
                name="camera-alt"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Take Photo</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={selectFromGallery}
          disabled={uploading || isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon
                name="photo-library"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <TouchableOpacity
          style={[
            styles.uploadButton,
            {
              backgroundColor:
                uploading || isAnalyzing || hasSkinLesion === false
                  ? colors.neutral
                  : '#34C759',
            },
          ]}
          onPress={handleImageUpload}
          disabled={uploading || isAnalyzing || hasSkinLesion === false}
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
              <Text style={styles.buttonText}>
                {hasSkinLesion === false
                  ? 'Analysis Disabled'
                  : 'Analyze Image'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {isAnalyzing && (
        <View style={styles.analysisStatus}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.analysisStatusText, { color: colors.primary }]}>
            Checking for skin lesions...
          </Text>
        </View>
      )}
    </>
  );

  const renderTextTab = () => (
    <>
      <ThemedView style={styles.textInputContainer}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surfaceVariant,
              color: colors.onSurface,
              borderColor: colors.outline,
            },
          ]}
          placeholder="Describe your symptoms in detail..."
          placeholderTextColor={colors.onSurfaceMuted}
          value={symptomsText}
          onChangeText={setSymptomsText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={[styles.characterCount, { color: colors.onSurfaceMuted }]}>
          {symptomsText.length}/500
        </Text>
      </ThemedView>

      <View style={styles.textTips}>
        <Text style={[styles.tipsTitle, { color: colors.primary }]}>
          What to include:
        </Text>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.onSurface }]}>
            Location of the skin issue
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.onSurface }]}>
            Appearance (color, size, shape)
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.onSurface }]}>
            Any symptoms (itching, pain, bleeding)
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="check-circle" size={16} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.onSurface }]}>
            How long it&apos;s been there
          </Text>
        </View>
      </View>

      {symptomsText.trim() && (
        <TouchableOpacity
          style={[
            styles.uploadButton,
            { backgroundColor: uploading ? colors.neutral : '#34C759' },
          ]}
          onPress={handleTextUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon
                name="text-fields"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Analyze Symptoms</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.surfaceContainer }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.primary }]}>
        Skin Lesion Analysis
      </Text>
      <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
        Upload an image or describe symptoms for AI-powered analysis
      </Text>

      <View
        style={[styles.tabContainer, { backgroundColor: colors.tabBackground }]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'image' && [
              styles.activeTab,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setActiveTab('image')}
        >
          <Icon
            name="photo-camera"
            size={20}
            color={activeTab === 'image' ? '#fff' : colors.primary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'image' ? '#fff' : colors.primary },
            ]}
          >
            Image Analysis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'text' && [
              styles.activeTab,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setActiveTab('text')}
        >
          <Icon
            name="text-fields"
            size={20}
            color={activeTab === 'text' ? '#fff' : colors.primary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'text' ? '#fff' : colors.primary },
            ]}
          >
            Text Analysis
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'image' ? renderImageTab() : renderTextTab()}

      {results && (
        <ThemedView
          style={[
            styles.resultsContainer,
            { backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <ThemedText style={[styles.resultsTitle, { color: colors.primary }]}>
            Analysis Results
          </ThemedText>

          <ThemedView
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}
          >
            {renderConditions(results.conditions)}
          </ThemedView>

          <Text style={[styles.resultScore, { color: colors.primary }]}>
            Confidence: {((results.confidence || 0) * 100).toFixed(1)}%
          </Text>

          <Text
            style={[
              styles.resultRisk,
              results.risk === 'low' && [
                styles.riskLow,
                { backgroundColor: colors.riskLow, color: colors.success },
              ],
              results.risk === 'medium' && [
                styles.riskMedium,
                { backgroundColor: colors.riskMedium, color: colors.warning },
              ],
              results.risk === 'high' && [
                styles.riskHigh,
                { backgroundColor: colors.riskHigh, color: colors.error },
              ],
            ]}
          >
            {(results.risk || 'low').toUpperCase()} RISK
          </Text>

          {results.symptomNote && (
            <Text
              style={[styles.resultNote, { color: colors.onSurfaceVariant }]}
            >
              💡 {results.symptomNote}
            </Text>
          )}
          <Text
            style={[styles.resultTimestamp, { color: colors.onSurfaceMuted }]}
          >
            {new Date(results.timestamp || new Date()).toLocaleString()}
          </Text>

          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.primary }]}
            onPress={handleShareToCommunity}
            disabled={sharingToCommunity}
          >
            {sharingToCommunity ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Icon
                  name="share"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.shareButtonText}>Share to Community</Text>
              </>
            )}
          </TouchableOpacity>
        </ThemedView>
      )}

      {!selectedImage && activeTab === 'image' && (
        <ThemedView
          style={[
            styles.tipsContainer,
            { backgroundColor: colors.tipsBackground },
          ]}
        >
          <Text style={[styles.tipsTitle, { color: colors.primary }]}>
            Tips for Best Results:
          </Text>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.onSurface }]}>
              Ensure good lighting
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.onSurface }]}>
              Focus clearly on the lesion
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.onSurface }]}>
              Include some surrounding skin
            </Text>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },

  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
    width: '100%',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Image Tab Styles
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
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
  skinDetectionBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skinDetectionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  placeholderContainer: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 10,
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
  buttonIcon: { marginRight: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  // Analysis Status
  analysisStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  analysisStatusText: {
    marginLeft: 8,
    fontSize: 14,
  },

  // Text Tab Styles
  textInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  textTips: {
    width: '100%',
    marginBottom: 20,
  },

  // Upload Button
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    marginBottom: 20,
    elevation: 3,
  },

  // Results Styles
  resultsContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  conditionBadgeContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  conditionBadgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noConditions: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
  },
  resultScore: { fontSize: 14 },
  resultRisk: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  riskLow: {},
  riskMedium: {},
  riskHigh: {},
  resultNote: { fontSize: 14, marginTop: 5 },
  resultTimestamp: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },

  // Share Button
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 16,
    elevation: 2,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },

  // Tips Styles
  tipsContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tipText: { marginLeft: 10, fontSize: 14 },
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
