import React from 'react';
// Added Image to the imports below
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { LessonNode } from './LessonNode';
import { UnitCard } from './UnitCard';
import { theme } from '../theme/theme';

export const LessonPath = ({ lessons, currentLessonIndex, languageName, totalXp }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <UnitCard title={`${languageName} syntax`} />
      
      <View style={styles.pathWrapper}>
        {/* Persistent Mascot on the left */}
        <View style={styles.catPositioner}>
            <Image 
              source={require('../../assets/cat-avatar.png')} 
              style={styles.mascotImage} 
            /> 
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
                offset={0} 
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
  container: { 
    paddingBottom: 120,
    backgroundColor: theme.colors.background || 'white' 
  },
  pathWrapper: { 
    marginTop: 40, 
    width: '100%', 
    minHeight: 600 
  },
  catPositioner: {
    position: 'absolute',
    left: 50,
    top: 50, // Adjusted top to be relative to the start of the path
    alignItems: 'center',
    zIndex: 10,
  },
  mascotImage: {
    width: 75, 
    height: 75, 
    resizeMode: 'contain'
  },
  xpText: {
    fontFamily: theme.fonts.main, // Updated from Courier to your theme font
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.navy || '#333',
    transform: [{ rotate: '-10deg' }],
    marginTop: -5,
  },
  row: { 
    marginVertical: 25 
  },
});