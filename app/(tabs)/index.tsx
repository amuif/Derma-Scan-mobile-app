import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColors';
import { useGetAllowedPost } from '@/hooks/usePost';
import { useScanHistory } from '@/hooks/useScan';
import { Post } from '@/types/posts';
import { Scan } from '@/types/scan';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCurrentUserQuery } from '@/hooks/useAuth';

const HomeScreen: React.FC = () => {
  const colors = useThemeColor();
  const router = useRouter();
  const { data: user } = useCurrentUserQuery();
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useGetAllowedPost();

  const {
    data: scans,
    isLoading: scansLoading,
    error: scansError,
    refetch: refetchScans,
  } = useScanHistory();

  useEffect(() => {
    const selfPost = posts?.filter((post) => post.author.id === user?.id) || [];
    setRecentPosts(selfPost);
  }, [posts, user]);

  useEffect(() => {
    const selfScan = scans?.filter((scan) => scan.user.id === user?.id) || [];
    setRecentScans(selfScan.slice(0, 3));
  }, [scans, user]);

  const refreshing = postsLoading || scansLoading;

  const onRefresh = () => {
    refetchPosts();
    refetchScans();
  };

  const navigateToPosts = () => {
    router.push('/posts');
  };

  const navigateToScans = () => {
    router.push('/history');
  };

  const navigateToCommunity = () => {
    router.push('/community');
  };

  const navigateToCreatePost = () => {
    router.push('/(tabs)/posts');
  };

  const QuickActionCard = ({
    title,
    description,
    icon,
    onPress,
    color,
  }: {
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
    color: string;
  }) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color="#fff" />
      </View>
      <View style={styles.quickActionContent}>
        <ThemedText style={styles.quickActionTitle}>{title}</ThemedText>
        <ThemedText
          style={[styles.quickActionDesc, { color: colors.onSurfaceVariant }]}
        >
          {description}
        </ThemedText>
      </View>
      <Icon name="chevron-right" size={20} color={colors.onSurfaceMuted} />
    </TouchableOpacity>
  );

  const PostItem = ({ post }: { post: Post }) => (
    <TouchableOpacity
      style={[styles.postItem, { backgroundColor: colors.surface }]}
    >
      <ThemedText style={styles.postTitle} numberOfLines={2}>
        {post.title}
      </ThemedText>
      <ThemedText
        style={[styles.postContent, { color: colors.onSurfaceVariant }]}
        numberOfLines={2}
      >
        {post.content}
      </ThemedText>
      <View style={styles.postMeta}>
        <ThemedText style={[styles.postCategory, { color: colors.primary }]}>
          {post.category}
        </ThemedText>
        <ThemedText style={[styles.postDate, { color: colors.onSurfaceMuted }]}>
          {new Date(post.createdAt).toLocaleDateString()}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const ScanItem = ({ scan }: { scan: Scan }) => (
    <TouchableOpacity
      style={[styles.scanItem, { backgroundColor: colors.surface }]}
    >
      <ThemedView
        style={styles.scanHeader}
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedView
          className="flex-col space-y-3"
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText
            className="font-semibold"
            style={{ color: colors.onSurfaceVariant }}
          >
            Conditions:
          </ThemedText>
          <ThemedText style={styles.scanConditions} numberOfLines={1}>
            {scan?.conditions?.length
              ? scan.conditions.map((c) => c.condition.name).join(', ')
              : 'No conditions identified'}
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={[
            styles.riskBadge,
            {
              backgroundColor:
                scan.risk === 'HIGH'
                  ? colors.riskHigh
                  : scan.risk === 'MEDIUM'
                    ? colors.riskMedium
                    : colors.riskLow,
            },
          ]}
        >
          <ThemedText style={styles.riskText}>
            {scan.risk?.toUpperCase() || 'LOW'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView
        className="flex-col space-y-2 bg-transparent"
        lightColor="transparent"
        darkColor="transparent"
      >
        <ThemedText className="font-semibold">Question:</ThemedText>
        <ThemedText>{scan.question || "User's question"}</ThemedText>
      </ThemedView>
      <ThemedText
        style={[styles.scanConfidence, { color: colors.onSurfaceVariant }]}
      >
        Confidence: {(scan.confidence * 100).toFixed(1) || 0}%
      </ThemedText>
      <ThemedText style={[styles.scanDate, { color: colors.onSurfaceMuted }]}>
        {new Date(scan.timestamp).toLocaleDateString()}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.surfaceContainer }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <ThemedText
              style={[styles.welcomeText, { color: colors.onSurface }]}
            >
              Welcome to DermaScan
            </ThemedText>
            <ThemedText
              style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
            >
              Your skin health companion
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText
            style={[styles.sectionTitle, { color: colors.onSurface }]}
          >
            Quick Actions
          </ThemedText>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="Create Post"
              description="Share knowledge"
              icon="post-add"
              onPress={navigateToCreatePost}
              color="#10b981"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.onSurface }]}
            >
              Recent Educational Posts
            </ThemedText>
            <TouchableOpacity onPress={navigateToPosts}>
              <ThemedText
                style={[styles.seeAllText, { color: colors.primary }]}
              >
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>

          {postsLoading ? (
            <ThemedText
              style={[styles.loadingText, { color: colors.onSurfaceMuted }]}
            >
              Loading posts...
            </ThemedText>
          ) : postsError ? (
            <ThemedText style={[styles.errorText, { color: colors.error }]}>
              Failed to load posts
            </ThemedText>
          ) : recentPosts.length === 0 ? (
            <ThemedText
              style={[styles.emptyText, { color: colors.onSurfaceMuted }]}
            >
              No posts available
            </ThemedText>
          ) : (
            <View style={styles.itemsContainer}>
              {recentPosts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.onSurface }]}
            >
              Your Recent Scans
            </ThemedText>
            <TouchableOpacity onPress={navigateToScans}>
              <ThemedText
                style={[styles.seeAllText, { color: colors.primary }]}
              >
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>

          {scansLoading ? (
            <ThemedText
              style={[styles.loadingText, { color: colors.onSurfaceMuted }]}
            >
              Loading scans...
            </ThemedText>
          ) : scansError ? (
            <ThemedText style={[styles.errorText, { color: colors.error }]}>
              Failed to load scans
            </ThemedText>
          ) : recentScans.length === 0 ? (
            <ThemedText
              style={[styles.emptyText, { color: colors.onSurfaceMuted }]}
            >
              No scans yet
            </ThemedText>
          ) : (
            <View style={styles.itemsContainer}>
              {recentScans.map((scan) => (
                <ScanItem key={scan.id} scan={scan} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.onSurface }]}
            >
              Community Insights
            </ThemedText>
            <TouchableOpacity onPress={navigateToCommunity}>
              <ThemedText
                style={[styles.seeAllText, { color: colors.primary }]}
              >
                Explore
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.communityCard, { backgroundColor: colors.surface }]}
            onPress={navigateToCommunity}
          >
            <View style={styles.communityContent}>
              <Icon name="people" size={32} color={colors.primary} />
              <View style={styles.communityText}>
                <ThemedText style={styles.communityTitle}>
                  Explore community posts
                </ThemedText>
                <ThemedText
                  style={[
                    styles.communityDesc,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  Connect with others, share experiences, and learn from
                  community scans
                </ThemedText>
              </View>
              <Icon
                name="chevron-right"
                size={24}
                color={colors.onSurfaceMuted}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    gap: 12,
    paddingTop: 5,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionDesc: {
    fontSize: 14,
  },
  itemsContainer: {
    gap: 12,
  },
  postItem: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  postDate: {
    fontSize: 12,
  },
  scanItem: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scanConditions: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  scanConfidence: {
    fontSize: 12,
    marginBottom: 4,
  },
  scanDate: {
    fontSize: 12,
  },
  communityCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  communityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  communityDesc: {
    fontSize: 14,
    lineHeight: 18,
  },
  statsContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
