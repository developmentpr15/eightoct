import 'package:flutter/material.dart';
import '../models/post.dart';
import '../models/user.dart';

class SocialProvider extends ChangeNotifier {
  List<Post> _posts = [];
  List<User> _users = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Post> get posts => _posts;
  List<User> get users => _users;
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

  Future<void> loadPosts() async {
    _setLoading(true);
    try {
      // Simulate API call with mock data
      await Future.delayed(const Duration(seconds: 1));

      _posts = [
        Post(
          id: '1',
          userId: 'user1',
          caption: 'Summer vibes with this amazing outfit! ☀️ What do you think?',
          images: ['https://picsum.photos/400/600?random=1'],
          hashtags: ['summer', 'fashion', 'style'],
          mentions: [],
          location: 'Miami Beach',
          likesCount: 234,
          commentsCount: 45,
          sharesCount: 12,
          heartsCount: 89,
          createdAt: DateTime.now().subtract(const Duration(hours: 2)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 2)),
          user: const User(
            id: 'user1',
            email: 'user1@example.com',
            username: 'fashionista',
            fullName: 'Sarah Johnson',
            avatarUrl: 'https://picsum.photos/100/100?random=101',
            privacySettings: PrivacySettings(),
            referralCode: 'REF123',
            createdAt: DateTime.now().subtract(const Duration(days: 30)),
            updatedAt: DateTime.now().subtract(const Duration(days: 1)),
            lastLogin: DateTime.now(),
          ),
        ),
        Post(
          id: '2',
          userId: 'user2',
          caption: 'Street style inspiration from Tokyo 🗾 Urban fashion at its finest!',
          images: ['https://picsum.photos/400/600?random=2'],
          hashtags: ['streetwear', 'tokyo', 'urban'],
          mentions: [],
          location: 'Tokyo, Japan',
          likesCount: 567,
          commentsCount: 78,
          sharesCount: 34,
          heartsCount: 156,
          createdAt: DateTime.now().subtract(const Duration(hours: 5)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 5)),
          user: const User(
            id: 'user2',
            email: 'user2@example.com',
            username: 'streetstyle',
            fullName: 'Mike Chen',
            avatarUrl: 'https://picsum.photos/100/100?random=102',
            privacySettings: PrivacySettings(),
            referralCode: 'REF456',
            createdAt: DateTime.now().subtract(const Duration(days: 60)),
            updatedAt: DateTime.now().subtract(const Duration(days: 2)),
            lastLogin: DateTime.now(),
          ),
        ),
        Post(
          id: '3',
          userId: 'user3',
          caption: 'Elegant evening look for the gala tonight ✨ Classic never goes out of style',
          images: ['https://picsum.photos/400/600?random=3'],
          hashtags: ['elegant', 'evening', 'classic'],
          mentions: [],
          location: 'New York',
          likesCount: 892,
          commentsCount: 124,
          sharesCount: 67,
          heartsCount: 234,
          createdAt: DateTime.now().subtract(const Duration(hours: 8)),
          updatedAt: DateTime.now().subtract(const Duration(hours: 8)),
          user: const User(
            id: 'user3',
            email: 'user3@example.com',
            username: 'elegant',
            fullName: 'Emma Davis',
            avatarUrl: 'https://picsum.photos/100/100?random=103',
            privacySettings: PrivacySettings(),
            referralCode: 'REF789',
            createdAt: DateTime.now().subtract(const Duration(days: 90)),
            updatedAt: DateTime.now().subtract(const Duration(days: 3)),
            lastLogin: DateTime.now(),
          ),
        ),
      ];

      _setError(null);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> likePost(String postId) async {
    try {
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex != -1) {
        final post = _posts[postIndex];
        _posts[postIndex] = post.copyWith(likesCount: post.likesCount + 1);
        notifyListeners();
      }
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> heartPost(String postId) async {
    try {
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex != -1) {
        final post = _posts[postIndex];
        _posts[postIndex] = post.copyWith(heartsCount: post.heartsCount + 1);
        notifyListeners();
      }
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> sharePost(String postId) async {
    try {
      final postIndex = _posts.indexWhere((post) => post.id == postId);
      if (postIndex != -1) {
        final post = _posts[postIndex];
        _posts[postIndex] = post.copyWith(sharesCount: post.sharesCount + 1);
        notifyListeners();
      }
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> createPost(String caption, List<String> images) async {
    try {
      final newPost = Post(
        id: 'post_${DateTime.now().millisecondsSinceEpoch}',
        userId: 'current_user',
        caption: caption,
        images: images,
        hashtags: [],
        mentions: [],
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        heartsCount: 0,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      _posts.insert(0, newPost);
      notifyListeners();
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }
}