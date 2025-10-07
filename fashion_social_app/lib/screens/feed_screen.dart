import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../providers/theme_provider.dart';
import '../providers/social_provider.dart';
import '../widgets/post_card.dart';
import '../widgets/gradient_text.dart';
import '../themes/app_theme.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

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
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    final socialProvider = Provider.of<SocialProvider>(context, listen: false);
    await socialProvider.loadPosts();
  }

  Future<void> _refreshPosts() async {
    setState(() {
      _isRefreshing = true;
    });
    
    await _loadPosts();
    
    setState(() {
      _isRefreshing = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final socialProvider = Provider.of<SocialProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return Scaffold(
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // App Header
          SliverAppBar(
            floating: true,
            snap: true,
            backgroundColor: isDark ? AppTheme.darkBackground : Colors.white,
            elevation: 0,
            title: GradientText(
              'Fashion Feed',
              gradient: AppTheme.primaryGradient,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            centerTitle: true,
            actions: [
              IconButton(
                icon: Icon(
                  Icons.notifications_outlined,
                  color: themeProvider.textColor,
                ),
                onPressed: () {
                  // TODO: Open notifications
                },
              ),
              IconButton(
                icon: Icon(
                  Icons.search,
                  color: themeProvider.textColor,
                ),
                onPressed: () {
                  // TODO: Open search
                },
              ),
            ],
          ),

          // Stories Section
          SliverToBoxAdapter(
            child: Container(
              height: 100,
              margin: const EdgeInsets.symmetric(vertical: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: 8,
                itemBuilder: (context, index) {
                  return Container(
                    width: 70,
                    margin: const EdgeInsets.only(right: 12),
                    child: Column(
                      children: [
                        Container(
                          width: 65,
                          height: 65,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: AppTheme.primaryGradient,
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(2),
                            child: Container(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isDark ? AppTheme.cardDark : Colors.white,
                              ),
                              child: CircleAvatar(
                                radius: 30,
                                backgroundImage: CachedNetworkImageProvider(
                                  'https://picsum.photos/100/100?random=${index + 200}',
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          index == 0 ? 'Your Story' : 'User${index}',
                          style: TextStyle(
                            fontSize: 11,
                            color: themeProvider.textColor,
                            fontWeight: index == 0 ? FontWeight.w600 : FontWeight.normal,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),

          // Posts Feed
          if (socialProvider.isLoading && socialProvider.posts.isEmpty)
            const SliverFillRemaining(
              child: Center(
                child: CircularProgressIndicator(
                  color: AppTheme.accentColor,
                ),
              ),
            )
          else if (socialProvider.posts.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.style,
                      size: 64,
                      color: Colors.grey[400],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No posts yet',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Be the first to share your fashion!',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final post = socialProvider.posts[index];
                  return PostCard(
                    post: post,
                    onLike: () => socialProvider.likePost(post.id),
                    onHeart: () => socialProvider.heartPost(post.id),
                    onShare: () => socialProvider.sharePost(post.id),
                    onComment: () {
                      // TODO: Open comments
                    },
                  );
                },
                childCount: socialProvider.posts.length,
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Create new post
        },
        backgroundColor: AppTheme.accentColor,
        child: const Icon(
          Icons.add,
          color: Colors.white,
        ),
      ),
    );
  }
}