import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/competition.dart';

class CompetitionService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Competition>> getCompetitions() async {
    try {
      final response = await _supabase
          .from('competitions')
          .select()
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => Competition.fromJson(json))
          .toList();
    } catch (e) {
      print('Get competitions error: $e');
      return [];
    }
  }

  Future<List<CompetitionEntry>> getCompetitionEntries(String competitionId) async {
    try {
      final response = await _supabase
          .from('competition_entries')
          .select('''
            *,
            user:users(username, avatar_url),
            post:posts(*)
          ''')
          .eq('competition_id', competitionId)
          .order('hearts_count', ascending: false);

      return (response as List)
          .map((json) => _mapEntryWithUserAndPost(json))
          .toList();
    } catch (e) {
      print('Get competition entries error: $e');
      return [];
    }
  }

  CompetitionEntry _mapEntryWithUserAndPost(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>?;
    final post = json['post'] as Map<String, dynamic>?;
    
    return CompetitionEntry.fromJson({
      ...json,
      'username': user?['username'] ?? 'Unknown',
      'user_avatar': user?['avatar_url'],
      'post': post,
    });
  }

  Future<bool> enterCompetition(String competitionId, String postId) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      await _supabase.from('competition_entries').insert({
        'competition_id': competitionId,
        'post_id': postId,
        'user_id': user.id,
        'hearts_count': 0,
        'is_winner': false,
        'created_at': DateTime.now().toIso8601String(),
      });

      return true;
    } catch (e) {
      print('Enter competition error: $e');
      return false;
    }
  }

  Future<bool> voteForEntry(String entryId) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      // Add vote
      await _supabase.from('votes').insert({
        'competition_entry_id': entryId,
        'user_id': user.id,
        'created_at': DateTime.now().toIso8601String(),
      });

      // Update hearts count
      await _supabase.rpc('increment_hearts_count', params: {'entry_id': entryId});

      return true;
    } catch (e) {
      print('Vote for entry error: $e');
      return false;
    }
  }

  Future<List<Competition>> getActiveCompetitions() async {
    try {
      final response = await _supabase
          .from('competitions')
          .select()
          .eq('status', 'active')
          .order('end_date', ascending: true);

      return (response as List)
          .map((json) => Competition.fromJson(json))
          .toList();
    } catch (e) {
      print('Get active competitions error: $e');
      return [];
    }
  }

  Future<List<Competition>> getUpcomingCompetitions() async {
    try {
      final response = await _supabase
          .from('competitions')
          .select()
          .eq('status', 'upcoming')
          .order('start_date', ascending: true);

      return (response as List)
          .map((json) => Competition.fromJson(json))
          .toList();
    } catch (e) {
      print('Get upcoming competitions error: $e');
      return [];
    }
  }

  Future<List<CompetitionEntry>> getUserEntries() async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return [];

      final response = await _supabase
          .from('competition_entries')
          .select('''
            *,
            competition:competitions(*),
            post:posts(*)
          ''')
          .eq('user_id', user.id)
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => CompetitionEntry.fromJson(json))
          .toList();
    } catch (e) {
      print('Get user entries error: $e');
      return [];
    }
  }
}

class CompetitionProvider extends ChangeNotifier {
  final CompetitionService _competitionService = CompetitionService();
  List<Competition> _competitions = [];
  List<CompetitionEntry> _entries = [];
  bool _isLoading = false;

  List<Competition> get competitions => _competitions;
  List<CompetitionEntry> get entries => _entries;
  bool get isLoading => _isLoading;

  List<Competition> get activeCompetitions =>
      _competitions.where((c) => c.isActive).toList();
  List<Competition> get upcomingCompetitions =>
      _competitions.where((c) => c.isUpcoming).toList();
  List<Competition> get completedCompetitions =>
      _competitions.where((c) => c.isCompleted).toList();

  Future<void> loadCompetitions() async {
    _isLoading = true;
    notifyListeners();

    try {
      _competitions = await _competitionService.getCompetitions();
    } catch (e) {
      print('Load competitions error: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadCompetitionEntries(String competitionId) async {
    _isLoading = true;
    notifyListeners();

    try {
      _entries = await _competitionService.getCompetitionEntries(competitionId);
    } catch (e) {
      print('Load competition entries error: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> enterCompetition(String competitionId, String postId) async {
    final success = await _competitionService.enterCompetition(competitionId, postId);
    
    if (success) {
      await loadCompetitions();
    }
    
    return success;
  }

  Future<bool> voteForEntry(String entryId) async {
    final success = await _competitionService.voteForEntry(entryId);
    
    if (success) {
      final entryIndex = _entries.indexWhere((entry) => entry.id == entryId);
      if (entryIndex != -1) {
        _entries[entryIndex] = _entries[entryIndex].copyWith(
          heartsCount: _entries[entryIndex].heartsCount + 1,
        );
        notifyListeners();
      }
    }
    
    return success;
  }
}