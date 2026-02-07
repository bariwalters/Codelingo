import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface NavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const BottomNavBar = ({ activeTab, onTabPress }: NavProps) => {
  return (
    <View style={styles.navContainer}>
      {/* HOME TAB */}
      <TouchableOpacity onPress={() => onTabPress('home')} style={styles.navItem}>
        <Ionicons 
          name={activeTab === 'home' ? "home" : "home-outline"} 
          size={32} 
          color={activeTab === 'home' ? theme.colors.white : theme.colors.teal} 
        />
      </TouchableOpacity>
     
      {/* QUESTS TAB (The Chest) */}
      <TouchableOpacity onPress={() => onTabPress('quests')} style={styles.navItem}>
        <Ionicons 
          name={activeTab === 'quests' ? "briefcase" : "briefcase-outline"} 
          size={32} 
          color={activeTab === 'quests' ? theme.colors.white : theme.colors.teal} 
        />
      </TouchableOpacity>

      {/* LEADERBOARD TAB (The Trophy) */}
      <TouchableOpacity onPress={() => onTabPress('leaderboard')} style={styles.navItem}>
        <Ionicons 
          name={activeTab === 'leaderboard' ? "trophy" : "trophy-outline"} 
          size={32} 
          color={activeTab === 'leaderboard' ? theme.colors.white : theme.colors.teal} 
        />
      </TouchableOpacity>

      {/* ACCOUNT TAB */}
      <TouchableOpacity onPress={() => onTabPress('account')} style={styles.navItem}>
        <Ionicons 
          name={activeTab === 'account' ? "person" : "person-outline"} 
          size={32} 
          color={activeTab === 'account' ? theme.colors.white : theme.colors.teal} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3C4D5E', // Match Lara's Navy variant
    paddingVertical: 15,
    paddingBottom: 35, // Safe area for modern phones
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
});