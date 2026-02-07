import { StatusBar } from 'expo-status-bar';
import { Text, View, ActivityIndicator } from 'react-native';
import { useFonts, NovaMono_400Regular } from '@expo-google-fonts/nova-mono';

// Import your new global styles and theme
import { globalStyles } from '../src/theme/globalStyles';
import { theme } from '../src/theme/theme';

export default function App() {
  // Load the font from Google Fonts
  let [fontsLoaded] = useFonts({
    'NovaMono': NovaMono_400Regular,
  });

  // Show a loading spinner while the font is downloading
  if (!fontsLoaded) {
    return (
      <View style={[globalStyles.screenContainer, globalStyles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.navy} />
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.centered}>
        <Text style={globalStyles.heading}>Codelingo</Text>
        <Text style={globalStyles.baseText}>
          Now using NovaMono and your custom palette!
        </Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}