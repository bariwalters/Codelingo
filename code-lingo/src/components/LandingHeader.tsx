import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const LandingHeader = ({ language, streak, enrolledLanguages = [], onLanguageSelect, onAddLanguage }: any) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const getShort = (id: string) => {
    const code = id?.toLowerCase();
    if (code === 'python') return 'Py';
    if (code === 'javascript') return 'JS';
    if (code === 'typescript') return 'TS';
    if (code === 'cpp') return 'C++';
    if (code === 'java') return 'Jv';
    if (code === 'csharp') return 'C#';
    return '??';
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.languagePill} onPress={() => setIsMenuVisible(true)}>
        <Text style={styles.pillText}>{getShort(language)}</Text>
        <Ionicons name="chevron-down" size={16} color="#2D3E50" style={{marginLeft: 4}} />
      </TouchableOpacity>

      <Modal transparent visible={isMenuVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setIsMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
            <View style={styles.arrowUp} />
            <View style={styles.menuContent}>
              {enrolledLanguages.map((langId: string) => (
                <TouchableOpacity 
                  key={langId} 
                  style={styles.menuItem} 
                  onPress={() => { onLanguageSelect(langId); setIsMenuVisible(false); }}
                >
                  <View style={[styles.langIcon, language.toLowerCase() === langId.toLowerCase() && styles.activeLang]}>
                    <Text style={styles.langIconText}>{getShort(langId)}</Text>
                  </View>
                  <Text style={styles.langLabel}>{langId}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.menuItem} onPress={() => { setIsMenuVisible(false); setTimeout(onAddLanguage, 300); }}>
                <View style={styles.langIcon}><Ionicons name="add" size={24} color="#2D3E50" /></View>
                <Text style={styles.langLabel}>Prog Lang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.streakContainer}>
        <Ionicons name="flame-outline" size={28} color="#000" />
        <Text style={styles.streakText}>{streak}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#2D3E50' },
  languagePill: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  pillText: { color: '#2D3E50', fontSize: 18, fontWeight: 'bold', fontFamily: 'Courier' },
  streakContainer: { flexDirection: 'row', alignItems: 'center' },
  streakText: { fontSize: 20, fontWeight: 'bold', color: '#000', marginLeft: 4, fontFamily: 'Courier' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  dropdownMenu: { position: 'absolute', top: 95, left: 10, right: 10 },
  arrowUp: { width: 0, height: 0, borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 12, borderBottomColor: '#3F566E', marginLeft: 25, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  menuContent: { backgroundColor: '#3F566E', borderRadius: 20, padding: 20, flexDirection: 'row', flexWrap: 'wrap' },
  menuItem: { alignItems: 'center', width: '33.3%', marginBottom: 15 },
  langIcon: { backgroundColor: 'white', width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  activeLang: { borderWidth: 3, borderColor: '#4ECDC4' },
  langIconText: { fontWeight: 'bold', color: '#2D3E50', fontFamily: 'Courier', fontSize: 18 },
  langLabel: { color: 'white', marginTop: 8, fontSize: 11, fontFamily: 'Courier' }
});