import 'package:flutter/material.dart';
import '../models/wardrobe.dart';

class WardrobeProvider extends ChangeNotifier {
  List<Wardrobe> _wardrobes = [];
  List<WardrobeItem> _items = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Wardrobe> get wardrobes => _wardrobes;
  List<WardrobeItem> get items => _items;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }

  Future<void> loadWardrobes() async {
    _setLoading(true);
    try {
      // Simulate API call with mock data
      await Future.delayed(const Duration(seconds: 1));

      _wardrobes = [
        Wardrobe(
          id: '1',
          userId: 'current_user',
          name: 'Summer Collection',
          description: 'Perfect outfits for summer season',
          isPublic: false,
          itemsCount: 15,
          createdAt: DateTime.now().subtract(const Duration(days: 30)),
          updatedAt: DateTime.now().subtract(const Duration(days: 5)),
        ),
        Wardrobe(
          id: '2',
          userId: 'current_user',
          name: 'Business Casual',
          description: 'Work appropriate attire',
          isPublic: false,
          itemsCount: 22,
          createdAt: DateTime.now().subtract(const Duration(days: 60)),
          updatedAt: DateTime.now().subtract(const Duration(days: 10)),
        ),
        Wardrobe(
          id: '3',
          userId: 'current_user',
          name: 'Weekend Vibes',
          description: 'Casual outfits for weekends',
          isPublic: true,
          accessCode: 'WEEKEND123',
          itemsCount: 18,
          createdAt: DateTime.now().subtract(const Duration(days: 90)),
          updatedAt: DateTime.now().subtract(const Duration(days: 2)),
        ),
      ];

      _setError(null);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadWardrobeItems(String wardrobeId) async {
    _setLoading(true);
    try {
      // Simulate API call with mock data
      await Future.delayed(const Duration(seconds: 1));

      _items = [
        WardrobeItem(
          id: '1',
          wardrobeId: wardrobeId,
          name: 'White Cotton T-Shirt',
          category: ClothingCategory.tops,
          brand: 'Uniqlo',
          color: 'White',
          size: 'M',
          material: 'Cotton',
          price: 29.99,
          imageUrl: 'https://picsum.photos/300/400?random=11',
          aiTags: ['casual', 'basic', 'versatile'],
          isFavorite: true,
          timesWorn: 12,
          lastWorn: DateTime.now().subtract(const Duration(days: 3)),
          createdAt: DateTime.now().subtract(const Duration(days: 30)),
          updatedAt: DateTime.now().subtract(const Duration(days: 1)),
        ),
        WardrobeItem(
          id: '2',
          wardrobeId: wardrobeId,
          name: 'Blue Denim Jeans',
          category: ClothingCategory.bottoms,
          brand: 'Levi\'s',
          color: 'Blue',
          size: '32',
          material: 'Denim',
          price: 89.99,
          imageUrl: 'https://picsum.photos/300/400?random=12',
          aiTags: ['casual', 'classic', 'durable'],
          isFavorite: false,
          timesWorn: 8,
          lastWorn: DateTime.now().subtract(const Duration(days: 7)),
          createdAt: DateTime.now().subtract(const Duration(days: 45)),
          updatedAt: DateTime.now().subtract(const Duration(days: 5)),
        ),
        WardrobeItem(
          id: '3',
          wardrobeId: wardrobeId,
          name: 'Black Leather Jacket',
          category: ClothingCategory.outerwear,
          brand: 'AllSaints',
          color: 'Black',
          size: 'L',
          material: 'Leather',
          price: 299.99,
          imageUrl: 'https://picsum.photos/300/400?random=13',
          aiTags: ['edgy', 'versatile', 'timeless'],
          isFavorite: true,
          timesWorn: 15,
          lastWorn: DateTime.now().subtract(const Duration(days: 1)),
          createdAt: DateTime.now().subtract(const Duration(days: 90)),
          updatedAt: DateTime.now().subtract(const Duration(days: 2)),
        ),
        WardrobeItem(
          id: '4',
          wardrobeId: wardrobeId,
          name: 'White Sneakers',
          category: ClothingCategory.shoes,
          brand: 'Nike',
          color: 'White',
          size: '10',
          material: 'Leather',
          price: 120.00,
          imageUrl: 'https://picsum.photos/300/400?random=14',
          aiTags: ['comfortable', 'athletic', 'versatile'],
          isFavorite: false,
          timesWorn: 20,
          lastWorn: DateTime.now().subtract(const Duration(days: 2)),
          createdAt: DateTime.now().subtract(const Duration(days: 60)),
          updatedAt: DateTime.now().subtract(const Duration(days: 3)),
        ),
      ];

      _setError(null);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> addWardrobe(String name, String? description, bool isPublic) async {
    try {
      final newWardrobe = Wardrobe(
        id: 'wardrobe_${DateTime.now().millisecondsSinceEpoch}',
        userId: 'current_user',
        name: name,
        description: description,
        isPublic: isPublic,
        itemsCount: 0,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      _wardrobes.insert(0, newWardrobe);
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> addWardrobeItem(WardrobeItem item) async {
    try {
      _items.insert(0, item);
      
      // Update wardrobe items count
      final wardrobeIndex = _wardrobes.indexWhere((w) => w.id == item.wardrobeId);
      if (wardrobeIndex != -1) {
        final wardrobe = _wardrobes[wardrobeIndex];
        _wardrobes[wardrobeIndex] = wardrobe.copyWith(itemsCount: wardrobe.itemsCount + 1);
      }
      
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> toggleFavorite(String itemId) async {
    try {
      final itemIndex = _items.indexWhere((item) => item.id == itemId);
      if (itemIndex != -1) {
        final item = _items[itemIndex];
        _items[itemIndex] = item.copyWith(isFavorite: !item.isFavorite);
        notifyListeners();
      }
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }
}