import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { BottomNavBar } from './components/BottomNavBar';
import { LandingHeader } from './components/LandingHeader';
import { LessonPath } from './components/LessonPath';
import AccountScreen from '../app/account';
import QuestsScreen from '../app/quests';
import LeaderboardScreen from '../app/leaderboard';
import LessonScreen from "../app/lesson";
import { userService } from './firebase/services/userService';

const ALL_LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'java', label: 'Java' },
];

const dummyLessons = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];

export default function MainShell({ userProfile: initialProfile }: { userProfile: any }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState<'tabs' | 'lesson'>('tabs');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [activeLang, setActiveLang] = useState(initialProfile?.currentLanguage || 'python');

  useEffect(() => {
    setUserProfile(initialProfile);
    if (initialProfile?.currentLanguage) {
      setActiveLang(initialProfile.currentLanguage);
    }
  }, [initialProfile]);

  const handleLanguageSelect = async (langId: string) => {
    setActiveLang(langId);
    try {
      if (userProfile?.uid) {
        await userService.switchCurrentLanguage(userProfile.uid, langId as any);
      }
    } catch (error) {
      console.error("Selection switch failed:", error);
    }
  };

  const handleStartLesson = (idx: number) => {
    setSelectedLessonIndex(idx);
    setActiveScreen('lesson');
  };

  const renderContent = () => {
    // Content rendering logic is inside the return below for clarity
    switch (currentTab) {
      case 'home':
        return (
          <LessonPath 
            lessons={dummyLessons} 
            languageName={activeLang} 
            totalXp={userProfile?.totalXp || 0}
            currentLessonIndex={userProfile?.currentLessonByLanguage?.[activeLang] || 0} 
            onStartLesson={handleStartLesson}
          />
        );
      case 'quests': return <QuestsScreen userProfile={userProfile} />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'account': return <AccountScreen userProfile={userProfile} />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {activeScreen === 'lesson' ? (
        <LessonScreen
          lessonIndex={selectedLessonIndex}
          language={activeLang}
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
  container: { flex: 1, backgroundColor: '#DDE8F0' },
  contentArea: { flex: 1 },
});