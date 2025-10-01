import { useColorScheme } from 'react-native';

export const themeColors = {
  light: {
    // Surfaces
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    surfaceContainer: '#f1f5f9',

    // Text
    onSurface: '#1e293b',
    onSurfaceVariant: '#475569',
    onSurfaceMuted: '#64748b',

    // Borders
    outline: '#e2e8f0',
    outlineVariant: '#cbd5e1',

    // Primary
    primary: '#3b82f6',
    onPrimary: '#ffffff',

    // Status
    success: '#16a34a',
    warning: '#d97706',
    error: '#ef4444',
    neutral: '#6b7280',

    // Backgrounds
    background: '#ffffff',
    card: '#ffffff',

    // Shadows
    shadow: '#000000',

    // Specific component colors
    tabBackground: 'rgba(0,0,0,0.05)',
    conditionBadge: 'rgba(0,122,255,0.1)',
    riskLow: 'rgba(52,199,89,0.15)',
    riskMedium: 'rgba(255,204,0,0.15)',
    riskHigh: 'rgba(255,59,48,0.15)',
    tipsBackground: 'rgba(0,122,255,0.05)',
  },
  dark: {
    // Surfaces
    surface: '#1e293b',
    surfaceVariant: '#334155',
    surfaceContainer: '#0f172a',

    // Text
    onSurface: '#f1f5f9',
    onSurfaceVariant: '#cbd5e1',
    onSurfaceMuted: '#94a3b8',

    // Borders
    outline: '#475569',
    outlineVariant: '#64748b',

    // Primary
    primary: '#60a5fa',
    onPrimary: '#1e293b',

    // Status
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    neutral: '#9ca3af',

    // Backgrounds
    background: '#0f172a',
    card: '#1e293b',

    // Shadows
    shadow: '#000000',

    // Specific component colors
    tabBackground: 'rgba(255,255,255,0.05)',
    conditionBadge: 'rgba(96,165,250,0.15)',
    riskLow: 'rgba(74,222,128,0.15)',
    riskMedium: 'rgba(251,191,36,0.15)',
    riskHigh: 'rgba(248,113,113,0.15)',
    tipsBackground: 'rgba(96,165,250,0.05)',
  },
};

export const useThemeColor = () => {
  const colorScheme = useColorScheme();
  return themeColors[colorScheme === 'dark' ? 'dark' : 'light'];
};
