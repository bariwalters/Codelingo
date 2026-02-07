import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.m,
  },
  // ADD THIS BLOCK:
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseText: {
    fontFamily: theme.fonts.main,
    color: theme.colors.text,
    fontSize: 16,
  },
  lightText: {
    fontFamily: theme.fonts.main,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  heading: {
    fontFamily: theme.fonts.main,
    color: theme.colors.navy,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
  }
});