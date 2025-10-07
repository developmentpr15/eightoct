import 'package:json_annotation/json_annotation.dart';
import 'user.dart';

part 'post.g.dart';

@JsonSerializable()
class Post {
  final String id;
  final String userId;
  final String caption;
  final List<String> images;
  final List<String> hashtags;
  final List<String> mentions;
  final String? location;
  final List<String>? outfitItems;
  final String? competitionId;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final int heartsCount;
  final bool isReported;
  final bool isHidden;
  final DateTime createdAt;
  final DateTime updatedAt;
  final User? user;

  const Post({
    required this.id,
    required this.userId,
    required this.caption,
    this.images = const [],
    this.hashtags = const [],
    this.mentions = const [],
    this.location,
    this.outfitItems,
    this.competitionId,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.sharesCount = 0,
    this.heartsCount = 0,
    this.isReported = false,
    this.isHidden = false,
    required this.createdAt,
    required this.updatedAt,
    this.user,
  });

  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);
  Map<String, dynamic> toJson() => _$PostToJson(this);

  Post copyWith({
    String? id,
    String? userId,
    String? caption,
    List<String>? images,
    List<String>? hashtags,
    List<String>? mentions,
    String? location,
    List<String>? outfitItems,
    String? competitionId,
    int? likesCount,
    int? commentsCount,
    int? sharesCount,
    int? heartsCount,
    bool? isReported,
    bool? isHidden,
    DateTime? createdAt,
    DateTime? updatedAt,
    User? user,
  }) {
    return Post(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      caption: caption ?? this.caption,
      images: images ?? this.images,
      hashtags: hashtags ?? this.hashtags,
      mentions: mentions ?? this.mentions,
      location: location ?? this.location,
      outfitItems: outfitItems ?? this.outfitItems,
      competitionId: competitionId ?? this.competitionId,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      sharesCount: sharesCount ?? this.sharesCount,
      heartsCount: heartsCount ?? this.heartsCount,
      isReported: isReported ?? this.isReported,
      isHidden: isHidden ?? this.isHidden,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      user: user ?? this.user,
    );
  }
}

@JsonSerializable()
class Comment {
  final String id;
  final String postId;
  final String userId;
  final String? parentId;
  final String content;
  final int likesCount;
  final bool isReported;
  final DateTime createdAt;
  final DateTime updatedAt;
  final User? user;
  final List<Comment>? replies;

  const Comment({
    required this.id,
    required this.postId,
    required this.userId,
    this.parentId,
    required this.content,
    this.likesCount = 0,
    this.isReported = false,
    required this.createdAt,
    required this.updatedAt,
    this.user,
    this.replies,
  });

  factory Comment.fromJson(Map<String, dynamic> json) => _$CommentFromJson(json);
  Map<String, dynamic> toJson() => _$CommentToJson(this);
}