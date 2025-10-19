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
    riskLow: '#34C75933',
    riskMedium: '#FFCC0033',
    riskHigh: '#FF3B3033',
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
    riskLow: '#4ADE8033',
    riskMedium: '#FBBF2433',
    riskHigh: '#F8717133',
    tipsBackground: 'rgba(96,165,250,0.05)',
  },
};

export const useThemeColor = () => {
  const colorScheme = useColorScheme();
  return themeColors[colorScheme === 'dark' ? 'dark' : 'light'];
};
