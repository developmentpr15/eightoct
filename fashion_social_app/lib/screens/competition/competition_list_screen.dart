import 'package:flutter/material.dart';
import '../../themes/app_theme.dart';

class CompetitionListScreen extends StatefulWidget {
  const CompetitionListScreen({Key? key}) : super(key: key);

  @override
  State<CompetitionListScreen> createState() => _CompetitionListScreenState();
}

class _CompetitionListScreenState extends State<CompetitionListScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fashion Competitions'),
      ),
      body: const Center(
        child: Text('Competitions Screen - Coming Soon'),
      ),
    );
  }
}