import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
// Make sure this path points exactly to where you saved the service!
import { generateSpeech } from '../src/services/voiceServices';

export default function TestVoicePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready to test');

  const runTest = async () => {
    setLoading(true);
    setStatus('Calling ElevenLabs...');
   
    try {
      // This is your hardcoded test line
      const testText = "Hello! I am your AI code reviewer. Your implementation is working.";
     
      const audioUrl = await generateSpeech(testText);
      setStatus('Audio generated! Playing...');
     
      // Browser-based audio playback
      const audio = new Audio(audioUrl);
      await audio.play();
     
    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ElevenLabs Audio Test</Text>
      <Text style={styles.status}>{status}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={runTest}>
          <Text style={styles.buttonText}>Generate & Play Speech</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 18, color: '#666', marginBottom: 20 },
  button: { backgroundColor: '#6200ee', padding: 20, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});