import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String email;
  final String username;
  final String? fullName;
  final String? avatarUrl;
  final String? bio;
  final String? phone;
  final DateTime? dateOfBirth;
  final String? gender;
  final List<String> stylePreferences;
  final PrivacySettings privacySettings;
  final int pointsBalance;
  final String referralCode;
  final String? referredBy;
  final bool isVerified;
  final bool isModerator;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime lastLogin;

  const User({
    required this.id,
    required this.email,
    required this.username,
    this.fullName,
    this.avatarUrl,
    this.bio,
    this.phone,
    this.dateOfBirth,
    this.gender,
    this.stylePreferences = const [],
    required this.privacySettings,
    this.pointsBalance = 0,
    required this.referralCode,
    this.referredBy,
    this.isVerified = false,
    this.isModerator = false,
    required this.createdAt,
    required this.updatedAt,
    required this.lastLogin,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);

  User copyWith({
    String? id,
    String? email,
    String? username,
    String? fullName,
    String? avatarUrl,
    String? bio,
    String? phone,
    DateTime? dateOfBirth,
    String? gender,
    List<String>? stylePreferences,
    PrivacySettings? privacySettings,
    int? pointsBalance,
    String? referralCode,
    String? referredBy,
    bool? isVerified,
    bool? isModerator,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? lastLogin,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      username: username ?? this.username,
      fullName: fullName ?? this.fullName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bio: bio ?? this.bio,
      phone: phone ?? this.phone,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      stylePreferences: stylePreferences ?? this.stylePreferences,
      privacySettings: privacySettings ?? this.privacySettings,
      pointsBalance: pointsBalance ?? this.pointsBalance,
      referralCode: referralCode ?? this.referralCode,
      referredBy: referredBy ?? this.referredBy,
      isVerified: isVerified ?? this.isVerified,
      isModerator: isModerator ?? this.isModerator,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      lastLogin: lastLogin ?? this.lastLogin,
    );
  }
}

@JsonSerializable()
class PrivacySettings {
  final String profileVisibility;
  final bool showEmail;
  final bool showPhone;
  final bool allowTagging;
  final String wardrobeBackup;
  final bool locationSharing;
  final bool dataAnalytics;

  const PrivacySettings({
    this.profileVisibility = 'public',
    this.showEmail = false,
    this.showPhone = false,
    this.allowTagging = true,
    this.wardrobeBackup = 'cloud_sync',
    this.locationSharing = false,
    this.dataAnalytics = true,
  });

  factory PrivacySettings.fromJson(Map<String, dynamic> json) => _$PrivacySettingsFromJson(json);
  Map<String, dynamic> toJson() => _$PrivacySettingsToJson(this);
}