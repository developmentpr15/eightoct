import 'package:json_annotation/json_annotation.dart';

part 'wardrobe.g.dart';

enum ClothingCategory {
  tops,
  bottoms,
  outerwear,
  shoes,
  accessories,
  innerwear,
  bags,
  hats,
  jewelry,
  other,
}

@JsonSerializable()
class Wardrobe {
  final String id;
  final String userId;
  final String name;
  final String? description;
  final bool isPublic;
  final String? accessCode;
  final DateTime? expiresAt;
  final int itemsCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Wardrobe({
    required this.id,
    required this.userId,
    required this.name,
    this.description,
    this.isPublic = false,
    this.accessCode,
    this.expiresAt,
    this.itemsCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Wardrobe.fromJson(Map<String, dynamic> json) => _$WardrobeFromJson(json);
  Map<String, dynamic> toJson() => _$WardrobeToJson(this);
}

@JsonSerializable()
class WardrobeItem {
  final String id;
  final String wardrobeId;
  final String name;
  final ClothingCategory category;
  final String? subcategory;
  final String? brand;
  final String? color;
  final String? size;
  final String? material;
  final DateTime? purchaseDate;
  final double? price;
  final String imageUrl;
  final List<String> aiTags;
  final String? notes;
  final bool isFavorite;
  final int timesWorn;
  final DateTime? lastWorn;
  final DateTime createdAt;
  final DateTime updatedAt;

  const WardrobeItem({
    required this.id,
    required this.wardrobeId,
    required this.name,
    required this.category,
    this.subcategory,
    this.brand,
    this.color,
    this.size,
    this.material,
    this.purchaseDate,
    this.price,
    required this.imageUrl,
    this.aiTags = const [],
    this.notes,
    this.isFavorite = false,
    this.timesWorn = 0,
    this.lastWorn,
    required this.createdAt,
    required this.updatedAt,
  });

  factory WardrobeItem.fromJson(Map<String, dynamic> json) => _$WardrobeItemFromJson(json);
  Map<String, dynamic> toJson() => _$WardrobeItemToJson(this);

  String get categoryDisplayName {
    switch (category) {
      case ClothingCategory.tops:
        return 'Tops';
      case ClothingCategory.bottoms:
        return 'Bottoms';
      case ClothingCategory.outerwear:
        return 'Outerwear';
      case ClothingCategory.shoes:
        return 'Shoes';
      case ClothingCategory.accessories:
        return 'Accessories';
      case ClothingCategory.innerwear:
        return 'Innerwear';
      case ClothingCategory.bags:
        return 'Bags';
      case ClothingCategory.hats:
        return 'Hats';
      case ClothingCategory.jewelry:
        return 'Jewelry';
      case ClothingCategory.other:
        return 'Other';
    }
  }
}