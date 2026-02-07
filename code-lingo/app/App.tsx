import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, NovaMono_400Regular } from '@expo-google-fonts/nova-mono';

// 1. Import the LoginScreen component
import LoginScreen from '../app/login'; 

import { globalStyles } from '../src/theme/globalStyles';
import { theme } from '../src/theme/theme';

export default function App() {
  let [fontsLoaded] = useFonts({
    'NovaMono': NovaMono_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.navy} />
      </View>
    );
  }

  // 2. Return the LoginScreen instead of the placeholder text
  return (
    <>
      <LoginScreen />
      <StatusBar style="auto" />
    </>
  );
}