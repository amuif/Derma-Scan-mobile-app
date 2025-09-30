import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useGetAllowedPost } from '@/hooks/usePost';
import { format } from 'date-fns';
import { Post } from '@/types/posts';

// Theme colors
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
    neutral: '#6b7280',

    // Shadows
    shadow: '#000000',
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
    neutral: '#9ca3af',

    // Shadows
    shadow: '#000000',
  },
};

// Hook to use theme colors
const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return themeColors[colorScheme === 'dark' ? 'dark' : 'light'];
};

// Category badge component
const CategoryBadge = ({ category }: { category: string }) => {
  const colors = useThemeColors();

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'TIPS':
        return { bg: colors.primary + '20', text: colors.primary }; // 20 = 12% opacity
      case 'PREVENTION':
        return { bg: '#dcfce7', text: '#166534' };
      case 'AWARENESS':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'TREATMENT':
        return { bg: '#fce7f3', text: '#9d174d' };
      default:
        return { bg: colors.surfaceVariant, text: colors.onSurfaceVariant };
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'TIPS':
        return 'Tips & Advice';
      case 'PREVENTION':
        return 'Prevention';
      case 'AWARENESS':
        return 'Awareness';
      case 'TREATMENT':
        return 'Treatment';
      default:
        return cat;
    }
  };

  const categoryColors = getCategoryColor(category);

  return (
    <View
      style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}
    >
      <ThemedText style={[styles.categoryText, { color: categoryColors.text }]}>
        {getCategoryLabel(category)}
      </ThemedText>
    </View>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const colors = useThemeColors();

  const getStatusColor = (stat: string) => {
    switch (stat) {
      case 'PUBLISHED':
        return { bg: '#dcfce7', text: '#166534' };
      case 'PENDING':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'DRAFT':
        return { bg: colors.surfaceVariant, text: colors.onSurfaceVariant };
      default:
        return { bg: colors.surfaceVariant, text: colors.onSurfaceVariant };
    }
  };

  const statusColors = getStatusColor(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
      <ThemedText style={[styles.statusText, { color: statusColors.text }]}>
        {status}
      </ThemedText>
    </View>
  );
};

// Individual post item component
const PostItem = ({
  post,
  onPress,
}: {
  post: Post;
  onPress?: (post: Post) => void;
}) => {
  const colors = useThemeColors();

  const handlePress = () => {
    if (onPress) {
      onPress(post);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.postItem,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.postHeader}>
        <View style={styles.postMeta}>
          <CategoryBadge category={post.category} />
          <StatusBadge status={post.status} />
        </View>
        <ThemedText style={[styles.dateText, { color: colors.onSurfaceMuted }]}>
          {formatDate(post.createdAt)}
        </ThemedText>
      </View>

      <ThemedText
        style={[styles.postTitle, { color: colors.onSurface }]}
        numberOfLines={2}
      >
        {post.title}
      </ThemedText>

      <ThemedText
        style={[styles.postContent, { color: colors.onSurfaceVariant }]}
        numberOfLines={3}
      >
        {post.content}
      </ThemedText>

      {post.author && (
        <View
          style={[styles.authorContainer, { borderTopColor: colors.outline }]}
        >
          <ThemedText
            style={[styles.authorText, { color: colors.onSurfaceMuted }]}
          >
            By {post.author.name || post.author.email}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Main posts list component
export const PostsList = ({
  onPostPress,
}: {
  onPostPress?: (post: Post) => void;
}) => {
  const colors = useThemeColors();
  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetAllowedPost();

  // Loading state
  if (isLoading) {
    return (
      <ThemedView
        style={[
          styles.centerContainer,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText
          style={[styles.loadingText, { color: colors.onSurfaceMuted }]}
        >
          Loading posts...
        </ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedView
        style={[
          styles.centerContainer,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        <ThemedText style={[styles.errorText, { color: '#ef4444' }]}>
          Failed to load posts
        </ThemedText>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => refetch()}
        >
          <ThemedText
            style={[styles.retryButtonText, { color: colors.onPrimary }]}
          >
            Try Again
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <ThemedView
        style={[
          styles.centerContainer,
          { backgroundColor: colors.surfaceContainer },
        ]}
      >
        <ThemedText
          style={[styles.emptyText, { color: colors.onSurfaceMuted }]}
        >
          No posts available
        </ThemedText>
        <ThemedText
          style={[styles.emptySubtext, { color: colors.onSurfaceMuted }]}
        >
          Create the first post to get started!
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostItem post={item} onPress={onPostPress} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContainer,
        { backgroundColor: colors.surfaceContainer },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

// Post detail component (for when a post is pressed)
export const PostDetail = ({ post }: { post: Post }) => {
  const colors = useThemeColors();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy • HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <View style={[styles.detailContainer, { backgroundColor: colors.surface }]}>
      <ScrollView style={styles.detailScrollView}>
        <View style={styles.detailHeader}>
          <View style={styles.detailMeta}>
            <CategoryBadge category={post.category} />
            <StatusBadge status={post.status} />
          </View>
          <ThemedText
            style={[styles.detailDate, { color: colors.onSurfaceMuted }]}
          >
            {formatDate(post.createdAt)}
          </ThemedText>
        </View>

        <ThemedText style={[styles.detailTitle, { color: colors.onSurface }]}>
          {post.title}
        </ThemedText>

        <ThemedText
          style={[styles.detailContent, { color: colors.onSurfaceVariant }]}
        >
          {post.content}
        </ThemedText>

        {post.author && (
          <View
            style={[styles.detailAuthor, { borderTopColor: colors.outline }]}
          >
            <ThemedText
              style={[
                styles.detailAuthorText,
                { color: colors.onSurfaceMuted },
              ]}
            >
              Posted by {post.author.name || post.author.email}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // List styles
  listContainer: {
    padding: 16,
  },
  postItem: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  authorContainer: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  authorText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  separator: {
    height: 12,
  },

  // Center container styles
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Detail styles
  detailContainer: {
    flex: 1,
  },
  detailScrollView: {
    flex: 1,
    padding: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailMeta: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  detailDate: {
    fontSize: 14,
    marginLeft: 8,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  detailContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailAuthor: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  detailAuthorText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
