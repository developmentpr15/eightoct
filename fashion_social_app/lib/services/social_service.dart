import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/post.dart';
import '../models/user.dart';

class SocialService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<Post>> getPosts({int limit = 20, DocumentSnapshot? startAfter}) async {
    try {
      Query query = _firestore
          .collection('posts')
          .orderBy('created_at', descending: true)
          .limit(limit);

      if (startAfter != null) {
        query = query.startAfterDocument(startAfter);
      }

      final QuerySnapshot snapshot = await query.get();
      
      final List<Post> posts = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final postData = doc.data() as Map<String, dynamic>;
        postData['id'] = doc.id;
        
        // Get user data
        final userDoc = await _firestore.collection('users').doc(postData['user_id']).get();
        if (userDoc.exists) {
          postData['user'] = userDoc.data();
        }
        
        posts.add(Post.fromJson(postData));
      }

      return posts;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<Post>> getUserPosts(String userId) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('posts')
          .where('user_id', isEqualTo: userId)
          .orderBy('created_at', descending: true)
          .get();

      final List<Post> posts = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final postData = doc.data() as Map<String, dynamic>;
        postData['id'] = doc.id;
        posts.add(Post.fromJson(postData));
      }

      return posts;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Post?> createPost({
    required String userId,
    required String caption,
    required List<String> images,
    List<String>? hashtags,
    List<String>? mentions,
    String? location,
    List<String>? outfitItems,
  }) async {
    try {
      final postData = {
        'user_id': userId,
        'caption': caption,
        'images': images,
        'hashtags': hashtags ?? [],
        'mentions': mentions ?? [],
        'location': location,
        'outfit_items': outfitItems ?? [],
        'likes_count': 0,
        'comments_count': 0,
        'shares_count': 0,
        'hearts_count': 0,
        'is_reported': false,
        'is_hidden': false,
        'created_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      };

      final DocumentReference docRef = await _firestore.collection('posts').add(postData);
      
      final postDataWithId = Map<String, dynamic>.from(postData);
      postDataWithId['id'] = docRef.id;

      return Post.fromJson(postDataWithId);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> likePost(String postId, String userId) async {
    try {
      await _firestore.collection('likes').add({
        'post_id': postId,
        'user_id': userId,
        'created_at': DateTime.now().toIso8601String(),
      });

      await _firestore.collection('posts').doc(postId).update({
        'likes_count': FieldValue.increment(1),
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> unlikePost(String postId, String userId) async {
    try {
      final QuerySnapshot likesSnapshot = await _firestore
          .collection('likes')
          .where('post_id', isEqualTo: postId)
          .where('user_id', isEqualTo: userId)
          .get();

      for (final DocumentSnapshot doc in likesSnapshot.docs) {
        await doc.reference.delete();
      }

      await _firestore.collection('posts').doc(postId).update({
        'likes_count': FieldValue.increment(-1),
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> heartPost(String postId, String userId) async {
    try {
      await _firestore.collection('hearts').add({
        'post_id': postId,
        'user_id': userId,
        'created_at': DateTime.now().toIso8601String(),
      });

      await _firestore.collection('posts').doc(postId).update({
        'hearts_count': FieldValue.increment(1),
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> sharePost(String postId, String userId) async {
    try {
      await _firestore.collection('shares').add({
        'post_id': postId,
        'user_id': userId,
        'created_at': DateTime.now().toIso8601String(),
      });

      await _firestore.collection('posts').doc(postId).update({
        'shares_count': FieldValue.increment(1),
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<Comment>> getComments(String postId) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('comments')
          .where('post_id', isEqualTo: postId)
          .orderBy('created_at', descending: false)
          .get();

      final List<Comment> comments = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final commentData = doc.data() as Map<String, dynamic>;
        commentData['id'] = doc.id;
        comments.add(Comment.fromJson(commentData));
      }

      return comments;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<Comment?> addComment(String postId, String userId, String content) async {
    try {
      final commentData = {
        'post_id': postId,
        'user_id': userId,
        'content': content,
        'likes_count': 0,
        'is_reported': false,
        'created_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      };

      final DocumentReference docRef = await _firestore.collection('comments').add(commentData);
      
      await _firestore.collection('posts').doc(postId).update({
        'comments_count': FieldValue.increment(1),
      });

      final commentDataWithId = Map<String, dynamic>.from(commentData);
      commentDataWithId['id'] = docRef.id;

      return Comment.fromJson(commentDataWithId);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> followUser(String currentUserId, String targetUserId) async {
    try {
      await _firestore.collection('follows').add({
        'follower_id': currentUserId,
        'following_id': targetUserId,
        'created_at': DateTime.now().toIso8601String(),
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> unfollowUser(String currentUserId, String targetUserId) async {
    try {
      final QuerySnapshot followsSnapshot = await _firestore
          .collection('follows')
          .where('follower_id', isEqualTo: currentUserId)
          .where('following_id', isEqualTo: targetUserId)
          .get();

      for (final DocumentSnapshot doc in followsSnapshot.docs) {
        await doc.reference.delete();
      }
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<UserModel>> searchUsers(String query) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('users')
          .where('username', isGreaterThanOrEqualTo: query)
          .where('username', isLessThanOrEqualTo: query + '\uf8ff')
          .limit(20)
          .get();

      final List<UserModel> users = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final userData = doc.data() as Map<String, dynamic>;
        userData['id'] = doc.id;
        users.add(UserModel.fromJson(userData));
      }

      return users;
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}