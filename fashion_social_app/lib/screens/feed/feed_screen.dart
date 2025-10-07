import 'package:flutter/material.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../app/providers/social_provider.dart';
import '../../app/providers/auth_provider.dart';
import '../../themes/app_theme.dart';
import '../../widgets/post_card.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state_widget.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({Key? key}) : super(key: key);

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen>
    with AutomaticKeepAliveClientMixin {
  final ScrollController _scrollController = ScrollController();
  bool _isRefreshing = false;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _loadData();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _loadData() async {
    final socialProvider = context.read<SocialProvider>();
    await socialProvider.loadPosts();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMorePosts();
    }
  }

  Future<void> _loadMorePosts() async {
    final socialProvider = context.read<SocialProvider>();
    if (!socialProvider.isLoading && socialProvider.hasMorePosts) {
      await socialProvider.loadPosts();
    }
  }

  Future<void> _refresh() async {
    setState(() {
      _isRefreshing = true;
    });
    
    final socialProvider = context.read<SocialProvider>();
    await socialProvider.loadPosts(refresh: true);
    
    setState(() {
      _isRefreshing = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(
                Icons.style,
                size: 18,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'Fashion Feed',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Implement search
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // TODO: Implement notifications
            },
          ),
        ],
      ),
      body: Consumer2<SocialProvider, AuthProvider>(
        builder: (context, socialProvider, authProvider, child) {
          if (socialProvider.isLoading && socialProvider.posts.isEmpty) {
            return const LoadingWidget();
          }

          if (socialProvider.errorMessage != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: Theme.of(context).errorColor,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Something went wrong',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    socialProvider.errorMessage!,
                    style: Theme.of(context).textTheme.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _refresh,
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            );
          }

          if (socialProvider.posts.isEmpty) {
            return const EmptyStateWidget(
              icon: Icons.style_outlined,
              title: 'No Posts Yet',
              subtitle: 'Be the first to share your fashion style!',
            );
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: AnimationLimiter(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: socialProvider.posts.length + 
                    (socialProvider.hasMorePosts ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == socialProvider.posts.length) {
                    return const Padding(
                      padding: EdgeInsets.all(16),
                      child: Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }

                  final post = socialProvider.posts[index];
                  return AnimationConfiguration.staggeredList(
                    position: index,
                    duration: const Duration(milliseconds: 375),
                    child: SlideAnimation(
                      verticalOffset: 50.0,
                      child: FadeInAnimation(
                        child: PostCard(
                          post: post,
                          currentUserId: authProvider.user?.uid ?? '',
                          onLike: () => socialProvider.likePost(post.id, authProvider.user?.uid ?? ''),
                          onUnlike: () => socialProvider.unlikePost(post.id, authProvider.user?.uid ?? ''),
                          onHeart: () => socialProvider.heartPost(post.id, authProvider.user?.uid ?? ''),
                          onShare: () => socialProvider.sharePost(post.id, authProvider.user?.uid ?? ''),
                          onComment: () {
                            // TODO: Navigate to comments
                          },
                          onUserTap: () {
                            if (post.user != null) {
                              context.go('/profile/${post.user!.id}');
                            }
                          },
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
}