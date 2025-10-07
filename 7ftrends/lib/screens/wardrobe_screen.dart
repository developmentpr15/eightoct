import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/wardrobe_service.dart';
import '../models/wardrobe_item.dart';
import '../widgets/wardrobe_item_card.dart';
import '../widgets/loading_widget.dart';
import 'add_wardrobe_item_screen.dart';

class WardrobeScreen extends StatefulWidget {
  const WardrobeScreen({super.key});

  @override
  State<WardrobeScreen> createState() => _WardrobeScreenState();
}

class _WardrobeScreenState extends State<WardrobeScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final List<ClothingCategory> _categories = ClothingCategory.values;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _categories.length, vsync: this);
    _loadWardrobe();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadWardrobe() async {
    final wardrobeProvider = Provider.of<WardrobeProvider>(context, listen: false);
    await wardrobeProvider.loadWardrobeItems();
  }

  void _navigateToAddItem(ClothingCategory category) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => AddWardrobeItemScreen(category: category),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Wardrobe'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: _categories.map((category) {
            return Tab(text: category.name.toUpperCase());
          }).toList(),
        ),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'add_item') {
                _navigateToAddItem(ClothingCategory.tops);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'add_item',
                child: Row(
                  children: [
                    Icon(Icons.add),
                    SizedBox(width: 8),
                    Text('Add Item'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Consumer<WardrobeProvider>(
        builder: (context, wardrobeProvider, child) {
          if (wardrobeProvider.isLoading && wardrobeProvider.items.isEmpty) {
            return const LoadingWidget();
          }

          return TabBarView(
            controller: _tabController,
            children: _categories.map((category) {
              final categoryItems = wardrobeProvider.items
                  .where((item) => item.category == category)
                  .toList();

              if (categoryItems.isEmpty) {
                return _buildEmptyState(category);
              }

              return GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 0.75,
                ),
                itemCount: categoryItems.length,
                itemBuilder: (context, index) {
                  final item = categoryItems[index];
                  return WardrobeItemCard(
                    item: item,
                    onTap: () => _viewItemDetails(item),
                    onFavorite: () => _toggleFavorite(item),
                    onDelete: () => _deleteItem(item),
                  );
                },
              );
            }).toList(),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _navigateToAddItem(ClothingCategory.tops),
        backgroundColor: const Color(0xFF7C4DFF),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildEmptyState(ClothingCategory category) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            _getCategoryIcon(category),
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            'No ${category.name} yet',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Add your first ${category.name.toLowerCase()} to get started',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => _navigateToAddItem(category),
            icon: const Icon(Icons.add),
            label: Text('Add ${category.name}'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7C4DFF),
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  IconData _getCategoryIcon(ClothingCategory category) {
    switch (category) {
      case ClothingCategory.tops:
        return Icons.checkroom;
      case ClothingCategory.bottoms:
        return Icons.style;
      case ClothingCategory.outerwear:
        return Icons.layers;
      case ClothingCategory.shoes:
        return Icons.footprint;
      case ClothingCategory.accessories:
        return Icons.watch;
      case ClothingCategory.innerwear:
        return Icons.inventory_2;
      case ClothingCategory.bags:
        return Icons.shopping_bag;
      case ClothingCategory.hats:
        return Icons.face;
      case ClothingCategory.jewelry:
        return Icons.diamond;
      case ClothingCategory.other:
        return Icons.category;
    }
  }

  void _viewItemDetails(WardrobeItem item) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => WardrobeItemDetailScreen(item: item),
      ),
    );
  }

  Future<void> _toggleFavorite(WardrobeItem item) async {
    final wardrobeProvider = Provider.of<WardrobeProvider>(context, listen: false);
    await wardrobeProvider.toggleFavorite(item.id);
  }

  Future<void> _deleteItem(WardrobeItem item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Item'),
        content: Text('Are you sure you want to delete ${item.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final wardrobeProvider = Provider.of<WardrobeProvider>(context, listen: false);
      await wardrobeProvider.deleteWardrobeItem(item.id);
    }
  }
}