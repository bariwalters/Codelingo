import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

// Define the shape of the data the component expects
interface LandingHeaderProps {
  language: string;
  streak: number;
}

export const LandingHeader = ({ language, streak }: LandingHeaderProps) => {
  // Helper to turn 'javascript' into 'JS', etc.
  const getDisplayLanguage = (langId: string) => {
    switch (langId.toLowerCase()) {
      case 'python': return 'Py';
      case 'javascript': return 'JS';
      case 'java': return 'Jv';
      case 'cpp': return 'C++';
      case 'sql': return 'SQL';
      default: return '??';
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.languagePill}>
        <Text style={styles.pillText}>{getDisplayLanguage(language)}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.white} style={{marginLeft: 4}} />
      </TouchableOpacity>

      <View style={styles.statContainer}>
        <Ionicons name="flame" size={28} color="#FF9600" />
        <Text style={styles.streakText}>{streak}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60, // Increased for modern iPhone status bars
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
  },
  languagePill: {
    backgroundColor: theme.colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    // Subtle shadow for depth
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pillText: {
    fontFamily: theme.fonts.main,
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontFamily: theme.fonts.main,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9600',
    marginLeft: 4,
  },
});