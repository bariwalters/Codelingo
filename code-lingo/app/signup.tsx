import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { globalStyles } from '../src/theme/globalStyles';
import { signUpWithEmail } from '../src/firebase/auth';
import { Picker } from "@react-native-picker/picker";
import type { LanguageId } from "../src/firebase/types";


export default function SignUpScreen({ onNavigate }: { onNavigate: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>("python");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUpWithEmail({ email, password, username, initialLanguage: selectedLanguage });
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
          <Text style={globalStyles.inputLabel}>starting language</Text>
          
          <View style={[
            globalStyles.inputField, 
            { 
              justifyContent: 'center', 
              paddingHorizontal: 0,
              overflow: 'hidden' 
            }
          ]}>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={(v) => setSelectedLanguage(v as LanguageId)}
              dropdownIconColor="#2F4156"
              mode="dropdown" // Better for Android "feel"
              style={{ 
                width: '100%',
                color: '#2F4156', 
                fontFamily: 'NovaMono'
              }}
            >
              <Picker.Item label="Python" value="python" />
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="javascript" />
              <Picker.Item label="C++" value="cpp" />
              <Picker.Item label="SQL" value="sql" />
            </Picker>
          </View>
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