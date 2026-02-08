import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { theme } from '../src/theme/theme';

const { height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={styles.container}>
      {/* Centered Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../assets/animations/cat_paws.json')} // Ensure this file exists!
          autoPlay
          loop={false} // Set to false so it plays once
          onAnimationFinish={onFinish} // Automatically proceeds when done
          style={styles.lottie}
        />
      </View>

      {/* Brand Name at the Bottom */}
      <View style={styles.footer}>
        <Text style={styles.brandText}>codeLingo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F5FE', // Your specific light blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  brandText: {
    fontFamily: theme.fonts.main,
    fontSize: 36,
    color: theme.colors.navy,
    letterSpacing: 2,
  },
});