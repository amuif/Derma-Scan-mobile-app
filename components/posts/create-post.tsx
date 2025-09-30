import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usePostCreation } from '@/hooks/usePost';
import { ThemedText } from '../ThemedText';
import { useCurrentUserQuery } from '@/hooks/useAuth';
import { ThemedView } from '../ThemedView';
import { X } from 'lucide-react-native';

export type CreatePostDialogRef = {
  open: () => void;
  close: () => void;
};

const EducationCategory = {
  TIPS: 'TIPS',
  PREVENTION: 'PREVENTION',
  AWARENESS: 'AWARENESS',
  TREATMENT: 'TREATMENT',
};

const CreatePost = forwardRef<CreatePostDialogRef>((_props, ref) => {
  const [visible, setVisible] = useState(false);
  const { data: user, isLoading } = useCurrentUserQuery();
  const { mutate: createPost, isPending: isSubmitting } = usePostCreation();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: EducationCategory.TIPS,
    language: 'en',
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => {
      setVisible(false);
      resetForm();
    },
  }));

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: EducationCategory.TIPS,
      language: 'en',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      Alert.alert('Error', 'Please enter content');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    createPost(
      {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        language: formData.language,
        authorId: user.id,
        status: 'PENDING',
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Post created successfully!');
          resetForm();
          setVisible(false);
        },
        onError: (error: Error) => {
          Alert.alert('Error', 'Failed to create post. Please try again.');
          console.error('Error creating post:', error);
        },
      },
    );
  };

  const handleClose = () => {
    if (formData.title || formData.content) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetForm();
              setVisible(false);
            },
          },
        ],
      );
    } else {
      setVisible(false);
    }
  };

  if (isLoading && visible) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.loadingContainer}>
            <ThemedText>Loading...............</ThemedText>
          </ThemedView>
        </ThemedView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              Create Education Post
            </ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <ThemedText style={styles.headerSubtitle}>
                Share knowledge and help others learn
              </ThemedText>

              {/* Title Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Title *</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter a compelling title"
                  placeholderTextColor="#9ca3af"
                  value={formData.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  maxLength={200}
                />
                <ThemedText style={styles.charCount}>
                  {formData.title.length}/200
                </ThemedText>
              </View>

              {/* Category Picker */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Category *</ThemedText>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.category}
                    onValueChange={(value) =>
                      handleInputChange('category', value)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="Tips & Advice"
                      value={EducationCategory.TIPS}
                    />
                    <Picker.Item
                      label="Prevention"
                      value={EducationCategory.PREVENTION}
                    />
                    <Picker.Item
                      label="Awareness"
                      value={EducationCategory.AWARENESS}
                    />
                    <Picker.Item
                      label="Treatment"
                      value={EducationCategory.TREATMENT}
                    />
                  </Picker>
                </View>
              </View>

              {/* Content Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Content *</ThemedText>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Write your educational content here..."
                  placeholderTextColor="#9ca3af"
                  value={formData.content}
                  onChangeText={(text) => handleInputChange('content', text)}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <ThemedText style={styles.charCount}>
                  {formData.content.length} characters
                </ThemedText>
              </View>

              {/* Form Info */}
              <View style={styles.infoBox}>
                <ThemedText style={styles.infoText}>
                  • Posts will be reviewed before publication{'\n'}• Make sure
                  your content is accurate and helpful{'\n'}• Use clear and
                  concise language
                </ThemedText>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.submitButtonText}>
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
});

// Add display name to fix ESLint warning
CreatePost.displayName = 'CreatePost';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b7280',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#1f2937',
  },
  charCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoBox: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreatePost;
