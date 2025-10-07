import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCompetitionStore } from '../../src/store';
import type { Competition } from '../../src/types';

export default function CompetitionsScreen() {
  const { competitions, isLoading, fetchCompetitions, enterCompetition } = useCompetitionStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'completed'>('active');

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCompetitions();
    setRefreshing(false);
  };

  const handleEnterCompetition = async (competitionId: string) => {
    try {
      await enterCompetition(competitionId);
      Alert.alert('Success', 'You have entered the competition!');
    } catch (error) {
      Alert.alert('Error', 'Failed to enter competition');
    }
  };

  const filteredCompetitions = competitions.filter(comp => {
    switch (selectedTab) {
      case 'active':
        return comp.status === 'active';
      case 'upcoming':
        return comp.status === 'upcoming';
      case 'completed':
        return comp.status === 'completed';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'upcoming':
        return '#2196F3';
      case 'completed':
        return '#9E9E9E';
      case 'judging':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const renderCompetition = ({ item }: { item: Competition }) => (
    <View style={styles.competitionCard}>
      {/* Banner Image */}
      {item.banner_image && (
        <Image
          source={{ uri: item.banner_image }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      )}

      {/* Competition Info */}
      <View style={styles.competitionInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.competitionTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.competitionDescription}>{item.description}</Text>

        {/* Hashtag */}
        <View style={styles.hashtagContainer}>
          <Ionicons name="pricetag" size={16} color="#0084ff" />
          <Text style={styles.hashtag}>{item.hashtag}</Text>
        </View>

        {/* Sponsor */}
        {item.sponsor && (
          <View style={styles.sponsorContainer}>
            <Ionicons name="business" size={16} color="#666" />
            <Text style={styles.sponsorText}>Sponsored by {item.sponsor}</Text>
          </View>
        )}

        {/* Prize */}
        {item.prize_description && (
          <View style={styles.prizeContainer}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.prizeText}>{item.prize_description}</Text>
          </View>
        )}

        {/* Date Range */}
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Ionicons name="calendar" size={14} color="#666" />
            <Text style={styles.dateText}>
              Start: {new Date(item.start_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.dateItem}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.dateText}>
              End: {new Date(item.end_date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Entries Count */}
        <View style={styles.entriesContainer}>
          <Ionicons name="people" size={16} color="#666" />
          <Text style={styles.entriesText}>{item.entries_count} entries</Text>
          {item.max_entries_per_user && (
            <Text style={styles.maxEntriesText}>
              (Max {item.max_entries_per_user} per user)
            </Text>
          )}
        </View>

        {/* Action Button */}
        {item.status === 'active' && (
          <TouchableOpacity
            style={styles.enterButton}
            onPress={() => handleEnterCompetition(item.id)}
          >
            <Text style={styles.enterButtonText}>Enter Competition</Text>
          </TouchableOpacity>
        )}

        {item.status === 'upcoming' && (
          <TouchableOpacity style={[styles.enterButton, styles.disabledButton]} disabled>
            <Text style={styles.disabledButtonText}>Starts Soon</Text>
          </TouchableOpacity>
        )}

        {item.status === 'completed' && (
          <TouchableOpacity style={[styles.enterButton, styles.viewButton]}>
            <Text style={styles.viewButtonText}>View Winners</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Competitions</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['active', 'upcoming', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab as any)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Competitions List */}
      <FlatList
        data={filteredCompetitions}
        renderItem={renderCompetition}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              No {selectedTab} competitions
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  competitionCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 150,
  },
  competitionInfo: {
    padding: 16,
  },
  headerRow: {
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
  hashtagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hashtag: {
    fontSize: 14,
    color: '#0084ff',
    fontWeight: '500',
    marginLeft: 4,
  },
  sponsorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sponsorText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  prizeText: {
    fontSize: 13,
    color: '#F57C00',
    fontWeight: '500',
    marginLeft: 4,
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  entriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  entriesText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  maxEntriesText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 8,
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
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  disabledButtonText: {
    color: '#999',
  },
  viewButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  viewButtonText: {
    color: '#000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});