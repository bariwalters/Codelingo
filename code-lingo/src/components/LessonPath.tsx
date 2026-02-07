import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';

export const LessonPath = ({ lessons, currentLessonIndex }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <UnitCard />
      <View style={styles.pathWrapper}>
        {lessons.map((lesson: any, index: number) => {
          // Zigzag offset pattern: center, right, center, left
          const zigzag = [0, 50, 0, -50];
          const offset = zigzag[index % 4];
          
          return (
            <LessonNode
              key={lesson.id}
              offset={offset}
              isActive={index === currentLessonIndex}
              isCompleted={index < currentLessonIndex}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120, // Avoid overlapping with navbar
  },
  pathWrapper: {
    alignItems: 'center',
    marginTop: 30,
  }
});