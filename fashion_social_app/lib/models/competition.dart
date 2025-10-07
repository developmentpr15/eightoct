import 'package:json_annotation/json_annotation.dart';
import 'user.dart';
import 'post.dart';

part 'competition.g.dart';

enum CompetitionType {
  dailyTheme,
  brandCollab,
  weeklyChallenge,
}

enum CompetitionStatus {
  upcoming,
  active,
  judging,
  completed,
  cancelled,
}

@JsonSerializable()
class Competition {
  final String id;
  final String title;
  final String description;
  final CompetitionType type;
  final String hashtag;
  final String? bannerImage;
  final String? sponsor;
  final String? prizeDescription;
  final List<String> rules;
  final DateTime startDate;
  final DateTime endDate;
  final CompetitionStatus status;
  final int entriesCount;
  final int? maxEntriesPerUser;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Competition({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.hashtag,
    this.bannerImage,
    this.sponsor,
    this.prizeDescription,
    this.rules = const [],
    required this.startDate,
    required this.endDate,
    required this.status,
    this.entriesCount = 0,
    this.maxEntriesPerUser,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Competition.fromJson(Map<String, dynamic> json) => _$CompetitionFromJson(json);
  Map<String, dynamic> toJson() => _$CompetitionToJson(this);

  String get typeDisplayName {
    switch (type) {
      case CompetitionType.dailyTheme:
        return 'Daily Theme';
      case CompetitionType.brandCollab:
        return 'Brand Collaboration';
      case CompetitionType.weeklyChallenge:
        return 'Weekly Challenge';
    }
  }

  String get statusDisplayName {
    switch (status) {
      case CompetitionStatus.upcoming:
        return 'Upcoming';
      case CompetitionStatus.active:
        return 'Active';
      case CompetitionStatus.judging:
        return 'Judging';
      case CompetitionStatus.completed:
        return 'Completed';
      case CompetitionStatus.cancelled:
        return 'Cancelled';
    }
  }
}

@JsonSerializable()
class CompetitionEntry {
  final String id;
  final String competitionId;
  final String postId;
  final String userId;
  final int heartsCount;
  final bool isWinner;
  final int? rank;
  final DateTime createdAt;
  final Post? post;
  final User? user;

  const CompetitionEntry({
    required this.id,
    required this.competitionId,
    required this.postId,
    required this.userId,
    this.heartsCount = 0,
    this.isWinner = false,
    this.rank,
    required this.createdAt,
    this.post,
    this.user,
  });

  factory CompetitionEntry.fromJson(Map<String, dynamic> json) => _$CompetitionEntryFromJson(json);
  Map<String, dynamic> toJson() => _$CompetitionEntryToJson(this);
}