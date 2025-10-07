import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  User? get currentUser => _auth.currentUser;

  Future<User?> signUp(String email, String password, String username, String fullName) async {
    try {
      final UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      final User? user = result.user;
      if (user != null) {
        await _createUserProfile(user, username, fullName);
        await user.updateDisplayName(username);
      }

      return user;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<User?> signIn(String email, String password) async {
    try {
      final UserCredential result = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return result.user;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<User?> signInWithGoogle() async {
    try {
      final GoogleAuthProvider googleProvider = GoogleAuthProvider();
      final UserCredential result = await _auth.signInWithPopup(googleProvider);
      final User? user = result.user;

      if (user != null) {
        await _ensureUserProfileExists(user);
      }

      return user;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> signOut() async {
    try {
      await _auth.signOut();
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<UserModel?> getUserProfile(String userId) async {
    try {
      final DocumentSnapshot doc = await _firestore.collection('users').doc(userId).get();
      
      if (doc.exists) {
        return UserModel.fromJson(doc.data() as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<UserModel?> updateUserProfile(String userId, Map<String, dynamic> updates) async {
    try {
      await _firestore.collection('users').doc(userId).update(updates);
      return await getUserProfile(userId);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> _createUserProfile(User user, String username, String fullName) async {
    final privacySettings = PrivacySettings();
    final referralCode = _generateReferralCode();

    final userModel = UserModel(
      id: user.uid,
      email: user.email!,
      username: username,
      fullName: fullName,
      avatarUrl: user.photoURL,
      privacySettings: privacySettings,
      referralCode: referralCode,
      isVerified: false,
      isModerator: false,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      lastLogin: DateTime.now(),
    );

    await _firestore.collection('users').doc(user.uid).set(userModel.toJson());
  }

  Future<void> _ensureUserProfileExists(User user) async {
    final doc = await _firestore.collection('users').doc(user.uid).get();
    
    if (!doc.exists) {
      await _createUserProfile(
        user,
        user.displayName ?? 'User',
        user.displayName ?? '',
      );
    } else {
      await _firestore.collection('users').doc(user.uid).update({
        'last_login': DateTime.now().toIso8601String(),
      });
    }
  }

  String _generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final random = DateTime.now().millisecondsSinceEpoch;
    String code = '';
    
    for (int i = 0; i < 8; i++) {
      code += chars[(random + i) % chars.length];
    }
    
    return code;
  }
}