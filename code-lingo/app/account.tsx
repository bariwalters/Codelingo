import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../src/theme/globalStyles';
import { theme } from '../src/theme/theme';
import { logout } from '../src/firebase/auth';

export default function AccountScreen({ userProfile }: any) {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header Section */}
      <View style={styles.headerCard}>
        <Text style={styles.usernameText}>{userProfile?.username || 'coder'}</Text>
        <View style={styles.avatarCircle}>
           <Image 
             source={{ uri: 'https://api.dicebear.com/7.x/bottts/png?seed=' + userProfile?.uid }} 
             style={styles.avatarImage} 
           />
        </View>
      </View>

      {/* Stats Summary Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>courses</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>following</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>followers</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>overview</Text>

      {/* Overview Grid */}
      <View style={styles.grid}>
        <View style={styles.gridCard}>
          <Text style={styles.cardEmoji}>🔥</Text>
          <Text style={styles.cardValue}>{userProfile?.streak || 0}</Text>
          <Text style={styles.cardLabel}>day streak</Text>
        </View>
        <View style={styles.gridCard}>
          <Text style={styles.cardEmoji}>⭐</Text>
          <Text style={styles.cardValue}>{userProfile?.xp || 0}</Text>
          <Text style={styles.cardLabel}>total xp</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
        <Text style={styles.logoutText}>log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerCard: {
    backgroundColor: theme.colors.white,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  usernameText: {
    fontFamily: theme.fonts.main,
    fontSize: 28,
    color: theme.colors.navy,
    marginBottom: 15,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.navy,
  },
  avatarImage: { width: 100, height: 100 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: theme.colors.navy },
  statLabel: { fontSize: 14, color: theme.colors.teal },
  sectionTitle: {
    fontFamily: theme.fonts.main,
    fontSize: 22,
    color: theme.colors.navy,
    marginLeft: 20,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  gridCard: {
    backgroundColor: theme.colors.white,
    width: '45%',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cardEmoji: { fontSize: 24 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: theme.colors.navy },
  cardLabel: { fontSize: 12, color: theme.colors.teal },
  logoutBtn: {
    margin: 40,
    padding: 15,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { color: 'white', fontWeight: 'bold' }
});