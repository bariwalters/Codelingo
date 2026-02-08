import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';


export const UnitCard = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.textContent}>
        <Text style={styles.unitTitle}>section 1, unit 1</Text>
        <Text style={styles.unitSubtitle}>python syntax</Text>
      </View>


      <TouchableOpacity style={styles.guidebookBtn}>
        <Ionicons name="book-outline" size={28} color={theme.colors.navy} />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.navy,
    marginHorizontal: theme.spacing.m,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginTop: theme.spacing.s,
    // Adding the subtle 3D shadow from your screenshot
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  textContent: {
    flex: 1,
    padding: theme.spacing.m,
  },
  unitTitle: {
    fontFamily: theme.fonts.main,
    color: theme.colors.white,
    fontSize: 14, // Slightly smaller for the "section" text
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  unitSubtitle: {
    fontFamily: theme.fonts.main,
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  guidebookBtn: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
  },
});
