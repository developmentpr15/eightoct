import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/competition.dart';

class CompetitionService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<List<Competition>> getCompetitions() async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('competitions')
          .orderBy('created_at', descending: true)
          .get();

      final List<Competition> competitions = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final competitionData = doc.data() as Map<String, dynamic>;
        competitionData['id'] = doc.id;
        competitions.add(Competition.fromJson(competitionData));
      }

      return competitions;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<List<CompetitionEntry>> getCompetitionEntries(String competitionId) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('competition_entries')
          .where('competition_id', isEqualTo: competitionId)
          .orderBy('hearts_count', descending: true)
          .get();

      final List<CompetitionEntry> entries = [];
      for (final DocumentSnapshot doc in snapshot.docs) {
        final entryData = doc.data() as Map<String, dynamic>;
        entryData['id'] = doc.id;
        entries.add(CompetitionEntry.fromJson(entryData));
      }

      return entries;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<CompetitionEntry?> enterCompetition({
    required String competitionId,
    required String postId,
    required String userId,
  }) async {
    try {
      final entryData = {
        'competition_id': competitionId,
        'post_id': postId,
        'user_id': userId,
        'hearts_count': 0,
        'is_winner': false,
        'created_at': DateTime.now().toIso8601String(),
      };

      final DocumentReference docRef = await _firestore.collection('competition_entries').add(entryData);
      
      // Update competition entries count
      await _firestore.collection('competitions').doc(competitionId).update({
        'entries_count': FieldValue.increment(1),
      });

      final entryDataWithId = Map<String, dynamic>.from(entryData);
      entryDataWithId['id'] = docRef.id;

      return CompetitionEntry.fromJson(entryDataWithId);
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<void> voteForEntry(String entryId, String userId) async {
    try {
      await _firestore.collection('votes').add({
        'competition_entry_id': entryId,
        'user_id': userId,
        'created_at': DateTime.now().toIso8601String(),
      });

      await _firestore.collection('competition_entries').doc(entryId).update({
        'hearts_count': FieldValue.increment(1),
      });
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<bool> canUserEnter(String competitionId, String userId) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('competition_entries')
          .where('competition_id', isEqualTo: competitionId)
          .where('user_id', isEqualTo: userId)
          .get();

      final competitionDoc = await _firestore.collection('competitions').doc(competitionId).get();
      final competition = Competition.fromJson(competitionDoc.data() as Map<String, dynamic>);
      
      final maxEntries = competition.maxEntriesPerUser ?? 3;
      return snapshot.docs.length < maxEntries;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  Future<int> getUserEntriesCount(String competitionId, String userId) async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('competition_entries')
          .where('competition_id', isEqualTo: competitionId)
          .where('user_id', isEqualTo: userId)
          .get();

      return snapshot.docs.length;
    } catch (e) {
      throw Exception(e.toString());
    }
  }
}