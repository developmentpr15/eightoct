import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSocial } from '../contexts/SocialContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const FeedScreen = () => {
  const { posts, stories, isLoading, loadPosts, likePost, heartPost, sharePost } = useSocial();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const renderStory = ({ item, index }) => (
    <TouchableOpacity style={styles.storyContainer}>
      <LinearGradient
        colors={['#E91E63', '#9C27B0']}
        style={styles.storyGradient}
      >
        <View style={styles.storyInner}>
          {item.isOwn ? (
            <Text style={styles.storyText}>You</Text>
          ) : (
            <Image
              source={{ uri: item.avatarUrl }}
              style={styles.storyAvatar}
            />
          )}
        </View>
      </LinearGradient>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => (
    <View style={[styles.postContainer, { backgroundColor: theme.colors.card }]}>
      <View style={styles.postHeader}>
        <View style={styles.postUserInfo}>
          <Image
            source={{ uri: item.avatarUrl }}
            style={styles.postAvatar}
          />
          <View>
            <Text style={[styles.postUsername, { color: theme.colors.text }]}>
              {item.username}
            </Text>
            {item.location && (
              <Text style={styles.postLocation}>{item.location}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: item.images[0] }}
        style={styles.postImage}
      />

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => likePost(item.id)}
        >
          <Text style={[styles.actionIcon, { color: item.isLiked ? '#E91E63' : theme.colors.text }]}>
            {item.isLiked ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => heartPost(item.id)}
        >
          <Text style={[styles.actionIcon, { color: item.isHearted ? '#E91E63' : theme.colors.text }]}>
            {item.isHearted ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
        >
          <Text style={[styles.actionIcon, { color: theme.colors.text }]}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => sharePost(item.id)}
        >
          <Text style={[styles.actionIcon, { color: theme.colors.text }]}>📤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={[styles.actionIcon, { color: theme.colors.text }]}>🔖</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postStats}>
        <Text style={[styles.likesCount, { color: theme.colors.text }]}>
          {item.likesCount + (item.isLiked ? 1 : 0)} likes
        </Text>
      </View>

      <View style={styles.postCaption}>
        <Text style={[styles.captionText, { color: theme.colors.text }]}>
          <Text style={styles.captionUsername}>{item.username}</Text> {item.caption}
        </Text>
      </View>

      {item.hashtags.length > 0 && (
        <View style={styles.hashtags}>
          {item.hashtags.map((tag, index) => (
            <View key={index} style={styles.hashtag}>
              <Text style={styles.hashtagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.commentsSection}>
        <Text style={styles.commentsText}>
          View all {item.commentsCount} comments
        </Text>
      </TouchableOpacity>

      <Text style={[styles.postTime, { color: theme.colors.textSecondary }]}>
        {formatTime(item.createdAt)}
      </Text>
    </View>
  );

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diff = now - postTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Fashion Feed
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Text style={[styles.headerIcon, { color: theme.colors.text }]}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.headerIcon, { color: theme.colors.text }]}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E91E63']}
          />
        }
        ListHeaderComponent={
          <View>
            <FlatList
              data={stories}
              renderItem={renderStory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      />
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    fontSize: 24,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  storyContainer: {
    alignItems: 'center',
    gap: 4,
  },
  storyGradient: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    padding: 2,
  },
  storyInner: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  storyAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  storyUsername: {
    fontSize: 11,
    color: '#666',
    maxWidth: 60,
  },
  feedContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postUsername: {
    fontSize: 14,
    fontWeight: '600',
  },
  postLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moreIcon: {
    fontSize: 20,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  postActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  postStats: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  postCaption: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  hashtag: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hashtagText: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '500',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  commentsText: {
    fontSize: 12,
    color: '#666',
  },
  postTime: {
    fontSize: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default FeedScreen;