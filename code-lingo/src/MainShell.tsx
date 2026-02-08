import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { BottomNavBar } from './components/BottomNavBar';
import { LandingHeader } from './components/LandingHeader';
import { LessonPath } from './components/LessonPath';
import AccountScreen from '../app/account';
import QuestsScreen from '../app/quests';
import LeaderboardScreen from '../app/leaderboard';
import LessonScreen from "../app/lesson";

// Theme & Services
import { theme } from './theme/theme';
import { userService } from './firebase/services/userService';

export default function MainShell({ userProfile }: { userProfile: any }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState<'tabs' | 'lesson'>('tabs');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);

  // New state to show/hide the language picker
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  const dummyLessons = [
    { id: '1', order: 1 }, 
    { id: '2', order: 2 }, 
    { id: '3', order: 3 },
    { id: '4', order: 4 }, 
    { id: '5', order: 5 }
  ];

  const handleLanguageSelect = async (newLang: string) => {
    try {
      if (userProfile?.uid) {
        await userService.switchCurrentLanguage(userProfile.uid, newLang as any);
      }
    } catch (error) {
      console.error("Error switching language:", error);
    }
  };

  // Instead of an Alert, we just toggle a View
  const handleAddLanguage = () => {
    console.log("MainShell: Opening language selector");
    setIsAddingLanguage(true);
  };

  const handleEnroll = async (lang: string) => {
    try {
      if (userProfile?.uid) {
        await userService.enrollLanguage(userProfile.uid, lang as any);
        setIsAddingLanguage(false); // Close selector on success
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const handleStartLesson = (idx: number) => {
    setSelectedLessonIndex(idx);
    setActiveScreen('lesson');
  };


  const renderContent = () => {
    // If we are in "Add Language" mode, show a special selection screen
    if (isAddingLanguage) {
      return (
        <View style={styles.addLanguageContainer}>
          <Text style={styles.title}>Learn a new language</Text>
          <TouchableOpacity style={styles.langButton} onPress={() => handleEnroll('javascript')}>
            <Text style={styles.langButtonText}>JavaScript</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langButton} onPress={() => handleEnroll('java')}>
            <Text style={styles.langButtonText}>Java</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.langButton, {backgroundColor: '#ff4444'}]} 
            onPress={() => setIsAddingLanguage(false)}
          >
            <Text style={styles.langButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <LessonPath 
            lessons={dummyLessons} 
            currentLessonIndex={userProfile?.currentLessonByLanguage?.[userProfile.currentLanguage] || 0}
            onStartLesson={handleStartLesson}
          />
        );

      case 'quests': return <QuestsScreen userProfile={userProfile} />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'account': return <AccountScreen userProfile={userProfile} />;
      default:
        return (
          <LessonPath
            lessons={dummyLessons}
            currentLessonIndex={0}
            onStartLesson={handleStartLesson}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {activeScreen === 'lesson' ? (
        <LessonScreen
          lessonIndex={selectedLessonIndex}
          language={userProfile?.currentLanguage || 'python'}
          onExit={() => setActiveScreen('tabs')}
        />
      ) : (
        <>
          {currentTab === 'home' && !isAddingLanguage && (
            <LandingHeader 
              language={userProfile?.currentLanguage || 'python'} 
              streak={userProfile?.streak || 0} 
              enrolledLanguages={userProfile?.enrolledLanguages || []}
              onLanguageSelect={handleLanguageSelect}
              onAddLanguage={handleAddLanguage}
            />
          )}

          <View style={styles.contentArea}>
            {renderContent()}
          </View>

          <BottomNavBar 
            activeTab={currentTab} 
            onTabPress={(tab: string) => {
              setCurrentTab(tab);
              setIsAddingLanguage(false);
              setActiveScreen('tabs');

            }} 
          />
        </>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentArea: {
    flex: 1,
  },
  addLanguageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.navy,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  langButton: {
    backgroundColor: theme.colors.teal,
    padding: 15,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  langButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});