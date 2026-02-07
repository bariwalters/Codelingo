import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../src/theme/globalStyles';

export default function LoginScreen() {
  return (
    <View style={globalStyles.screenContainer}>
      {/* Top Header Section */}
      <View style={globalStyles.headerSection}>
        <Text style={[globalStyles.heading, { fontSize: 32 }]}>codeLingo</Text>
        {/* Replace with your actual cat image asset */}
        <View style={{ width: 100, height: 100, borderWidth: 3, borderRadius: 20, borderColor: '#2F4156' }} />
      </View>

      {/* Navy Auth Card */}
      <View style={globalStyles.authCard}>
        <Text style={[globalStyles.heading, { color: '#FFF', fontSize: 40 }]}>log in</Text>
        
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.inputLabel}>email</Text>
          <TextInput style={globalStyles.inputField} />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.inputLabel}>password</Text>
          <TextInput style={globalStyles.inputField} secureTextEntry />
        </View>

        <TouchableOpacity style={globalStyles.authButton}>
          <Text style={globalStyles.buttonText}>log in</Text>
        </TouchableOpacity>
        
        <Text style={[globalStyles.lightText, { marginTop: 15, fontSize: 12 }]}>
          don't have an account? sign up
        </Text>
      </View>
    </View>
  );
}