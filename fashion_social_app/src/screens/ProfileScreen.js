import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [selectedTab, setSelectedTab] = useState('posts');

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout }
      ]
    );
  };

  const renderProfileHeader = () => (
    <LinearGradient
      colors={['#1a1a2e', '#252542', '#0F3460']}
      style={styles.profileHeader}
    >
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.username}>
          {user?.username || 'fashionuser'}
        </Text>
        <Text style={styles.fullName}>
          {user?.fullName || 'Fashion User'}
        </Text>
        {user?.bio && (
          <Text style={styles.bio}>{user.bio}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1.2K</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>843</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderPointsCard = () => (
    <LinearGradient
      colors={['#FFD700', '#FFA000']}
      style={styles.pointsCard}
    >
      <View style={styles.pointsContent}>
        <View style={styles.pointsLeft}>
          <Text style={styles.pointsLabel}>Points Balance</Text>
          <Text style={styles.pointsAmount}>
            {user?.pointsBalance || 2450}
          </Text>
        </View>
        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderProfileInfo = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Profile Information
      </Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Phone</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          Not set
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Gender</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          Not set
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Member Since</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
        </Text>
      </View>
    </View>
  );

  const renderStylePreferences = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Style Preferences
      </Text>
      
      <View style={styles.preferencesContainer}>
        {['Casual', 'Formal', 'Streetwear', 'Vintage', 'Minimalist'].map((style) => (
          <View key={style} style={styles.preferenceTag}>
            <Text style={styles.preferenceText}>{style}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Achievements
      </Text>
      
      <View style={styles.achievementsGrid}>
        {[
          { icon: '📈', title: 'Trendsetter', desc: 'Post 10 outfits', unlocked: true },
          { icon: '❤️', title: 'Social Butterfly', desc: 'Get 100 likes', unlocked: true },
          { icon: '🏆', title: 'Competition Winner', desc: 'Win a competition', unlocked: false },
          { icon: '🧠', title: 'Style Guru', desc: 'Help 50 users', unlocked: false },
          { icon: '☀️', title: 'Early Bird', desc: 'Login 7 days in a row', unlocked: true },
          { icon: '⭐', title: 'Fashion Icon', desc: 'Reach 1000 followers', unlocked: false },
        ].map((achievement, index) => (
          <View key={index} style={[
            styles.achievementCard,
            { backgroundColor: achievement.unlocked ? 'rgba(255, 215, 0, 0.1)' : '#f5f5f5' }
          ]}>
            <Text style={styles.achievementIcon}>
              {achievement.icon}
            </Text>
            <Text style={[
              styles.achievementTitle,
              { color: achievement.unlocked ? theme.colors.text : theme.colors.textSecondary }
            ]}>
              {achievement.title}
            </Text>
            <Text style={styles.achievementDesc}>
              {achievement.desc}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPostsGrid = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
      <View style={styles.postsGrid}>
        {Array.from({ length: 9 }, (_, i) => (
          <View key={i} style={styles.postGridItem}>
            <Image
              source={{ uri: `https://picsum.photos/200/200?random=${i + 100}` }}
              style={styles.postGridImage}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#E91E63' }]}>
        <Text style={styles.actionButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.border }]}>
        <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
          Share Profile
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F44336' }]} onPress={handleLogout}>
        <Text style={styles.actionButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderProfileHeader()}
      
      <View style={styles.content}>
        {renderPointsCard()}
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'posts' && styles.activeTab,
              { borderColor: theme.colors.border }
            ]}
            onPress={() => setSelectedTab('posts')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'posts' && styles.activeTabText,
              { color: selectedTab === 'posts' ? theme.colors.accent : theme.colors.textSecondary }
            ]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'about' && styles.activeTab,
              { borderColor: theme.colors.border }
            ]}
            onPress={() => setSelectedTab('about')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'about' && styles.activeTabText,
              { color: selectedTab === 'about' ? theme.colors.accent : theme.colors.textSecondary }
            ]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'achievements' && styles.activeTab,
              { borderColor: theme.colors.border }
            ]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'achievements' && styles.activeTabText,
              { color: selectedTab === 'achievements' ? theme.colors.accent : theme.colors.textSecondary }
            ]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'posts' && renderPostsGrid()}
        {selectedTab === 'about' && (
          <>
            {renderProfileInfo()}
            {renderStylePreferences()}
            {renderActions()}
          </>
        )}
        {selectedTab === 'achievements' && renderAchievements()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  fullName: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  pointsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLeft: {
    flex: 1,
  },
  pointsLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  pointsAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  redeemButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E91E63',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceTag: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.3)',
  },
  preferenceText: {
    color: '#E91E63',
    fontSize: 12,
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 32 - 12) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  postGridItem: {
    width: (width - 32 - 4) / 3,
    aspectRatio: 1,
  },
  postGridImage: {
    width: '100%',
    height: '100%',
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;