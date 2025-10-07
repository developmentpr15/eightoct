import 'package:flutter/material.dart';
import '../../themes/app_theme.dart';

class CameraScreen extends StatefulWidget {
  final String mode;
  const CameraScreen({Key? key, required this.mode}) : super(key: key);

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.mode == 'post' ? 'Create Post' : 'Add to Wardrobe'),
      ),
      body: Center(
        child: Text('Camera Screen (${widget.mode}) - Coming Soon'),
      ),
    );
  }
}