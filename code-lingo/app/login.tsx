import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '../src/theme/globalStyles';
import { loginWithEmail } from '../src/firebase/auth';

export default function LoginScreen({ onNavigate }: { onNavigate: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      Alert.alert("Login Error", err.message);
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.headerSection}>
        <Text style={[globalStyles.heading, { fontSize: 32 }]}>codeLingo</Text>
        <View style={{ width: 100, height: 100, borderWidth: 3, borderRadius: 20, borderColor: '#2F4156' }} />
      </View>

      <View style={globalStyles.authCard}>
        <Text style={[globalStyles.heading, { color: '#FFF', fontSize: 40 }]}>log in</Text>
        
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.inputLabel}>email</Text>
          <TextInput 
            style={globalStyles.inputField} 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.inputLabel}>password</Text>
          <TextInput 
            style={globalStyles.inputField} 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={globalStyles.authButton} onPress={handleLogin}>
          <Text style={globalStyles.buttonText}>log in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigate} style={{ marginTop: 20 }}>
          <Text style={globalStyles.lightText}>don't have an account? sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}