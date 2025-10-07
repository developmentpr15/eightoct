import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/gradient_text.dart';
import '../widgets/custom_button.dart';
import '../themes/app_theme.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final isDark = themeProvider.isDarkMode;
    final user = authProvider.user;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Profile Header
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: isDark ? AppTheme.luxuryGradient : AppTheme.primaryGradient,
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        const SizedBox(height: 40),
                        
                        // Profile Picture
                        Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 3),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: CircleAvatar(
                            radius: 47,
                            backgroundImage: user?.avatarUrl != null
                                ? NetworkImage(user!.avatarUrl!)
                                : null,
                            child: user?.avatarUrl == null
                                ? Icon(
                                    Icons.person,
                                    size: 40,
                                    color: Colors.grey[400],
                                  )
                                : null,
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Username
                        GradientText(
                          user?.username ?? 'Fashion User',
                          gradient: AppTheme.goldGradient,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 4),

                        // Full Name
                        Text(
                          user?.fullName ?? '',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.white.withOpacity(0.9),
                            fontWeight: FontWeight.w300,
                          ),
                        ),

                        const SizedBox(height: 8),

                        // Bio
                        if (user?.bio != null)
                          Text(
                            user!.bio!,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.8),
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),

                        const SizedBox(height: 16),

                        // Stats
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _buildStatItem('Posts', '42'),
                            _buildStatItem('Followers', '1.2K'),
                            _buildStatItem('Following', '843'),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: Icon(
                  Icons.settings,
                  color: Colors.white,
                ),
                onPressed: () {
                  // TODO: Open settings
                },
              ),
            ],
          ),

          // Tab Bar
          SliverPersistentHeader(
            delegate: _SliverTabBarDelegate(
              TabBar(
                controller: _tabController,
                labelColor: AppTheme.accentColor,
                unselectedLabelColor: Colors.grey,
                indicatorColor: AppTheme.accentColor,
                indicatorWeight: 3,
                tabs: const [
                  Tab(text: 'Posts'),
                  Tab(text: 'About'),
                  Tab(text: 'Achievements'),
                ],
              ),
            ),
            pinned: true,
          ),

          // Tab Content
          SliverFillRemaining(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildPostsTab(isDark),
                _buildAboutTab(user, isDark),
                _buildAchievementsTab(isDark),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.white.withOpacity(0.8),
          ),
        ),
      ],
    );
  }

  Widget _buildPostsTab(bool isDark) {
    return GridView.builder(
      padding: const EdgeInsets.all(2),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 2,
        mainAxisSpacing: 2,
        childAspectRatio: 1,
      ),
      itemCount: 21,
      itemBuilder: (context, index) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.grey[300],
            borderRadius: BorderRadius.circular(4),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: Image.network(
              'https://picsum.photos/200/200?random=${index + 100}',
              fit: BoxFit.cover,
            ),
          ),
        );
      },
    );
  }

  Widget _buildAboutTab(user, bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Points Balance
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: AppTheme.goldGradient,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.goldColor.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.stars,
                  color: Colors.white,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Points Balance',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const Text(
                      '2,450',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                CustomButton(
                  text: 'Redeem',
                  onPressed: () {
                    // TODO: Open rewards store
                  },
                  color: Colors.white,
                  textStyle: const TextStyle(
                    color: AppTheme.primaryColor,
                    fontWeight: FontWeight.w600,
                  ),
                  height: 36,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Profile Information
          Text(
            'Profile Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 16),

          _buildInfoRow('Email', user?.email ?? '', isDark),
          _buildInfoRow('Phone', user?.phone ?? 'Not set', isDark),
          _buildInfoRow('Gender', user?.gender ?? 'Not set', isDark),
          _buildInfoRow('Member Since', _formatDate(user?.createdAt), isDark),

          const SizedBox(height: 24),

          // Style Preferences
          Text(
            'Style Preferences',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : AppTheme.primaryColor,
            ),
          ),
          const SizedBox(height: 16),

          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              'Casual', 'Formal', 'Streetwear', 'Vintage', 'Minimalist'
            ].map((style) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.accentColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.accentColor.withOpacity(0.3)),
                ),
                child: Text(
                  style,
                  style: TextStyle(
                    color: AppTheme.accentColor,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: 24),

          // Actions
          CustomButton(
            text: 'Edit Profile',
            onPressed: () {
              // TODO: Edit profile
            },
            gradient: AppTheme.primaryGradient,
          ),

          const SizedBox(height: 12),

          CustomButton(
            text: 'Share Profile',
            onPressed: () {
              // TODO: Share profile
            },
            color: isDark ? AppTheme.cardDark : Colors.white,
            textStyle: TextStyle(
              color: AppTheme.accentColor,
              fontWeight: FontWeight.w600,
            ),
          ),

          const SizedBox(height: 12),

          CustomButton(
            text: 'Sign Out',
            onPressed: () {
              final authProvider = Provider.of<AuthProvider>(context, listen: false);
              authProvider.signOut();
              Navigator.of(context).pushReplacementNamed('/login');
            },
            color: AppTheme.errorColor,
          ),
        ],
      ),
    );
  }

  Widget _buildAchievementsTab(bool isDark) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.8,
      ),
      itemCount: 6,
      itemBuilder: (context, index) {
        return _buildAchievementCard(index, isDark);
      },
    );
  }

  Widget _buildAchievementCard(int index, bool isDark) {
    final achievements = [
      {'title': 'Trendsetter', 'description': 'Post 10 outfits', 'icon': Icons.trending_up, 'unlocked': true},
      {'title': 'Social Butterfly', 'description': 'Get 100 likes', 'icon': Icons.favorite, 'unlocked': true},
      {'title': 'Competition Winner', 'description': 'Win a competition', 'icon': Icons.emoji_events, 'unlocked': false},
      {'title': 'Style Guru', 'description': 'Help 50 users', 'icon': Icons.psychology, 'unlocked': false},
      {'title': 'Early Bird', 'description': 'Login 7 days in a row', 'icon': Icons.wb_sunny, 'unlocked': true},
      {'title': 'Fashion Icon', 'description': 'Reach 1000 followers', 'icon': Icons.star, 'unlocked': false},
    ];

    final achievement = achievements[index];
    final isUnlocked = achievement['unlocked'] as bool;

    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: isUnlocked ? AppTheme.goldGradient : null,
          color: isUnlocked ? null : Colors.grey[200],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                achievement['icon'] as IconData,
                size: 40,
                color: isUnlocked ? Colors.white : Colors.grey[600],
              ),
              const SizedBox(height: 12),
              Text(
                achievement['title'] as String,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: isUnlocked ? Colors.white : Colors.grey[700],
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                achievement['description'] as String,
                style: TextStyle(
                  fontSize: 10,
                  color: isUnlocked ? Colors.white.withOpacity(0.9) : Colors.grey[600],
                  textAlign: TextAlign.center,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize: 14,
                color: isDark ? Colors.white : AppTheme.primaryColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'Unknown';
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;

  _SliverTabBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;

  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(
      color: Theme.of(context).scaffoldBackgroundColor,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverTabBarDelegate oldDelegate) {
    return false;
  }
}