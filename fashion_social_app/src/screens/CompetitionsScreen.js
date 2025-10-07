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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompetition } from '../contexts/CompetitionContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const CompetitionsScreen = () => {
  const { competitions, isLoading, loadCompetitions, getActiveCompetitions, getUpcomingCompetitions, getCompletedCompetitions } = useCompetition();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    loadCompetitions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCompetitions();
    setRefreshing(false);
  };

  const handleEnterCompetition = (competition) => {
    Alert.alert(
      'Enter Competition',
      `Are you sure you want to enter "${competition.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enter', onPress: () => {
          // TODO: Implement competition entry
          Alert.alert('Coming Soon', 'Competition entry feature will be available soon!');
        }}
      ]
    );
  };

  const renderCompetitionCard = ({ item }) => (
    <View style={[styles.competitionCard, { backgroundColor: theme.colors.card }]}>
      {item.bannerImage && (
        <Image
          source={{ uri: item.bannerImage }}
          style={styles.bannerImage}
        />
      )}
      
      <View style={styles.competitionContent}>
        <View style={styles.competitionHeader}>
          <Text style={[styles.competitionTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>
            {getTypeLabel(item.type)}
          </Text>
        </View>

        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {item.description}
        </Text>

        {item.sponsor && (
          <View style={styles.sponsorContainer}>
            <Text style={styles.sponsorIcon}>🏢</Text>
            <Text style={styles.sponsorText}>
              Sponsored by {item.sponsor}
            </Text>
          </View>
        )}

        {item.prizeDescription && (
          <LinearGradient
            colors={['#FFD700', '#FFA000']}
            style={styles.prizeContainer}
          >
            <Text style={styles.prizeIcon}>🏆</Text>
            <Text style={styles.prizeText}>
              {item.prizeDescription}
            </Text>
          </LinearGradient>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
              {item.entriesCount} entries
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏷️</Text>
            <Text style={styles.hashtagText}>
              {item.hashtag}
            </Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateIcon}>📅</Text>
          <View style={styles.dateInfo}>
            <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
              Start: {formatDate(item.startDate)}
            </Text>
            <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
              End: {formatDate(item.endDate)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.enterButton,
            { 
              backgroundColor: item.status === 'active' ? '#E91E63' : theme.colors.border,
              opacity: item.status === 'active' ? 1 : 0.6
            }
          ]}
          onPress={() => item.status === 'active' && handleEnterCompetition(item)}
          disabled={item.status !== 'active'}
        >
          <Text style={[
            styles.enterButtonText,
            { color: item.status === 'active' ? '#fff' : theme.colors.textSecondary }
          ]}>
            {getButtonText(item.status)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'upcoming': return '#FF9800';
      case 'judging': return '#2196F3';
      case 'completed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'ACTIVE';
      case 'upcoming': return 'UPCOMING';
      case 'judging': return 'JUDGING';
      case 'completed': return 'COMPLETED';
      default: return 'UNKNOWN';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'dailyTheme': return 'Daily Theme';
      case 'brandCollab': return 'Brand Collaboration';
      case 'weeklyChallenge': return 'Weekly Challenge';
      default: return 'Competition';
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'active': return 'Enter Competition';
      case 'upcoming': return 'Notify Me';
      case 'judging': return 'Judging in Progress';
      case 'completed': return 'View Results';
      default: return 'Not Available';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getCompetitionsForTab = () => {
    switch (selectedTab) {
      case 'active':
        return getActiveCompetitions();
      case 'upcoming':
        return getUpcomingCompetitions();
      case 'completed':
        return getCompletedCompetitions();
      default:
        return [];
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Competitions
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'active' && styles.activeTab,
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'active' && styles.activeTabText,
            { color: selectedTab === 'active' ? theme.colors.accent : theme.colors.textSecondary }
          ]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'upcoming' && styles.activeTab,
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'upcoming' && styles.activeTabText,
            { color: selectedTab === 'upcoming' ? theme.colors.accent : theme.colors.textSecondary }
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'completed' && styles.activeTab,
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'completed' && styles.activeTabText,
            { color: selectedTab === 'completed' ? theme.colors.accent : theme.colors.textSecondary }
          ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCompetitionsForTab()}
        renderItem={renderCompetitionCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E91E63']}
          />
        }
        contentContainerStyle={styles.competitionsContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {selectedTab === 'active' ? '🏆' : selectedTab === 'upcoming' ? '📅' : '✅'}
            </Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No {selectedTab} competitions
            </Text>
            <Text style={styles.emptyDescription}>
              {selectedTab === 'active' 
                ? 'Check back soon for new challenges!'
                : selectedTab === 'upcoming'
                ? 'New competitions will be announced soon!'
                : 'Completed competitions will appear here'
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomColor: '#E91E63',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E91E63',
  },
  competitionsContainer: {
    padding: 16,
    gap: 16,
  },
  competitionCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  competitionContent: {
    padding: 20,
  },
  competitionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  competitionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  typeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typeText: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    color: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sponsorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sponsorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sponsorText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  prizeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  prizeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hashtagText: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 11,
  },
  enterButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default CompetitionsScreen;