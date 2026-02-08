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
      {/* 1. Dashed Ring (Back Layer) */}
      {isActive && <View style={styles.dashedRing} />}
      
      {/* 2. 3D Shadow Base (Middle Layer) */}
      <View style={[styles.shadowLayer, { backgroundColor: shadow }]} />
      
      {/* 3. Top Button Surface (Top Layer) */}
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
    width: 120, // Provides enough padding for the 110px ring
    height: 120,
  },
  dashedRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: theme.colors.teal,
    borderStyle: 'dashed',
    // Positioned to encompass the 3D stack perfectly
    top: 3, 
  },
  shadowLayer: {
    position: 'absolute',
    width: 85,
    height: 76,
    borderRadius: 45,
    // Sitting slightly lower to create depth
    top: 22, 
    zIndex: 1,
  },
  nodeCircle: {
    position: 'absolute',
    width: 85,
    height: 76, 
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    // Lifted up 8px from the shadow base
    top: 14, 
    zIndex: 2,
  },
  nodeNumber: {
    fontFamily: theme.fonts.main,
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
  },
});