import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWardrobeStore } from '../../src/store';
import type { Wardrobe, WardrobeItem } from '../../src/types';

export default function WardrobeScreen() {
  const { wardrobes, items, isLoading, fetchWardrobes, fetchItems, createWardrobe } = useWardrobeStore();
  const [selectedWardrobe, setSelectedWardrobe] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWardrobeName, setNewWardrobeName] = useState('');

  useEffect(() => {
    fetchWardrobes();
  }, []);

  useEffect(() => {
    if (selectedWardrobe) {
      fetchItems(selectedWardrobe);
    }
  }, [selectedWardrobe]);

  const handleCreateWardrobe = async () => {
    if (!newWardrobeName.trim()) {
      Alert.alert('Error', 'Please enter a wardrobe name');
      return;
    }

    try {
      await createWardrobe({
        name: newWardrobeName,
        user_id: 'current-user', // This should come from auth store
        is_public: false,
      });
      setNewWardrobeName('');
      setShowAddModal(false);
      fetchWardrobes();
    } catch (error) {
      Alert.alert('Error', 'Failed to create wardrobe');
    }
  };

  const renderWardrobe = ({ item }: { item: Wardrobe }) => (
    <TouchableOpacity
      style={[
        styles.wardrobeCard,
        selectedWardrobe === item.id && styles.selectedWardrobe
      ]}
      onPress={() => setSelectedWardrobe(item.id)}
    >
      <View style={styles.wardrobeHeader}>
        <Text style={styles.wardrobeName}>{item.name}</Text>
        <Text style={styles.itemCount}>{item.items_count} items</Text>
      </View>
      {item.description && (
        <Text style={styles.wardrobeDescription}>{item.description}</Text>
      )}
      <View style={styles.wardrobeFooter}>
        <Ionicons
          name={item.is_public ? 'globe' : 'lock-closed'}
          size={16}
          color="#666"
        />
        <Text style={styles.privacyText}>
          {item.is_public ? 'Public' : 'Private'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderWardrobeItem = ({ item }: { item: WardrobeItem }) => (
    <View style={styles.itemCard}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {item.brand && (
          <Text style={styles.itemBrand}>{item.brand}</Text>
        )}
        {item.color && (
          <View style={styles.colorContainer}>
            <View style={[styles.colorDot, { backgroundColor: item.color.toLowerCase() }]} />
            <Text style={styles.colorText}>{item.color}</Text>
          </View>
        )}
        {item.is_favorite && (
          <Ionicons name="heart" size={16} color="#ff3b30" style={styles.favoriteIcon} />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wardrobe</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Wardrobes List */}
      {!selectedWardrobe ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Your Wardrobes</Text>
          <FlatList
            data={wardrobes}
            renderItem={renderWardrobe}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedWardrobe(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backText}>Back to Wardrobes</Text>
          </TouchableOpacity>

          {/* Items Grid */}
          <Text style={styles.sectionTitle}>Items</Text>
          <FlatList
            data={items}
            renderItem={renderWardrobeItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          />
        </View>
      )}

      {/* Add Wardrobe Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Wardrobe</Text>
            <TextInput
              style={styles.input}
              placeholder="Wardrobe name"
              value={newWardrobeName}
              onChangeText={setNewWardrobeName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateWardrobe}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  wardrobeCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedWardrobe: {
    borderColor: '#000',
    backgroundColor: '#f8f8f8',
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
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  gridContainer: {
    paddingBottom: 16,
  },
  itemCard: {
    flex: 1,
    margin: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
  itemInfo: {
    padding: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  colorText: {
    fontSize: 11,
    color: '#666',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  createButton: {
    backgroundColor: '#000',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});