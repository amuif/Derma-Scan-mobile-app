import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconX, IconArrowLeft } from '@tabler/icons-react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginHeader({ showBackButton = false, onClose }: { showBackButton?: boolean; onClose?: () => void }) {
  const navigation = useNavigation();
  
  const handleBack = () => {
    if (onClose) {
      onClose();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Top bar with close/back button */}
      <ThemedView style={styles.topBar}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <IconArrowLeft size={24} color="#6b7280" />
          </TouchableOpacity>
        ) : (
          <ThemedView style={styles.placeholder} />
        )}
        
        {onClose && (
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <IconX size={24} color="#6b7280" />
          </TouchableOpacity>
        )}
      </ThemedView>

      {/* Logo/Brand */}
      <ThemedView style={styles.logoContainer}>
        <ThemedView style={styles.logo}>
          <ThemedText style={styles.logoText}>A</ThemedText>
        </ThemedView>
        <ThemedText style={styles.brandText}>AppName</ThemedText>
      </ThemedView>

      {/* Main header content */}
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Welcome back</ThemedText>
        <ThemedText style={styles.subtitle}>Sign in to continue your journey</ThemedText>
      </ThemedView>

      {/* Decorative elements */}
      <ThemedView style={styles.decorationCircle1} />
      <ThemedView style={styles.decorationCircle2} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  decorationCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dbeafe',
    top: -30,
    right: -30,
    opacity: 0.6,
  },
  decorationCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fee2e2',
    bottom: -20,
    left: -20,
    opacity: 0.4,
  },
});
