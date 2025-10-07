class Competition {
  final String id;
  final String title;
  final String description;
  final String type;
  final String hashtag;
  final String? bannerImage;
  final String? sponsor;
  final String? prizeDescription;
  final List<String> rules;
  final DateTime startDate;
  final DateTime endDate;
  final String status;
  final int entriesCount;
  final int? maxEntriesPerUser;
  final DateTime createdAt;

  Competition({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.hashtag,
    this.bannerImage,
    this.sponsor,
    this.prizeDescription,
    required this.rules,
    required this.startDate,
    required this.endDate,
    required this.status,
    required this.entriesCount,
    this.maxEntriesPerUser,
    required this.createdAt,
  });

  factory Competition.fromJson(Map<String, dynamic> json) {
    return Competition(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: json['type'] as String,
      hashtag: json['hashtag'] as String,
      bannerImage: json['banner_image'] as String?,
      sponsor: json['sponsor'] as String?,
      prizeDescription: json['prize_description'] as String?,
      rules: List<String>.from(json['rules'] as List? ?? []),
      startDate: DateTime.parse(json['start_date'] as String),
      endDate: DateTime.parse(json['end_date'] as String),
      status: json['status'] as String,
      entriesCount: json['entries_count'] as int? ?? 0,
      maxEntriesPerUser: json['max_entries_per_user'] as int?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'type': type,
      'hashtag': hashtag,
      'banner_image': bannerImage,
      'sponsor': sponsor,
      'prize_description': prizeDescription,
      'rules': rules,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
      'status': status,
      'entries_count': entriesCount,
      'max_entries_per_user': maxEntriesPerUser,
      'created_at': createdAt.toIso8601String(),
    };
  }

  bool get isActive => status == 'active';
  bool get isUpcoming => status == 'upcoming';
  bool get isCompleted => status == 'completed';
}

class CompetitionEntry {
  final String id;
  final String competitionId;
  final String postId;
  final String userId;
  final String username;
  final String? userAvatar;
  final int heartsCount;
  final bool isWinner;
  final int? rank;
  final DateTime createdAt;
  final Post? post;

  CompetitionEntry({
    required this.id,
    required this.competitionId,
    required this.postId,
    required this.userId,
    required this.username,
    this.userAvatar,
    required this.heartsCount,
    required this.isWinner,
    this.rank,
    required this.createdAt,
    this.post,
  });

  factory CompetitionEntry.fromJson(Map<String, dynamic> json) {
    return CompetitionEntry(
      id: json['id'] as String,
      competitionId: json['competition_id'] as String,
      postId: json['post_id'] as String,
      userId: json['user_id'] as String,
      username: json['username'] as String,
      userAvatar: json['user_avatar'] as String?,
      heartsCount: json['hearts_count'] as int? ?? 0,
      isWinner: json['is_winner'] as bool? ?? false,
      rank: json['rank'] as int?,
      createdAt: DateTime.parse(json['created_at'] as String),
      post: json['post'] != null ? Post.fromJson(json['post'] as Map<String, dynamic>) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'competition_id': competitionId,
      'post_id': postId,
      'user_id': userId,
      'username': username,
      'user_avatar': userAvatar,
      'hearts_count': heartsCount,
      'is_winner': isWinner,
      'rank': rank,
      'created_at': createdAt.toIso8601String(),
      'post': post?.toJson(),
    };
  }
}

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
}