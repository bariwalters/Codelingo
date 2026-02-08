import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';
import { theme } from '../theme/theme'; 

interface LessonPathProps {
  lessons: { id: string; order: number }[];
  currentLessonIndex: number;
  languageName: string;
  totalXp: number;
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
          const zigzag = [40, 80, 40, 10];
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
    backgroundColor: '#DDE8F0', 
  },
  pathWrapper: {
    marginTop: 40,
    width: '100%',
    minHeight: 600,
  },
  catPositioner: {
    position: 'absolute',
    right: 275, 
    top: 60,
    alignItems: 'center',
    zIndex: 10,
  },
  mascotImage: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
  },
  xpText: {
    fontFamily: theme.fonts.main, // Swapped to use your theme font for consistency
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    transform: [{ rotate: '-10deg' }],
    marginTop: -5,
  },
  row: {
    marginVertical: 25,
    // Ensures nodes don't hug the absolute edge if the offset is 0
    paddingLeft: 20, 
  },
});