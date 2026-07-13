/**
 * Raptor Eats — Global Theme
 * Corporate Identity & UI/UX Design System
 *
 * All design tokens defined per the Raptor Eats brand manual.
 */

// ─── Colors ────────────────────────────────────────────────────────
export const Colors = {
  // Primary brand color — "Verde Raptor"
  primary: '#118C2D',
  primaryDark: '#0D6B22',
  primaryLight: '#E8F5E9',

  // Text & Outlines — "Negro Carbón"
  text: '#000000',

  // Alerts & Accents — "Rojo Impulso"
  alert: '#A82020',

  // Secondary/Food — "Beige Gourmet"
  secondary: '#E6D09B',
  secondaryLight: '#F5ECCD',

  // Backgrounds — "Blanco Puro"
  background: '#FFFFFF',

  // Disabled/Inactive
  disabled: '#888888',
  disabledLight: '#CCCCCC',

  // Additional semantic colors
  h1Color: '#1B4332',
  bodyColor: '#2D2D2D',
  cardBorder: '#F0F0F0',
  inputBorder: '#E0E0E0',
  inputBackground: '#FAFAFA',
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Surface colors
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F8F9FA',
};

// ─── High Contrast Colors ──────────────────────────────────────────
export const HighContrastColors = {
  // Pure Black & White with High Visibility Accents
  primary: '#FFFF00',       // Bright Yellow for high visibility
  primaryDark: '#CCCC00',
  primaryLight: '#333333',  // Dark gray for subtle highlights

  // Text & Outlines — Pure White on Black
  text: '#FFFFFF',

  // Alerts & Accents — Bright Red
  alert: '#FF3333',

  // Secondary/Food
  secondary: '#FFCC00',
  secondaryLight: '#665500',

  // Backgrounds — Pure Black
  background: '#000000',

  // Disabled/Inactive
  disabled: '#AAAAAA',
  disabledLight: '#444444',

  // Additional semantic colors
  h1Color: '#FFFF00',       // Yellow headers for readability
  bodyColor: '#FFFFFF',
  cardBorder: '#FFFF00',    // Yellow borders
  inputBorder: '#FFFFFF',
  inputBackground: '#000000',
  overlay: 'rgba(0, 0, 0, 0.8)',

  // Surface colors
  surfaceElevated: '#111111',
  surfaceSubtle: '#000000',
};

// ─── Typography ────────────────────────────────────────────────────
// Font family names match the names used by @expo-google-fonts packages
export const Fonts = {
  poppinsExtraBold: 'Poppins_800ExtraBold',
  poppinsBold: 'Poppins_700Bold',
  poppinsSemiBold: 'Poppins_600SemiBold',
  nunitoBold: 'Nunito_700Bold',
  nunitoSemiBold: 'Nunito_600SemiBold',
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
};

export const Typography = {
  h1: {
    fontFamily: Fonts.poppinsExtraBold,
    fontSize: 30,
    lineHeight: 38,
    color: Colors.h1Color,
  },
  h2: {
    fontFamily: Fonts.poppinsBold,
    fontSize: 24,
    lineHeight: 32,
    color: Colors.text,
  },
  h3: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.bodyColor,
  },
  h3SemiBold: {
    fontFamily: Fonts.nunitoSemiBold,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.bodyColor,
  },
  body: {
    fontFamily: Fonts.interRegular,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.bodyColor,
  },
  bodySmall: {
    fontFamily: Fonts.interRegular,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.bodyColor,
  },
  button: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.background,
  },
  price: {
    fontFamily: Fonts.interMedium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.h1Color,
  },
  priceTotal: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.h1Color,
  },
  label: {
    fontFamily: Fonts.interMedium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.disabled,
  },
  navActive: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.primary,
  },
  navInactive: {
    fontFamily: Fonts.interRegular,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.disabled,
  },
};

// ─── Shadows ───────────────────────────────────────────────────────
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  bottomBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  topBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
};

// ─── Spacing ───────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  section: 48,
};

// ─── Border Radius ─────────────────────────────────────────────────
export const BorderRadius = {
  sm: 8,
  card: 12,
  button: 12,
  input: 10,
  badge: 20,
  round: 999,
};

// ─── Animation Constants ───────────────────────────────────────────
export const Animation = {
  press: {
    scaleTo: 0.95,
    duration: 150,
  },
  transition: {
    duration: 250,
    easing: 'ease-in-out',
  },
};

// ─── Icon Sizes ────────────────────────────────────────────────────
export const IconSize = {
  standard: 24,
  large: 28,
  small: 20,
  touchTarget: 48,
};
