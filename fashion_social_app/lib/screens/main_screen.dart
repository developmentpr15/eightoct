import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../app/providers/auth_provider.dart';
import '../app/providers/theme_provider.dart';
import '../themes/app_theme.dart';
import '../widgets/bottom_navigation.dart';
import 'feed/feed_screen.dart';
import 'wardrobe/wardrobe_screen.dart';
import 'competition/competition_list_screen.dart';
import 'profile/profile_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    const FeedScreen(),
    const WardrobeScreen(),
    const CompetitionListScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final themeProvider = context.watch<ThemeProvider>();
    
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: CustomBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton.extended(
              onPressed: () {
                context.go('/camera?mode=post');
              },
              backgroundColor: AppTheme.accentColor,
              foregroundColor: Colors.white,
              icon: const Icon(Icons.camera_alt),
              label: const Text('Create'),
              elevation: 4,
            )
          : _currentIndex == 1
              ? FloatingActionButton.extended(
                  onPressed: () {
                    context.go('/camera?mode=wardrobe');
                  },
                  backgroundColor: AppTheme.accentColor,
                  foregroundColor: Colors.white,
                  icon: const Icon(Icons.add_a_photo),
                  label: const Text('Add Item'),
                  elevation: 4,
                )
              : null,
    );
  }
}