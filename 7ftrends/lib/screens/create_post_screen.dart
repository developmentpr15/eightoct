import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import '../services/feed_service.dart';
import '../services/auth_service.dart';
import '../widgets/loading_widget.dart';

class CreatePostScreen extends StatefulWidget {
  final List<XFile> images;

  const CreatePostScreen({super.key, required this.images});

  @override
  State<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final TextEditingController _captionController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  bool _isPosting = false;
  List<String> _hashtags = [];

  @override
  void dispose() {
    _captionController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  void _extractHashtags() {
    final text = _captionController.text;
    final regex = RegExp(r'#(\w+)');
    final matches = regex.allMatches(text);
    setState(() {
      _hashtags = matches.map((match) => match.group(0)!).toList();
    });
  }

  Future<void> _createPost() async {
    if (_captionController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add a caption')),
      );
      return;
    }

    setState(() {
      _isPosting = true;
    });

    try {
      // Convert images to URLs (in a real app, you'd upload to storage)
      final imageUrls = widget.images.map((image) => image.path).toList();

      final success = await Provider.of<FeedProvider>(context, listen: false)
          .createPost(
        caption: _captionController.text,
        images: imageUrls,
        hashtags: _hashtags,
        location: _locationController.text.trim().isEmpty
            ? null
            : _locationController.text,
      );

      if (success) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Post created successfully!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to create post')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() {
        _isPosting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Post'),
        actions: [
          TextButton(
            onPressed: _isPosting ? null : _createPost,
            child: _isPosting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Post'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User info
            Consumer<AuthProvider>(
              builder: (context, authProvider, child) {
                return Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundImage: authProvider.user?.avatarUrl != null
                          ? NetworkImage(authProvider.user!.avatarUrl!)
                          : null,
                      child: authProvider.user?.avatarUrl == null
                          ? Text(
                              authProvider.user?.fullName.substring(0, 1) ?? 'U',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            authProvider.user?.username ?? 'User',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 16),

            // Caption
            TextField(
              controller: _captionController,
              onChanged: (value) => _extractHashtags(),
              maxLines: 8,
              decoration: const InputDecoration(
                hintText: 'Share your fashion story...',
                border: InputBorder.none,
              ),
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),

            // Hashtags
            if (_hashtags.isNotEmpty) ...[
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: _hashtags.map((hashtag) {
                  return Chip(
                    label: Text(hashtag),
                    backgroundColor: const Color(0xFF7C4DFF).withOpacity(0.1),
                    deleteIcon: const Icon(Icons.close, size: 16),
                    onDeleted: () {
                      setState(() {
                        _hashtags.remove(hashtag);
                        _captionController.text = _captionController.text
                            .replaceAll(hashtag, '')
                            .replaceAll(RegExp(r'\s+'), ' ')
                            .trim();
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
            ],

            // Location
            TextField(
              controller: _locationController,
              decoration: InputDecoration(
                hintText: 'Add location',
                prefixIcon: const Icon(Icons.location_on_outlined),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Images
            SizedBox(
              height: 200,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: widget.images.length,
                itemBuilder: (context, index) {
                  return Container(
                    width: 150,
                    margin: const EdgeInsets.only(right: 8),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.file(
                        widget.images[index],
                        fit: BoxFit.cover,
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),

            // Additional options
            Row(
              children: [
                IconButton(
                  onPressed: () {
                    // Add more images
                  },
                  icon: const Icon(Icons.photo_library_outlined),
                ),
                IconButton(
                  onPressed: () {
                    // Add tag
                  },
                  icon: const Icon(Icons.tag_outlined),
                ),
                IconButton(
                  onPressed: () {
                    // Add emoji
                  },
                  icon: const Icon(Icons.emoji_emotions_outlined),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}