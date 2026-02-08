import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, NovaMono_400Regular } from '@expo-google-fonts/nova-mono';
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../src/firebase/firebase";
import { logout } from "../src/firebase/auth";
import { getUserProfile } from "../src/firebase/db";
import { UserProfile } from "../src/firebase/types";

import LoginScreen from '../app/login'; 
import SignUpScreen from '../app/signup'; 
import LessonScreen from '../app/lesson';
import { globalStyles } from '../src/theme/globalStyles';
import { theme } from '../src/theme/theme';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);
  
  type AppScreen = "dashboard" | "lesson";
  const [screen, setScreen] = useState<AppScreen>("dashboard");


  let [fontsLoaded] = useFonts({ 'NovaMono': NovaMono_400Regular });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      }
      
      if (!firebaseUser) {
        setUserProfile(null);
        setScreen("dashboard");
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

  // If not logged in, show Login or Signup based on isLoginView state
  if (!user) {
    return isLoginView ? (
      <LoginScreen onNavigate={() => setIsLoginView(false)} />
    ) : (
      <SignUpScreen onNavigate={() => setIsLoginView(true)} />
    );
  }

  if (screen === "lesson") {
    return <LessonScreen onExit={() => setScreen("dashboard")} />;
  }


  // Dashboard View (Logged In)
  return (
    <View style={[globalStyles.screenContainer, globalStyles.centered]}>
      <Text style={globalStyles.heading}>hello, {userProfile?.username || 'coder'}!</Text>
      
      <TouchableOpacity
        style={globalStyles.authButton}
        onPress={() => setScreen("lesson")}
      >
        <Text style={globalStyles.buttonText}>start lesson</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={globalStyles.authButton} onPress={() => logout()}>
        <Text style={globalStyles.buttonText}>log out</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}