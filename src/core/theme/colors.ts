// OFFHOOK — Color System
// Ultra-premium deep space + neon accent palette

export const Colors = {
  // Primary backgrounds
  primary: '#0A0A1A',
  primaryDark: '#050510',
  primaryLight: '#12122A',
  surface: '#1A1A2E',
  surfaceLight: '#222240',
  surfaceElevated: '#2A2A4A',

  // Accent colors
  accent1: '#6C63FF', // Electric violet
  accent1Light: '#8B85FF',
  accent1Dark: '#5046E5',
  accent2: '#00F5C4', // Neon mint
  accent2Light: '#33FFD6',
  accent2Dark: '#00CC9E',
  accent3: '#FF6B6B', // Alert red
  accent3Light: '#FF9999',
  accent3Dark: '#E04545',

  // Gradient stops
  gradientPurple: '#6C63FF',
  gradientTeal: '#00F5C4',
  gradientBlue: '#0A84FF',
  gradientPink: '#FF2D92',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0CC',
  textMuted: '#6E6E8A',
  textAccent: '#6C63FF',

  // Glassmorphism
  glassBg: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderLight: 'rgba(255, 255, 255, 0.18)',
  glassHighlight: 'rgba(255, 255, 255, 0.08)',

  // Risk meter colors
  riskLow: '#00F5C4',
  riskMedium: '#FFD93D',
  riskHigh: '#FF8C42',
  riskCritical: '#FF6B6B',

  // Status
  success: '#00F5C4',
  warning: '#FFD93D',
  error: '#FF6B6B',
  info: '#0A84FF',

  // Shadows
  shadowPrimary: 'rgba(108, 99, 255, 0.25)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',

  // Miscellaneous
  divider: 'rgba(255, 255, 255, 0.08)',
  overlay: 'rgba(5, 5, 16, 0.85)',
  cardBg: 'rgba(26, 26, 46, 0.8)',
} as const;

export const Gradients = {
  hero: ['#6C63FF', '#00F5C4', '#0A84FF'],
  aurora: ['#6C63FF', '#0A84FF', '#00F5C4'],
  sunset: ['#FF2D92', '#FF6B6B', '#FFD93D'],
  accent: ['#6C63FF', '#8B85FF'],
  dark: ['#0A0A1A', '#1A1A2E'],
  card: ['rgba(108, 99, 255, 0.15)', 'rgba(0, 245, 196, 0.05)'],
  risk: ['#00F5C4', '#FFD93D', '#FF8C42', '#FF6B6B'],
} as const;
