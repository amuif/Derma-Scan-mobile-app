import { useScanHistory } from '@/hooks/useScan';
import { useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';



export default function CommunityHeader() {
  const { data, isLoading, isError } = useScanHistory();

  useEffect(() => {
    console.log(data);
  }, [data]);

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
        <ThemedText style={styles.errorText}>Failed to load community posts</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {data && data.length > 0 ? (
        <>
          <ThemedText style={styles.headerText}>Community Scan History</ThemedText>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <View style={styles.cardHeader}>
                  <ThemedText style={styles.confidenceText}>
                    Confidence: {(item.confidence * 100).toFixed(1)}%
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.riskText,
                      { color: item.risk === 'HIGH' ? '#ef4444' : item.risk === 'MEDIUM' ? '#f59e0b' : '#22c55e' },
                    ]}
                  >
                    Risk: {item.risk}
                  </ThemedText>
                </View>
                <ThemedText style={styles.notesText}>Notes: {item.notes || 'No notes'}</ThemedText>
                <ThemedText style={styles.timestampText}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </ThemedText>
              </ThemedView>
            )}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : (
        <ThemedText style={styles.noDataText}>No scan history available</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerText: {
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
    backgroundColor: '#f8fafc',
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  riskText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  timestampText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  listContent: {
    paddingBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 20,
  },
});
