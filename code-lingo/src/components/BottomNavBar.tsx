import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface NavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const BottomNavbar = ({ activeTab, onTabPress }: NavProps) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => onTabPress('home')} style={styles.navItem}>
        <Ionicons 
          name={activeTab === 'home' ? "home" : "home-outline"} 
          size={32} 
          color={activeTab === 'home' ? theme.colors.white : theme.colors.teal} 
        />
      </TouchableOpacity>
     
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="cube-outline" size={32} color={theme.colors.teal} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="trophy-outline" size={32} color={theme.colors.teal} />
      </TouchableOpacity>

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
    backgroundColor: '#3C4D5E', // Lara's specific navy variant
    paddingVertical: 20,
    paddingBottom: 35, 
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 10,
  }
});