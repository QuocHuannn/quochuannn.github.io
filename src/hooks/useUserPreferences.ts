// React Hook for User Preferences Management
// Provides easy integration of user preferences system in React components

import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  userPreferencesManager,
  UserPreferences,
  UserUIPreferences,
  ThemePreferences
} from '../utils/userPreferences';
import { AnimationPreferences } from '../utils/animationPreferences';
import { useTheme } from './useTheme';
import { useReducedMotion } from './useReducedMotion';

export interface UseUserPreferencesOptions {
  autoSync?: boolean;
  enableCloudSync?: boolean;
  cloudSyncUrl?: string;
  onPreferencesChange?: (preferences: UserPreferences) => void;
  onSyncError?: (error: Error) => void;
}

export interface UseUserPreferencesReturn {
  // State
  preferences: UserPreferences;
  themePreferences: ThemePreferences;
  animationPreferences: AnimationPreferences;
  uiPreferences: UserUIPreferences;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date;
  
  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  updateThemePreferences: (updates: Partial<ThemePreferences>) => void;
  updateAnimationPreferences: (updates: Partial<AnimationPreferences>) => void;
  updateUIPreferences: (updates: Partial<UserUIPreferences>) => void;
  
  // Reset functions
  resetPreferences: () => void;
  resetSection: (section: keyof UserPreferences) => void;
  
  // Import/Export
  exportPreferences: () => string;
  importPreferences: (json: string, merge?: boolean) => boolean;
  
  // Cloud sync
  setUserId: (userId: string) => void;
  setCloudSync: (enabled: boolean, cloudSyncUrl?: string) => void;
  
  // Storage info
  getStorageInfo: () => { used: number; available: number; total: number };
}

/**
 * Main hook for user preferences management
 */
export function useUserPreferences(options: UseUserPreferencesOptions = {}): UseUserPreferencesReturn {
  const {
    onPreferencesChange,
    onSyncError
  } = options;

  const [preferences, setPreferences] = useState<UserPreferences>(() => 
    userPreferencesManager.getPreferences()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Subscribe to preference changes
  useEffect(() => {
    const unsubscribe = userPreferencesManager.subscribe((updatedPreferences) => {
      setPreferences(updatedPreferences);
      onPreferencesChange?.(updatedPreferences);
    });

    return unsubscribe;
  }, [onPreferencesChange]);

  // Derived state
  const themePreferences = useMemo(() => preferences.theme, [preferences.theme]);
  const animationPreferences = useMemo(() => preferences.animations, [preferences.animations]);
  const uiPreferences = useMemo(() => preferences.ui, [preferences.ui]);
  const lastUpdated = useMemo(() => new Date(preferences.lastUpdated), [preferences.lastUpdated]);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    try {
      setError(null);
      userPreferencesManager.updatePreferences(updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update preferences');
      setError(error.message);
      onSyncError?.(error);
    }
  }, [onSyncError]);

  // Update theme preferences
  const updateThemePreferences = useCallback((updates: Partial<ThemePreferences>) => {
    try {
      setError(null);
      userPreferencesManager.updateThemePreferences(updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update theme preferences');
      setError(error.message);
      onSyncError?.(error);
    }
  }, [onSyncError]);

  // Update animation preferences
  const updateAnimationPreferences = useCallback((updates: Partial<AnimationPreferences>) => {
    try {
      setError(null);
      userPreferencesManager.updateAnimationPreferences(updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update animation preferences');
      setError(error.message);
      onSyncError?.(error);
    }
  }, [onSyncError]);

  // Update UI preferences
  const updateUIPreferences = useCallback((updates: Partial<UserUIPreferences>) => {
    try {
      setError(null);
      userPreferencesManager.updateUIPreferences(updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update UI preferences');
      setError(error.message);
      onSyncError?.(error);
    }
  }, [onSyncError]);

  // Reset preferences
  const resetPreferences = useCallback(() => {
    try {
      setError(null);
      userPreferencesManager.resetPreferences();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset preferences');
      setError(error.message);
      onSyncError?.(error);
    }
  }, [onSyncError]);

  // Reset section
  const resetSection = useCallback((section: keyof UserPreferences) => {
    try {
      setError(null);
      userPreferencesManager.resetSection(section);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset section');
      setError(error.message);
      onSyncError?.(error);
    }
  }, [onSyncError]);

  // Export preferences
  const exportPreferences = useCallback(() => {
    return userPreferencesManager.exportPreferences();
  }, []);

  // Import preferences
  const importPreferences = useCallback((json: string, merge = true) => {
    try {
      setError(null);
      return userPreferencesManager.importPreferences(json, merge);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to import preferences');
      setError(error.message);
      onSyncError?.(error);
      return false;
    }
  }, [onSyncError]);

  // Set user ID
  const setUserId = useCallback((userId: string) => {
    userPreferencesManager.setUserId(userId);
  }, []);

  // Set cloud sync
  const setCloudSync = useCallback((enabled: boolean, cloudSyncUrl?: string) => {
    userPreferencesManager.setCloudSync(enabled, cloudSyncUrl);
  }, []);

  // Get storage info
  const getStorageInfo = useCallback(() => {
    return userPreferencesManager.getStorageInfo();
  }, []);

  return {
    // State
    preferences,
    themePreferences,
    animationPreferences,
    uiPreferences,
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    updatePreferences,
    updateThemePreferences,
    updateAnimationPreferences,
    updateUIPreferences,
    
    // Reset functions
    resetPreferences,
    resetSection,
    
    // Import/Export
    exportPreferences,
    importPreferences,
    
    // Cloud sync
    setUserId,
    setCloudSync,
    
    // Storage info
    getStorageInfo
  };
}

/**
 * Hook for theme preferences only
 */
export function useThemePreferences() {
  const { themePreferences, updateThemePreferences, error } = useUserPreferences();
  const { theme, setTheme } = useTheme();
  
  // Sync theme with preferences
  useEffect(() => {
    if (themePreferences.theme !== theme) {
      setTheme(themePreferences.theme);
    }
  }, [themePreferences.theme, theme, setTheme]);
  
  const updateTheme = useCallback((newTheme: 'light' | 'dark') => {
    updateThemePreferences({ theme: newTheme });
  }, [updateThemePreferences]);
  
  return {
    preferences: themePreferences,
    currentTheme: theme,
    updateTheme,
    updatePreferences: updateThemePreferences,
    error
  };
}

/**
 * Hook for animation preferences only
 */
export function useAnimationPreferences() {
  const { animationPreferences, updateAnimationPreferences, error } = useUserPreferences();
  const prefersReducedMotion = useReducedMotion();
  
  // Check if animations should be enabled
  const shouldAnimate = useMemo(() => {
    return animationPreferences.globalAnimationsEnabled && !prefersReducedMotion;
  }, [animationPreferences.globalAnimationsEnabled, prefersReducedMotion]);

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    updateAnimationPreferences({ globalAnimationsEnabled: enabled });
  }, [updateAnimationPreferences]);

  const setTransitionDuration = useCallback((duration: number) => {
    updateAnimationPreferences({
      themeTransition: {
        ...animationPreferences.themeTransition,
        duration: Math.max(0, Math.min(2000, duration))
      }
    });
  }, [updateAnimationPreferences, animationPreferences.themeTransition]);
  
  return {
    preferences: animationPreferences,
    shouldAnimate,
    prefersReducedMotion,
    setAnimationsEnabled,
    setTransitionDuration,
    updatePreferences: updateAnimationPreferences,
    error
  };
}

/**
 * Hook for UI preferences only
 */
export function useUIPreferences() {
  const { uiPreferences, updateUIPreferences, error } = useUserPreferences();
  
  const updateLayout = useCallback((updates: Partial<UserUIPreferences['layout']>) => {
    updateUIPreferences({ 
      layout: {
        ...uiPreferences.layout,
        ...updates
      }
    });
  }, [updateUIPreferences, uiPreferences.layout]);
  
  const updateAccessibility = useCallback((updates: Partial<UserUIPreferences['accessibility']>) => {
    updateUIPreferences({ 
      accessibility: {
        ...uiPreferences.accessibility,
        ...updates
      }
    });
  }, [updateUIPreferences, uiPreferences.accessibility]);
  
  const updatePerformance = useCallback((updates: Partial<UserUIPreferences['performance']>) => {
    updateUIPreferences({ 
      performance: {
        ...uiPreferences.performance,
        ...updates
      }
    });
  }, [updateUIPreferences, uiPreferences.performance]);
  
  const updateContent = useCallback((updates: Partial<UserUIPreferences['content']>) => {
    updateUIPreferences({ 
      content: {
        ...uiPreferences.content,
        ...updates
      }
    });
  }, [updateUIPreferences, uiPreferences.content]);
  
  const updatePrivacy = useCallback((updates: Partial<UserUIPreferences['privacy']>) => {
    updateUIPreferences({ 
      privacy: {
        ...uiPreferences.privacy,
        ...updates
      }
    });
  }, [updateUIPreferences, uiPreferences.privacy]);
  
  return {
    preferences: uiPreferences,
    layout: uiPreferences.layout,
    accessibility: uiPreferences.accessibility,
    performance: uiPreferences.performance,
    content: uiPreferences.content,
    privacy: uiPreferences.privacy,
    updateLayout,
    updateAccessibility,
    updatePerformance,
    updateContent,
    updatePrivacy,
    updatePreferences: updateUIPreferences,
    error
  };
}

/**
 * Hook for accessibility preferences
 */
export function useAccessibilityPreferences() {
  const { accessibility, updateAccessibility, error } = useUIPreferences();
  const prefersReducedMotion = useReducedMotion();
  
  // Auto-sync reduced motion preference
  useEffect(() => {
    if (accessibility.reducedMotion !== prefersReducedMotion) {
      updateAccessibility({ reducedMotion: prefersReducedMotion });
    }
  }, [accessibility.reducedMotion, prefersReducedMotion, updateAccessibility]);
  
  const toggleHighContrast = useCallback(() => {
    updateAccessibility({ highContrast: !accessibility.highContrast });
  }, [accessibility.highContrast, updateAccessibility]);
  
  const toggleLargeText = useCallback(() => {
    updateAccessibility({ largeText: !accessibility.largeText });
  }, [accessibility.largeText, updateAccessibility]);
  
  const toggleReducedMotion = useCallback(() => {
    updateAccessibility({ reducedMotion: !accessibility.reducedMotion });
  }, [accessibility.reducedMotion, updateAccessibility]);
  
  return {
    preferences: accessibility,
    highContrast: accessibility.highContrast,
    largeText: accessibility.largeText,
    reducedMotion: accessibility.reducedMotion,
    screenReader: accessibility.screenReader,
    keyboardNavigation: accessibility.keyboardNavigation,
    focusIndicators: accessibility.focusIndicators,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    updatePreferences: updateAccessibility,
    error
  };
}

/**
 * Hook for performance preferences
 */
export function usePerformancePreferences() {
  const { performance, updatePerformance, error } = useUIPreferences();
  
  const toggleAnimations = useCallback(() => {
    updatePerformance({ enableAnimations: !performance.enableAnimations });
  }, [performance.enableAnimations, updatePerformance]);
  
  const toggleTransitions = useCallback(() => {
    updatePerformance({ enableTransitions: !performance.enableTransitions });
  }, [performance.enableTransitions, updatePerformance]);
  
  const toggleParallax = useCallback(() => {
    updatePerformance({ enableParallax: !performance.enableParallax });
  }, [performance.enableParallax, updatePerformance]);
  
  const toggleBlur = useCallback(() => {
    updatePerformance({ enableBlur: !performance.enableBlur });
  }, [performance.enableBlur, updatePerformance]);
  
  const setImageQuality = useCallback((quality: 'low' | 'medium' | 'high' | 'auto') => {
    updatePerformance({ imageQuality: quality });
  }, [updatePerformance]);
  
  return {
    preferences: performance,
    enableAnimations: performance.enableAnimations,
    enableTransitions: performance.enableTransitions,
    enableParallax: performance.enableParallax,
    enableBlur: performance.enableBlur,
    imageQuality: performance.imageQuality,
    lazyLoading: performance.lazyLoading,
    toggleAnimations,
    toggleTransitions,
    toggleParallax,
    toggleBlur,
    setImageQuality,
    updatePreferences: updatePerformance,
    error
  };
}

/**
 * Hook for preference import/export
 */
export function usePreferenceSync() {
  const { 
    exportPreferences, 
    importPreferences, 
    setUserId, 
    setCloudSync, 
    getStorageInfo,
    error 
  } = useUserPreferences();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const exportToFile = useCallback(async () => {
    setIsExporting(true);
    try {
      const json = exportPreferences();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-preferences-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Failed to export preferences:', err);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [exportPreferences]);
  
  const importFromFile = useCallback(async (file: File, merge = true): Promise<boolean> => {
    setIsImporting(true);
    try {
      const text = await file.text();
      const success = importPreferences(text, merge);
      return success;
    } catch (err) {
      console.error('Failed to import preferences:', err);
      return false;
    } finally {
      setIsImporting(false);
    }
  }, [importPreferences]);
  
  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    try {
      const json = exportPreferences();
      await navigator.clipboard.writeText(json);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }, [exportPreferences]);
  
  const importFromClipboard = useCallback(async (merge = true): Promise<boolean> => {
    try {
      const text = await navigator.clipboard.readText();
      return importPreferences(text, merge);
    } catch (err) {
      console.error('Failed to import from clipboard:', err);
      return false;
    }
  }, [importPreferences]);
  
  return {
    exportToFile,
    importFromFile,
    copyToClipboard,
    importFromClipboard,
    setUserId,
    setCloudSync,
    getStorageInfo,
    isExporting,
    isImporting,
    error
  };
}

/**
 * Hook for preference validation
 */
export function usePreferenceValidation() {
  const validatePreferences = useCallback((preferences: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!preferences || typeof preferences !== 'object') {
      errors.push('Preferences must be an object');
      return { isValid: false, errors };
    }
    
    // Validate structure
    const requiredSections = ['theme', 'animations', 'ui', 'version', 'lastUpdated'];
    requiredSections.forEach(section => {
      if (!preferences[section]) {
        errors.push(`Missing required section: ${section}`);
      }
    });
    
    // Validate theme section
    if (preferences.theme) {
      const validThemes = ['light', 'dark'];
      if (!validThemes.includes(preferences.theme.theme)) {
        errors.push('Invalid theme value');
      }
    }
    
    // Validate version
    if (preferences.version && typeof preferences.version !== 'string') {
      errors.push('Version must be a string');
    }
    
    // Validate timestamp
    if (preferences.lastUpdated && typeof preferences.lastUpdated !== 'number') {
      errors.push('lastUpdated must be a number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);
  
  return {
    validatePreferences
  };
}