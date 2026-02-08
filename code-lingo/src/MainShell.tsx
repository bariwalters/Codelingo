import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { BottomNavBar } from './components/BottomNavBar';
import { LandingHeader } from './components/LandingHeader';
import { LessonPath } from './components/LessonPath';
import AccountScreen from '../app/account';
import QuestsScreen from '../app/quests';
import LeaderboardScreen from '../app/leaderboard';
import { theme } from './theme/theme';
import { userService } from './firebase/services/userService';

const ALL_LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'java', label: 'Java' },
];

export default function MainShell({ userProfile }: { userProfile: any }) {
  const [currentTab, setCurrentTab] = useState('home');
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [activeLang, setActiveLang] = useState(userProfile?.currentLanguage || 'python');

  useEffect(() => {
    if (userProfile?.currentLanguage) {
      setActiveLang(userProfile.currentLanguage);
    }
  }, [userProfile?.currentLanguage]);

  // Only show languages the user hasn't joined yet
  const availableToEnroll = ALL_LANGUAGES.filter(
    lang => !userProfile?.enrolledLanguages?.includes(lang.id)
  );

  const handleLanguageSelect = async (newLang: string) => {
    setActiveLang(newLang);
    try {
      if (userProfile?.uid) {
        await userService.switchCurrentLanguage(userProfile.uid, newLang as any);
      }
    } catch (error) {
      console.error("Error switching:", error);
    }
  };

  const renderContent = () => {
    if (isAddingLanguage) {
      return (
        <ScrollView contentContainerStyle={styles.addLanguageContainer}>
          <Text style={styles.title}>Chose a Language</Text>
          {availableToEnroll.map((lang) => (
            <TouchableOpacity 
              key={lang.id} 
              style={styles.langButton} 
              onPress={async () => {
                await userService.enrollLanguage(userProfile.uid, lang.id as any);
                handleLanguageSelect(lang.id);
                setIsAddingLanguage(false);
              }}
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

    const langDisplay = activeLang === 'cpp' ? 'c++' : activeLang === 'csharp' ? 'c#' : activeLang;

    switch (currentTab) {
      case 'home':
        return (
          <LessonPath 
            lessons={[{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }]} 
            languageName={langDisplay} 
            totalXp={userProfile?.totalXp || 0}
            currentLessonIndex={userProfile?.currentLessonByLanguage?.[activeLang] || 0} 
          />
        );
      case 'quests': return <QuestsScreen userProfile={userProfile} />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'account': return <AccountScreen userProfile={userProfile} />;
      default: return <View />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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
      <BottomNavBar activeTab={currentTab} onTabPress={(tab: string) => {
          setCurrentTab(tab);
          setIsAddingLanguage(false);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDE8F0' }, // Matches light blue bg in Figma
  contentArea: { flex: 1 },
  addLanguageContainer: { padding: 40, alignItems: 'center', backgroundColor: '#2D3E50', flexGrow: 1, justifyContent: 'center' },
  title: { fontFamily: 'Courier', fontSize: 24, color: 'white', marginBottom: 30, fontWeight: 'bold' },
  langButton: { backgroundColor: theme.colors.white, padding: 18, borderRadius: 15, width: '100%', alignItems: 'center', marginBottom: 15 },
  langButtonText: { fontFamily: 'Courier', color: '#2D3E50', fontSize: 18, fontWeight: 'bold' },
  cancelLink: { color: 'white', fontFamily: 'Courier', marginTop: 20, textDecorationLine: 'underline' }
});