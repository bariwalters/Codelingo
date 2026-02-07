import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from 'react-native';
import { useFonts, NovaMono_400Regular } from '@expo-google-fonts/nova-mono';
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../src/firebase/firebase";
import { getUserProfile } from "../src/firebase/db";
import { UserProfile } from "../src/firebase/types";

import LoginScreen from '../app/login'; 
import SignUpScreen from '../app/signup'; 
import MainShell from '../src/MainShell';
import { theme } from '../src/theme/theme';
import { globalStyles } from '../src/theme/globalStyles';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

  let [fontsLoaded] = useFonts({ 'NovaMono': NovaMono_400Regular });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.navy} />
      </View>
    );
  }

  if (!user) {
    return isLoginView 
      ? <LoginScreen onNavigate={() => setIsLoginView(false)} />
      : <SignUpScreen onNavigate={() => setIsLoginView(true)} />;
  }

  // Pass userProfile to the main app shell
  return <MainShell userProfile={userProfile} />;
}