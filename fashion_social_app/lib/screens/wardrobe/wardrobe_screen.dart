import 'package:flutter/material.dart';
import '../../themes/app_theme.dart';

class WardrobeScreen extends StatefulWidget {
  final String? wardrobeId;
  const WardrobeScreen({Key? key, this.wardrobeId}) : super(key: key);

  @override
  State<WardrobeScreen> createState() => _WardrobeScreenState();
}

class _WardrobeScreenState extends State<WardrobeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Wardrobe'),
      ),
      body: const Center(
        child: Text('Wardrobe Screen - Coming Soon'),
      ),
    );
  }
}