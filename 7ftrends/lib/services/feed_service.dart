import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/post.dart';
import '../models/user.dart';

class FeedService {
  final SupabaseClient _supabase = Supabase.instance.client;

  Future<List<Post>> getFeed({int limit = 20, int offset = 0}) async {
    try {
      final response = await _supabase
          .from('posts')
          .select('''
            *,
            user:users(username, avatar_url, is_verified)
          ''')
          .order('created_at', ascending: false)
          .range(offset, offset + limit - 1);

      return (response as List)
          .map((json) => _mapPostWithUser(json))
          .toList();
    } catch (e) {
      print('Get feed error: $e');
      return [];
    }
  }

  Post _mapPostWithUser(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>?;
    return Post.fromJson({
      ...json,
      'username': user?['username'] ?? 'Unknown',
      'user_avatar': user?['avatar_url'],
      'is_verified': user?['is_verified'] ?? false,
    });
  }

  Future<bool> createPost({
    required String caption,
    required List<String> images,
    List<String>? hashtags,
    List<String>? mentions,
    String? location,
  }) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      await _supabase.from('posts').insert({
        'user_id': user.id,
        'caption': caption,
        'images': images,
        'hashtags': hashtags ?? [],
        'mentions': mentions ?? [],
        'location': location,
        'likes_count': 0,
        'comments_count': 0,
        'shares_count': 0,
        'created_at': DateTime.now().toIso8601String(),
      });

      return true;
    } catch (e) {
      print('Create post error: $e');
      return false;
    }
  }

  Future<bool> likePost(String postId) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      // Add like
      await _supabase.from('likes').insert({
        'post_id': postId,
        'user_id': user.id,
        'created_at': DateTime.now().toIso8601String(),
      });

      // Update likes count
      await _supabase.rpc('increment_likes_count', params: {'post_id': postId});

      return true;
    } catch (e) {
      print('Like post error: $e');
      return false;
    }
  }

  Future<bool> unlikePost(String postId) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      // Remove like
      await _supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

      // Update likes count
      await _supabase.rpc('decrement_likes_count', params: {'post_id': postId});

      return true;
    } catch (e) {
      print('Unlike post error: $e');
      return false;
    }
  }

  Future<bool> addComment(String postId, String content) async {
    try {
      final user = _supabase.auth.currentUser;
      if (user == null) return false;

      await _supabase.from('comments').insert({
        'post_id': postId,
        'user_id': user.id,
        'content': content,
        'likes_count': 0,
        'created_at': DateTime.now().toIso8601String(),
      });

      // Update comments count
      await _supabase.rpc('increment_comments_count', params: {'post_id': postId});

      return true;
    } catch (e) {
      print('Add comment error: $e');
      return false;
    }
  }

  Future<List<Comment>> getComments(String postId) async {
    try {
      final response = await _supabase
          .from('comments')
          .select('''
            *,
            user:users(username, avatar_url)
          ''')
          .eq('post_id', postId)
          .order('created_at', ascending: true);

      return (response as List)
          .map((json) => _mapCommentWithUser(json))
          .toList();
    } catch (e) {
      print('Get comments error: $e');
      return [];
    }
  }

  Comment _mapCommentWithUser(Map<String, dynamic> json) {
    final user = json['user'] as Map<String, dynamic>?;
    return Comment.fromJson({
      ...json,
      'username': user?['username'] ?? 'Unknown',
      'user_avatar': user?['avatar_url'],
    });
  }

  Future<bool> sharePost(String postId) async {
    try {
      await _supabase.rpc('increment_shares_count', params: {'post_id': postId});
      return true;
    } catch (e) {
      print('Share post error: $e');
      return false;
    }
  }

  Future<List<Post>> searchPosts(String query) async {
    try {
      final response = await _supabase
          .from('posts')
          .select('''
            *,
            user:users(username, avatar_url, is_verified)
          ''')
          .or('caption.ilike.%$query%,hashtags.cs.{${query.toLowerCase()}}')
          .order('created_at', ascending: false)
          .limit(50);

      return (response as List)
          .map((json) => _mapPostWithUser(json))
          .toList();
    } catch (e) {
      print('Search posts error: $e');
      return [];
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
      final currentUser = _supabase.auth.currentUser;
      if (currentUser == null) return false;

      await _supabase.rpc('follow_user', params: {
        'follower_id': currentUser.id,
        'following_id': userId,
      });

      return true;
    } catch (e) {
      print('Follow user error: $e');
      return false;
    }
  }

  Future<bool> unfollowUser(String userId) async {
    try {
      final currentUser = _supabase.auth.currentUser;
      if (currentUser == null) return false;

      await _supabase.rpc('unfollow_user', params: {
        'follower_id': currentUser.id,
        'following_id': userId,
      });

      return true;
    } catch (e) {
      print('Unfollow user error: $e');
      return false;
    }
  }
}

class FeedProvider extends ChangeNotifier {
  final FeedService _feedService = FeedService();
  List<Post> _posts = [];
  bool _isLoading = false;
  bool _hasMore = true;
  int _currentPage = 0;

  List<Post> get posts => _posts;
  bool get isLoading => _isLoading;
  bool get hasMore => _hasMore;

  Future<void> loadFeed({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 0;
      _posts.clear();
      _hasMore = true;
    }

    if (_isLoading || !_hasMore) return;

    _isLoading = true;
    notifyListeners();

    try {
      final newPosts = await _feedService.getFeed(
        limit: 20,
        offset: _currentPage * 20,
      );

      if (newPosts.length < 20) {
        _hasMore = false;
      }

      _posts.addAll(newPosts);
      _currentPage++;
    } catch (e) {
      print('Load feed error: $e');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> likePost(String postId) async {
    final postIndex = _posts.indexWhere((post) => post.id == postId);
    if (postIndex == -1) return false;

    final post = _posts[postIndex];
    final isLiked = post.isLiked;

    // Optimistic update
    _posts[postIndex] = post.copyWith(
      isLiked: !isLiked,
      likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
    );
    notifyListeners();

    final success = isLiked
        ? await _feedService.unlikePost(postId)
        : await _feedService.likePost(postId);

    if (!success) {
      // Revert optimistic update
      _posts[postIndex] = post;
      notifyListeners();
    }

    return success;
  }

  Future<bool> addComment(String postId, String content) async {
    final success = await _feedService.addComment(postId, content);
    
    if (success) {
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex != -1) {
        _posts[postIndex] = _posts[postIndex].copyWith(
          commentsCount: _posts[postIndex].commentsCount + 1,
        );
        notifyListeners();
      }
    }

    return success;
  }

  Future<bool> sharePost(String postId) async {
    final success = await _feedService.sharePost(postId);
    
    if (success) {
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex != -1) {
        _posts[postIndex] = _posts[postIndex].copyWith(
          sharesCount: _posts[postIndex].sharesCount + 1,
        );
        notifyListeners();
      }
    }

    return success;
  }

  Future<bool> createPost({
    required String caption,
    required List<String> images,
    List<String>? hashtags,
    List<String>? mentions,
    String? location,
  }) async {
    final success = await _feedService.createPost(
      caption: caption,
      images: images,
      hashtags: hashtags,
      mentions: mentions,
      location: location,
    );

    if (success) {
      await loadFeed(refresh: true);
    }

    return success;
  }
}