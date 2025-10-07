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

class WardrobeItem {
  final String id;
  final String userId;
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

  WardrobeItem({
    required this.id,
    required this.userId,
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
    required this.aiTags,
    this.notes,
    required this.isFavorite,
    required this.timesWorn,
    this.lastWorn,
    required this.createdAt,
  });

  factory WardrobeItem.fromJson(Map<String, dynamic> json) {
    return WardrobeItem(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      name: json['name'] as String,
      category: ClothingCategory.values.firstWhere(
        (e) => e.name == json['category'],
        orElse: () => ClothingCategory.other,
      ),
      subcategory: json['subcategory'] as String?,
      brand: json['brand'] as String?,
      color: json['color'] as String?,
      size: json['size'] as String?,
      material: json['material'] as String?,
      purchaseDate: json['purchase_date'] != null 
          ? DateTime.parse(json['purchase_date'] as String)
          : null,
      price: (json['price'] as num?)?.toDouble(),
      imageUrl: json['image_url'] as String,
      aiTags: List<String>.from(json['ai_tags'] as List? ?? []),
      notes: json['notes'] as String?,
      isFavorite: json['is_favorite'] as bool? ?? false,
      timesWorn: json['times_worn'] as int? ?? 0,
      lastWorn: json['last_worn'] != null
          ? DateTime.parse(json['last_worn'] as String)
          : null,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'category': category.name,
      'subcategory': subcategory,
      'brand': brand,
      'color': color,
      'size': size,
      'material': material,
      'purchase_date': purchaseDate?.toIso8601String(),
      'price': price,
      'image_url': imageUrl,
      'ai_tags': aiTags,
      'notes': notes,
      'is_favorite': isFavorite,
      'times_worn': timesWorn,
      'last_worn': lastWorn?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
    };
  }

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

  Wardrobe({
    required this.id,
    required this.userId,
    required this.name,
    this.description,
    required this.isPublic,
    this.accessCode,
    this.expiresAt,
    required this.itemsCount,
    required this.createdAt,
  });

  factory Wardrobe.fromJson(Map<String, dynamic> json) {
    return Wardrobe(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      isPublic: json['is_public'] as bool? ?? false,
      accessCode: json['access_code'] as String?,
      expiresAt: json['expires_at'] != null
          ? DateTime.parse(json['expires_at'] as String)
          : null,
      itemsCount: json['items_count'] as int? ?? 0,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'description': description,
      'is_public': isPublic,
      'access_code': accessCode,
      'expires_at': expiresAt?.toIso8601String(),
      'items_count': itemsCount,
      'created_at': createdAt.toIso8601String(),
    };
  }
}