import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavBar } from './components/BottomNavBar';
import { LandingHeader } from './components/LandingHeader';
import { LessonPath } from './components/LessonPath';
import AccountScreen from '../app/account';
import QuestsScreen from '../app/quests';
import LeaderboardScreen from '../app/leaderboard';
import { theme } from './theme/theme';

export default function MainShell({ userProfile }: { userProfile: any }) {
  const [currentTab, setCurrentTab] = useState('home');

  const dummyLessons = [
    { id: '1', order: 1 }, 
    { id: '2', order: 2 }, 
    { id: '3', order: 3 },
    { id: '4', order: 4 }, 
    { id: '5', order: 5 }
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <LessonPath 
            lessons={dummyLessons} 
            currentLessonIndex={userProfile?.currentLessonByLanguage?.[userProfile.currentLanguage] || 0} 
          />
        );
      case 'quests':
        return <QuestsScreen userProfile={userProfile} />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'account':
        return <AccountScreen userProfile={userProfile} />;
      default:
        return (
          <LessonPath 
            lessons={dummyLessons} 
            currentLessonIndex={0} 
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {currentTab === 'home' && (
        <LandingHeader 
          language={userProfile?.currentLanguage || 'python'} 
          streak={userProfile?.streak || 0} 
        />
      )}

      <View style={styles.contentArea}>
        {renderContent()}
      </View>

      <BottomNavBar 
        activeTab={currentTab} 
        onTabPress={(tab: string) => setCurrentTab(tab)} 
      />
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
  }
});