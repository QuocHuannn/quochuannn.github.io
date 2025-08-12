import React, { createContext, useEffect, useState, ReactNode, useMemo, useCallback, useRef } from 'react';
import { Theme, ThemeContext, ThemeContextType } from '../../hooks/useTheme';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { themeStorage } from '../../utils/themeStorage';
import { AnimationPreferencesManager } from '../../utils/animationPreferences';
import { themeTransitionManager } from '../../utils/themeTransitions';
import { themePresetsManager, applyThemePreset } from '../../utils/themePresets';
import { userPreferencesManager } from '../../utils/userPreferences';

// Singleton instance để tránh tạo mới mỗi render
let globalAnimationManager: AnimationPreferencesManager | null = null;
const getAnimationManager = () => {
  if (!globalAnimationManager) {
    globalAnimationManager = new AnimationPreferencesManager();
  }
  return globalAnimationManager;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  enableAdvancedFeatures?: boolean;
  enableThemeTransitions?: boolean;
  enablePresets?: boolean;
  autoSyncPreferences?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light',
  enableAdvancedFeatures = true,
  enableThemeTransitions = true,
  enablePresets = true,
  autoSyncPreferences = true
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Use singleton animation manager
  const animationPreferencesManager = useMemo(() => getAnimationManager(), []);
  
  // Refs để tránh stale closures
  const enableAdvancedFeaturesRef = useRef(enableAdvancedFeatures);
  const enableThemeTransitionsRef = useRef(enableThemeTransitions);
  const enablePresetsRef = useRef(enablePresets);
  const autoSyncPreferencesRef = useRef(autoSyncPreferences);
  
  // Update refs when props change
  useEffect(() => {
    enableAdvancedFeaturesRef.current = enableAdvancedFeatures;
    enableThemeTransitionsRef.current = enableThemeTransitions;
    enablePresetsRef.current = enablePresets;
    autoSyncPreferencesRef.current = autoSyncPreferences;
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && enableAdvancedFeatures) {
      // Use advanced theme storage
      const preferences = themeStorage.getPreferences();
      if (preferences.theme && ['light', 'dark'].includes(preferences.theme)) {
        return preferences.theme;
      }
    } else if (typeof window !== 'undefined') {
      // Fallback to simple localStorage
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return defaultTheme;
  });
  
  // Actual theme is now the same as theme since we only support light/dark
  const actualTheme: 'light' | 'dark' = theme;

  const toggleTheme = useCallback(() => {
    // Simple toggle between light and dark
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  const handleSetTheme = useCallback(async (newTheme: Theme) => {
    // Immediate theme change for better performance
    setTheme(newTheme);
    
    // Handle optional transition animation asynchronously
    if (enableThemeTransitionsRef.current && !prefersReducedMotion) {
      const animationPrefs = animationPreferencesManager.getPreferences();
      const shouldAnimate = animationPrefs.globalAnimationsEnabled && animationPrefs.themeTransition.enabled;
      
      if (shouldAnimate) {
        // Non-blocking transition effect
        requestAnimationFrame(() => {
          document.documentElement.classList.add('theme-switching');
          setTimeout(() => {
            document.documentElement.classList.remove('theme-switching');
          }, animationPrefs.themeTransition.duration);
        });
      }
    }
  }, [prefersReducedMotion, animationPreferencesManager]);

  // Separate effects for better performance
  // Effect 1: Core theme application (most critical)
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Batch DOM updates
    root.setAttribute('data-theme', actualTheme);
    root.style.colorScheme = actualTheme;
  }, [actualTheme]);
  
  // Effect 2: Storage updates (less critical, can be debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (enableAdvancedFeaturesRef.current) {
        themeStorage.updatePreference('theme', theme);
        
        if (autoSyncPreferencesRef.current) {
          userPreferencesManager.updatePreferences({ 
            theme: { 
              theme: theme, 
              animationsEnabled: true, 
              transitionDuration: 300,
              reducedMotion: false,
              highContrast: false,
              fontSize: 'medium' as const,
              lastModified: Date.now()
            } 
          });
        }
      } else {
        localStorage.setItem('theme', theme);
      }
    }, 100); // Debounce storage updates
    
    return () => clearTimeout(timeoutId);
  }, [theme]);
  
  // Effect 3: Theme presets (optional)
  useEffect(() => {
    if (enablePresetsRef.current) {
      const currentPreset = themePresetsManager.getCurrentPreset();
      if (currentPreset) {
        requestAnimationFrame(() => {
          applyThemePreset(currentPreset.id, actualTheme);
        });
      }
    }
  }, [actualTheme]);
  
  // Effect 4: Custom event dispatch (least critical)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('themeChange', { 
        detail: { 
          theme, 
          actualTheme, 
          prefersReducedMotion, 
          timestamp: Date.now(),
          advancedFeatures: enableAdvancedFeaturesRef.current,
          transitions: enableThemeTransitionsRef.current,
          presets: enablePresetsRef.current
        } 
      }));
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [theme, actualTheme, prefersReducedMotion]);

  const contextValue: ThemeContextType = useMemo(() => ({
    theme,
    actualTheme,
    prefersReducedMotion,
    setTheme: handleSetTheme,
    toggleTheme,
  }), [theme, actualTheme, prefersReducedMotion, handleSetTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};