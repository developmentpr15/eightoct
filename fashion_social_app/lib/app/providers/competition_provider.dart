import 'package:flutter/material.dart';
import '../models/competition.dart';

class CompetitionProvider extends ChangeNotifier {
  List<Competition> _competitions = [];
  List<CompetitionEntry> _entries = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Competition> get competitions => _competitions;
  List<CompetitionEntry> get entries => _entries;
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

  Future<void> loadCompetitions() async {
    _setLoading(true);
    try {
      // Simulate API call with mock data
      await Future.delayed(const Duration(seconds: 1));

      _competitions = [
        Competition(
          id: '1',
          title: 'Summer Style Challenge',
          description: 'Show us your best summer outfit! The most creative and stylish look wins amazing prizes.',
          type: CompetitionType.dailyTheme,
          hashtag: '#SummerStyle2024',
          bannerImage: 'https://picsum.photos/800/400?random=21',
          sponsor: 'Fashion Magazine',
          prizeDescription: '$1000 shopping spree + feature in our magazine',
          rules: [
            'Must be original content',
            'Use #SummerStyle2024 hashtag',
            'Outfit must be summer-appropriate',
            'One entry per person',
          ],
          startDate: DateTime.now(),
          endDate: DateTime.now().add(const Duration(days: 7)),
          status: CompetitionStatus.active,
          entriesCount: 156,
          maxEntriesPerUser: 3,
          createdAt: DateTime.now().subtract(const Duration(days: 1)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 6)),
        ),
        Competition(
          id: '2',
          title: 'Sustainable Fashion Week',
          description: 'Create amazing outfits using sustainable and eco-friendly fashion pieces.',
          type: CompetitionType.weeklyChallenge,
          hashtag: '#EcoChic2024',
          bannerImage: 'https://picsum.photos/800/400?random=22',
          sponsor: 'Green Fashion Co',
          prizeDescription: 'Eco-friendly wardrobe makeover worth $2000',
          rules: [
            'Must feature sustainable brands',
            'Explain your eco-friendly choices',
            'Use #EcoChic2024 hashtag',
            'Maximum 5 photos per entry',
          ],
          startDate: DateTime.now().add(const Duration(days: 3)),
          endDate: DateTime.now().add(const Duration(days: 10)),
          status: CompetitionStatus.upcoming,
          entriesCount: 0,
          maxEntriesPerUser: 2,
          createdAt: DateTime.now().subtract(const Duration(days: 2)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 12)),
        ),
        Competition(
          id: '3',
          title: 'Street Style Collaboration',
          description: 'Partner with Urban Outfitters to showcase your best street style looks.',
          type: CompetitionType.brandCollab,
          hashtag: '#UrbanStyleX',
          bannerImage: 'https://picsum.photos/800/400?random=23',
          sponsor: 'Urban Outfitters',
          prizeDescription: '$500 Urban Outfitters gift card + brand ambassador opportunity',
          rules: [
            'Must feature at least one Urban Outfitters item',
            'Urban aesthetic required',
            'Tag @urbanoutfitters',
            'Use #UrbanStyleX hashtag',
          ],
          startDate: DateTime.now().subtract(const Duration(days: 5)),
          endDate: DateTime.now().subtract(const Duration(days: 1)),
          status: CompetitionStatus.judging,
          entriesCount: 342,
          maxEntriesPerUser: 5,
          createdAt: DateTime.now().subtract(const Duration(days: 7)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 24)),
        ),
      ];

      _setError(null);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadCompetitionEntries(String competitionId) async {
    _setLoading(true);
    try {
      // Simulate API call with mock data
      await Future.delayed(const Duration(seconds: 1));

      _entries = [
        CompetitionEntry(
          id: '1',
          competitionId: competitionId,
          postId: 'post1',
          userId: 'user1',
          heartsCount: 234,
          isWinner: false,
          createdAt: DateTime.now().subtract(const Duration(hours: 2)),
        ),
        CompetitionEntry(
          id: '2',
          competitionId: competitionId,
          postId: 'post2',
          userId: 'user2',
          heartsCount: 456,
          isWinner: false,
          createdAt: DateTime.now().subtract(const Duration(hours: 4)),
        ),
        CompetitionEntry(
          id: '3',
          competitionId: competitionId,
          postId: 'post3',
          userId: 'user3',
          heartsCount: 789,
          isWinner: true,
          rank: 1,
          createdAt: DateTime.now().subtract(const Duration(hours: 6)),
        ),
      ];

      _setError(null);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> enterCompetition(String competitionId, String postId) async {
    try {
      final newEntry = CompetitionEntry(
        id: 'entry_${DateTime.now().millisecondsSinceEpoch}',
        competitionId: competitionId,
        postId: postId,
        userId: 'current_user',
        heartsCount: 0,
        isWinner: false,
        createdAt: DateTime.now(),
      );

      _entries.insert(0, newEntry);
      
      // Update competition entries count
      final competitionIndex = _competitions.indexWhere((c) => c.id == competitionId);
      if (competitionIndex != -1) {
        final competition = _competitions[competitionIndex];
        _competitions[competitionIndex] = competition.copyWith(
          entriesCount: competition.entriesCount + 1,
        );
      }
      
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> voteForEntry(String entryId) async {
    try {
      final entryIndex = _entries.indexWhere((entry) => entry.id == entryId);
      if (entryIndex != -1) {
        final entry = _entries[entryIndex];
        _entries[entryIndex] = entry.copyWith(heartsCount: entry.heartsCount + 1);
        notifyListeners();
      }
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  List<Competition> getActiveCompetitions() {
    return _competitions.where((c) => c.status == CompetitionStatus.active).toList();
  }

  List<Competition> getUpcomingCompetitions() {
    return _competitions.where((c) => c.status == CompetitionStatus.upcoming).toList();
  }

  List<Competition> getCompletedCompetitions() {
    return _competitions.where((c) => c.status == CompetitionStatus.completed).toList();
  }
}