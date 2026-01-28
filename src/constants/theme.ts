/**
 * Crispy Pro Theme Constants
 * Design System for the Franchise Operations App
 */

// ============================================
// COLORS
// ============================================
export const COLORS = {
  // Backgrounds
  background: '#E9E7D0',
  backgroundSecondary: '#DFDCC0', // Slightly darker version of E9E7D0
  backgroundTertiary: '#D5D2B0',
  cardBackground: '#FFFFFF',

  // Primary - Yellow/Amber (#FCC221)
  primary: '#FCC221',
  primaryLight: '#FDD86E',
  primaryDark: '#F9A825',
  primaryGradientStart: '#FCC221',
  primaryGradientEnd: '#FFB300',

  // Secondary - Green (#11682B)
  secondary: '#11682B',
  secondaryLight: '#E0F2F1',
  cream: '#FFFDE7',

  // Brand Accents
  brandDark: '#0E431B', // Dark Green

  // Status Colors
  success: '#11682B', // Using the green from palette
  successLight: '#DCEDC8',
  successDark: '#0E431B',

  warning: '#FCC221', // Using the primary yellow
  warningLight: '#FFF9C4',
  warningDark: '#F57F17',

  error: '#D32F2F',
  errorLight: '#FFEBEE',
  errorDark: '#B71C1C',

  info: '#0288D1',
  infoLight: '#E1F5FE',

  // Text Colors
  textPrimary: '#0E431B', // Dark Green Text
  textSecondary: '#475D4B', // Muted Green Gray
  textMuted: '#8D9E90',
  textLight: '#FFFFFF',
  textOnPrimary: '#0E431B', // Dark text on bright yellow

  // Border Colors
  border: '#D7D5BE',
  borderLight: '#F2F0DC',
  borderDark: '#0E431B', // High contrast border

  // Misc
  overlay: 'rgba(14, 67, 27, 0.4)', // Dark green overlay
  shadow: 'rgba(14, 67, 27, 0.1)', // Greenish shadow
  transparent: 'transparent',
};

// ============================================
// TYPOGRAPHY
// ============================================
export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    regular: 'System', // Use custom font if available later
    medium: 'System',
    bold: 'System',
  },

  // Font Sizes
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    base: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
    '5xl': 48,
  },

  // Font Weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// ============================================
// SPACING
// ============================================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// ============================================
// BORDER RADIUS (Increased for Softer Look)
// ============================================
export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  '2xl': 32,
  full: 9999,
};

// ============================================
// SHADOWS (Softer, Diffused)
// ============================================
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
};

// ============================================
// COMPONENT SIZES
// ============================================
export const SIZES = {
  // Icon Sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 28,
  iconXl: 32,

  // Button Heights (Pill Shapes)
  buttonSm: 36,
  buttonMd: 48,
  buttonLg: 56,

  // Input Heights
  inputSm: 40,
  inputMd: 50,
  inputLg: 60,

  // Avatar Sizes
  avatarSm: 36,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 96,

  // Tab Bar
  tabBarHeight: 65,

  // Header
  headerHeight: 60,
};

// ============================================
// STATUS BADGE COLORS
// ============================================
export const STATUS_COLORS = {
  completed: {
    background: COLORS.successLight,
    text: COLORS.successDark,
  },
  inProgress: {
    background: COLORS.primaryLight,
    text: COLORS.primaryDark,
  },
  pending: {
    background: COLORS.warningLight,
    text: COLORS.warningDark,
  },
  cancelled: {
    background: COLORS.errorLight,
    text: COLORS.errorDark,
  },
  urgent: {
    background: '#FFE5E5', // Softer red bg
    text: COLORS.error,
  },
  new: {
    background: COLORS.infoLight,
    text: COLORS.info,
  },
};

// ============================================
// QUICK ACCESS THEME OBJECT
// ============================================
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  sizes: SIZES,
  statusColors: STATUS_COLORS,
};

export default theme;
