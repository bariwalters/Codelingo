import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../src/theme/theme';
import { logout } from '../src/firebase/auth';

export default function AccountScreen({ userProfile }: any) {
  const suggestions = [
    { id: '1', name: 'User 1' },
    { id: '2', name: 'User 2' },
    { id: '3', name: 'User 3' },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      // flexGrow ensures the content fills the screen so the blue goes to the bottom
      contentContainerStyle={styles.scrollContent}
      // This prevents the white flash when bouncing at the bottom on iOS
      bounces={true} 
      overScrollMode="always"
    >
      {/* Header with Settings Gear */}
      <View style={styles.topNav}>
        <Text style={styles.usernameHeader}>{userProfile?.username || 'alexa'}</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={theme.colors.navy} />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../assets/cat-avatar.png')} 
            style={styles.avatarImage} 
          />
        </View>
      </View>

      {/* Stats Summary Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
             <View style={styles.badgeRow}>
                <View style={[styles.courseBadge, {backgroundColor: '#b0b0b0'}]}><Text style={styles.badgeText}>Py</Text></View>
                <View style={[styles.courseBadge, {backgroundColor: '#cbd5e0'}]}><Text style={styles.badgeText}>TS</Text></View>
             </View>
            <Text style={styles.statLabel}>courses</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>following</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>followers</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>overview</Text>
        
        <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
                <MaterialCommunityIcons name="fire" size={26} color="#e53e3e" />
                <Text style={styles.overviewValue}>{userProfile?.streak || 0}</Text>
            </View>
            <View style={styles.overviewItem}>
                <View style={[styles.courseBadge, {backgroundColor: '#b0b0b0', width: 24, height: 24, marginRight: 0}]}><Text style={[styles.badgeText, {fontSize: 10}]}>Py</Text></View>
                <Text style={styles.overviewValue}>9</Text>
            </View>
            <View style={styles.overviewItem}>
                <MaterialCommunityIcons name="shield-outline" size={26} color={theme.colors.navy} />
                <Text style={styles.overviewValue}>gold</Text>
            </View>
            <View style={styles.overviewItem}>
                <MaterialCommunityIcons name="lightning-bolt" size={26} color="#ecc94b" />
                <Text style={styles.overviewValue}>{userProfile?.xp || 10} xp</Text>
            </View>
        </View>

        <Text style={styles.sectionTitle}>friend suggestions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
          {suggestions.map((item) => (
            <View key={item.id} style={styles.suggestionCard}>
              <TouchableOpacity style={styles.closeCard}>
                <Ionicons name="close" size={18} color="#718096" />
              </TouchableOpacity>
              <View style={styles.suggestionAvatar}>
                 <Ionicons name="person" size={40} color="black" />
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>follow</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
          <Text style={styles.logoutText}>log out</Text>
        </TouchableOpacity>

        {/* EXTRA SPACE PADDER: Matches the blue background to fix the white gap */}
        <View style={{ height: 125 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  scrollContent: {
    flexGrow: 1,
    // Removed paddingBottom from here!
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  usernameHeader: {
    fontSize: 32,
    fontFamily: theme.fonts.main,
    color: theme.colors.navy,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
  },
  avatarImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain' 
  },
  statsContainer: {
    backgroundColor: '#d1dce7', 
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // Margin Bottom is 0 to ensure the color sits flush
    marginBottom: 0,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: { 
    alignItems: 'flex-start', 
    flex: 1 
  },
  badgeRow: { 
    flexDirection: 'row', 
    marginBottom: 5 
  },
  courseBadge: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  badgeText: { 
    fontSize: 14, 
    fontFamily: theme.fonts.main,
    color: '#4a5568' 
  },
  statNumber: { 
    fontSize: 22, 
    fontFamily: theme.fonts.main,
    color: theme.colors.navy, 
    marginBottom: 5 
  },
  statLabel: { 
    fontSize: 16, 
    color: 'black', 
    fontFamily: theme.fonts.main
  },
  sectionTitle: {
    fontSize: 20,
    color: 'black',
    fontFamily: theme.fonts.main,
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  overviewItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  overviewValue: {
    fontSize: 18,
    fontFamily: theme.fonts.main,
    marginLeft: 10,
    color: '#4a5568',
  },
  suggestionsScroll: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  suggestionCard: {
    backgroundColor: '#9ca3af',
    width: 140,
    height: 170,
    borderRadius: 20,
    marginRight: 15,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between'
  },
  closeCard: { 
    alignSelf: 'flex-end' 
  },
  suggestionAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  followBtn: {
    backgroundColor: '#edf2f7',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center'
  },
  followText: { 
    fontFamily: theme.fonts.main,
    color: '#4a5568' 
  },
  logoutBtn: {
    padding: 15,
    backgroundColor: '#e53e3e',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: { 
    color: 'white', 
    fontFamily: theme.fonts.main
  }
});