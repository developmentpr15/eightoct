import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'app/app.dart';
import 'app/providers/theme_provider.dart';
import 'app/providers/auth_provider.dart';
import 'app/providers/wardrobe_provider.dart';
import 'app/providers/social_provider.dart';
import 'app/providers/competition_provider.dart';
import 'themes/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Mock Firebase initialization for demo
  print('🚀 Fashion Social App Demo');
  print('==========================');
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => WardrobeProvider()),
        ChangeNotifierProvider(create: (_) => SocialProvider()),
        ChangeNotifierProvider(create: (_) => CompetitionProvider()),
      ],
      child: const FashionSocialDemoApp(),
    ),
  );
}

class FashionSocialDemoApp extends StatelessWidget {
  const FashionSocialDemoApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp(
          title: 'Fashion Social App Demo',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeProvider.themeMode,
          home: const DemoScreen(),
        );
      },
    );
  }
}

class DemoScreen extends StatefulWidget {
  const DemoScreen({Key? key}) : super(key: key);

  @override
  State<DemoScreen> createState() => _DemoScreenState();
}

class _DemoScreenState extends State<DemoScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
    _animationController.forward();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: AnimatedBuilder(
        animation: _fadeAnimation,
        builder: (context, child) {
          return FadeTransition(
            opacity: _fadeAnimation,
            child: Column(
              children: [
                // Header
                Container(
                  decoration: BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                  ),
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(
                                  Icons.style,
                                  color: AppTheme.accentColor,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Fashion Social',
                                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      'Premium Fashion Experience',
                                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        color: Colors.white.withOpacity(0.9),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Consumer<ThemeProvider>(
                                builder: (context, themeProvider, child) {
                                  return IconButton(
                                    icon: Icon(
                                      themeProvider.isDarkMode 
                                          ? Icons.light_mode 
                                          : Icons.dark_mode,
                                      color: Colors.white,
                                    ),
                                    onPressed: () => themeProvider.toggleTheme(),
                                  );
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          TabBar(
                            controller: _tabController,
                            indicatorColor: Colors.white,
                            labelColor: Colors.white,
                            unselectedLabelColor: Colors.white.withOpacity(0.7),
                            tabs: const [
                              Tab(text: 'Features'),
                              Tab(text: 'Design'),
                              Tab(text: 'Tech Stack'),
                              Tab(text: 'Architecture'),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                
                // Content
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: const [
                      FeaturesTab(),
                      DesignTab(),
                      TechStackTab(),
                      ArchitectureTab(),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class FeaturesTab extends StatelessWidget {
  const FeaturesTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final features = [
      {
        'icon': Icons.feed,
        'title': 'Social Feed',
        'description': 'Share your fashion style with likes, comments, and hearts',
        'color': AppTheme.accentColor,
      },
      {
        'icon': Icons.wardrobe,
        'title': 'Digital Wardrobe',
        'description': 'Organize your clothes with AI-powered tagging',
        'color': AppTheme.secondaryColor,
      },
      {
        'icon': Icons.emoji_events,
        'title': 'Fashion Competitions',
        'description': 'Participate in daily, weekly, and brand-sponsored contests',
        'color': AppTheme.goldColor,
      },
      {
        'icon': Icons.camera_alt,
        'title': 'AR Try-On',
        'description': 'Virtual fitting room with augmented reality',
        'color': AppTheme.infoColor,
      },
      {
        'icon': Icons.wb_sunny,
        'title': 'Weather Integration',
        'description': 'Smart outfit suggestions based on weather conditions',
        'color': AppTheme.warningColor,
      },
      {
        'icon': Icons.stars,
        'title': 'Points System',
        'description': 'Gamification with rewards and achievements',
        'color': AppTheme.successColor,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: features.length,
      itemBuilder: (context, index) {
        final feature = features[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: ListTile(
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: (feature['color'] as Color).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                feature['icon'] as IconData,
                color: feature['color'] as Color,
                size: 24,
              ),
            ),
            title: Text(
              feature['title'] as String,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(
                feature['description'] as String,
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
          ),
        );
      },
    );
  }
}

class DesignTab extends StatelessWidget {
  const DesignTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildDesignSection(
            context,
            'Modern UI/UX',
            'Clean, premium design with smooth animations and micro-interactions',
            Icons.palette,
            AppTheme.accentColor,
          ),
          const SizedBox(height: 16),
          _buildDesignSection(
            context,
            'Dark & Light Themes',
            'Full theme support with automatic system detection',
            Icons.dark_mode,
            AppTheme.secondaryColor,
          ),
          const SizedBox(height: 16),
          _buildDesignSection(
            context,
            'Responsive Design',
            'Optimized for all screen sizes and orientations',
            Icons.smartphone,
            AppTheme.infoColor,
          ),
          const SizedBox(height: 16),
          _buildDesignSection(
            context,
            'Premium Typography',
            'Poppins font family with proper hierarchy',
            Icons.text_fields,
            AppTheme.goldColor,
          ),
          const SizedBox(height: 16),
          _buildDesignSection(
            context,
            'Smooth Animations',
            '60fps animations with Flutter\'s performance',
            Icons.animation,
            AppTheme.successColor,
          ),
        ],
      ),
    );
  }

  Widget _buildDesignSection(
    BuildContext context,
    String title,
    String description,
    IconData icon,
    Color color,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 30),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TechStackTab extends StatelessWidget {
  const TechStackTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final technologies = [
      'Flutter 3.x - Cross-platform development',
      'Dart - Modern programming language',
      'Provider - State management',
      'Firebase Auth - Authentication',
      'Cloud Firestore - Database',
      'Firebase Storage - File storage',
      'Google ML Kit - Image recognition',
      'AR Flutter Plugin - Augmented reality',
      'Google Fonts - Typography',
      'Lottie - Complex animations',
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: technologies.length,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppTheme.accentColor.withOpacity(0.1),
              child: Text(
                '${index + 1}',
                style: TextStyle(
                  color: AppTheme.accentColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            title: Text(technologies[index]),
          ),
        );
      },
    );
  }
}

class ArchitectureTab extends StatelessWidget {
  const ArchitectureTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Project Architecture',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          _buildArchitectureItem(
            context,
            'Clean Architecture',
            'Separation of concerns with proper layering',
          ),
          _buildArchitectureItem(
            context,
            'Provider Pattern',
            'Efficient state management with dependency injection',
          ),
          _buildArchitectureItem(
            context,
            'Service Layer',
            'Business logic separated from UI components',
          ),
          _buildArchitectureItem(
            context,
            'Repository Pattern',
            'Data access abstraction for better testability',
          ),
          _buildArchitectureItem(
            context,
            'Modular Design',
            'Feature-based code organization',
          ),
          const SizedBox(height: 24),
          Text(
            'Key Principles',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          _buildPrincipleItem(context, 'SOLID Principles'),
          _buildPrincipleItem(context, 'DRY (Don\'t Repeat Yourself)'),
          _buildPrincipleItem(context, 'KISS (Keep It Simple, Stupid)'),
          _buildPrincipleItem(context, 'Test-Driven Development'),
        ],
      ),
    );
  }

  Widget _buildArchitectureItem(BuildContext context, String title, String description) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppTheme.accentColor,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              description,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrincipleItem(BuildContext context, String principle) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            Icons.check_circle,
            color: AppTheme.successColor,
            size: 20,
          ),
          const SizedBox(width: 8),
          Text(
            principle,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }
}