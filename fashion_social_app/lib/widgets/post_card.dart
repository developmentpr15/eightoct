import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/post.dart';
import '../providers/theme_provider.dart';
import '../themes/app_theme.dart';

class PostCard extends StatefulWidget {
  final Post post;
  final VoidCallback onLike;
  final VoidCallback onHeart;
  final VoidCallback onShare;
  final VoidCallback onComment;

  const PostCard({
    super.key,
    required this.post,
    required this.onLike,
    required this.onHeart,
    required this.onShare,
    required this.onComment,
  });

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard>
    with TickerProviderStateMixin {
  late AnimationController _likeController;
  late AnimationController _heartController;
  late Animation<double> _likeAnimation;
  late Animation<double> _heartAnimation;

  bool _isLiked = false;
  bool _isHearted = false;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
  }

  void _initializeAnimations() {
    _likeController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _heartController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _likeAnimation = Tween<double>(
      begin: 1.0,
      end: 1.3,
    ).animate(CurvedAnimation(
      parent: _likeController,
      curve: Curves.elasticOut,
    ));

    _heartAnimation = Tween<double>(
      begin: 1.0,
      end: 1.3,
    ).animate(CurvedAnimation(
      parent: _heartController,
      curve: Curves.elasticOut,
    ));
  }

  @override
  void dispose() {
    _likeController.dispose();
    _heartController.dispose();
    super.dispose();
  }

  void _handleLike() {
    setState(() {
      _isLiked = !_isLiked;
    });

    _likeController.forward().then((_) {
      _likeController.reverse();
    });

    widget.onLike();
  }

  void _handleHeart() {
    setState(() {
      _isHearted = !_isHearted;
    });

    _heartController.forward().then((_) {
      _heartController.reverse();
    });

    widget.onHeart();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDark = themeProvider.isDarkMode;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // User Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: widget.post.user?.avatarUrl != null
                      ? CachedNetworkImageProvider(widget.post.user!.avatarUrl!)
                      : null,
                  child: widget.post.user?.avatarUrl == null
                      ? const Icon(Icons.person)
                      : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            widget.post.user?.username ?? 'Unknown',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: themeProvider.textColor,
                            ),
                          ),
                          if (widget.post.user?.isVerified == true) ...[
                            const SizedBox(width: 4),
                            Icon(
                              Icons.verified,
                              size: 14,
                              color: AppTheme.accentColor,
                            ),
                          ],
                        ],
                      ),
                      if (widget.post.location != null)
                        Text(
                          widget.post.location!,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(
                    Icons.more_horiz,
                    color: themeProvider.textColor,
                  ),
                  onPressed: () {
                    // TODO: Show post options
                  },
                ),
              ],
            ),
          ),

          // Image
          if (widget.post.images.isNotEmpty)
            CachedNetworkImage(
              imageUrl: widget.post.images.first,
              width: double.infinity,
              height: 400,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                height: 400,
                color: Colors.grey[200],
                child: const Center(
                  child: CircularProgressIndicator(),
                ),
              ),
              errorWidget: (context, url, error) => Container(
                height: 400,
                color: Colors.grey[200],
                child: const Icon(Icons.error),
              ),
            ),

          // Actions
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Action Buttons
                Row(
                  children: [
                    AnimatedBuilder(
                      animation: _likeAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _isLiked ? _likeAnimation.value : 1.0,
                          child: IconButton(
                            icon: Icon(
                              _isLiked ? Icons.favorite : Icons.favorite_border,
                              color: _isLiked ? AppTheme.accentColor : themeProvider.textColor,
                            ),
                            onPressed: _handleLike,
                          ),
                        );
                      },
                    ),
                    AnimatedBuilder(
                      animation: _heartAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _isHearted ? _heartAnimation.value : 1.0,
                          child: IconButton(
                            icon: Icon(
                              _isHearted ? Icons.favorite : Icons.favorite_border,
                              color: _isHearted ? Colors.red : themeProvider.textColor,
                            ),
                            onPressed: _handleHeart,
                          ),
                        );
                      },
                    ),
                    IconButton(
                      icon: Icon(
                        Icons.chat_bubble_outline,
                        color: themeProvider.textColor,
                      ),
                      onPressed: widget.onComment,
                    ),
                    IconButton(
                      icon: Icon(
                        Icons.send,
                        color: themeProvider.textColor,
                      ),
                      onPressed: widget.onShare,
                    ),
                    const Spacer(),
                    IconButton(
                      icon: Icon(
                        Icons.bookmark_border,
                        color: themeProvider.textColor,
                      ),
                      onPressed: () {
                        // TODO: Save post
                      },
                    ),
                  ],
                ),

                // Likes Count
                Text(
                  '${widget.post.likesCount + (_isLiked ? 1 : 0)} likes',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: themeProvider.textColor,
                  ),
                ),

                const SizedBox(height: 8),

                // Caption
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: widget.post.user?.username ?? 'Unknown',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: themeProvider.textColor,
                        ),
                      ),
                      const TextSpan(text: ' '),
                      TextSpan(
                        text: widget.post.caption,
                        style: TextStyle(
                          fontSize: 14,
                          color: themeProvider.textColor,
                        ),
                      ),
                    ],
                  ),
                ),

                // Hashtags
                if (widget.post.hashtags.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    children: widget.post.hashtags.map((hashtag) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.accentColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '#$hashtag',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.accentColor,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],

                const SizedBox(height: 8),

                // Comments Count
                if (widget.post.commentsCount > 0)
                  GestureDetector(
                    onTap: widget.onComment,
                    child: Text(
                      'View all ${widget.post.commentsCount} comments',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),

                const SizedBox(height: 4),

                // Time
                Text(
                  _formatTime(widget.post.createdAt),
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    }
  }
}