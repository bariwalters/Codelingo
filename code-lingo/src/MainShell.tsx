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

  // Lesson screen "navigation"
  const [activeScreen, setActiveScreen] = useState<'tabs' | 'lesson'>('tabs');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);

  // Language picker UI
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  // Local profile copy so UI updates immediately
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [activeLang, setActiveLang] = useState(initialProfile?.currentLanguage || 'python');

  // keep local state synced with incoming profile
  useEffect(() => {
    setUserProfile(initialProfile);
    if (initialProfile?.currentLanguage) setActiveLang(initialProfile.currentLanguage);
  }, [initialProfile]);

  // lessons list (stable ids)
  const dummyLessons = [
    { id: '1', order: 1 },
    { id: '2', order: 2 },
    { id: '3', order: 3 },
    { id: '4', order: 4 },
    { id: '5', order: 5 },
  ];

  const availableToEnroll = ALL_LANGUAGES.filter(
    (lang) => !userProfile?.enrolledLanguages?.includes(lang.id)
  );

  const handleLanguageSelect = async (langId: string) => {
    setActiveLang(langId);
    try {
      if (userProfile?.uid) {
        await userService.switchCurrentLanguage(userProfile.uid, langId as any);
      }
    } catch (error) {
      console.error('Selection switch failed:', error);
    }
  };

  const handleEnrollNewLanguage = async (langId: string) => {
    if (!userProfile?.uid) return;

    // instant UI update
    const updatedEnrolled = [...(userProfile.enrolledLanguages || []), langId];
    setUserProfile({
      ...userProfile,
      enrolledLanguages: updatedEnrolled,
      currentLanguage: langId,
    });
    setActiveLang(langId);
    setIsAddingLanguage(false);

    try {
      await userService.enrollLanguage(userProfile.uid, langId as any);
      await userService.switchCurrentLanguage(userProfile.uid, langId as any);
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  const handleStartLesson = (idx: number) => {
    setSelectedLessonIndex(idx);
    setActiveScreen('lesson');
  };

  const renderContent = () => {
    if (isAddingLanguage) {
      return (
        <ScrollView contentContainerStyle={styles.addLanguageContainer}>
          <Text style={styles.title}>Choose a Language</Text>
          {availableToEnroll.map((lang) => (
            <TouchableOpacity
              key={lang.id}
              style={styles.langButton}
              onPress={() => handleEnrollNewLanguage(lang.id)}
            >
              <Text style={styles.langButtonText}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setIsAddingLanguage(false)}>
            <Text style={styles.cancelLink}>Back to Lessons</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    const langLabel =
      ALL_LANGUAGES.find((l) => l.id === activeLang)?.label.toLowerCase() || activeLang;

    switch (currentTab) {
      case 'home':
        return (
          <LessonPath
            lessons={dummyLessons}
            languageName={langLabel}
            totalXp={userProfile?.totalXp || 0}
            currentLessonIndex={userProfile?.currentLessonByLanguage?.[activeLang] || 0}
            onStartLesson={handleStartLesson}
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
          language={(activeLang as LanguageId) || ('python' as LanguageId)}
          onExit={() => setActiveScreen('tabs')}
        />
      ) : (
        <>
          {currentTab === 'home' && !isAddingLanguage && (
            <LandingHeader
              language={activeLang}
              streak={userProfile?.streak || 0}
              enrolledLanguages={userProfile?.enrolledLanguages || []}
              onLanguageSelect={handleLanguageSelect}
              onAddLanguage={() => setIsAddingLanguage(true)}
            />
          )}

          <View style={styles.contentArea}>{renderContent()}</View>

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
  container: { flex: 1, backgroundColor: '#DDE8F0' },
  contentArea: { flex: 1 },

  addLanguageContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#2D3E50',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Courier',
    fontSize: 24,
    color: 'white',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  langButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  langButtonText: {
    fontFamily: 'Courier',
    color: '#2D3E50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelLink: {
    color: 'white',
    fontFamily: 'Courier',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
