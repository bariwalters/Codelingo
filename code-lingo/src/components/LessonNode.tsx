import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface LessonNodeProps {
  index: number;
  isActive?: boolean;
  isCompleted?: boolean;
  onPress?: (index: number) => void;
}

export const LessonNode = ({ isActive, isCompleted, index, onPress }: LessonNodeProps) => {
  const colors = {
    active: { top: theme.colors.teal, shadow: '#78909C' }, // Dark teal shadow
    completed: { top: theme.colors.navy, shadow: '#1E293B' },
    locked: { top: '#A9BCC9', shadow: '#78909C' } 
  };

  const currentState = isActive ? 'active' : isCompleted ? 'completed' : 'locked';
  const { top, shadow } = colors[currentState];

  return (
    <View style={styles.nodeContainer}>
      {isActive && <View style={styles.dashedRing} />}
      
      {/* 3D Shadow Base */}
      <View style={[styles.shadowLayer, { backgroundColor: shadow }]} />
      
      {/* Top Button Surface */}
      <TouchableOpacity
        onPress={() => onPress?.(index)}
        activeOpacity={0.9}
        style={[styles.nodeCircle, { backgroundColor: top }]}
      >
        {isActive ? (
          <Ionicons name="play" size={35} color="white" style={{ marginLeft: 4 }} />
        ) : (
          <Text style={styles.nodeNumber}>{index + 1}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  nodeCircle: {
    width: 85,
    height: 76, 
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginTop: -10, // Pulls the face up to reveal the shadow
  },
  shadowLayer: {
    position: 'absolute',
    width: 85,
    height: 80,
    borderRadius: 45,
    bottom: 12,
    zIndex: 1,
  },
  nodeNumber: {
    fontFamily: theme.fonts.main,
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
  },
  dashedRing: {
    position: 'absolute',
    width: 115,
    height: 115,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.teal,
    borderStyle: 'dashed',
    zIndex: 0,
  }
});