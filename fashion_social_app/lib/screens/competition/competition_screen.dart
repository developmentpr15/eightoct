import 'package:flutter/material.dart';
import '../../themes/app_theme.dart';

class CompetitionScreen extends StatefulWidget {
  final String competitionId;
  const CompetitionScreen({Key? key, required this.competitionId}) : super(key: key);

  @override
  State<CompetitionScreen> createState() => _CompetitionScreenState();
}

class _CompetitionScreenState extends State<CompetitionScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Competition Details'),
      ),
      body: Center(
        child: Text('Competition: ${widget.competitionId} - Coming Soon'),
      ),
    );
  }
}