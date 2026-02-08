import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';
import { theme } from '../theme/theme'; // Ensure this path is correct

interface LessonPathProps {
  lessons: { id: string; order: number }[];
  currentLessonIndex: number;

  // UI bits used in the JSX below
  languageName: string;
  totalXp: number;

  // navigation callback (so tapping a node opens lesson.tsx)
  onStartLesson: (idx: number) => void;
}

export const LessonPath = ({
  lessons,
  currentLessonIndex,
  languageName,
  totalXp,
  onStartLesson,
}: LessonPathProps) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <UnitCard title={`${languageName} syntax`} />

      <View style={styles.pathWrapper}>
        {/* The Cat & XP Badge */}
        <View style={styles.catPositioner}>
          <Image
            source={require('../../assets/cat-avatar.png')}
            style={styles.mascotImage}
          />
          <Text style={styles.xpText}>{totalXp} XP</Text>
        </View>

        {lessons.map((lesson, index) => {
          const zigzag = [100, 140, 100, 60];
          const offset = zigzag[index % 4];

          return (
            <View key={lesson.id} style={[styles.row, { marginLeft: offset }]}>
              <LessonNode
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
    backgroundColor: '#DDE8F0', // Matching your light blue background
  },
  pathWrapper: {
    marginTop: 40,
    width: '100%',
    minHeight: 600,
  },
  catPositioner: {
    position: 'absolute',
    left: 40, // Keeps it on the left side of the path
    top: 100,
    alignItems: 'center',
    zIndex: 10,
  },
  mascotImage: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
  },
  xpText: {
    fontFamily: 'Courier', // Matches the "hand-drawn" terminal look
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    transform: [{ rotate: '-10deg' }],
    marginTop: -10,
  },
  row: {
    marginVertical: 25,
  },
});
