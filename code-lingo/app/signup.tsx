import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  StyleSheet 
} from 'react-native';
import { globalStyles } from '../src/theme/globalStyles';
import { signUpWithEmail } from '../src/firebase/auth';
import { Picker } from "@react-native-picker/picker";
import type { LanguageId } from "../src/firebase/types";
import { theme } from '../src/theme/theme';
import LottieView from 'lottie-react-native';

export default function SignUpScreen({ onNavigate }: { onNavigate: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>("python");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert("Missing Fields", "Please fill in all details");
      return;
    }
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <View style={[globalStyles.screenContainer, { flex: 1 }]}>
        
        {/* Header Section */}
        <View style={[globalStyles.headerSection, { marginTop: 62, paddingBottom: 0 }]}>
          <Text style={[globalStyles.heading, { fontSize: 32 }]}>codeLingo</Text>
          <View style={{ alignItems: 'center' }}>
            <LottieView
              source={require('../assets/animations/cat_mascot.json')}
              autoPlay
              loop
              style={styles.lottieCat}
            />
          </View>
        </View>

        {/* Auth Card */}
        <View style={[
          globalStyles.authCard, 
          { 
            flex: 1, 
            marginBottom: 0, 
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 0,
            paddingBottom: 40 
          }
        ]}>
          <Text style={[globalStyles.heading, { color: '#FFF', fontSize: 36, marginBottom: 5 }]}>sign up</Text>
          
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
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={(v) => setSelectedLanguage(v as LanguageId)}
                dropdownIconColor="#2F4156"
                mode="dropdown"
                // Removed background from picker itself to let wrapper handle it
                style={styles.picker}
                itemStyle={styles.pickerItemStyle}
              >
                <Picker.Item label="Python" value="python" style={styles.pickerItem} />
                <Picker.Item label="Java" value="java" style={styles.pickerItem} />
                <Picker.Item label="JavaScript" value="javascript" style={styles.pickerItem} />
                <Picker.Item label="C++" value="cpp" style={styles.pickerItem} />
                <Picker.Item label="SQL" value="sql" style={styles.pickerItem} />
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

          <TouchableOpacity onPress={onNavigate} style={{ marginTop: 15, alignSelf: 'center' }}>
            <Text style={globalStyles.lightText}>already have an account? log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  lottieCat: {
    width: 150, 
    height: 150,
    backgroundColor: 'transparent',
  },
  pickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 15, // Matches your other inputs
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0, // Ensures no weird double borders
  },
  picker: {
    width: '100%',
    color: '#ffffff',
    ...Platform.select({
      android: {
        marginLeft: -8, // Centers text better on Android
      }
    })
  },
  pickerItem: {
    fontFamily: theme.fonts.main, // Global font for the items
    fontSize: 16,
    color: '#ffffff',
  },
  pickerItemStyle: {
    // Specifically for iOS wheel styling
    fontFamily: theme.fonts.main,
    fontSize: 16,
    height: 50,
  }
});