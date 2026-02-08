import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const UnitCard = ({ title }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.textSide}>
          <Text style={styles.unitText}>section 1, unit 1</Text>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.iconSide}>
          <Ionicons name="book-outline" size={28} color="white" />
        </View>
      </View>
      <View style={styles.triangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  card: {
    backgroundColor: '#2D3E50',
    flexDirection: 'row',
    width: '90%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1A2530',
  },
  textSide: { padding: 20, flex: 1 },
  iconSide: {
    width: 70,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#1A2530',
  },
  unitText: { color: 'rgba(255,255,255,0.8)', fontFamily: 'Courier', fontSize: 16 },
  titleText: { color: 'white', fontFamily: 'Courier', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2D3E50',
    marginTop: -2,
    alignSelf: 'flex-start',
    marginLeft: '15%',
  },
});