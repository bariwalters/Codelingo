import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// Components
import { BottomNavBar } from './components/BottomNavBar';
import { LandingHeader } from './components/LandingHeader';
import { LessonPath } from './components/LessonPath';

// Screens
import AccountScreen from '../app/account';
import QuestsScreen from '../app/quests';
import LeaderboardScreen from '../app/leaderboard';

// Theme
import { theme } from './theme/theme';

export default function MainShell({ userProfile }: { userProfile: any }) {
  const [currentTab, setCurrentTab] = useState('home');

  // Placeholder data for the LessonPath
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
      {/* The LandingHeader (Language/Streak) only shows on the 
        Home tab to keep the UI clean on other pages. 
      */}
      {currentTab === 'home' && (
        <LandingHeader 
          language={userProfile?.currentLanguage || 'python'} 
          streak={userProfile?.streak || 0} 
        />
      )}

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {renderContent()}
      </View>

      {/* Lara's Custom Bottom Navigation */}
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