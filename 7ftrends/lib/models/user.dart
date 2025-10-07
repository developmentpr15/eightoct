class User {
  final String id;
  final String username;
  final String email;
  final String fullName;
  final String? avatarUrl;
  final String? bio;
  final int pointsBalance;
  final bool isVerified;
  final DateTime createdAt;
  final List<String> followers;
  final List<String> following;
  final UserSettings settings;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.fullName,
    this.avatarUrl,
    this.bio,
    required this.pointsBalance,
    required this.isVerified,
    required this.createdAt,
    required this.followers,
    required this.following,
    required this.settings,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      username: json['username'] as String,
      email: json['email'] as String,
      fullName: json['full_name'] as String,
      avatarUrl: json['avatar_url'] as String?,
      bio: json['bio'] as String?,
      pointsBalance: json['points_balance'] as int,
      isVerified: json['is_verified'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      followers: List<String>.from(json['followers'] as List? ?? []),
      following: List<String>.from(json['following'] as List? ?? []),
      settings: UserSettings.fromJson(json['settings'] as Map<String, dynamic>? ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'bio': bio,
      'points_balance': pointsBalance,
      'is_verified': isVerified,
      'created_at': createdAt.toIso8601String(),
      'followers': followers,
      'following': following,
      'settings': settings.toJson(),
    };
  }
}

class UserSettings {
  final bool profileVisibility;
  final bool allowTagging;
  final bool wardrobeBackup;
  final bool locationSharing;
  final bool dataAnalytics;

  UserSettings({
    required this.profileVisibility,
    required this.allowTagging,
    required this.wardrobeBackup,
    required this.locationSharing,
    required this.dataAnalytics,
  });

  factory UserSettings.fromJson(Map<String, dynamic> json) {
    return UserSettings(
      profileVisibility: json['profile_visibility'] as bool? ?? true,
      allowTagging: json['allow_tagging'] as bool? ?? true,
      wardrobeBackup: json['wardrobe_backup'] as bool? ?? false,
      locationSharing: json['location_sharing'] as bool? ?? false,
      dataAnalytics: json['data_analytics'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'profile_visibility': profileVisibility,
      'allow_tagging': allowTagging,
      'wardrobe_backup': wardrobeBackup,
      'location_sharing': locationSharing,
      'data_analytics': dataAnalytics,
    };
  }
}