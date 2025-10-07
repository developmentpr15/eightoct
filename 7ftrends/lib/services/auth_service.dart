import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user.dart';

class AuthService {
  final SupabaseClient _supabase = Supabase.instance.client;

  User? _currentUser;
  User? get currentUser => _currentUser;

  Future<bool> signUp(String email, String password, String username, String fullName) async {
    try {
      final response = await _supabase.auth.signUp(
        email: email,
        password: password,
        data: {
          'username': username,
          'full_name': fullName,
        },
      );

      if (response.user != null) {
        // Create user profile
        await _supabase.from('users').insert({
          'id': response.user!.id,
          'email': email,
          'username': username,
          'full_name': fullName,
          'points_balance': 0,
          'is_verified': false,
          'created_at': DateTime.now().toIso8601String(),
          'settings': {
            'profile_visibility': true,
            'allow_tagging': true,
            'wardrobe_backup': false,
            'location_sharing': false,
            'data_analytics': true,
          },
          'followers': [],
          'following': [],
        });

        await loadCurrentUser();
        return true;
      }
      return false;
    } catch (e) {
      print('Sign up error: $e');
      return false;
    }
  }

  Future<bool> signIn(String email, String password) async {
    try {
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );

      if (response.user != null) {
        await loadCurrentUser();
        return true;
      }
      return false;
    } catch (e) {
      print('Sign in error: $e');
      return false;
    }
  }

  Future<bool> signInWithGoogle() async {
    try {
      final response = await _supabase.auth.signInWithOAuth(
        Provider.google,
        redirectTo: 'io.supabase.flutter://auth-callback',
      );

      if (response.user != null) {
        await loadCurrentUser();
        return true;
      }
      return false;
    } catch (e) {
      print('Google sign in error: $e');
      return false;
    }
  }

  Future<void> signOut() async {
    try {
      await _supabase.auth.signOut();
      _currentUser = null;
    } catch (e) {
      print('Sign out error: $e');
    }
  }

  Future<void> loadCurrentUser() async {
    try {
      final user = _supabase.auth.currentUser;
      if (user != null) {
        final response = await _supabase
            .from('users')
            .select()
            .eq('id', user.id)
            .single();

        if (response != null) {
          _currentUser = User.fromJson(response);
        }
      }
    } catch (e) {
      print('Load current user error: $e');
    }
  }

  Future<bool> updateProfile({
    String? fullName,
    String? bio,
    String? avatarUrl,
  }) async {
    try {
      if (_currentUser == null) return false;

      final updates = <String, dynamic>{};
      if (fullName != null) updates['full_name'] = fullName;
      if (bio != null) updates['bio'] = bio;
      if (avatarUrl != null) updates['avatar_url'] = avatarUrl;

      await _supabase
          .from('users')
          .update(updates)
          .eq('id', _currentUser!.id);

      await loadCurrentUser();
      return true;
    } catch (e) {
      print('Update profile error: $e');
      return false;
    }
  }

  Future<List<User>> searchUsers(String query) async {
    try {
      final response = await _supabase
          .from('users')
          .select()
          .ilike('username', '%$query%')
          .or('full_name.ilike.%$query%')
          .limit(20);

      return (response as List)
          .map((json) => User.fromJson(json))
          .toList();
    } catch (e) {
      print('Search users error: $e');
      return [];
    }
  }

  Future<bool> followUser(String userId) async {
    try {
      if (_currentUser == null) return false;

      // Add to following list
      await _supabase.rpc('follow_user', params: {
        'follower_id': _currentUser!.id,
        'following_id': userId,
      });

      await loadCurrentUser();
      return true;
    } catch (e) {
      print('Follow user error: $e');
      return false;
    }
  }

  Future<bool> unfollowUser(String userId) async {
    try {
      if (_currentUser == null) return false;

      // Remove from following list
      await _supabase.rpc('unfollow_user', params: {
        'follower_id': _currentUser!.id,
        'following_id': userId,
      });

      await loadCurrentUser();
      return true;
    } catch (e) {
      print('Unfollow user error: $e');
      return false;
    }
  }

  Stream<User?> get authStateChanges {
    return _supabase.auth.onAuthStateChanges
        .map((event) async {
          if (event.session != null) {
            await loadCurrentUser();
            return _currentUser;
          } else {
            _currentUser = null;
            return null;
          }
        })
        .map((future) => future as User?);
  }
}

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _loadUser();
    _authService.authStateChanges.listen((user) {
      _user = user;
      notifyListeners();
    });
  }

  Future<void> _loadUser() async {
    _isLoading = true;
    notifyListeners();
    
    await _authService.loadCurrentUser();
    _user = _authService.currentUser;
    
    _isLoading = false;
    notifyListeners();
  }

  Future<bool> signUp(String email, String password, String username, String fullName) async {
    _isLoading = true;
    notifyListeners();

    final success = await _authService.signUp(email, password, username, fullName);
    
    _isLoading = false;
    if (success) {
      _user = _authService.currentUser;
    }
    notifyListeners();
    
    return success;
  }

  Future<bool> signIn(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    final success = await _authService.signIn(email, password);
    
    _isLoading = false;
    if (success) {
      _user = _authService.currentUser;
    }
    notifyListeners();
    
    return success;
  }

  Future<bool> signInWithGoogle() async {
    _isLoading = true;
    notifyListeners();

    final success = await _authService.signInWithGoogle();
    
    _isLoading = false;
    if (success) {
      _user = _authService.currentUser;
    }
    notifyListeners();
    
    return success;
  }

  Future<void> signOut() async {
    await _authService.signOut();
    _user = null;
    notifyListeners();
  }

  Future<bool> updateProfile({
    String? fullName,
    String? bio,
    String? avatarUrl,
  }) async {
    final success = await _authService.updateProfile(
      fullName: fullName,
      bio: bio,
      avatarUrl: avatarUrl,
    );
    
    if (success) {
      _user = _authService.currentUser;
      notifyListeners();
    }
    
    return success;
  }
}