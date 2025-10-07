import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/wardrobe_item.dart';

class WardrobeService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<WardrobeItem>> getWardrobeItems() async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return [];

      final response = await _supabase
          .from('wardrobe_items')
          .select()
          .eq('user_id', user.id)
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => WardrobeItem.fromJson(json))
          .toList();
    } catch (e) {
      print('Get wardrobe items error: $e');
      return [];
    }
  }

  Future<bool> addWardrobeItem(WardrobeItem item) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      final itemData = item.toJson();
      itemData['user_id'] = user.id;
      itemData.remove('id'); // Let database generate ID

      await _supabase.from('wardrobe_items').insert(itemData);
      return true;
    } catch (e) {
      print('Add wardrobe item error: $e');
      return false;
    }
  }

  Future<bool> updateWardrobeItem(WardrobeItem item) async {
    try {
      await _supabase
          .from('wardrobe_items')
          .update(item.toJson())
          .eq('id', item.id);
      return true;
    } catch (e) {
      print('Update wardrobe item error: $e');
      return false;
    }
  }

  Future<bool> deleteWardrobeItem(String itemId) async {
    try {
      await _supabase
          .from('wardrobe_items')
          .delete()
          .eq('id', itemId);
      return true;
    } catch (e) {
      print('Delete wardrobe item error: $e');
      return false;
    }
  }

  Future<bool> toggleFavorite(String itemId) async {
    try {
      await _supabase.rpc('toggle_favorite', params: {'item_id': itemId});
      return true;
    } catch (e) {
      print('Toggle favorite error: $e');
      return false;
    }
  }

  Future<List<WardrobeItem>> getFavoriteItems() async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return [];

      final response = await _supabase
          .from('wardrobe_items')
          .select()
          .eq('user_id', user.id)
          .eq('is_favorite', true)
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => WardrobeItem.fromJson(json))
          .toList();
    } catch (e) {
      print('Get favorite items error: $e');
      return [];
    }
  }

  Future<List<WardrobeItem>> getItemsByCategory(ClothingCategory category) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return [];

      final response = await _supabase
          .from('wardrobe_items')
          .select()
          .eq('user_id', user.id)
          .eq('category', category.name)
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => WardrobeItem.fromJson(json))
          .toList();
    } catch (e) {
      print('Get items by category error: $e');
      return [];
    }
  }

  Future<bool> incrementTimesWorn(String itemId) async {
    try {
      await _supabase.rpc('increment_times_worn', params: {'item_id': itemId});
      return true;
    } catch (e) {
      print('Increment times worn error: $e');
      return false;
    }
  }
}

class WardrobeProvider extends ChangeNotifier {
  final WardrobeService _wardrobeService = WardrobeService();
  List<WardrobeItem> _items = [];
  bool _isLoading = false;

  List<WardrobeItem> get items => _items;
  bool get isLoading => _isLoading;

  Future<void> loadWardrobeItems() async {
    _isLoading = true;
    notifyListeners();

    try {
      _items = await _wardrobeService.getWardrobeItems();
    } catch (e) {
      print('Load wardrobe items error: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> addWardrobeItem(WardrobeItem item) async {
    final success = await _wardrobeService.addWardrobeItem(item);
    
    if (success) {
      await loadWardrobeItems();
    }
    
    return success;
  }

  Future<bool> updateWardrobeItem(WardrobeItem item) async {
    final success = await _wardrobeService.updateWardrobeItem(item);
    
    if (success) {
      await loadWardrobeItems();
    }
    
    return success;
  }

  Future<bool> deleteWardrobeItem(String itemId) async {
    final success = await _wardrobeService.deleteWardrobeItem(itemId);
    
    if (success) {
      _items.removeWhere((item) => item.id == itemId);
      notifyListeners();
    }
    
    return success;
  }

  Future<bool> toggleFavorite(String itemId) async {
    final success = await _wardrobeService.toggleFavorite(itemId);
    
    if (success) {
      final itemIndex = _items.indexWhere((item) => item.id == itemId);
      if (itemIndex != -1) {
        _items[itemIndex] = _items[itemIndex].copyWith(
          isFavorite: !_items[itemIndex].isFavorite,
        );
        notifyListeners();
      }
    }
    
    return success;
  }

  List<WardrobeItem> getItemsByCategory(ClothingCategory category) {
    return _items.where((item) => item.category == category).toList();
  }

  List<WardrobeItem> getFavoriteItems() {
    return _items.where((item) => item.isFavorite).toList();
  }
}