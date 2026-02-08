import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface LandingHeaderProps {
  language: string;
  streak: number;
  enrolledLanguages: string[];
  onLanguageSelect: (lang: string) => void;
  onAddLanguage: () => void;
}

export const LandingHeader = ({ 
  language, 
  streak, 
  enrolledLanguages = [], 
  onLanguageSelect,
  onAddLanguage 
}: LandingHeaderProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleSelect = (lang: string) => {
    onLanguageSelect(lang);
    setIsMenuVisible(false);
  };

  const getDisplayLanguage = (langId: string) => {
    switch (langId?.toLowerCase()) {
      case 'python': return 'Py';
      case 'javascript': return 'JS';
      case 'java': return 'Jv';
      case 'cpp': return 'C++';
      default: return '??';
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.languagePill} 
        onPress={() => setIsMenuVisible(true)}
      >
        <Text style={styles.pillText}>{getDisplayLanguage(language)}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.colors.white} style={{marginLeft: 4}} />
      </TouchableOpacity>

      <Modal transparent visible={isMenuVisible} animationType="fade">
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={[styles.dropdownMenu, { pointerEvents: 'box-none' }]}>
            <View style={styles.arrowUp} />
            <View style={styles.menuContent}>
              
              {enrolledLanguages.map((lang) => (
                <TouchableOpacity 
                  key={lang} 
                  style={styles.menuItem} 
                  onPress={() => handleSelect(lang)}
                >
                  <View style={[styles.langIcon, language === lang && styles.activeLang]}>
                    <Text style={styles.langIconText}>{getDisplayLanguage(lang)}</Text>
                  </View>
                  <Text style={styles.langLabel}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  console.log("Plus clicked!"); 
                  setIsMenuVisible(false);
                  setTimeout(() => {
                    onAddLanguage();
                  }, 300);
                }}
              >
                <View style={styles.langIcon}>
                  <Ionicons name="add" size={24} color={theme.colors.navy} />
                </View>
                <Text style={styles.langLabel}>Prog Lang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.statContainer}>
        <Ionicons name="flame" size={28} color="#FF9600" />
        <Text style={styles.streakText}>{streak}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    zIndex: 100,
  },
  languagePill: {
    backgroundColor: theme.colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  pillText: {
    fontFamily: theme.fonts.main,
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontFamily: theme.fonts.main,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 95,
    left: 15,
    width: '90%',
  },
  arrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.navy,
    marginLeft: 20,
  },
  menuContent: {
    backgroundColor: theme.colors.navy,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  menuItem: {
    alignItems: 'center',
    width: '33.3%',
    marginBottom: 10,
  },
  langIcon: {
    backgroundColor: theme.colors.white,
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeLang: {
    borderWidth: 3,
    borderColor: theme.colors.teal,
  },
  langIconText: {
    fontFamily: theme.fonts.main,
    fontWeight: 'bold',
    fontSize: 18,
  },
  langLabel: {
    color: 'white',
    fontFamily: theme.fonts.main,
    marginTop: 8,
    fontSize: 12,
  },
});