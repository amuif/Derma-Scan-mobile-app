import { Button } from '../ui/button';
import { IconLogout, IconTrash } from '@tabler/icons-react-native';
import { useDeleteMutation, useLogoutMutation } from '@/hooks/useAuth';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '@/stores/auth';

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
      <ThemedText style={styles.title}>Actions</ThemedText>

      <ThemedView style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDeleteAccount}
        >
          <ThemedView style={styles.actionContent}>
            <ThemedView
              style={[styles.iconContainer, { backgroundColor: '#fee2e2' }]}
            >
              <IconTrash size={22} color="#dc2626" />
            </ThemedView>
            <ThemedView style={styles.textContainer}>
              <ThemedText style={[styles.actionText, { color: '#dc2626' }]}>
                Delete Account
              </ThemedText>
              <ThemedText style={styles.actionSubtext}>
                Permanently delete your account
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <IconLogout size={24} color="#dc2626" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.versionContainer}>
        <ThemedText style={styles.versionText}>App Version 1.0.0</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 12,
    padding: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '500',
    fontSize: 16,
    paddingHorizontal: 2,
    marginHorizontal: 5,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
