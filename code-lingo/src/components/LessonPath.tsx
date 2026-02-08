import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';
import { theme } from '../theme/theme'; 

interface LessonPathProps {
  lessons: { id: string; order: number }[];
  currentLessonIndex: number; // This must be passed as profile.currentLessonByLanguage[lang]
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
        <View style={styles.staticCatContainer}>
          <Image
            source={require('../../assets/cat-avatar.png')}
            style={styles.mascotImage}
          />
          <Text style={styles.xpText}>{totalXp} XP</Text>
        </View>

        {lessons.map((lesson, index) => {
          const zigzag = [0, 80, 0, -80]; 
          const offset = zigzag[index % 4];
          
          // Logic to darken nodes and move the ring
          const isActive = index === currentLessonIndex;
          const isCompleted = index < currentLessonIndex;

          return (
            <View key={lesson.id} style={styles.row}>
              <View style={{ transform: [{ translateX: offset }], alignItems: 'center' }}>
                <LessonNode
                  index={index}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onPress={(i) => onStartLesson(i)}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 150, backgroundColor: '#DDE8F0' },
  pathWrapper: { marginTop: 40, width: '100%', alignItems: 'center', position: 'relative' },
  staticCatContainer: { position: 'absolute', left: 40, top: 100, alignItems: 'center', zIndex: 10 },
  mascotImage: { width: 90, height: 90, resizeMode: 'contain' },
  xpText: { fontFamily: theme.fonts.main, fontSize: 20, fontWeight: 'bold', color: '#2D3E50', marginTop: -5, transform: [{ rotate: '-10deg' }] },
  row: { marginVertical: 15, width: '100%', alignItems: 'center', justifyContent: 'center' },
});