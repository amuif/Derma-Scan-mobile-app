import { Scan } from '@/types/scan';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { Image } from 'expo-image';
import { FILES_URL } from '@/constants/backend-url';
import { useEffect } from 'react';

interface CommunityCardProps {
  item: Scan;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function CommunityCard({ item }: CommunityCardProps) {
  useEffect(() => {
    console.log(`${FILES_URL}/${item.imageUrl}`);
  }, [item]);

  return (
    <ThemedView style={styles.card}>
      <Image
        source={{ uri: `${FILES_URL}/${item.imageUrl}` }}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
        style={styles.image}
      />
      <ThemedView style={styles.contentContainer}>
        {item.conditions ? (
          item.conditions.map((c, index: number) => (
            <ThemedView key={index} style={styles.conditionContainer}>
              <ThemedText style={styles.cardHeader}>
                {c.condition.name}
              </ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.noConditionsText}>
            No conditions detected
          </ThemedText>
        )}
        <View style={styles.row}>
          <ThemedText style={styles.descriptionText}>{item.notes}</ThemedText>
          <ThemedView
            style={[
              styles.badge,
              styles.riskBadge,
              {
                backgroundColor:
                  item.risk === 'HIGH'
                    ? '#ef4444'
                    : item.risk === 'MEDIUM'
                      ? '#f59e0b'
                      : '#22c55e',
              },
            ]}
          >
            <ThemedText style={styles.badgeText}>Risk: {item.risk}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.badge, styles.confidenceBadge]}>
            <ThemedText style={styles.badgeText}>
              Confidence: {(item.confidence * 100).toFixed(1)}%
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.badge, styles.timestampBadge]}>
            <ThemedText style={styles.badgeText}>
              {new Date(item.timestamp).toLocaleDateString()}
            </ThemedText>
          </ThemedView>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  contentContainer: {
    paddingHorizontal: 8,
  },
  conditionContainer: {
    borderRadius: 16,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  noConditionsText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
  },
  riskBadge: {
    // Dynamic background color set inline based on risk level
  },
  confidenceBadge: {
    backgroundColor: '#3b82f6',
  },
  timestampBadge: {
    backgroundColor: '#6b7280',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
