import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';
import { Ionicons } from '@expo/vector-icons';

export const LessonPath = ({ lessons, currentLessonIndex, languageName, totalXp }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <UnitCard title={`${languageName} syntax`} />
      
      <View style={styles.pathWrapper}>
        <View style={styles.catPositioner}>
            <Ionicons name="logo-github" size={80} color="#000" /> 
            <Text style={styles.xpText}>{totalXp} XP</Text>
        </View>

        {lessons.map((lesson: any, index: number) => {
          const zigzag = [100, 140, 100, 60];
          const offset = zigzag[index % 4];
          
          return (
            <View key={lesson.id} style={[styles.row, { marginLeft: offset }]}>
              <LessonNode
                index={index}
                offset={0} // Fixed TypeScript error
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
  catPositioner: { position: 'absolute', left: 30, top: 120, alignItems: 'center', zIndex: 5 },
  xpText: { fontFamily: 'Courier', fontSize: 22, fontWeight: 'bold', color: '#333', transform: [{ rotate: '-10deg' }], marginTop: -5 },
  row: { marginVertical: 20 },
});