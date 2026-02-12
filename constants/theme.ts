/**
 * Crispy Pro Theme Constants
 * Design System for the Franchise Operations App
 */

// ============================================
// COLORS
// ============================================
export const COLORS = {
  // Backgrounds
  background: '#F8F9FA', // Clean White/Gray
  backgroundSecondary: '#FFFFFF', // Pure White for cards
  backgroundTertiary: '#F1F3F5',
  cardBackground: '#FFFFFF',

  // Primary - Green (#8BC34A - Fresh Green)
  primary: '#7CB342', // Fresh Green from image
  primaryLight: '#DCEDC8',
  primaryDark: '#558B2F',
  primaryGradientStart: '#9CCC65',
  primaryGradientEnd: '#689F38',

  // Secondary - Dark Green
  secondary: '#33691E',
  secondaryLight: '#F1F8E9',
  cream: '#FFFDE7', // Kept for legacy support if needed

  // Brand Accents
  brandDark: '#1B5E20',

  // Status Colors
  success: '#43A047',
  successLight: '#E8F5E9',
  successDark: '#1B5E20',

  warning: '#FFB300', // Amber
  warningLight: '#FFF8E1',
  warningDark: '#FF6F00',

  error: '#E53935',
  errorLight: '#FFEBEE',
  errorDark: '#B71C1C',

  info: '#039BE5',
  infoLight: '#E1F5FE',

  // Text Colors
  textPrimary: '#212121', // Dark Gray for high contrast
  textSecondary: '#757575', // Medium Gray
  textMuted: '#9E9E9E', // Light Gray
  textLight: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  borderDark: '#BDBDBD',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.4)',
  shadow: 'rgba(0, 0, 0, 0.08)', // Softer shadow
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
    background: '#E8F5E9', // Green 50
    text: '#2E7D32', // Green 800
  },
  inProgress: {
    background: '#FFF8E1', // Amber 50
    text: '#F57F17', // Amber 900
  },
  pending: {
    background: '#F3E5F5', // Purple 50
    text: '#7B1FA2', // Purple 800
  },
  cancelled: {
    background: '#FFEBEE', // Red 50
    text: '#C62828', // Red 800
  },
  urgent: {
    background: '#FBE9E7', // Deep Orange 50
    text: '#D84315', // Deep Orange 800
  },
  new: {
    background: '#E3F2FD', // Blue 50
    text: '#1565C0', // Blue 800
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
