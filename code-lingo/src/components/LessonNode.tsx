import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useRouter } from 'expo-router';


interface LessonNodeProps {
  offset: number;
  isActive?: boolean;
  isCompleted?: boolean;
  index: number; // Added index for numbering
  onPress?: (index: number) => void;

}

export const LessonNode = ({ offset, isActive, isCompleted, index, onPress }: LessonNodeProps) => {
  const router = useRouter();

  return (
    <View style={[styles.nodeContainer, { transform: [{ translateX: offset }] }]}>
      {/* Dashed Ring now centered behind the circle */}
      {isActive && <View style={styles.dashedRing} />}
      
      <TouchableOpacity

        onPress={() => onPress?.(index)}

        style={[
          styles.nodeCircle,
          {
            backgroundColor: isActive
              ? theme.colors.teal
              : isCompleted
                ? theme.colors.navy
                : '#8BA1B0'
          }
        ]}
      >
        {isActive ? (
          <Ionicons name="play" size={40} color={theme.colors.white} />
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
    marginVertical: 15,
  },
  nodeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    // The 3D button shadow effect
    borderBottomWidth: 6,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  nodeNumber: {
    fontFamily: theme.fonts.main,
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  dashedRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.teal,
    borderStyle: 'dashed',
    zIndex: 1,
  }
});