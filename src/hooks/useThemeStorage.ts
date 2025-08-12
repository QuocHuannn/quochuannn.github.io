import { useState, useEffect, useCallback, useRef } from 'react';
import type { ThemePreferences, ThemeStorageOptions } from '../types/theme';
import { 
  ThemeStorage,
  themeStorage as defaultStorage 
} from '../utils/themeStorage';

export interface UseThemeStorageOptions {
  storage?: ThemeStorage;
  syncOnMount?: boolean;
  enableRealTimeSync?: boolean;
}

export interface UseThemeStorageReturn {
  preferences: ThemePreferences;
  updatePreference: <K extends keyof ThemePreferences>(
    key: K, 
    value: ThemePreferences[K]
  ) => void;
  setPreferences: (prefs: Partial<ThemePreferences>) => void;
  clearPreferences: () => void;
  exportPreferences: () => string;
  importPreferences: (json: string) => boolean;
  isLoading: boolean;
  error: string | null;
  storageInfo: {
    used: number;
    available: number;
    percentage: number;
  };
}

/**
 * Hook để quản lý theme preferences với storage persistence
 */
export const useThemeStorage = (options: UseThemeStorageOptions = {}): UseThemeStorageReturn => {
  const {
    storage = defaultStorage,
    syncOnMount = true,
    enableRealTimeSync = true
  } = options;

  const [preferences, setPreferencesState] = useState<ThemePreferences>(() => {
    if (syncOnMount) {
      return storage.getPreferences();
    }
    return {
      theme: 'light',
      animationsEnabled: true,
      transitionDuration: 300,
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      lastModified: Date.now()
    };
  });

  const [isLoading, setIsLoading] = useState(!syncOnMount);
  const [error, setError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState(() => storage.getStorageInfo());
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Load preferences on mount if not synced initially
  useEffect(() => {
    if (!syncOnMount) {
      try {
        setIsLoading(true);
        const prefs = storage.getPreferences();
        setPreferencesState(prefs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preferences');
      } finally {
        setIsLoading(false);
      }
    }
  }, [storage, syncOnMount]);

  // Subscribe to preference changes
  useEffect(() => {
    if (!enableRealTimeSync) return;

    const handlePreferencesChange = (newPreferences: ThemePreferences) => {
      setPreferencesState(newPreferences);
      setStorageInfo(storage.getStorageInfo());
      setError(null);
    };

    try {
      unsubscribeRef.current = storage.subscribe(handlePreferencesChange);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to changes');
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [storage, enableRealTimeSync]);

  // Listen for custom events
  useEffect(() => {
    if (!enableRealTimeSync) return;

    const handlePreferencesChanged = (event: CustomEvent) => {
      const { preferences: newPrefs, source } = event.detail;
      if (source === 'external') {
        setPreferencesState(newPrefs);
        setStorageInfo(storage.getStorageInfo());
      }
    };

    const handlePreferencesCleared = (event: CustomEvent) => {
      const { preferences: newPrefs } = event.detail;
      setPreferencesState(newPrefs);
      setStorageInfo(storage.getStorageInfo());
    };

    window.addEventListener('themePreferencesChanged', handlePreferencesChanged as EventListener);
    window.addEventListener('themePreferencesCleared', handlePreferencesCleared as EventListener);

    return () => {
      window.removeEventListener('themePreferencesChanged', handlePreferencesChanged as EventListener);
      window.removeEventListener('themePreferencesCleared', handlePreferencesCleared as EventListener);
    };
  }, [storage, enableRealTimeSync]);

  const updatePreference = useCallback(<K extends keyof ThemePreferences>(
    key: K, 
    value: ThemePreferences[K]
  ) => {
    try {
      storage.updatePreference(key, value);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preference');
    }
  }, [storage]);

  const setPreferences = useCallback((prefs: Partial<ThemePreferences>) => {
    try {
      storage.setPreferences(prefs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set preferences');
    }
  }, [storage]);

  const clearPreferences = useCallback(() => {
    try {
      storage.clearPreferences();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear preferences');
    }
  }, [storage]);

  const exportPreferences = useCallback(() => {
    try {
      return storage.exportPreferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export preferences');
      return '{}';
    }
  }, [storage]);

  const importPreferences = useCallback((json: string) => {
    try {
      const success = storage.importPreferences(json);
      if (success) {
        setError(null);
      } else {
        setError('Failed to import preferences: Invalid JSON');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import preferences');
      return false;
    }
  }, [storage]);

  return {
    preferences,
    updatePreference,
    setPreferences,
    clearPreferences,
    exportPreferences,
    importPreferences,
    isLoading,
    error,
    storageInfo
  };
};

/**
 * Hook đơn giản để chỉ lấy theme preferences
 */
export const useThemePreferences = (): ThemePreferences => {
  const { preferences } = useThemeStorage({ enableRealTimeSync: false });
  return preferences;
};

/**
 * Hook để chỉ update theme preferences
 */
export const useUpdateThemePreferences = () => {
  const { updatePreference, setPreferences } = useThemeStorage({ 
    syncOnMount: false, 
    enableRealTimeSync: false 
  });
  
  return { updatePreference, setPreferences };
};

/**
 * Hook để theo dõi specific preference
 */
export const useThemePreference = <K extends keyof ThemePreferences>(
  key: K
): [ThemePreferences[K], (value: ThemePreferences[K]) => void] => {
  const { preferences, updatePreference } = useThemeStorage();
  
  const setValue = useCallback((value: ThemePreferences[K]) => {
    updatePreference(key, value);
  }, [key, updatePreference]);
  
  return [preferences[key], setValue];
};

/**
 * Hook để tạo custom theme storage instance
 */
export const useCustomThemeStorage = (options: Partial<ThemeStorageOptions>) => {
  const storageRef = useRef<ThemeStorage | null>(null);
  
  if (!storageRef.current) {
    storageRef.current = new ThemeStorage(options);
  }
  
  const storage = storageRef.current;
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (storageRef.current) {
        storageRef.current.destroy();
        storageRef.current = null;
      }
    };
  }, []);
  
  return useThemeStorage({ storage });
};