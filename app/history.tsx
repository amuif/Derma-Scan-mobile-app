import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useScanHistory } from '@/hooks/useScan';
import { Scan } from '@/types/scan';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FILES_URL } from '@/constants/backend-url';

const ScanHistoryScreen: React.FC = () => {
  const { data: scanHistory, isLoading, error, refetch } = useScanHistory();
  const primaryColor = '#3b82f6';

  const getRiskColor = (risk: Scan['risk']) => {
    switch (risk) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);
  const getRiskIcon = (risk: Scan['risk']) => {
    switch (risk) {
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      case 'LOW':
        return 'check-circle';
      default:
        return 'help';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const renderScanItem = ({ item }: { item: Scan }) => {
    const { date, time } = formatDate(item.timestamp);

    return (
      <TouchableOpacity style={styles.scanCard}>
        <View style={styles.scanHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `${FILES_URL}/${item.imageUrl}` }}
              style={styles.scanImage}
              resizeMode="cover"
            />
            <View
              style={[styles.qualityBadge, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.qualityText}>{item.imageQuality}</Text>
            </View>
          </View>

          <View style={styles.scanInfo}>
            <View style={styles.confidenceContainer}>
              <Icon name="analytics" size={16} color={primaryColor} />
              <Text style={[styles.confidenceText, { color: primaryColor }]}>
                {(item.confidence * 100).toFixed(1)}% confidence
              </Text>
            </View>

            <View
              style={[
                styles.riskContainer,
                { backgroundColor: getRiskColor(item.risk) + '20' },
              ]}
            >
              <Icon
                name={getRiskIcon(item.risk)}
                size={16}
                color={getRiskColor(item.risk)}
              />
              <Text
                style={[styles.riskText, { color: getRiskColor(item.risk) }]}
              >
                {item.risk} Risk
              </Text>
            </View>
          </View>
        </View>

        {/* FIXED CONDITIONS PART */}
        <View style={styles.conditionsContainer}>
          <Text style={styles.conditionsTitle}>Detected Conditions:</Text>
          <View style={styles.conditionsList}>
            {item.conditions && Array.isArray(item.conditions) ? (
              item.conditions.map((conditionItem: any) => (
                <View key={conditionItem.id} style={styles.conditionItem}>
                  <View
                    style={[
                      styles.conditionDot,
                      { backgroundColor: primaryColor },
                    ]}
                  />
                  <Text style={styles.conditionName}>
                    {conditionItem.condition?.name || 'Unknown Condition'}
                  </Text>
                  <Text style={styles.conditionConfidence}>
                    {Math.round(conditionItem.confidence * 100)}%
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noConditionsText}>
                No conditions detected
              </Text>
            )}
          </View>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Icon name="notes" size={16} color="#6b7280" />
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Icon name="access-time" size={14} color="#9ca3af" />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <View
        style={[styles.emptyIcon, { backgroundColor: primaryColor + '20' }]}
      >
        <Icon name="history" size={48} color={primaryColor} />
      </View>
      <ThemedText style={styles.emptyTitle}>No Scan History</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        Your skin analysis history will appear here after you complete your
        first scan.
      </ThemedText>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={[styles.loadingText, { color: primaryColor }]}>
          Loading your scan history...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.errorTitle}>Unable to Load History</Text>
        <Text style={styles.errorDescription}>
          There was a problem loading your scan history. Please try again.
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: primaryColor }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Scan History</ThemedText>
        <Text style={styles.subtitle}>
          {scanHistory?.length || 0} scan{scanHistory?.length !== 1 ? 's' : ''}{' '}
          completed
        </Text>
      </View>

      <FlatList
        data={scanHistory}
        renderItem={renderScanItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={primaryColor}
            colors={[primaryColor]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  scanCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  scanHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  scanImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  qualityBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  qualityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  scanInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  conditionsContainer: {
    marginBottom: 12,
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  conditionsList: {
    gap: 6,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  conditionName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  conditionConfidence: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  noConditionsText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 22,
  },
});

export default ScanHistoryScreen;
