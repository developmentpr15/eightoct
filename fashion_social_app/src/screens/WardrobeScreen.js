import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWardrobe } from '../contexts/WardrobeContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const WardrobeScreen = () => {
  const { wardrobes, items, isLoading, loadWardrobes, loadWardrobeItems, addWardrobe } = useWardrobe();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWardrobeName, setNewWardrobeName] = useState('');
  const [newWardrobeDescription, setNewWardrobeDescription] = useState('');
  const [newWardrobeIsPublic, setNewWardrobeIsPublic] = useState(false);
  const [selectedTab, setSelectedTab] = useState('collections');

  useEffect(() => {
    loadWardrobes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWardrobes();
    setRefreshing(false);
  };

  const handleAddWardrobe = async () => {
    if (!newWardrobeName.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }

    const result = await addWardrobe(
      newWardrobeName.trim(),
      newWardrobeDescription.trim(),
      newWardrobeIsPublic
    );

    if (result.success) {
      setShowAddModal(false);
      setNewWardrobeName('');
      setNewWardrobeDescription('');
      setNewWardrobeIsPublic(false);
      Alert.alert('Success', 'Collection created successfully!');
    }
  };

  const renderWardrobeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.wardrobeCard, { backgroundColor: theme.colors.card }]}
      onPress={() => {
        loadWardrobeItems(item.id);
        setSelectedTab('items');
      }}
    >
      <LinearGradient
        colors={['rgba(233, 30, 99, 0.1)', 'rgba(156, 39, 176, 0.1)']}
        style={styles.wardrobeGradient}
      >
        <View style={styles.wardrobeHeader}>
          <View style={styles.wardrobePrivacy}>
            <Text style={styles.privacyIcon}>
              {item.isPublic ? '🌐' : '🔒'}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.wardrobeContent}>
          <Text style={[styles.wardrobeName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={styles.wardrobeDescription}>
              {item.description}
            </Text>
          )}
          <View style={styles.wardrobeStats}>
            <Text style={styles.itemsCount}>
              📚 {item.itemsCount} items
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderWardrobeItemCard = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.itemImageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.itemImage}
        />
        {item.isFavorite && (
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteIcon}>❤️</Text>
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {item.brand && (
          <Text style={styles.itemBrand}>{item.brand}</Text>
        )}
        <View style={styles.itemStats}>
          <Text style={styles.timesWorn}>👔 {item.timesWorn}x</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {item.category.substring(0, 3).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Wardrobe
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'collections' && styles.activeTab,
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSelectedTab('collections')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'collections' && styles.activeTabText,
            { color: selectedTab === 'collections' ? theme.colors.accent : theme.colors.textSecondary }
          ]}>
            Collections
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'items' && styles.activeTab,
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSelectedTab('items')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'items' && styles.activeTabText,
            { color: selectedTab === 'items' ? theme.colors.accent : theme.colors.textSecondary }
          ]}>
            Items
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'collections' ? (
        <FlatList
          data={wardrobes}
          renderItem={renderWardrobeItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E91E63']}
            />
          }
          numColumns={2}
          contentContainerStyle={styles.collectionsContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👗</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No collections yet
              </Text>
              <Text style={styles.emptyDescription}>
                Create your first wardrobe collection
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.emptyButtonText}>Create Collection</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <FlatList
          data={items}
          renderItem={renderWardrobeItemCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.itemsContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👔</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No items yet
              </Text>
              <Text style={styles.emptyDescription}>
                Add your first fashion item
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Create Collection
            </Text>
            <TouchableOpacity onPress={handleAddWardrobe}>
              <Text style={styles.createButton}>Create</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Collection Name
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Enter collection name"
              placeholderTextColor={theme.colors.textSecondary}
              value={newWardrobeName}
              onChangeText={setNewWardrobeName}
            />

            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Description (Optional)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Enter description"
              placeholderTextColor={theme.colors.textSecondary}
              value={newWardrobeDescription}
              onChangeText={setNewWardrobeDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                Public Collection
              </Text>
              <TouchableOpacity
                style={[
                  styles.switch,
                  newWardrobeIsPublic && styles.switchActive,
                  { backgroundColor: newWardrobeIsPublic ? theme.colors.accent : theme.colors.border }
                ]}
                onPress={() => setNewWardrobeIsPublic(!newWardrobeIsPublic)}
              >
                <View style={[
                  styles.switchThumb,
                  newWardrobeIsPublic && styles.switchThumbActive,
                  { backgroundColor: newWardrobeIsPublic ? '#fff' : theme.colors.textSecondary }
                ]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  collectionsContainer: {
    padding: 16,
    gap: 16,
  },
  wardrobeCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  wardrobeGradient: {
    padding: 16,
    height: 150,
  },
  wardrobeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wardrobePrivacy: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  privacyIcon: {
    fontSize: 12,
  },
  moreIcon: {
    fontSize: 16,
    color: '#666',
  },
  wardrobeContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  wardrobeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  wardrobeDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  wardrobeStats: {
    alignItems: 'flex-start',
  },
  itemsCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  itemsContainer: {
    padding: 16,
    gap: 16,
  },
  itemCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 12,
  },
  itemDetails: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timesWorn: {
    fontSize: 11,
    color: '#666',
  },
  categoryBadge: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#E91E63',
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
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  createButton: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#E91E63',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
    marginRight: 2,
  },
});

export default WardrobeScreen;