import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { BottomNavBar } from './components/BottomNavBar';
import { LandingHeader } from './components/LandingHeader';
import { LessonPath } from './components/LessonPath';
import AccountScreen from '../app/account';
import QuestsScreen from '../app/quests';
import LeaderboardScreen from '../app/leaderboard';
import LessonScreen from '../app/lesson';
import { theme } from './theme/theme';
import { userService } from './firebase/services/userService';
import type { LanguageId } from './firebase/types';

const ALL_LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'java', label: 'Java' },
];

export default function MainShell({ userProfile: initialProfile }: { userProfile: any }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState<'tabs' | 'lesson'>('tabs');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [activeLang, setActiveLang] = useState(initialProfile?.currentLanguage || 'python');

  // Real-time listener for "live" XP updates
  useEffect(() => {
    if (!initialProfile?.uid) return;
    const unsubscribe = userService.subscribeToProfile(initialProfile.uid, (freshData) => {
      setUserProfile(freshData);
      if (freshData.currentLanguage) setActiveLang(freshData.currentLanguage);
    });
    return () => unsubscribe();
  }, [initialProfile?.uid]);

  const handleEnrollNewLanguage = async (langId: string) => {
    if (!userProfile?.uid) return;
    try {
      await userService.enrollLanguage(userProfile.uid, langId as LanguageId);
      setIsAddingLanguage(false);
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  const renderContent = () => {
    if (isAddingLanguage) {
      return (
        <ScrollView contentContainerStyle={styles.addLanguageContainer}>
          <Text style={styles.title}>Choose a Language</Text>
          {ALL_LANGUAGES.filter(l => !userProfile?.enrolledLanguages?.includes(l.id)).map((lang) => (
            <TouchableOpacity key={lang.id} style={styles.langButton} onPress={() => handleEnrollNewLanguage(lang.id)}>
              <Text style={styles.langButtonText}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setIsAddingLanguage(false)}>
            <Text style={styles.cancelLink}>Back to Lessons</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <LessonPath
            lessons={[{ id: '1', order: 1 }, { id: '2', order: 2 }, { id: '3', order: 3 }, { id: '4', order: 4 }, { id: '5', order: 5 }]}
            languageName={activeLang}
            totalXp={userProfile?.xp || 0}
            currentLessonIndex={userProfile?.currentLessonByLanguage?.[activeLang] || 0}
            onStartLesson={(idx) => { setSelectedLessonIndex(idx); setActiveScreen('lesson'); }}
          />
        );
      case 'quests':
        return <QuestsScreen userProfile={userProfile} />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'account':
        return <AccountScreen userProfile={userProfile} />;
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {activeScreen === 'lesson' ? (
        <LessonScreen
          lessonIndex={selectedLessonIndex}
          language={(activeLang as LanguageId)}
          onExit={() => setActiveScreen('tabs')}
        />
      ) : (
        <>
          {currentTab === 'home' && !isAddingLanguage && (
            <LandingHeader
              language={activeLang}
              streak={userProfile?.streak || 0}
              enrolledLanguages={userProfile?.enrolledLanguages || []}
              onLanguageSelect={(id: string) => { 
                setActiveLang(id); 
                userService.switchCurrentLanguage(userProfile.uid, id as LanguageId); 
              }}
              onAddLanguage={() => setIsAddingLanguage(true)}
            />
          )}
          <View style={styles.contentArea}>{renderContent()}</View>
          <BottomNavBar activeTab={currentTab} onTabPress={(tab: string) => { 
            setCurrentTab(tab); 
            setIsAddingLanguage(false); 
            setActiveScreen('tabs'); 
          }} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDE8F0' },
  contentArea: { flex: 1 },
  addLanguageContainer: { padding: 40, alignItems: 'center', backgroundColor: '#2D3E50', flexGrow: 1, justifyContent: 'center' },
  title: { fontFamily: 'Courier', fontSize: 24, color: 'white', marginBottom: 30, fontWeight: 'bold' },
  langButton: { backgroundColor: 'white', padding: 18, borderRadius: 15, width: '100%', alignItems: 'center', marginBottom: 15 },
  langButtonText: { fontFamily: 'Courier', color: '#2D3E50', fontSize: 18, fontWeight: 'bold' },
  cancelLink: { color: 'white', fontFamily: 'Courier', marginTop: 20, textDecorationLine: 'underline' },
});