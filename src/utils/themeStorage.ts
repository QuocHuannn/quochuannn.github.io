// Advanced Theme Storage System
// Handles theme persistence with localStorage/sessionStorage and user preferences

import type { ThemePreferences, ThemeStorageOptions } from '../types/theme';

// Re-export types for backward compatibility
export type { ThemePreferences, ThemeStorageOptions };

const DEFAULT_PREFERENCES: ThemePreferences = {
  theme: 'light',
  animationsEnabled: true,
  transitionDuration: 300,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  lastModified: Date.now()
};

const DEFAULT_OPTIONS: ThemeStorageOptions = {
  storageType: 'localStorage',
  key: 'theme-preferences',
  fallbackPreferences: {},
  enableAutoSync: true,
  syncInterval: 5000
};

export class ThemeStorage {
  private options: ThemeStorageOptions;
  private storage: Storage;
  private syncInterval?: NodeJS.Timeout;
  private listeners: Set<(preferences: ThemePreferences) => void> = new Set();
  private lastKnownPreferences?: ThemePreferences;

  constructor(options: Partial<ThemeStorageOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    if (typeof window === 'undefined') {
      throw new Error('ThemeStorage can only be used in browser environment');
    }
    
    this.storage = this.options.storageType === 'sessionStorage' 
      ? window.sessionStorage 
      : window.localStorage;
    
    if (this.options.enableAutoSync && this.options.syncInterval) {
      this.startAutoSync();
    }
    
    // Listen for storage events from other tabs
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  /**
   * Get theme preferences from storage
   */
  getPreferences(): ThemePreferences {
    try {
      const stored = this.storage.getItem(this.options.key);
      if (!stored) {
        return { ...DEFAULT_PREFERENCES, ...this.options.fallbackPreferences };
      }
      
      const parsed = JSON.parse(stored) as ThemePreferences;
      
      // Validate and merge with defaults
      const preferences: ThemePreferences = {
        ...DEFAULT_PREFERENCES,
        ...this.options.fallbackPreferences,
        ...parsed,
        lastModified: parsed.lastModified || Date.now()
      };
      
      // Validate theme value
      if (!['light', 'dark'].includes(preferences.theme)) {
        preferences.theme = 'light';
      }
      
      // Validate fontSize
      if (!['small', 'medium', 'large'].includes(preferences.fontSize)) {
        preferences.fontSize = 'medium';
      }
      
      return preferences;
    } catch (error) {
      console.warn('Failed to parse theme preferences from storage:', error);
      return { ...DEFAULT_PREFERENCES, ...this.options.fallbackPreferences };
    }
  }

  /**
   * Save theme preferences to storage
   */
  setPreferences(preferences: Partial<ThemePreferences>): void {
    try {
      const current = this.getPreferences();
      const updated: ThemePreferences = {
        ...current,
        ...preferences,
        lastModified: Date.now()
      };
      
      this.storage.setItem(this.options.key, JSON.stringify(updated));
      this.lastKnownPreferences = updated;
      
      // Notify listeners
      this.listeners.forEach(listener => {
        try {
          listener(updated);
        } catch (error) {
          console.error('Error in theme preferences listener:', error);
        }
      });
      
      // Dispatch custom event for cross-component communication
      window.dispatchEvent(new CustomEvent('themePreferencesChanged', {
        detail: { preferences: updated, source: 'local' }
      }));
    } catch (error) {
      console.error('Failed to save theme preferences:', error);
    }
  }

  /**
   * Update specific preference
   */
  updatePreference<K extends keyof ThemePreferences>(
    key: K, 
    value: ThemePreferences[K]
  ): void {
    this.setPreferences({ [key]: value } as Partial<ThemePreferences>);
  }

  /**
   * Clear all preferences
   */
  clearPreferences(): void {
    try {
      this.storage.removeItem(this.options.key);
      this.lastKnownPreferences = undefined;
      
      const defaultPrefs = { ...DEFAULT_PREFERENCES, ...this.options.fallbackPreferences };
      
      // Notify listeners
      this.listeners.forEach(listener => {
        try {
          listener(defaultPrefs);
        } catch (error) {
          console.error('Error in theme preferences listener:', error);
        }
      });
      
      window.dispatchEvent(new CustomEvent('themePreferencesCleared', {
        detail: { preferences: defaultPrefs }
      }));
    } catch (error) {
      console.error('Failed to clear theme preferences:', error);
    }
  }

  /**
   * Subscribe to preference changes
   */
  subscribe(listener: (preferences: ThemePreferences) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Export preferences as JSON
   */
  exportPreferences(): string {
    const preferences = this.getPreferences();
    return JSON.stringify(preferences, null, 2);
  }

  /**
   * Import preferences from JSON
   */
  importPreferences(json: string): boolean {
    try {
      const preferences = JSON.parse(json) as Partial<ThemePreferences>;
      this.setPreferences(preferences);
      return true;
    } catch (error) {
      console.error('Failed to import theme preferences:', error);
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const testKey = '__storage_test__';
      const testValue = 'x';
      let used = 0;
      let available = 0;
      
      // Calculate used space
      for (let key in this.storage) {
        if (this.storage.hasOwnProperty(key)) {
          used += this.storage[key].length + key.length;
        }
      }
      
      // Calculate available space
      try {
        let testSize = 1024; // Start with 1KB
        while (testSize < 10 * 1024 * 1024) { // Max 10MB
          try {
            this.storage.setItem(testKey, 'x'.repeat(testSize));
            this.storage.removeItem(testKey);
            testSize *= 2;
          } catch {
            break;
          }
        }
        available = testSize / 2;
      } catch {
        available = 5 * 1024 * 1024; // Assume 5MB default
      }
      
      return {
        used,
        available,
        percentage: (used / (used + available)) * 100
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Handle storage changes from other tabs
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.options.key && event.newValue) {
      try {
        const preferences = JSON.parse(event.newValue) as ThemePreferences;
        this.lastKnownPreferences = preferences;
        
        // Notify listeners
        this.listeners.forEach(listener => {
          try {
            listener(preferences);
          } catch (error) {
            console.error('Error in theme preferences listener:', error);
          }
        });
        
        // Dispatch event with external source
        window.dispatchEvent(new CustomEvent('themePreferencesChanged', {
          detail: { preferences, source: 'external' }
        }));
      } catch (error) {
        console.error('Failed to handle storage change:', error);
      }
    }
  }

  /**
   * Start auto-sync to detect external changes
   */
  private startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      const current = this.getPreferences();
      
      if (!this.lastKnownPreferences || 
          current.lastModified !== this.lastKnownPreferences.lastModified) {
        this.lastKnownPreferences = current;
        
        // Notify listeners of sync update
        this.listeners.forEach(listener => {
          try {
            listener(current);
          } catch (error) {
            console.error('Error in theme preferences listener:', error);
          }
        });
      }
    }, this.options.syncInterval);
  }

  /**
   * Stop auto-sync and cleanup
   */
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
    
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    this.listeners.clear();
  }
}

// Singleton instance for easy usage
export const themeStorage = new ThemeStorage();

// Utility functions
export const getThemePreferences = () => themeStorage.getPreferences();
export const setThemePreferences = (prefs: Partial<ThemePreferences>) => 
  themeStorage.setPreferences(prefs);
export const updateThemePreference = <K extends keyof ThemePreferences>(
  key: K, 
  value: ThemePreferences[K]
) => themeStorage.updatePreference(key, value);
export const subscribeToThemePreferences = (listener: (prefs: ThemePreferences) => void) => 
  themeStorage.subscribe(listener);