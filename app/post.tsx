import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useGetAllowedPost } from '@/hooks/usePost';
import { useCurrentUserQuery } from '@/hooks/useAuth';
import { Post } from '@/types/posts';

export type EducationCategory =
  | 'tips'
  | 'prevention'
  | 'awareness'
  | 'treatment';

export type EducationCategoryFilter = EducationCategory | 'All';

const CATEGORIES: EducationCategoryFilter[] = [
  'All',
  'tips',
  'prevention',
  'awareness',
  'treatment',
];

const EducationCategoryUtils = {
  getDisplayName(category: EducationCategoryFilter): string {
    const displayNames: Record<EducationCategoryFilter, string> = {
      All: 'All Categories',
      tips: 'Tips & Advice',
      prevention: 'Prevention',
      awareness: 'Awareness',
      treatment: 'Treatment',
    };
    return displayNames[category] || category;
  },

  getColor(category: EducationCategoryFilter): string {
    const colors: Record<EducationCategoryFilter, string> = {
      All: '#3b82f6',
      tips: '#8b5cf6',
      prevention: '#10b981',
      awareness: '#f59e0b',
      treatment: '#ef4444',
    };
    return colors[category] || '#3b82f6';
  },

  getIcon(category: EducationCategoryFilter): string {
    const icons: Record<EducationCategoryFilter, string> = {
      All: 'apps',
      tips: 'lightbulb',
      prevention: 'shield',
      awareness: 'info',
      treatment: 'healing',
    };
    return icons[category] || 'article';
  },
};

const PostsScreen: React.FC = () => {
  const { data: posts, refetch, isLoading, error } = useGetAllowedPost();
  const { data: user } = useCurrentUserQuery();
  const [selectedCategory, setSelectedCategory] =
    useState<EducationCategoryFilter>('All');
  const [postHistory, setPostHistory] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const primaryColor = '#3b82f6';

  const availableCategories = useMemo(() => {
    const postCategories = posts?.map((post) => post.category) || [];
    const uniqueCategories = [
      ...new Set(postCategories),
    ] as EducationCategory[];
    return ['All', ...uniqueCategories];
  }, [posts]);

  useEffect(() => {
    const selfPost = posts?.filter((post) => post.author.id === user?.id) || [];
    setPostHistory(selfPost);
  }, [user, posts]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: EducationCategoryFilter) => {
    return EducationCategoryUtils.getColor(category);
  };

  const getTimeToRead = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return selectedCategory === 'All'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [filteredPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: EducationCategoryFilter) => {
    setSelectedCategory(category);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderCategoryChip = (category: EducationCategoryFilter) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        {
          backgroundColor:
            selectedCategory === category
              ? getCategoryColor(category)
              : `${getCategoryColor(category)}15`,
          borderColor: getCategoryColor(category),
        },
      ]}
      onPress={() => handleCategoryPress(category)}
    >
      <Icon
        name={EducationCategoryUtils.getIcon(category)}
        size={14}
        color={
          selectedCategory === category ? '#ffffff' : getCategoryColor(category)
        }
        style={styles.categoryIcon}
      />
      <Text
        style={[
          styles.categoryChipText,
          {
            color:
              selectedCategory === category
                ? '#ffffff'
                : getCategoryColor(category),
          },
        ]}
      >
        {EducationCategoryUtils.getDisplayName(category)}
      </Text>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item, index }: { item: Post; index: number }) => (
    <Animated.View
      style={[
        styles.postCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity style={styles.postContent} activeOpacity={0.7}>
        <View style={styles.postHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: `${getCategoryColor(item.category)}15` },
            ]}
          >
            <Icon
              name={EducationCategoryUtils.getIcon(item.category)}
              size={12}
              color={getCategoryColor(item.category)}
            />
            <Text
              style={[
                styles.categoryBadgeText,
                { color: getCategoryColor(item.category) },
              ]}
            >
              {EducationCategoryUtils.getDisplayName(item.category)}
            </Text>
          </View>
          <View style={styles.metaInfo}>
            <Icon name="schedule" size={12} color="#9ca3af" />
            <Text style={styles.readTime}>{getTimeToRead(item.content)}</Text>
          </View>
        </View>

        <ThemedText style={styles.postTitle}>{item.title}</ThemedText>

        <ThemedText style={styles.postContentText} numberOfLines={3}>
          {item.content}
        </ThemedText>

        <View style={styles.postFooter}>
          <View style={styles.authorInfo}>
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: getCategoryColor(item.category) },
              ]}
            >
              <Text style={styles.avatarText}>
                {item.author.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{item.author.name}</Text>
              <View style={styles.dateContainer}>
                <Icon name="access-time" size={10} color="#9ca3af" />
                <Text style={styles.postDate}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.postActions}>
            <View
              style={[
                styles.languageBadge,
                { backgroundColor: `${primaryColor}15` },
              ]}
            >
              <Icon name="language" size={12} color={primaryColor} />
              <Text style={[styles.languageText, { color: primaryColor }]}>
                {item.language.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.bookmarkButton}>
              <Icon name="bookmark-border" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <View
        style={[styles.emptyIcon, { backgroundColor: primaryColor + '15' }]}
      >
        <Icon name="article" size={48} color={primaryColor} />
      </View>
      <ThemedText style={styles.emptyTitle}>No Posts Available</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        {selectedCategory === 'All'
          ? 'There are no educational posts available at the moment.'
          : `No posts found in the ${EducationCategoryUtils.getDisplayName(selectedCategory)} category.`}
      </ThemedText>
      <TouchableOpacity
        style={[styles.refreshButton, { backgroundColor: primaryColor }]}
        onPress={onRefresh}
      >
        <Icon name="refresh" size={18} color="#ffffff" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </ThemedView>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={[styles.loadingText, { color: primaryColor }]}>
          Loading educational content...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color="#ef4444" />
        <Text style={styles.errorTitle}>Unable to Load Content</Text>
        <Text style={styles.errorDescription}>
          There was a problem loading the educational posts.{'\n'}Please check
          your connection and try again.
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: primaryColor }]}
          onPress={() => refetch()}
        >
          <Icon name="refresh" size={18} color="#ffffff" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Educational Content</ThemedText>
        <ThemedText style={styles.subtitle}>
          Learn about skin health, prevention, and treatment
        </ThemedText>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: primaryColor }]}>
              {posts?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: primaryColor }]}>
              {availableCategories.length - 1}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: primaryColor }]}>
              {postHistory.length}
            </Text>
            <Text style={styles.statLabel}>Your Posts</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={availableCategories}
          renderItem={({ item }) =>
            renderCategoryChip(item as EducationCategory)
          }
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Posts List */}
      <Animated.FlatList
        data={sortedPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColor}
            colors={[primaryColor]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          filteredPosts.length > 0 ? (
            <Text style={styles.resultsCount}>
              Showing {filteredPosts.length} post
              {filteredPosts.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' &&
                ` in ${EducationCategoryUtils.getDisplayName(selectedCategory)}`}
            </Text>
          ) : null
        }
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  categoriesContainer: {
    marginVertical: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  postsList: {
    padding: 16,
    paddingTop: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postContent: {
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTime: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  postContentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    marginBottom: 16,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  languageText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bookmarkButton: {
    padding: 4,
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
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
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
    minHeight: 400,
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
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PostsScreen;
