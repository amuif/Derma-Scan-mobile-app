import { useScanHistory } from '@/hooks/useScan';
import { StyleSheet, FlatList, useColorScheme } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import CommunityCard from '../shared/community-card';

const themeColors = {
  light: {
    // Surfaces
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    surfaceContainer: '#f1f5f9',

    // Text
    onSurface: '#1e293b',
    onSurfaceVariant: '#475569',
    onSurfaceMuted: '#64748b',

    // Borders
    outline: '#e2e8f0',
    outlineVariant: '#cbd5e1',

    // Primary
    primary: '#3b82f6',
    onPrimary: '#ffffff',

    // Status
    success: '#16a34a',
    warning: '#d97706',
    error: '#ef4444',
    neutral: '#6b7280',
  },
  dark: {
    // Surfaces
    surface: '#1e293b',
    surfaceVariant: '#334155',
    surfaceContainer: '#0f172a',

    // Text
    onSurface: '#f1f5f9',
    onSurfaceVariant: '#cbd5e1',
    onSurfaceMuted: '#94a3b8',

    // Borders
    outline: '#475569',
    outlineVariant: '#64748b',

    // Primary
    primary: '#60a5fa',
    onPrimary: '#1e293b',

    // Status
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    neutral: '#9ca3af',
  },
};

// Hook to use theme colors
const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return themeColors[colorScheme === 'dark' ? 'dark' : 'light'];
};

export default function CommunityHeader() {
  const { data, isLoading, isError } = useScanHistory();
  const colors = useThemeColors();

  if (isLoading) {
    return (
      <ThemedView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        <ThemedText style={[styles.loadingText, { color: colors.primary }]}>
          Loading...
        </ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    console.log('Error fetching community posts', isError);
    return (
      <ThemedView
        style={[
          styles.errorContainer,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        <ThemedText style={[styles.errorText, { color: colors.error }]}>
          Failed to load community posts
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.surfaceContainer }]}
    >
      {data && data.length > 0 ? (
        <>
          <ThemedText style={[styles.headerText, { color: colors.primary }]}>
            Community Scan History
          </ThemedText>

          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CommunityCard item={item} />}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : (
        <ThemedText
          style={[styles.noDataText, { color: colors.onSurfaceMuted }]}
        >
          No scan history available
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  headerText: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
});
