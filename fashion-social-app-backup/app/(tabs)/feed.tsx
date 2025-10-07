import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeedStore } from '../../src/store';
import type { Post } from '../../src/types';

export default function FeedScreen() {
  const { posts, isLoading, fetchPosts, likePost, unlikePost } = useFeedStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user?.avatar_url || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>
              {item.user?.username}
              {item.user?.is_verified && (
                <Ionicons name="checkmark-circle" size={14} color="#0084ff" />
              )}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Post Images */}
      {item.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.images[0] }}
            style={styles.postImage}
            resizeMode="cover"
          />
          {item.images.length > 1 && (
            <View style={styles.imageOverlay}>
              <Text style={styles.imageCount}>+{item.images.length - 1}</Text>
            </View>
          )}
        </View>
      )}

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.caption}>{item.caption}</Text>
        
        {/* Hashtags */}
        {item.hashtags.length > 0 && (
          <View style={styles.hashtagContainer}>
            {item.hashtags.map((tag, index) => (
              <Text key={index} style={styles.hashtag}>
                #{tag}
              </Text>
            ))}
          </View>
        )}

        {/* Location */}
        {item.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id, item.is_liked || false)}
        >
          <Ionicons
            name={item.is_liked ? 'heart' : 'heart-outline'}
            size={24}
            color={item.is_liked ? '#ff3b30' : '#666'}
          />
          <Text style={styles.actionText}>{item.likes_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{item.comments_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{item.shares_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedContainer: {
    paddingVertical: 8,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
    marginBottom: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  hashtag: {
    fontSize: 13,
    color: '#0084ff',
    marginRight: 8,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});