import { useEffect, useState } from 'react';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCurrentUserQuery, useUpdateCurrentUser } from '@/hooks/useAuth';
import { authStorage } from '@/lib/auth';
import { useRouter } from 'expo-router';

export default function ProfileData() {
  const { data: user, isLoading, refetch } = useCurrentUserQuery();
  const { mutateAsync: updateUser } = useUpdateCurrentUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };

      const response = updateUser(updateData);
      await authStorage.setUser((await response).user);
      refetch();

      setFormData((prev) => ({ ...prev, password: '' }));
      setIsEditing(false);
      Alert.alert('Success', 'Your profile has been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.log(error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
    setIsEditing(false);
    setShowPassword(false);
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.noDataText}>
          No user data available
        </ThemedText>
      </ThemedView>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Profile Information</ThemedText>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil-outline" size={20} color="#3b82f6" />
              <ThemedText style={styles.editButtonText}>Edit</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedView style={styles.editActions}>
              <TouchableOpacity
                style={[styles.cancelButton]}
                onPress={handleCancel}
                disabled={isLoading}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.fieldsContainer}>
          <ThemedView style={styles.field}>
            <ThemedView style={styles.fieldHeader}>
              <Ionicons name="person-outline" size={16} color="#6b7280" />
              <ThemedText style={styles.fieldLabel}>Full Name</ThemedText>
            </ThemedView>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your name"
              />
            ) : (
              <ThemedText style={styles.fieldValue}>{user.name}</ThemedText>
            )}
          </ThemedView>

          <ThemedView style={styles.field}>
            <ThemedView style={styles.fieldHeader}>
              <Ionicons name="mail-outline" size={16} color="#6b7280" />
              <ThemedText style={styles.fieldLabel}>Email Address</ThemedText>
            </ThemedView>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <ThemedText style={styles.fieldValue}>{user.email}</ThemedText>
            )}
          </ThemedView>

          {isEditing && (
            <ThemedView style={styles.field}>
              <ThemedView style={styles.fieldHeader}>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color="#6b7280"
                />
                <ThemedText style={styles.fieldLabel}>New Password</ThemedText>
              </ThemedView>
              <ThemedView style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Enter new password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView style={styles.field}>
            <ThemedView style={styles.fieldHeader}>
              <Ionicons name="refresh-outline" size={16} color="#6b7280" />
              <ThemedText style={styles.fieldLabel}>Last Updated</ThemedText>
            </ThemedView>
            <ThemedText style={styles.fieldValue}>
              {formatDate(user.updatedAt)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.historyCard}>
        <ThemedView style={styles.historyHeader}>
          <Ionicons name="time-outline" size={24} color="#3b82f6" />
          <ThemedText style={styles.historyTitle}>Your History</ThemedText>
        </ThemedView>

        <ThemedView style={styles.historyButtonsContainer}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/history')}
          >
            <View
              style={[
                styles.buttonIconContainer,
                { backgroundColor: '#3b82f6' },
              ]}
            >
              <Ionicons name="scan-outline" size={24} color="#ffffff" />
            </View>
            <View style={styles.buttonContent}>
              <ThemedText style={styles.buttonTitle}>Scan History</ThemedText>
              <ThemedText style={styles.buttonDescription}>
                View your skin analysis results and previous scans
              </ThemedText>
            </View>
            <View style={styles.buttonArrow}>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/post')}
          >
            <View
              style={[
                styles.buttonIconContainer,
                { backgroundColor: '#8b5cf6' },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#ffffff"
              />
            </View>
            <View style={styles.buttonContent}>
              <ThemedText style={styles.buttonTitle}>Post History</ThemedText>
              <ThemedText style={styles.buttonDescription}>
                Review your educational posts and content
              </ThemedText>
            </View>
            <View style={styles.buttonArrow}>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  editButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 60,
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 10,
    minWidth: 60,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  fieldsContainer: {
    gap: 20,
    marginBottom: 20,
  },
  field: {
    gap: 8,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  input: {
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 50, // Space for eye icon
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  passwordHint: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
  },

  // Enhanced History Styles
  historyCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyButtonsContainer: {
    gap: 16,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
   },
  buttonIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
    gap: 4,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  buttonArrow: {
    padding: 4,
  },
  statusContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  statusText: {
    color: '#166534',
    fontWeight: '500',
  },
  additionalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  additionalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
