class Post {
  final String id;
  final String userId;
  final String username;
  final String? userAvatar;
  final String caption;
  final List<String> images;
  final List<String> hashtags;
  final List<String> mentions;
  final String? location;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final bool isLiked;
  final DateTime createdAt;
  final bool isVerified;

  Post({
    required this.id,
    required this.userId,
    required this.username,
    this.userAvatar,
    required this.caption,
    required this.images,
    required this.hashtags,
    required this.mentions,
    this.location,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.isLiked,
    required this.createdAt,
    required this.isVerified,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      username: json['username'] as String,
      userAvatar: json['user_avatar'] as String?,
      caption: json['caption'] as String,
      images: List<String>.from(json['images'] as List? ?? []),
      hashtags: List<String>.from(json['hashtags'] as List? ?? []),
      mentions: List<String>.from(json['mentions'] as List? ?? []),
      location: json['location'] as String?,
      likesCount: json['likes_count'] as int,
      commentsCount: json['comments_count'] as int,
      sharesCount: json['shares_count'] as int,
      isLiked: json['is_liked'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
      isVerified: json['is_verified'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'username': username,
      'user_avatar': userAvatar,
      'caption': caption,
      'images': images,
      'hashtags': hashtags,
      'mentions': mentions,
      'location': location,
      'likes_count': likesCount,
      'comments_count': commentsCount,
      'shares_count': sharesCount,
      'is_liked': isLiked,
      'created_at': createdAt.toIso8601String(),
      'is_verified': isVerified,
    };
  }

  Post copyWith({
    String? id,
    String? userId,
    String? username,
    String? userAvatar,
    String? caption,
    List<String>? images,
    List<String>? hashtags,
    List<String>? mentions,
    String? location,
    int? likesCount,
    int? commentsCount,
    int? sharesCount,
    bool? isLiked,
    DateTime? createdAt,
    bool? isVerified,
  }) {
    return Post(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      username: username ?? this.username,
      userAvatar: userAvatar ?? this.userAvatar,
      caption: caption ?? this.caption,
      images: images ?? this.images,
      hashtags: hashtags ?? this.hashtags,
      mentions: mentions ?? this.mentions,
      location: location ?? this.location,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      sharesCount: sharesCount ?? this.sharesCount,
      isLiked: isLiked ?? this.isLiked,
      createdAt: createdAt ?? this.createdAt,
      isVerified: isVerified ?? this.isVerified,
    );
  }
}

class Comment {
  final String id;
  final String postId;
  final String userId;
  final String username;
  final String? userAvatar;
  final String content;
  final int likesCount;
  final DateTime createdAt;
  final bool isLiked;

  Comment({
    required this.id,
    required this.postId,
    required this.userId,
    required this.username,
    this.userAvatar,
    required this.content,
    required this.likesCount,
    required this.createdAt,
    required this.isLiked,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] as String,
      postId: json['post_id'] as String,
      userId: json['user_id'] as String,
      username: json['username'] as String,
      userAvatar: json['user_avatar'] as String?,
      content: json['content'] as String,
      likesCount: json['likes_count'] as int,
      createdAt: DateTime.parse(json['created_at'] as String),
      isLiked: json['is_liked'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'post_id': postId,
      'user_id': userId,
      'username': username,
      'user_avatar': userAvatar,
      'content': content,
      'likes_count': likesCount,
      'created_at': createdAt.toIso8601String(),
      'is_liked': isLiked,
    };
  }
}