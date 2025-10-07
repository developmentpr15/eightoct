import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/competition_service.dart';
import '../models/competition.dart';
import '../widgets/competition_card.dart';
import '../widgets/loading_widget.dart';

class CompetitionScreen extends StatefulWidget {
  const CompetitionScreen({super.key});

  @override
  State<CompetitionScreen> createState() => _CompetitionScreenState();
}

class _CompetitionScreenState extends State<CompetitionScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadCompetitions();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadCompetitions() async {
    final competitionProvider = Provider.of<CompetitionProvider>(context, listen: false);
    await competitionProvider.loadCompetitions();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Competitions'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'ACTIVE'),
            Tab(text: 'UPCOMING'),
            Tab(text: 'COMPLETED'),
          ],
        ),
      ),
      body: Consumer<CompetitionProvider>(
        builder: (context, competitionProvider, child) {
          if (competitionProvider.isLoading && competitionProvider.competitions.isEmpty) {
            return const LoadingWidget();
          }

          return TabBarView(
            controller: _tabController,
            children: [
              _buildCompetitionList(competitionProvider.activeCompetitions),
              _buildCompetitionList(competitionProvider.upcomingCompetitions),
              _buildCompetitionList(competitionProvider.completedCompetitions),
            ],
          );
        },
      ),
    );
  }

  Widget _buildCompetitionList(List<Competition> competitions) {
    if (competitions.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.emoji_events_outlined,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              'No competitions yet',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Check back later for new fashion competitions',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[500],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: competitions.length,
      itemBuilder: (context, index) {
        final competition = competitions[index];
        return CompetitionCard(
          competition: competition,
          onTap: () => _viewCompetitionDetails(competition),
        );
      },
    );
  }

  void _viewCompetitionDetails(Competition competition) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => CompetitionDetailScreen(competition: competition),
      ),
    );
  }
}

class CompetitionDetailScreen extends StatefulWidget {
  final Competition competition;

  const CompetitionDetailScreen({super.key, required this.competition});

  @override
  State<CompetitionDetailScreen> createState() => _CompetitionDetailScreenState();
}

class _CompetitionDetailScreenState extends State<CompetitionDetailScreen> {
  @override
  void initState() {
    super.initState();
    _loadEntries();
  }

  Future<void> _loadEntries() async {
    final competitionProvider = Provider.of<CompetitionProvider>(context, listen: false);
    await competitionProvider.loadCompetitionEntries(widget.competition.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.competition.title),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner Image
            if (widget.competition.bannerImage != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  widget.competition.bannerImage!,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 200,
                      color: Colors.grey[200],
                      child: const Icon(Icons.image, color: Colors.grey),
                    );
                  },
                ),
              ),
            const SizedBox(height: 16),

            // Title and Status
            Row(
              children: [
                Expanded(
                  child: Text(
                    widget.competition.title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(widget.competition.status),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    widget.competition.status.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Description
            Text(
              widget.competition.description,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),

            // Hashtag
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF7C4DFF).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                widget.competition.hashtag,
                style: const TextStyle(
                  color: Color(0xFF7C4DFF),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Competition Details
            _buildDetailCard('Sponsor', widget.competition.sponsor ?? 'N/A'),
            _buildDetailCard('Prize', widget.competition.prizeDescription ?? 'N/A'),
            _buildDetailCard('Entries', '${widget.competition.entriesCount}'),
            _buildDetailCard('End Date', '${widget.competition.endDate.day}/${widget.competition.endDate.month}/${widget.competition.endDate.year}'),
            const SizedBox(height: 16),

            // Rules
            const Text(
              'Rules',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ...widget.competition.rules.map((rule) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('• ', style: TextStyle(fontWeight: FontWeight.bold)),
                    Expanded(child: Text(rule)),
                  ],
                ),
              );
            }),
            const SizedBox(height: 24),

            // Action Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: widget.competition.isActive
                    ? _enterCompetition
                    : widget.competition.isUpcoming
                        ? _notifyMe
                        : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF7C4DFF),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text(
                  widget.competition.isActive
                      ? 'Enter Competition'
                      : widget.competition.isUpcoming
                          ? 'Notify Me'
                          : 'Competition Ended',
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Entries
            const Text(
              'Entries',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Consumer<CompetitionProvider>(
              builder: (context, competitionProvider, child) {
                if (competitionProvider.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (competitionProvider.entries.isEmpty) {
                  return const Center(
                    child: Text('No entries yet. Be the first to enter!'),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: competitionProvider.entries.length,
                  itemBuilder: (context, index) {
                    final entry = competitionProvider.entries[index];
                    return CompetitionEntryCard(
                      entry: entry,
                      onVote: () => _voteForEntry(entry.id),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailCard(String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Text(
            '$label: ',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'active':
        return Colors.green;
      case 'upcoming':
        return Colors.blue;
      case 'completed':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  void _enterCompetition() {
    // Navigate to post creation with competition hashtag
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Create a post with the competition hashtag to enter!')),
    );
  }

  void _notifyMe() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('You will be notified when this competition starts!')),
    );
  }

  Future<void> _voteForEntry(String entryId) async {
    final competitionProvider = Provider.of<CompetitionProvider>(context, listen: false);
    await competitionProvider.voteForEntry(entryId);
  }
}

class CompetitionEntryCard extends StatelessWidget {
  final CompetitionEntry entry;
  final VoidCallback onVote;

  const CompetitionEntryCard({
    super.key,
    required this.entry,
    required this.onVote,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            // User Avatar
            CircleAvatar(
              radius: 20,
              backgroundImage: entry.userAvatar != null
                  ? NetworkImage(entry.userAvatar!)
                  : null,
              child: entry.userAvatar == null
                  ? Text(entry.username.substring(0, 1).toUpperCase())
                  : null,
            ),
            const SizedBox(width: 12),
            
            // User Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.username,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  if (entry.isWinner)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.amber,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'WINNER',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            
            // Hearts
            Column(
              children: [
                IconButton(
                  onPressed: onVote,
                  icon: const Icon(Icons.favorite, color: Colors.red),
                ),
                Text(
                  entry.heartsCount.toString(),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}