import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.skyBlue,
  },
  headerSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authCard: {
    flex: 0.6,
    backgroundColor: theme.colors.navy,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingHorizontal: 40,
    paddingTop: 30,
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: theme.fonts.main,
    color: theme.colors.white,
    fontSize: 18,
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: theme.colors.white,
    borderRadius: 25,
    height: 45,
    paddingHorizontal: 20,
    fontFamily: theme.fonts.main,
  },
  authButton: {
    backgroundColor: theme.colors.beige,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: theme.fonts.main,
    color: theme.colors.navy,
    fontSize: 20,
  },
  heading: {
    fontFamily: theme.fonts.main,
    color: theme.colors.navy,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
  },
  baseText: {
    fontFamily: theme.fonts.main,
    color: theme.colors.text,
    fontSize: 16,
  },
  lightText: {
    fontFamily: theme.fonts.main,
    color: theme.colors.white,
    fontSize: 12,
  }, // <--- Check for this comma!
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});