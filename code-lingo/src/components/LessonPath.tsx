import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export const LessonPath = ({ lessons, currentLessonIndex, languageName, totalXp }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <UnitCard title={`${languageName} syntax`} />
      
      <View style={styles.pathWrapper}>
        {/* Persistent Mascot on the left */}
        <View style={styles.catPositioner}>
            <Ionicons name="logo-github" size={80} color="#000" /> 
            <Text style={styles.xpText}>{totalXp} XP</Text>
        </View>

        {lessons.map((lesson: any, index: number) => {
          // Offsets adjusted to push nodes to the right of the cat
          const zigzag = [100, 140, 100, 60];
          const offset = zigzag[index % 4];
          
          return (
            <View key={lesson.id} style={[styles.row, { marginLeft: offset }]}>
              <LessonNode
                index={index}
                offset={0} // Fixed: Passing 0 because the row handles the margin
                isActive={index === currentLessonIndex}
                isCompleted={index < currentLessonIndex}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 120 },
  pathWrapper: { marginTop: 40, width: '100%', minHeight: 600 },
  catPositioner: {
    position: 'absolute',
    left: 30,
    top: 120,
    alignItems: 'center',
    zIndex: 5,
  },
  xpText: {
    fontFamily: 'Courier',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    transform: [{ rotate: '-10deg' }],
    marginTop: -5,
  },
  row: { marginVertical: 20 },
});