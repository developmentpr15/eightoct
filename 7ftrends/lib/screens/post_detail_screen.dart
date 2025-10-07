import 'package:flutter/material.dart';
import '../models/post.dart';

class PostDetailScreen extends StatelessWidget {
  final Post post;

  const PostDetailScreen({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(post.username),
      ),
      body: Center(
        child: Text('Post Detail for ${post.id}'),
      ),
    );
  }
}

class WardrobeItemDetailScreen extends StatelessWidget {
  final dynamic item;

  const WardrobeItemDetailScreen({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(item.name ?? 'Item Detail'),
      ),
      body: Center(
        child: Text('Wardrobe Item Detail'),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Home Screen'),
      ),
    );
  }
}