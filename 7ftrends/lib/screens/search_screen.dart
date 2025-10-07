import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/feed_service.dart';
import '../services/auth_service.dart';
import '../widgets/user_card.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  List<dynamic> _searchResults = [];
  bool _isSearching = false;
  String _currentSearch = '';

  @override
  void initState() {
    super.initState();
    _searchFocusNode.requestFocus();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  Future<void> _performSearch(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _searchResults.clear();
        _currentSearch = '';
      });
      return;
    }

    setState(() {
      _isSearching = true;
      _currentSearch = query;
    });

    try {
      final feedService = FeedService();
      
      // Search for users and posts
      final users = await feedService.searchUsers(query);
      final posts = await feedService.searchPosts(query);

      setState(() {
        _searchResults = [
          {'type': 'users', 'data': users},
          {'type': 'posts', 'data': posts},
        ];
        _isSearching = false;
      });
    } catch (e) {
      setState(() {
        _searchResults.clear();
        _isSearching = false;
      });
    }
  }

  void _onSearchChanged(String value) {
    Future.delayed(const Duration(milliseconds: 500), () {
      if (_searchController.text == value) {
        _performSearch(value);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          focusNode: _searchFocusNode,
          onChanged: _onSearchChanged,
          decoration: InputDecoration(
            hintText: 'Search users, hashtags, posts...',
            border: InputBorder.none,
            hintStyle: TextStyle(
              color: Colors.grey[600],
            ),
          ),
          style: const TextStyle(fontSize: 16),
        ),
        actions: [
          if (_currentSearch.isNotEmpty)
            IconButton(
              onPressed: () {
                _searchController.clear();
                setState(() {
                  _searchResults.clear();
                  _currentSearch = '';
                });
              },
              icon: const Icon(Icons.clear),
            ),
        ],
      ),
      body: _isSearching
          ? const Center(child: CircularProgressIndicator())
          : _currentSearch.isEmpty
              ? _buildSearchSuggestions()
              : _buildSearchResults(),
    );
  }

  Widget _buildSearchSuggestions() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Trending',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              '#SummerStyle',
              '#StreetFashion',
              '#OOTD',
              '#FashionInspo',
              '#Trendy',
              '#StyleGoals',
              '#FashionBlogger',
              '#LookGood',
            ].map((tag) {
              return ActionChip(
                label: Text(tag),
                onPressed: () {
                  _searchController.text = tag;
                  _performSearch(tag);
                },
                backgroundColor: const Color(0xFF7C4DFF).withOpacity(0.1),
              );
            }).toList(),
          ),
          const SizedBox(height: 32),
          const Text(
            'Suggested Users',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          // Add suggested users here
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    if (_searchResults.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search_off, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'No results found',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _searchResults.length,
      itemBuilder: (context, index) {
        final result = _searchResults[index];
        final type = result['type'] as String;
        final data = result['data'] as List;

        if (data.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (type == 'users') ...[
              const Text(
                'Users',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              ...data.map((user) {
                return UserCard(
                  user: user,
                  onFollow: () => _followUser(user.id),
                  onUnfollow: () => _unfollowUser(user.id),
                );
              }).toList(),
            ],
            if (type == 'posts') ...[
              const SizedBox(height: 16),
              const Text(
                'Posts',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              // Add post results here
            ],
            const SizedBox(height: 16),
          ],
        );
      },
    );
  }

  Future<void> _followUser(String userId) async {
    final feedService = FeedService();
    await feedService.followUser(userId);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('User followed')),
    );
  }

  Future<void> _unfollowUser(String userId) async {
    final feedService = FeedService();
    await feedService.unfollowUser(userId);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('User unfollowed')),
    );
  }
}