import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme/theme';

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
  <View style={styles.progressTrack}>
    <View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} />
    <Text style={styles.progressText}>{current}/{total}</Text>
  </View>
);

export default function QuestsScreen({ userProfile }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.headerCard}>
        <View style={styles.headerTextContent}>
          <Text style={styles.mainTitle}>Quests</Text>
          <Text style={styles.subtitle}>Complete quests to earn rewards!</Text>
        </View>
        <Ionicons name="paw" size={80} color={theme.colors.navy} /> 
      </View>

      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>weekend quest</Text>
          <View style={styles.timerTag}>
            <Ionicons name="time-outline" size={14} color={theme.colors.navy} />
            <Text style={styles.timerText}>2d</Text>
          </View>
        </View>
        <View style={styles.weekendCard} />

        <Text style={styles.questTaskText}>complete 3 perfect lessons</Text>
        <ProgressBar current={0} total={3} />

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>daily quest</Text>
          <View style={styles.timerTag}>
            <Ionicons name="time-outline" size={14} color={theme.colors.navy} />
            <Text style={styles.timerText}>1h</Text>
          </View>
        </View>

        <View style={styles.dailyRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.questTaskText}>earn 10 xp</Text>
            <ProgressBar current={userProfile?.xp || 0} total={10} />
          </View>
          <Ionicons name="gift" size={40} color="#8BA1B0" style={styles.chestIcon} />
        </View>

        <View style={styles.dailyRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.questTaskText}>complete 2 lessons</Text>
            <ProgressBar current={0} total={2} />
          </View>
          <Ionicons name="gift" size={40} color="#8BA1B0" style={styles.chestIcon} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.skyBlue },
  headerCard: {
    backgroundColor: theme.colors.white,
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContent: { flex: 1 },
  mainTitle: { fontFamily: theme.fonts.main, fontSize: 32, color: theme.colors.navy },
  subtitle: { fontFamily: theme.fonts.main, fontSize: 16, color: theme.colors.navy, marginTop: 5 },
  body: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontFamily: theme.fonts.main, fontSize: 20, color: theme.colors.navy },
  timerTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  timerText: { fontFamily: theme.fonts.main, fontSize: 14, color: theme.colors.navy, marginLeft: 4 },
  weekendCard: { height: 120, backgroundColor: '#8BA1B0', borderRadius: 20, marginBottom: 15 },
  questTaskText: { fontFamily: theme.fonts.main, fontSize: 16, color: theme.colors.navy, marginBottom: 8 },
  progressTrack: { height: 25, backgroundColor: '#8BA1B0', borderRadius: 12.5, justifyContent: 'center', overflow: 'hidden' },
  progressFill: { position: 'absolute', height: '100%', backgroundColor: '#5B7083' },
  progressText: { textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: 'white', zIndex: 1 },
  divider: { height: 1, backgroundColor: theme.colors.navy, marginVertical: 25, opacity: 0.2 },
  dailyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  chestIcon: { marginLeft: 15 }
});