import { useScanHistory } from '@/hooks/useScan';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import CommunityCard from '../shared/community-card';

export default function CommunityHeader() {
  const { data, isLoading, isError } = useScanHistory();

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    console.log('Error fetching community posts', isError);
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Failed to load community posts
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {data && data.length > 0 ? (
        <>
          <ThemedText style={styles.headerText}>
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
        <ThemedText style={styles.noDataText}>
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
    color: '#3b82f6',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#3b82f6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  noDataText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
});
