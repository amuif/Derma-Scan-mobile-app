import { StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconMicroscope } from '@tabler/icons-react-native';

const SignUpHeader = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.logoContainer}>
          <ThemedView style={styles.logoCircle}>
            <IconMicroscope size={32} color="#3b82f6" />
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.title}>DERMA SCAN</ThemedText>

        <ThemedText style={styles.subtitle}>
          Skin health insights powered by AI
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.decorationCircle1} />
      <ThemedView style={styles.decorationCircle2} />
      <ThemedView style={styles.decorationCircle3} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    backgroundColor: '#f8fafc',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(99, 102, 241, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  decorationCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e7ff',
    top: -40,
    right: -40,
    opacity: 0.7,
  },
  decorationCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fae8ff',
    bottom: -30,
    left: -20,
    opacity: 0.5,
  },
  decorationCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dcfce7',
    top: 50,
    left: 40,
    opacity: 0.4,
  },
});

export default SignUpHeader;
