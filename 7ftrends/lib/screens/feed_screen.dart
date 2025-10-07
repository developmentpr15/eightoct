import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import '../services/feed_service.dart';
import '../widgets/post_card.dart';
import '../widgets/loading_widget.dart';
import '../widgets/empty_state_widget.dart';
import 'create_post_screen.dart';
import 'search_screen.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final ScrollController _scrollController = ScrollController();
  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _loadFeed();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadFeed() async {
    final feedProvider = Provider.of<FeedProvider>(context, listen: false);
    await feedProvider.loadFeed(refresh: true);
  }

  Future<void> _loadMore() async {
    final feedProvider = Provider.of<FeedProvider>(context, listen: false);
    await feedProvider.loadFeed();
  }

  Future<void> _refreshFeed() async {
    await _loadFeed();
  }

  void _navigateToCreatePost() async {
    final images = await _imagePicker.pickMultiImage();
    if (images.isNotEmpty) {
      if (mounted) {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => CreatePostScreen(images: images),
          ),
        );
      }
    }
  }

  void _navigateToSearch() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const SearchScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/logo.png',
              height: 32,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF7C4DFF), Color(0xFFB388FF)],
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Center(
                    child: Text(
                      '7F',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(width: 8),
            const Text(
              '7ftrends',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Color(0xFF7C4DFF),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: _navigateToSearch,
            icon: const Icon(Icons.search),
          ),
        ],
        elevation: 0,
        backgroundColor: Colors.white,
      ),
      body: Consumer<FeedProvider>(
        builder: (context, feedProvider, child) {
          if (feedProvider.isLoading && feedProvider.posts.isEmpty) {
            return const LoadingWidget();
          }

          if (feedProvider.posts.isEmpty) {
            return EmptyStateWidget(
              title: 'No posts yet',
              subtitle: 'Be the first to share your fashion!',
              actionText: 'Create Post',
              onAction: _navigateToCreatePost,
            );
          }

          return RefreshIndicator(
            onRefresh: _refreshFeed,
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: feedProvider.posts.length + (feedProvider.hasMore ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == feedProvider.posts.length) {
                  return const Padding(
                    padding: EdgeInsets.all(16),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }

                final post = feedProvider.posts[index];
                return PostCard(
                  post: post,
                  onLike: () => feedProvider.likePost(post.id),
                  onComment: (content) => feedProvider.addComment(post.id, content),
                  onShare: () => feedProvider.sharePost(post.id),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _navigateToCreatePost,
        backgroundColor: const Color(0xFF7C4DFF),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}