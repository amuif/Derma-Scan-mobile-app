import { IconLogout, IconTrash } from '@tabler/icons-react-native';
import { useDeleteMutation, useLogoutMutation } from '@/hooks/useAuth';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { StyleSheet, TouchableOpacity, Alert, View } from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileFooter() {
  const { mutateAsync: logout } = useLogoutMutation();
  const { mutateAsync: deleteUser } = useDeleteMutation();
  const { user } = useAuthStore();

  async function handleLogout() {
    try {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.log('Error logging out', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]);
    } catch (error) {
      console.log('Error showing logout confirmation', error);
    }
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            user && deleteUser(user.id);
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.footerCard}>
        <ThemedView style={styles.header}>
          <Ionicons name="settings-outline" size={24} color="#3b82f6" />
          <ThemedText style={styles.title}>Account Actions</ThemedText>
        </ThemedView>

        <ThemedView style={styles.actionsContainer}>
          {/* Delete Account Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDeleteAccount}
          >
            <View
              style={[
                styles.buttonIconContainer,
                { backgroundColor: '#fee2e2' },
              ]}
            >
              <IconTrash size={20} color="#dc2626" />
            </View>
            <View style={styles.buttonContent}>
              <ThemedText style={styles.buttonTitle}>Delete Account</ThemedText>
              <ThemedText style={styles.buttonDescription}>
                Permanently delete your account and all data
              </ThemedText>
            </View>
            <View style={styles.buttonArrow}>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <View
              style={[
                styles.buttonIconContainer,
                { backgroundColor: '#eff6ff' },
              ]}
            >
              <IconLogout size={20} color="#3b82f6" />
            </View>
            <View style={styles.buttonContent}>
              <ThemedText style={styles.buttonTitle}>Logout</ThemedText>
              <ThemedText style={styles.buttonDescription}>
                Sign out of your account
              </ThemedText>
            </View>
            <View style={styles.buttonArrow}>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </ThemedView>

        {/* Version Info */}
        <ThemedView style={styles.versionContainer}>
          <View style={styles.versionContent}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#9ca3af"
            />
            <ThemedText style={styles.versionText}>
              App Version 1.0.0
            </ThemedText>
          </View>
          <ThemedText style={styles.buildText}>Build 2024.01</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footerCard: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIconContainer: {
    width: 44,
    height: 44,
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
    color: '#111827',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  buttonArrow: {
    padding: 4,
  },
  versionContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
    gap: 8,
  },
  versionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  buildText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
