// User Preferences Management System
// Centralized system for managing all user theme and UI preferences

import type { ThemePreferences, ThemeStorageOptions } from '../types/theme';
import { ThemeStorage } from './themeStorage';

// Re-export ThemePreferences for external use
export { ThemePreferences };
import { AnimationPreferencesManager, AnimationPreferences } from './animationPreferences';
import { ThemePresetsManager } from './themePresets';
import { ThemeTransitionManager, ThemeTransitionConfig } from './themeTransitions';

export interface UserUIPreferences {
  // Layout preferences
  layout: {
    sidebar: 'collapsed' | 'expanded' | 'auto';
    navigation: 'top' | 'side' | 'bottom';
    density: 'compact' | 'comfortable' | 'spacious';
    showBreadcrumbs: boolean;
    showTooltips: boolean;
  };
  
  // Accessibility preferences
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    focusIndicators: 'default' | 'enhanced' | 'minimal';
  };
  
  // Performance preferences
  performance: {
    enableAnimations: boolean;
    enableTransitions: boolean;
    enableParallax: boolean;
    enableBlur: boolean;
    imageQuality: 'low' | 'medium' | 'high' | 'auto';
    lazyLoading: boolean;
  };
  
  // Content preferences
  content: {
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    timezone: string;
    currency: string;
    numberFormat: string;
  };
  
  // Privacy preferences
  privacy: {
    analytics: boolean;
    cookies: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
  };
}

export interface UserPreferences {
  theme: ThemePreferences;
  animations: AnimationPreferences;
  ui: UserUIPreferences;
  version: string;
  lastUpdated: number;
  userId?: string;
}

export interface UserPreferencesOptions {
  storageKey?: string;
  version?: string;
  autoSync?: boolean;
  syncInterval?: number;
  enableCloudSync?: boolean;
  cloudSyncUrl?: string;
  onPreferencesChange?: (preferences: UserPreferences) => void;
  onSyncError?: (error: Error) => void;
  onCloudSyncSuccess?: () => void;
}

const DEFAULT_UI_PREFERENCES: UserUIPreferences = {
  layout: {
    sidebar: 'auto',
    navigation: 'top',
    density: 'comfortable',
    showBreadcrumbs: true,
    showTooltips: true
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: 'default'
  },
  performance: {
    enableAnimations: true,
    enableTransitions: true,
    enableParallax: true,
    enableBlur: true,
    imageQuality: 'auto',
    lazyLoading: true
  },
  content: {
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currency: 'USD',
    numberFormat: 'en-US'
  },
  privacy: {
    analytics: true,
    cookies: true,
    localStorage: true,
    sessionStorage: true,
    indexedDB: true
  }
};

const DEFAULT_OPTIONS: Required<UserPreferencesOptions> = {
  storageKey: 'user-preferences',
  version: '1.0.0',
  autoSync: true,
  syncInterval: 30000, // 30 seconds
  enableCloudSync: false,
  cloudSyncUrl: '',
  onPreferencesChange: () => {},
  onSyncError: () => {},
  onCloudSyncSuccess: () => {}
};

export class UserPreferencesManager {
  private preferences: UserPreferences;
  private options: Required<UserPreferencesOptions>;
  private themeStorage: ThemeStorage;
  private animationManager: AnimationPreferencesManager;
  private syncTimer?: number;
  private listeners: Set<(preferences: UserPreferences) => void> = new Set();
  private isInitialized = false;

  constructor(options: UserPreferencesOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Initialize preferences first
    this.preferences = this.loadPreferences();
    
    // Initialize sub-managers
    this.themeStorage = new ThemeStorage({
      key: `${this.options.storageKey}-theme`,
      enableAutoSync: this.options.autoSync,
      fallbackPreferences: {
        theme: this.preferences.theme.theme,
        animationsEnabled: this.preferences.theme.animationsEnabled
      }
    });
    
    this.animationManager = new AnimationPreferencesManager({
      globalAnimationsEnabled: this.preferences.animations.globalAnimationsEnabled,
      respectReducedMotion: this.preferences.animations.respectReducedMotion
    });
    
    // Setup auto-sync
    if (this.options.autoSync) {
      this.startAutoSync();
    }
    
    // Listen for storage changes from other tabs
    this.setupStorageListener();
    
    this.isInitialized = true;
  }

  /**
   * Load preferences from storage
   */
  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.options.storageKey);
      
      if (stored) {
        const parsed = JSON.parse(stored) as UserPreferences;
        
        // Version migration if needed
        if (parsed.version !== this.options.version) {
          return this.migratePreferences(parsed);
        }
        
        // Merge with defaults to ensure all properties exist
        return this.mergeWithDefaults(parsed);
      }
    } catch (error) {
      // Silently handle preference loading errors
    }
    
    // Return default preferences
    return this.createDefaultPreferences();
  }

  /**
   * Create default preferences
   */
  private createDefaultPreferences(): UserPreferences {
    // Create default theme preferences
    const defaultTheme: ThemePreferences = {
      theme: 'light',
      animationsEnabled: true,
      transitionDuration: 300,
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      lastModified: Date.now()
    };
    
    // Create default animation preferences
    const defaultAnimations: AnimationPreferences = {
      globalAnimationsEnabled: true,
      respectReducedMotion: true,
      themeTransition: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enabled: true
      },
      pageTransition: {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enabled: true
      },
      componentTransition: {
        duration: 200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enabled: true
      },
      hoverAnimations: {
        duration: 150,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enabled: true
      },
      clickAnimations: {
        duration: 100,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enabled: true
      },
      loadingAnimations: {
        duration: 1000,
        easing: 'linear',
        enabled: true
      },
      progressAnimations: {
        duration: 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enabled: true
      },
      scrollAnimations: {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        enabled: true
      },
      parallaxAnimations: {
        duration: 0,
        easing: 'linear',
        enabled: true
      },
      customPresets: {}
    };
    
    return {
      theme: defaultTheme,
      animations: defaultAnimations,
      ui: { ...DEFAULT_UI_PREFERENCES },
      version: this.options.version,
      lastUpdated: Date.now()
    };
  }

  /**
   * Merge preferences with defaults
   */
  private mergeWithDefaults(preferences: Partial<UserPreferences>): UserPreferences {
    const defaults = this.createDefaultPreferences();
    
    return {
      theme: { ...defaults.theme, ...preferences.theme },
      animations: { ...defaults.animations, ...preferences.animations },
      ui: {
        layout: { ...defaults.ui.layout, ...preferences.ui?.layout },
        accessibility: { ...defaults.ui.accessibility, ...preferences.ui?.accessibility },
        performance: { ...defaults.ui.performance, ...preferences.ui?.performance },
        content: { ...defaults.ui.content, ...preferences.ui?.content },
        privacy: { ...defaults.ui.privacy, ...preferences.ui?.privacy }
      },
      version: this.options.version,
      lastUpdated: preferences.lastUpdated || Date.now(),
      userId: preferences.userId
    };
  }

  /**
   * Migrate preferences from older versions
   */
  private migratePreferences(oldPreferences: UserPreferences): UserPreferences {
    // Add migration logic here when needed
    
    const migrated = this.mergeWithDefaults(oldPreferences);
    migrated.version = this.options.version;
    migrated.lastUpdated = Date.now();
    
    return migrated;
  }

  /**
   * Save preferences to storage
   */
  private savePreferences(): void {
    try {
      this.preferences.lastUpdated = Date.now();
      localStorage.setItem(this.options.storageKey, JSON.stringify(this.preferences));
      
      // Sync with sub-managers
      this.themeStorage.updatePreference('theme', this.preferences.theme.theme);
      this.animationManager.setPreferences({ globalAnimationsEnabled: this.preferences.animations.globalAnimationsEnabled });
      
      // Notify listeners
      this.notifyListeners();
      this.options.onPreferencesChange(this.preferences);
      
    } catch (error) {
      this.options.onSyncError(error as Error);
    }
  }

  /**
   * Setup storage listener for cross-tab sync
   */
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.options.storageKey && event.newValue) {
        try {
          const newPreferences = JSON.parse(event.newValue) as UserPreferences;
          
          // Only update if the change is from another tab
          if (newPreferences.lastUpdated > this.preferences.lastUpdated) {
            this.preferences = newPreferences;
            this.notifyListeners();
          }
        } catch (error) {
          // Silently handle storage sync errors
        }
      }
    });
  }

  /**
   * Start auto-sync timer
   */
  private startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = window.setInterval(() => {
      if (this.options.enableCloudSync) {
        this.syncWithCloud();
      }
    }, this.options.syncInterval);
  }

  /**
   * Stop auto-sync timer
   */
  private stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
    }
  }

  /**
   * Sync with cloud storage
   */
  private async syncWithCloud(): Promise<void> {
    if (!this.options.enableCloudSync || !this.options.cloudSyncUrl) {
      return;
    }
    
    try {
      // Upload current preferences
      const response = await fetch(this.options.cloudSyncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.preferences.userId,
          preferences: this.preferences,
          timestamp: Date.now()
        })
      });
      
      if (response.ok) {
        const cloudData = await response.json();
        
        // Check if cloud has newer data
        if (cloudData.preferences && cloudData.timestamp > this.preferences.lastUpdated) {
          this.preferences = this.mergeWithDefaults(cloudData.preferences);
          this.savePreferences();
        }
        
        this.options.onCloudSyncSuccess();
      }
    } catch (error) {
      this.options.onSyncError(error as Error);
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.preferences);
      } catch (error) {
        // Silently handle listener errors
      }
    });
  }

  // Public API

  /**
   * Get all preferences
   */
  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  /**
   * Get theme preferences
   */
  getThemePreferences(): ThemePreferences {
    return { ...this.preferences.theme };
  }

  /**
   * Get animation preferences
   */
  getAnimationPreferences(): AnimationPreferences {
    return { ...this.preferences.animations };
  }

  /**
   * Get UI preferences
   */
  getUIPreferences(): UserUIPreferences {
    return { ...this.preferences.ui };
  }

  /**
   * Update theme preferences
   */
  updateThemePreferences(updates: Partial<ThemePreferences>): void {
    this.preferences.theme = { ...this.preferences.theme, ...updates };
    this.savePreferences();
  }

  /**
   * Update animation preferences
   */
  updateAnimationPreferences(updates: Partial<AnimationPreferences>): void {
    this.preferences.animations = { ...this.preferences.animations, ...updates };
    this.savePreferences();
  }

  /**
   * Update UI preferences
   */
  updateUIPreferences(updates: Partial<UserUIPreferences>): void {
    this.preferences.ui = {
      layout: { ...this.preferences.ui.layout, ...updates.layout },
      accessibility: { ...this.preferences.ui.accessibility, ...updates.accessibility },
      performance: { ...this.preferences.ui.performance, ...updates.performance },
      content: { ...this.preferences.ui.content, ...updates.content },
      privacy: { ...this.preferences.ui.privacy, ...updates.privacy }
    };
    this.savePreferences();
  }

  /**
   * Update specific preference section
   */
  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...updates,
      lastUpdated: Date.now()
    };
    this.savePreferences();
  }

  /**
   * Reset all preferences to defaults
   */
  resetPreferences(): void {
    this.preferences = this.createDefaultPreferences();
    this.savePreferences();
  }

  /**
   * Reset specific preference section
   */
  resetSection(section: keyof UserPreferences): void {
    const defaults = this.createDefaultPreferences();
    
    switch (section) {
      case 'theme':
        this.preferences.theme = defaults.theme;
        break;
      case 'animations':
        this.preferences.animations = defaults.animations;
        break;
      case 'ui':
        this.preferences.ui = defaults.ui;
        break;
    }
    
    this.savePreferences();
  }

  /**
   * Export preferences as JSON
   */
  exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  /**
   * Import preferences from JSON
   */
  importPreferences(json: string, merge = true): boolean {
    try {
      const imported = JSON.parse(json) as Partial<UserPreferences>;
      
      if (merge) {
        this.preferences = this.mergeWithDefaults(imported);
      } else {
        this.preferences = {
          ...this.createDefaultPreferences(),
          ...imported,
          version: this.options.version,
          lastUpdated: Date.now()
        };
      }
      
      this.savePreferences();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Subscribe to preference changes
   */
  subscribe(listener: (preferences: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Set user ID for cloud sync
   */
  setUserId(userId: string): void {
    this.preferences.userId = userId;
    this.savePreferences();
  }

  /**
   * Enable/disable cloud sync
   */
  setCloudSync(enabled: boolean, cloudSyncUrl?: string): void {
    this.options.enableCloudSync = enabled;
    
    if (cloudSyncUrl) {
      this.options.cloudSyncUrl = cloudSyncUrl;
    }
    
    if (enabled && this.options.autoSync) {
      this.startAutoSync();
    } else {
      this.stopAutoSync();
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: number; total: number } {
    const preferencesSize = new Blob([this.exportPreferences()]).size;
    const themeStorageInfo = this.themeStorage.getStorageInfo();
    
    return {
      used: preferencesSize + themeStorageInfo.used,
      available: themeStorageInfo.available,
      total: preferencesSize + themeStorageInfo.used + themeStorageInfo.available
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopAutoSync();
    this.listeners.clear();
  }
}

// Global instance
export const userPreferencesManager = new UserPreferencesManager();

// Utility functions
export function getUserPreferences(): UserPreferences {
  return userPreferencesManager.getPreferences();
}

export function updateUserPreferences(updates: Partial<UserPreferences>): void {
  userPreferencesManager.updatePreferences(updates);
}

export function resetUserPreferences(): void {
  userPreferencesManager.resetPreferences();
}

export function exportUserPreferences(): string {
  return userPreferencesManager.exportPreferences();
}

export function importUserPreferences(json: string, merge = true): boolean {
  return userPreferencesManager.importPreferences(json, merge);
}