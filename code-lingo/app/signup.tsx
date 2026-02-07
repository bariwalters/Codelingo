import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { globalStyles } from '../src/theme/globalStyles';
import { signUpWithEmail } from '../src/firebase/auth';

export default function SignUpScreen({ onNavigate }: { onNavigate: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUpWithEmail({ email, password, username });
    } catch (err: any) {
      Alert.alert("Sign Up Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.headerSection}>
        <Text style={[globalStyles.heading, { fontSize: 32 }]}>codeLingo</Text>
        <View style={{ width: 80, height: 80, borderWidth: 3, borderRadius: 20, borderColor: '#2F4156' }} />
      </View>

      <View style={globalStyles.authCard}>
        <Text style={[globalStyles.heading, { color: '#FFF', fontSize: 36 }]}>sign up</Text>
        
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.inputLabel}>email</Text>
          <TextInput style={globalStyles.inputField} value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.inputLabel}>first name</Text>
          <TextInput style={globalStyles.inputField} value={username} onChangeText={setUsername} />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.inputLabel}>password</Text>
          <TextInput style={globalStyles.inputField} secureTextEntry value={password} onChangeText={setPassword} />
        </View>

        <TouchableOpacity style={globalStyles.authButton} onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#2F4156" /> : <Text style={globalStyles.buttonText}>sign up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigate} style={{ marginTop: 20 }}>
          <Text style={globalStyles.lightText}>already have an account? log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}