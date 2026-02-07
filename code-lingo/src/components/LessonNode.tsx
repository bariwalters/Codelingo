import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';


interface LessonNodeProps {
  offset: number;
  isActive?: boolean;
  isCompleted?: boolean;
}


export const LessonNode = ({ offset, isActive, isCompleted }: LessonNodeProps) => {
  return (
    <View style={{ transform: [{ translateX: offset }] }}>
      {/* Dashed Ring for the current active lesson */}
      {isActive && <View style={styles.dashedRing} />}
     
      <TouchableOpacity
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
          isCompleted && <Ionicons name="checkmark" size={40} color={theme.colors.white} />
        )}
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  nodeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    // The 3D button shadow effect
    borderBottomWidth: 6,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  dashedRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.teal,
    borderStyle: 'dashed',
    top: -10,
    left: -10,
  }
});
