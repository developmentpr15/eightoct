import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    username: 'fashionista_123',
    fullName: 'Sarah Johnson',
    avatar: 'https://via.placeholder.com/40',
    caption: 'Summer vibes in this amazing outfit! Perfect for the beach 🏖️ #SummerStyle #BeachFashion',
    image: 'https://via.placeholder.com/400x300/87CEEB/FFFFFF?text=Summer+Outfit',
    likes: 234,
    comments: 45,
    shares: 12,
    isLiked: false,
    location: 'Miami Beach',
    isVerified: true,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    username: 'style_guru',
    fullName: 'Mike Chen',
    avatar: 'https://via.placeholder.com/40',
    caption: 'Street style inspiration from downtown 🏙️ #UrbanFashion #StreetStyle',
    image: 'https://via.placeholder.com/400x300/708090/FFFFFF?text=Street+Style',
    likes: 567,
    comments: 89,
    shares: 34,
    isLiked: true,
    location: 'New York City',
    isVerified: false,
    timestamp: '4 hours ago'
  }
];

const mockCompetitions = [
  {
    id: '1',
    title: 'Summer Style Challenge',
    description: 'Show off your best summer outfit! The most creative and stylish look wins.',
    hashtag: '#SummerStyle2024',
    sponsor: 'Fashion Brand X',
    prize: '$500 shopping spree + featured post',
    status: 'active',
    entries: 127,
    endDate: '7 days'
  },
  {
    id: '2',
    title: 'Street Style Fashion Week',
    description: 'Urban fashion at its finest. Show us your best street style look.',
    hashtag: '#StreetStyleWeek',
    sponsor: 'Urban Outfitters',
    prize: 'Feature on our Instagram page',
    status: 'upcoming',
    entries: 0,
    endDate: 'Starts tomorrow'
  }
];

const mockWardrobes = [
  {
    id: '1',
    name: 'Summer Collection',
    description: 'Light and breezy outfits for hot weather',
    items: 12,
    isPublic: false
  },
  {
    id: '2',
    name: 'Work Attire',
    description: 'Professional outfits for the office',
    items: 8,
    isPublic: false
  },
  {
    id: '3',
    name: 'Weekend Casual',
    description: 'Comfortable clothes for days off',
    items: 15,
    isPublic: true
  }
];

export default function FashionSocialApp() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState(new Set(['2']));

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          }
        : post
    ));
  };

  const renderPost = (post: any) => (
    <View key={post.id} style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{post.username}</Text>
              {post.isVerified && <Text style={styles.verifiedBadge}>✓</Text>}
            </View>
            <Text style={styles.fullName}>{post.fullName}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: post.image }} style={styles.postImage} />

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.caption}>{post.caption}</Text>
        {post.location && (
          <Text style={styles.location}>📍 {post.location}</Text>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleLike(post.id)}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.liked]}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCompetition = (competition: any) => (
    <View key={competition.id} style={styles.competitionCard}>
      <View style={styles.competitionHeader}>
        <Text style={styles.competitionTitle}>{competition.title}</Text>
        <View style={[
          styles.statusBadge, 
          competition.status === 'active' ? styles.activeStatus : 
          competition.status === 'upcoming' ? styles.upcomingStatus : 
          styles.completedStatus
        ]}>
          <Text style={styles.statusText}>{competition.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.competitionDescription}>{competition.description}</Text>
      <View style={styles.competitionMeta}>
        <Text style={styles.hashtag}>#{competition.hashtag}</Text>
        <Text style={styles.sponsor}>Sponsored by {competition.sponsor}</Text>
        <Text style={styles.prize}>🏆 {competition.prize}</Text>
        <Text style={styles.entries}>{competition.entries} entries</Text>
        <Text style={styles.endDate}>{competition.endDate}</Text>
      </View>
      <TouchableOpacity style={styles.enterButton}>
        <Text style={styles.enterButtonText}>
          {competition.status === 'active' ? 'Enter Competition' : 
           competition.status === 'upcoming' ? 'Notify Me' : 
           'View Winners'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderWardrobe = (wardrobe: any) => (
    <View key={wardrobe.id} style={styles.wardrobeCard}>
      <View style={styles.wardrobeHeader}>
        <Text style={styles.wardrobeName}>{wardrobe.name}</Text>
        <Text style={styles.itemCount}>{wardrobe.items} items</Text>
      </View>
      <Text style={styles.wardrobeDescription}>{wardrobe.description}</Text>
      <View style={styles.wardrobeFooter}>
        <Text style={styles.privacy}>
          {wardrobe.isPublic ? '🌐 Public' : '🔒 Private'}
        </Text>
        <TouchableOpacity style={styles.openButton}>
          <Text style={styles.openButtonText}>Open</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeed = () => (
    <ScrollView style={styles.feedContainer}>
      <Text style={styles.sectionTitle}>Your Feed</Text>
      {posts.map(renderPost)}
    </ScrollView>
  );

  const renderCompetitions = () => (
    <ScrollView style={styles.competitionsContainer}>
      <Text style={styles.sectionTitle}>Fashion Competitions</Text>
      {mockCompetitions.map(renderCompetition)}
    </ScrollView>
  );

  const renderWardrobe = () => (
    <ScrollView style={styles.wardrobeContainer}>
      <Text style={styles.sectionTitle}>My Wardrobes</Text>
      <TouchableOpacity style={styles.addWardrobeButton}>
        <Text style={styles.addWardrobeText}>+ Create New Wardrobe</Text>
      </TouchableOpacity>
      {mockWardrobes.map(renderWardrobe)}
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.profileAvatar} />
        <Text style={styles.profileName}>Alex Smith</Text>
        <Text style={styles.profileUsername}>@fashion_lover</Text>
        <Text style={styles.profileBio}>Fashion enthusiast | Style blogger | Always looking for the next trend</Text>
        <View style={styles.profileStats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>567</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1,250</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.pointsSection}>
        <Text style={styles.pointsTitle}>🏆 Points & Rewards</Text>
        <Text style={styles.pointsBalance}>Current Balance: 1,250 points</Text>
        <TouchableOpacity style={styles.rewardsButton}>
          <Text style={styles.rewardsText}>View Rewards</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fashion Social</Text>
        <Text style={styles.headerSubtitle}>Your style, your community</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'competitions' && renderCompetitions()}
        {activeTab === 'wardrobe' && renderWardrobe()}
        {activeTab === 'profile' && renderProfile()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { id: 'feed', icon: '🏠', label: 'Feed' },
          { id: 'wardrobe', icon: '👔', label: 'Wardrobe' },
          { id: 'competitions', icon: '🏆', label: 'Competitions' },
          { id: 'profile', icon: '👤', label: 'Profile' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.navItem,
              activeTab === tab.id && styles.activeNavItem
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[
              styles.navIcon,
              activeTab === tab.id && styles.activeNavIcon
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.navLabel,
              activeTab === tab.id && styles.activeNavLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  
  // Feed styles
  feedContainer: {
    flex: 1,
  },
  postCard: {
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
  userDetails: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 4,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#0084ff',
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  moreText: {
    fontSize: 16,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
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
  location: {
    fontSize: 12,
    color: '#666',
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
  actionIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  liked: {
    color: '#ff3b30',
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },

  // Competitions styles
  competitionsContainer: {
    flex: 1,
  },
  competitionCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
  },
  competitionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  competitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: '#4CAF50',
  },
  upcomingStatus: {
    backgroundColor: '#2196F3',
  },
  completedStatus: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  competitionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  competitionMeta: {
    marginBottom: 16,
  },
  hashtag: {
    fontSize: 14,
    color: '#0084ff',
    fontWeight: '500',
    marginBottom: 4,
  },
  sponsor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  prize: {
    fontSize: 13,
    color: '#F57C00',
    fontWeight: '500',
    marginBottom: 4,
  },
  entries: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  endDate: {
    fontSize: 12,
    color: '#666',
  },
  enterButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Wardrobe styles
  wardrobeContainer: {
    flex: 1,
  },
  addWardrobeButton: {
    backgroundColor: '#000',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addWardrobeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  wardrobeCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
  },
  wardrobeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wardrobeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  wardrobeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  wardrobeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacy: {
    fontSize: 12,
    color: '#666',
  },
  openButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  openButtonText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },

  // Profile styles
  profileContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  editProfileButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pointsSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  pointsBalance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  rewardsButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rewardsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  // Navigation styles
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingBottom: 8,
    paddingTop: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  activeNavItem: {
    // borderTopWidth: 2,
    // borderTopColor: '#000',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  activeNavIcon: {
    // color: '#000',
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
  },
  activeNavLabel: {
    // color: '#000',
    fontWeight: '600',
  },
});