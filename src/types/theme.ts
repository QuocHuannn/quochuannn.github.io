// Theme Types
// Centralized type definitions for theme system

export interface ThemePreferences {
  theme: 'light' | 'dark';
  animationsEnabled: boolean;
  transitionDuration: number;
  autoSwitchTime?: {
    lightModeStart: string; // HH:MM format
    darkModeStart: string;  // HH:MM format
  };
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  lastModified: number;
}

export interface ThemeStorageOptions {
  storageType: 'localStorage' | 'sessionStorage';
  key: string;
  fallbackPreferences: Partial<ThemePreferences>;
  enableAutoSync: boolean;
  syncInterval?: number; // milliseconds
}