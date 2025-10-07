import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/wardrobe.dart';

class WardrobeService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<Wardrobe>> getUserWardrobes(String userId) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('wardrobes')
          .where('user_id', isEqualTo: userId)
          .orderBy('created_at', descending: true)
          .get();

      final List<Wardrobe> wardrobes = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final wardrobeData = doc.data() as Map<String, dynamic>;
        wardrobeData['id'] = doc.id;
        wardrobes.add(Wardrobe.fromJson(wardrobeData));
      }

      return wardrobes;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<WardrobeItem>> getWardrobeItems(String wardrobeId) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('wardrobe_items')
          .where('wardrobe_id', isEqualTo: wardrobeId)
          .orderBy('created_at', descending: true)
          .get();

      final List<WardrobeItem> items = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final itemData = doc.data() as Map<String, dynamic>;
        itemData['id'] = doc.id;
        items.add(WardrobeItem.fromJson(itemData));
      }

      return items;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Wardrobe?> createWardrobe({
    required String userId,
    required String name,
    String? description,
    bool isPublic = false,
  }) async {
    try {
      final accessCode = isPublic ? _generateAccessCode() : null;
      
      final wardrobeData = {
        'user_id': userId,
        'name': name,
        'description': description,
        'is_public': isPublic,
        'access_code': accessCode,
        'items_count': 0,
        'created_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      };

      final DocumentReference docRef = await _firestore.collection('wardrobes').add(wardrobeData);
      
      final wardrobeDataWithId = Map<String, dynamic>.from(wardrobeData);
      wardrobeDataWithId['id'] = docRef.id;

      return Wardrobe.fromJson(wardrobeDataWithId);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<WardrobeItem?> addItem({
    required String wardrobeId,
    required String name,
    required ClothingCategory category,
    required String imageUrl,
    String? subcategory,
    String? brand,
    String? color,
    String? size,
    String? material,
    double? price,
    String? notes,
  }) async {
    try {
      final itemData = {
        'wardrobe_id': wardrobeId,
        'name': name,
        'category': category.name,
        'subcategory': subcategory,
        'brand': brand,
        'color': color,
        'size': size,
        'material': material,
        'purchase_date': null,
        'price': price,
        'image_url': imageUrl,
        'ai_tags': [],
        'notes': notes,
        'is_favorite': false,
        'times_worn': 0,
        'last_worn': null,
        'created_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      };

      final DocumentReference docRef = await _firestore.collection('wardrobe_items').add(itemData);
      
      // Update wardrobe items count
      await _firestore.collection('wardrobes').doc(wardrobeId).update({
        'items_count': FieldValue.increment(1),
      });

      final itemDataWithId = Map<String, dynamic>.from(itemData);
      itemDataWithId['id'] = docRef.id;

      return WardrobeItem.fromJson(itemDataWithId);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<WardrobeItem?> updateItem(String itemId, Map<String, dynamic> updates) async {
    try {
      updates['updated_at'] = DateTime.now().toIso8601String();
      
      await _firestore.collection('wardrobe_items').doc(itemId).update(updates);
      
      final DocumentSnapshot doc = await _firestore.collection('wardrobe_items').doc(itemId).get();
      if (doc.exists) {
        final itemData = doc.data() as Map<String, dynamic>;
        itemData['id'] = doc.id;
        return WardrobeItem.fromJson(itemData);
      }
      return null;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> deleteItem(String itemId) async {
    try {
      final DocumentSnapshot doc = await _firestore.collection('wardrobe_items').doc(itemId).get();
      if (doc.exists) {
        final itemData = doc.data() as Map<String, dynamic>;
        final wardrobeId = itemData['wardrobe_id'];
        
        await doc.reference.delete();
        
        // Update wardrobe items count
        await _firestore.collection('wardrobes').doc(wardrobeId).update({
          'items_count': FieldValue.increment(-1),
        });
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  String _generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    String code = '';
    
    for (int i = 0; i < 6; i++) {
      code += chars[(DateTime.now().millisecondsSinceEpoch + i) % chars.length];
    }
    
    return code;
  }
}