// Animation Preferences System
// Handles animation settings based on user preferences and system settings

import { setCSSCustomProperties } from './themeUtils';

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  enabled: boolean;
}

export interface AnimationPreferences {
  // Global animation settings
  globalAnimationsEnabled: boolean;
  respectReducedMotion: boolean;
  
  // Transition settings
  themeTransition: AnimationConfig;
  pageTransition: AnimationConfig;
  componentTransition: AnimationConfig;
  
  // Hover and interaction animations
  hoverAnimations: AnimationConfig;
  clickAnimations: AnimationConfig;
  
  // Loading and progress animations
  loadingAnimations: AnimationConfig;
  progressAnimations: AnimationConfig;
  
  // Scroll-based animations
  scrollAnimations: AnimationConfig;
  parallaxAnimations: AnimationConfig;
  
  // Custom animation presets
  customPresets: Record<string, AnimationConfig>;
}

const DEFAULT_ANIMATION_PREFERENCES: AnimationPreferences = {
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
    duration: 0, // Parallax is usually continuous
    easing: 'linear',
    enabled: true
  },
  
  customPresets: {
    'bounce': {
      duration: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      enabled: true
    },
    'smooth': {
      duration: 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      enabled: true
    },
    'snappy': {
      duration: 150,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      enabled: true
    }
  }
};

export class AnimationPreferencesManager {
  private preferences: AnimationPreferences;
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Set<(preferences: AnimationPreferences) => void> = new Set();
  private reducedMotionListeners: Set<(reducedMotion: boolean) => void> = new Set();

  constructor(initialPreferences?: Partial<AnimationPreferences>) {
    this.preferences = {
      ...DEFAULT_ANIMATION_PREFERENCES,
      ...initialPreferences
    };
    
    if (typeof window !== 'undefined') {
      this.setupReducedMotionListener();
    }
  }

  /**
   * Get current animation preferences
   */
  getPreferences(): AnimationPreferences {
    return { ...this.preferences };
  }

  /**
   * Update animation preferences
   */
  setPreferences(preferences: Partial<AnimationPreferences>): void {
    this.preferences = {
      ...this.preferences,
      ...preferences
    };
    
    this.notifyListeners();
  }

  /**
   * Update specific animation config
   */
  updateAnimationConfig(
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
    config: Partial<AnimationConfig>
  ): void {
    if (this.preferences[type] && typeof this.preferences[type] === 'object') {
      this.preferences[type] = {
        ...this.preferences[type] as AnimationConfig,
        ...config
      };
      this.notifyListeners();
    }
  }

  /**
   * Add or update custom preset
   */
  setCustomPreset(name: string, config: AnimationConfig): void {
    this.preferences.customPresets[name] = config;
    this.notifyListeners();
  }

  /**
   * Remove custom preset
   */
  removeCustomPreset(name: string): void {
    delete this.preferences.customPresets[name];
    this.notifyListeners();
  }

  /**
   * Get effective animation config (considering reduced motion and global settings)
   */
  getEffectiveConfig(
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
  ): AnimationConfig {
    const config = this.preferences[type] as AnimationConfig;
    const reducedMotion = this.getReducedMotionPreference();
    
    // If animations are globally disabled or reduced motion is preferred
    if (!this.preferences.globalAnimationsEnabled || 
        (this.preferences.respectReducedMotion && reducedMotion)) {
      return {
        ...config,
        duration: 0,
        enabled: false
      };
    }
    
    return config;
  }

  /**
   * Get custom preset config
   */
  getCustomPreset(name: string): AnimationConfig | null {
    const preset = this.preferences.customPresets[name];
    if (!preset) return null;
    
    const reducedMotion = this.getReducedMotionPreference();
    
    if (!this.preferences.globalAnimationsEnabled || 
        (this.preferences.respectReducedMotion && reducedMotion)) {
      return {
        ...preset,
        duration: 0,
        enabled: false
      };
    }
    
    return preset;
  }

  /**
   * Check if animations should be enabled
   */
  shouldAnimate(type?: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>): boolean {
    if (!this.preferences.globalAnimationsEnabled) return false;
    
    const reducedMotion = this.getReducedMotionPreference();
    if (this.preferences.respectReducedMotion && reducedMotion) return false;
    
    if (type) {
      const config = this.preferences[type] as AnimationConfig;
      return config && config.enabled !== undefined ? config.enabled : true;
    }
    
    return true;
  }

  /**
   * Get CSS transition string for a specific animation type
   */
  getCSSTransition(
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
    property: string = 'all'
  ): string {
    const config = this.getEffectiveConfig(type);
    
    if (!config.enabled || config.duration === 0) {
      return 'none';
    }
    
    const delay = config.delay ? ` ${config.delay}ms` : '';
    return `${property} ${config.duration}ms ${config.easing}${delay}`;
  }

  /**
   * Get CSS animation duration for a specific type
   */
  getCSSAnimationDuration(
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
  ): string {
    const config = this.getEffectiveConfig(type);
    return `${config.duration}ms`;
  }

  /**
   * Generate CSS custom properties for animations
   */
  getCSSCustomProperties(): Record<string, string> {
    const properties: Record<string, string> = {};
    
    // Theme transition
    const themeConfig = this.getEffectiveConfig('themeTransition');
    properties['--theme-transition-duration'] = `${themeConfig.duration}ms`;
    properties['--theme-transition-easing'] = themeConfig.easing;
    
    // Component transition
    const componentConfig = this.getEffectiveConfig('componentTransition');
    properties['--component-transition-duration'] = `${componentConfig.duration}ms`;
    properties['--component-transition-easing'] = componentConfig.easing;
    
    // Hover animations
    const hoverConfig = this.getEffectiveConfig('hoverAnimations');
    properties['--hover-transition-duration'] = `${hoverConfig.duration}ms`;
    properties['--hover-transition-easing'] = hoverConfig.easing;
    
    // Global animation state
    properties['--animations-enabled'] = this.shouldAnimate() ? '1' : '0';
    
    return properties;
  }

  /**
   * Apply CSS custom properties to document root (batched)
   */
  applyCSSCustomProperties(): void {
    if (typeof window === 'undefined') return;
    
    const properties = this.getCSSCustomProperties();
    setCSSCustomProperties(properties);
  }

  /**
   * Get system reduced motion preference
   */
  getReducedMotionPreference(): boolean {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Subscribe to preference changes
   */
  subscribe(listener: (preferences: AnimationPreferences) => void): () => void {
    this.listeners.add(listener);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to reduced motion changes
   */
  subscribeToReducedMotion(listener: (reducedMotion: boolean) => void): () => void {
    this.reducedMotionListeners.add(listener);
    
    return () => {
      this.reducedMotionListeners.delete(listener);
    };
  }

  /**
   * Reset to default preferences
   */
  reset(): void {
    this.preferences = { ...DEFAULT_ANIMATION_PREFERENCES };
    this.notifyListeners();
  }

  /**
   * Export preferences as JSON
   */
  export(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  /**
   * Import preferences from JSON
   */
  import(json: string): boolean {
    try {
      const imported = JSON.parse(json) as Partial<AnimationPreferences>;
      this.setPreferences(imported);
      return true;
    } catch (error) {
      console.error('Failed to import animation preferences:', error);
      return false;
    }
  }

  /**
   * Setup reduced motion media query listener
   */
  private setupReducedMotionListener(): void {
    this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      this.reducedMotionListeners.forEach(listener => {
        try {
          listener(e.matches);
        } catch (error) {
          console.error('Error in reduced motion listener:', error);
        }
      });
      
      // Update CSS properties when reduced motion changes
      this.applyCSSCustomProperties();
    };
    
    this.mediaQuery.addEventListener('change', handleChange);
  }

  /**
   * Notify all listeners of preference changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.preferences);
      } catch (error) {
        console.error('Error in animation preferences listener:', error);
      }
    });
    
    // Update CSS properties
    this.applyCSSCustomProperties();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', () => {});
      this.mediaQuery = null;
    }
    
    this.listeners.clear();
    this.reducedMotionListeners.clear();
  }
}

// Singleton instance
let globalAnimationManager: AnimationPreferencesManager | null = null;

/**
 * Get the global singleton instance of AnimationPreferencesManager
 * This ensures only one instance exists across the entire application
 */
export const getAnimationManager = (): AnimationPreferencesManager => {
  if (!globalAnimationManager) {
    globalAnimationManager = new AnimationPreferencesManager();
  }
  return globalAnimationManager;
};

// Legacy singleton instance for backward compatibility
export const animationPreferences = getAnimationManager();

// Utility functions using singleton
export const getAnimationPreferences = () => getAnimationManager().getPreferences();
export const setAnimationPreferences = (prefs: Partial<AnimationPreferences>) => 
  getAnimationManager().setPreferences(prefs);
export const shouldAnimate = (type?: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>) => 
  getAnimationManager().shouldAnimate(type);
export const getCSSTransition = (
  type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
  property?: string
) => getAnimationManager().getCSSTransition(type, property);

/**
 * Reset the global singleton (useful for testing)
 */
export const resetAnimationManager = (): void => {
  if (globalAnimationManager) {
    globalAnimationManager.destroy();
    globalAnimationManager = null;
  }
};