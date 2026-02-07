import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme/theme';

const DUMMY_LEADERBOARD = [
  { id: '1', username: 'alexa', xp: 2500, rank: 1, avatar: 'https://api.dicebear.com/7.x/bottts/png?seed=alexa' },
  { id: '2', username: 'jenna', xp: 2100, rank: 2, avatar: 'https://api.dicebear.com/7.x/bottts/png?seed=jenna' },
  { id: '3', username: 'lara', xp: 1850, rank: 3, avatar: 'https://api.dicebear.com/7.x/bottts/png?seed=lara' },
  { id: '4', username: 'coding_cat', xp: 1200, rank: 4, avatar: 'https://api.dicebear.com/7.x/bottts/png?seed=cat' },
  { id: '5', username: 'dev_guy', xp: 950, rank: 5, avatar: 'https://api.dicebear.com/7.x/bottts/png?seed=dev' },
];

export default function LeaderboardScreen() {
  const renderRankItem = ({ item }: { item: typeof DUMMY_LEADERBOARD[0] }) => (
    <View style={styles.rankRow}>
      <Text style={styles.rankNumber}>{item.rank}</Text>
      <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
      <Text style={styles.listUsername}>{item.username}</Text>
      <Text style={styles.listXP}>{item.xp} XP</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section with Podium */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>leaderboard</Text>
        
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          <View style={[styles.podiumSpot, { marginTop: 30 }]}>
            <Image source={{ uri: DUMMY_LEADERBOARD[1].avatar }} style={styles.podiumAvatar} />
            <Text style={styles.podiumName}>{DUMMY_LEADERBOARD[1].username}</Text>
            <View style={[styles.podiumBar, { height: 60, backgroundColor: '#A9BCC9' }]}>
              <Text style={styles.podiumRank}>2</Text>
            </View>
          </View>

          {/* 1st Place */}
          <View style={styles.podiumSpot}>
            <Ionicons name="trophy" size={24} color="#FFD700" style={{ marginBottom: 5 }} />
            <Image source={{ uri: DUMMY_LEADERBOARD[0].avatar }} style={[styles.podiumAvatar, { borderColor: '#FFD700', borderWidth: 3 }]} />
            <Text style={styles.podiumName}>{DUMMY_LEADERBOARD[0].username}</Text>
            <View style={[styles.podiumBar, { height: 90, backgroundColor: '#FFD700' }]}>
              <Text style={styles.podiumRank}>1</Text>
            </View>
          </View>

          {/* 3rd Place */}
          <View style={[styles.podiumSpot, { marginTop: 45 }]}>
            <Image source={{ uri: DUMMY_LEADERBOARD[2].avatar }} style={styles.podiumAvatar} />
            <Text style={styles.podiumName}>{DUMMY_LEADERBOARD[2].username}</Text>
            <View style={[styles.podiumBar, { height: 45, backgroundColor: '#CD7F32' }]}>
              <Text style={styles.podiumRank}>3</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Rankings List */}
      <FlatList
        data={DUMMY_LEADERBOARD.slice(3)}
        keyExtractor={(item) => item.id}
        renderItem={renderRankItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerCard: {
    backgroundColor: theme.colors.white,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { fontFamily: theme.fonts.main, fontSize: 28, color: theme.colors.navy, marginBottom: 20 },
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', width: '100%' },
  podiumSpot: { alignItems: 'center', marginHorizontal: 10 },
  podiumAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee', marginBottom: 5 },
  podiumName: { fontFamily: theme.fonts.main, fontSize: 14, color: theme.colors.navy, marginBottom: 5 },
  podiumBar: { width: 60, borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center', alignItems: 'center' },
  podiumRank: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  listContent: { padding: 20, paddingBottom: 100 },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rankNumber: { fontFamily: theme.fonts.main, fontSize: 18, color: theme.colors.teal, width: 30 },
  listAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  listUsername: { flex: 1, fontFamily: theme.fonts.main, fontSize: 16, color: theme.colors.navy },
  listXP: { fontFamily: theme.fonts.main, fontSize: 14, color: theme.colors.teal },
});