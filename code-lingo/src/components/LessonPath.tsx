import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';


interface LessonPathProps {
  lessons: { id: string; order: number }[];
  currentLessonIndex: number;
  onStartLesson: (idx: number) => void;
}

export const LessonPath = ({ lessons, currentLessonIndex, onStartLesson }: LessonPathProps) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <UnitCard />
      <View style={styles.pathWrapper}>
        {lessons.map((lesson: any, index: number) => {
          const zigzag = [0, 50, 0, -50];
          const offset = zigzag[index % 4];
          const isActive = index === currentLessonIndex;
          
          return (
            <View key={lesson.id} style={styles.row}>
              {/* The Cat Mascot & XP - Only renders next to the active lesson */}
              {isActive && (
                <View style={[styles.mascotContainer, { left: offset - 90 }]}>
                   <Ionicons name="logo-github" size={60} color="#000" /> 
                   <Text style={styles.xpText}>150 XP</Text>
                </View>
              )}

              <LessonNode
                key={lesson.id}
                index={index}
                offset={offset}
                isActive={index === currentLessonIndex}
                isCompleted={index < currentLessonIndex}
                onPress={(i) => onStartLesson(i)}
/>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
  },
  pathWrapper: {
    alignItems: 'center',
    marginTop: 30,
  },
  row: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  xpText: {
    fontFamily: theme.fonts.main,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.navy,
    marginTop: -5,
    transform: [{ rotate: '-10deg' }]
  }
});