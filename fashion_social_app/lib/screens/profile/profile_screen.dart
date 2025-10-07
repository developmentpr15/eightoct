import 'package:flutter/material.dart';
import '../../themes/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  final String? userId;
  const ProfileScreen({Key? key, this.userId}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.userId != null ? 'User Profile' : 'My Profile'),
      ),
      body: Center(
        child: Text('Profile Screen - Coming Soon'),
      ),
    );
  }
}