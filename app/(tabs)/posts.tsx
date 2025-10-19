import CreatePost, {
  CreatePostDialogRef,
} from '@/components/posts/create-post';
import { PostDetail, PostsList } from '@/components/posts/list-post';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Post } from '@/types/posts';
import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useColorScheme,
} from 'react-native';

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
  },
};

// Hook to use theme colors
const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return themeColors[colorScheme === 'dark' ? 'dark' : 'light'];
};

export default function ParentComponent() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const createPostRef = useRef<CreatePostDialogRef>(null);
  const colors = useThemeColors();

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  const handleOpenCreatePost = () => {
    createPostRef.current?.open();
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.surfaceContainer }]}
    >
      {/* Header Section */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.outline,
          },
        ]}
      >
        <ThemedText style={[styles.title, { color: colors.primary }]}>
          Education Hub
        </ThemedText>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleOpenCreatePost}
        >
          <ThemedText
            style={[styles.createButtonText, { color: colors.onPrimary }]}
          >
            Create educational post
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <View style={styles.listContainer}>
        <PostsList onPostPress={handlePostPress} />
      </View>

      {/* Create Post Dialog */}
      <CreatePost ref={createPostRef} />

      {/* Post Detail Modal */}
      <Modal
        visible={!!selectedPost}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseDetail}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          {selectedPost && <PostDetail post={selectedPost} />}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={handleCloseDetail}
          >
            <ThemedText
              style={[styles.closeButtonText, { color: colors.onPrimary }]}
            >
              Close
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
