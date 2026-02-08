import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, Image } from 'react-native';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../src/firebase/firebase';
import { theme } from '../src/theme/theme';
import { globalStyles } from '../src/theme/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const CAT_ANIMATION = require('../assets/animations/cat_mascot.json');

let cachedData: any[] = [];

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<any[]>(cachedData);
  const [loading, setLoading] = useState(cachedData.length === 0);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(20));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        cachedData = list;
        setUsers(list);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading && users.length === 0) {
    return (
      <View style={[globalStyles.centered, { flex: 1, backgroundColor: 'white' }]}>
        <ActivityIndicator size="large" color={theme.colors.teal} />
      </View>
    );
  }

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#A9BCC9';
    if (rank === 3) return '#CD7F32';
    return '#E5E5E5';
  };

  const renderPodium = (user: any, rank: number) => {
    const rankColor = getRankColor(rank);
    const overlayColor = rankColor + '44'; 
    
    return (
      <View style={styles.podiumUser}>
        <View style={[styles.avatarCircle, { borderColor: rankColor, borderWidth: 3 }]}>
          {user?.avatarUrl ? (
            // If user has a real photo, show it
            <Image 
              source={{ uri: user.avatarUrl }} 
              style={styles.catImage}
            />
          ) : (
            // Otherwise, show the animated mascot
            <LottieView
              source={CAT_ANIMATION}
              autoPlay
              loop
              style={styles.catImage}
            />
          )}
          
          {/* THE OVERLAY: Tints the avatar/animation based on rank */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor, pointerEvents: 'none' }]} />
        </View>
        
        <Text style={styles.podiumName} numberOfLines={1}>
          {user?.username || '---'}
        </Text>

        <View style={[styles.podiumBlock, { 
          backgroundColor: rankColor,
          height: rank === 1 ? 85 : rank === 2 ? 65 : 55 
        }]}>
          <Text style={styles.podiumNumber}>{rank}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <View style={styles.whiteHeader}>
        <Text style={[globalStyles.heading, styles.headerTitle]}>Leaderboard</Text>
        <View style={styles.podiumRow}>
          {renderPodium(topThree[1], 2)}
          {renderPodium(topThree[0], 1)}
          {renderPodium(topThree[2], 3)}
        </View>
      </View>

      <FlatList
        data={others}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.listRow}>
            <Text style={styles.listRank}>{index + 4}</Text>
            <Text style={styles.listUsername}>{item.username}</Text>
            <Text style={styles.listXP}>{item.xp} XP</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background, 
  },
  whiteHeader: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    paddingTop: 70, 
    paddingBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerTitle: {
    fontFamily: theme.fonts.main,
    color: theme.colors.navy,
    fontSize: 26,
    marginBottom: 10,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  podiumUser: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 75,
  },
  avatarCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: theme.colors.beige,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  catImage: {
    width: '100%',
    height: '100%',
  },
  podiumName: {
    fontFamily: theme.fonts.main,
    color: theme.colors.navy,
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  podiumBlock: {
    width: 55,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumNumber: {
    fontFamily: theme.fonts.main,
    color: 'white',
    fontSize: 22,
  },
  listRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 22,
    marginBottom: 12,
    alignItems: 'center',
  },
  listRank: {
    fontFamily: theme.fonts.main,
    color: theme.colors.teal,
    width: 35,
    fontSize: 16,
  },
  listUsername: {
    flex: 1,
    fontFamily: theme.fonts.main,
    color: theme.colors.navy,
    fontSize: 16,
  },
  listXP: {
    fontFamily: theme.fonts.main,
    color: theme.colors.teal,
    fontSize: 14,
  }
});