import 'package:flutter/material.dart';
import '../models/user.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _errorMessage;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get errorMessage => _errorMessage;

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }

  Future<bool> signUp(String email, String password, String username, String fullName) async {
    _setLoading(true);
    _setError(null);

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));

      // Create mock user
      _user = User(
        id: 'user_${DateTime.now().millisecondsSinceEpoch}',
        email: email,
        username: username,
        fullName: fullName,
        privacySettings: const PrivacySettings(),
        referralCode: 'REF${DateTime.now().millisecondsSinceEpoch}',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        lastLogin: DateTime.now(),
      );

      _isAuthenticated = true;
      _setError(null);
      return true;

    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    _setError(null);

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));

      // Create mock user
      _user = User(
        id: 'user_${DateTime.now().millisecondsSinceEpoch}',
        email: email,
        username: email.split('@')[0],
        fullName: 'Fashion User',
        privacySettings: const PrivacySettings(),
        referralCode: 'REF${DateTime.now().millisecondsSinceEpoch}',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        lastLogin: DateTime.now(),
      );

      _isAuthenticated = true;
      _setError(null);
      return true;

    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signOut() async {
    _user = null;
    _isAuthenticated = false;
    _setError(null);
    notifyListeners();
  }

  Future<void> updateProfile(User updatedUser) async {
    _setLoading(true);
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));
      _user = updatedUser;
      _setError(null);
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }
}