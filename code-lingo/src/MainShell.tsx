import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavbar } from './components/BottomNavBar';
import { LandingHeader } from './components/LandingHeader';
import { LessonPath } from './components/LessonPath';
import AccountScreen from '../app/account';
import { theme } from './theme/theme';

export default function MainShell({ userProfile }: any) {
  const [currentTab, setCurrentTab] = useState('home');

  // Dummy lessons for the path - Jenna will likely provide real ones later
  const dummyLessons = [
    { id: '1', order: 1 }, { id: '2', order: 2 }, { id: '3', order: 3 },
    { id: '4', order: 4 }, { id: '5', order: 5 }
  ];

  return (
    <View style={styles.container}>
      {/* Only show the path header if we are on the home tab */}
      {currentTab === 'home' && (
        <LandingHeader 
          language={userProfile?.currentLanguage || 'python'} 
          streak={userProfile?.streak || 0} 
        />
      )}

      <View style={{ flex: 1 }}>
        {currentTab === 'home' ? (
          <LessonPath 
            lessons={dummyLessons} 
            currentLessonIndex={userProfile?.currentLessonByLanguage?.[userProfile.currentLanguage] || 0} 
          />
        ) : (
          <AccountScreen userProfile={userProfile} />
        )}
      </View>

      {/* Lara's Navbar with a function to change tabs */}
      <BottomNavbar activeTab={currentTab} onTabPress={setCurrentTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});