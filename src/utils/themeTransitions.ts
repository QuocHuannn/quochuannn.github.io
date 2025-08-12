// Theme Transition Animations System
// Handles smooth transitions when switching between themes

export interface ThemeTransitionConfig {
  duration: number;
  easing: string;
  properties: string[];
  stagger?: number;
  beforeTransition?: () => void;
  afterTransition?: () => void;
}

export interface ThemeTransitionPresets {
  instant: ThemeTransitionConfig;
  smooth: ThemeTransitionConfig;
  fade: ThemeTransitionConfig;
  slide: ThemeTransitionConfig;
  zoom: ThemeTransitionConfig;
  flip: ThemeTransitionConfig;
  custom: ThemeTransitionConfig;
}

const DEFAULT_TRANSITION_PRESETS: ThemeTransitionPresets = {
  instant: {
    duration: 0,
    easing: 'linear',
    properties: []
  },
  
  smooth: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: [
      'background-color',
      'color',
      'border-color',
      'box-shadow',
      'fill',
      'stroke'
    ]
  },
  
  fade: {
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['opacity'],
    beforeTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-opacity', '0');
    },
    afterTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-opacity', '1');
    }
  },
  
  slide: {
    duration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['transform'],
    beforeTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-transform', 'translateX(-100%)');
    },
    afterTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-transform', 'translateX(0)');
    }
  },
  
  zoom: {
    duration: 350,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    properties: ['transform'],
    beforeTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-scale', '0.95');
    },
    afterTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-scale', '1');
    }
  },
  
  flip: {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['transform'],
    stagger: 50,
    beforeTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-rotate', 'rotateY(90deg)');
    },
    afterTransition: () => {
      document.documentElement.style.setProperty('--theme-transition-rotate', 'rotateY(0deg)');
    }
  },
  
  custom: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: ['all']
  }
};

export class ThemeTransitionManager {
  private currentPreset: keyof ThemeTransitionPresets = 'smooth';
  private presets: ThemeTransitionPresets;
  private isTransitioning = false;
  private listeners: Set<(isTransitioning: boolean) => void> = new Set();
  private lastTransitionTime = 0;
  private readonly TRANSITION_DEBOUNCE = 150; // ms

  constructor(customPresets?: Partial<ThemeTransitionPresets>) {
    this.presets = {
      ...DEFAULT_TRANSITION_PRESETS,
      ...customPresets
    };
  }

  /**
   * Set current transition preset
   */
  setPreset(preset: keyof ThemeTransitionPresets): void {
    this.currentPreset = preset;
  }

  /**
   * Get current transition preset
   */
  getCurrentPreset(): keyof ThemeTransitionPresets {
    return this.currentPreset;
  }

  /**
   * Update preset configuration
   */
  updatePreset(preset: keyof ThemeTransitionPresets, config: Partial<ThemeTransitionConfig>): void {
    this.presets[preset] = {
      ...this.presets[preset],
      ...config
    };
  }

  /**
   * Get preset configuration
   */
  getPreset(preset: keyof ThemeTransitionPresets): ThemeTransitionConfig {
    return this.presets[preset];
  }

  /**
   * Execute theme transition (simplified, no queue)
   */
  async executeTransition(
    themeChangeCallback: () => void,
    preset?: keyof ThemeTransitionPresets
  ): Promise<void> {
    const now = Date.now();
    
    // Debounce rapid transitions
    if (now - this.lastTransitionTime < this.TRANSITION_DEBOUNCE) {
      themeChangeCallback();
      return;
    }
    
    this.lastTransitionTime = now;
    const transitionPreset = preset || this.currentPreset;
    const config = this.presets[transitionPreset];

    // Check for reduced motion or if already transitioning
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || this.isTransitioning) {
      themeChangeCallback();
      return;
    }

    this.isTransitioning = true;
    this.notifyListeners(true);

    try {
      // Simple CSS class-based transition
      const root = document.documentElement;
      root.classList.add('theme-switching');
      
      // Execute theme change immediately
      themeChangeCallback();
      
      // Wait for CSS transition to complete
      await new Promise(resolve => {
        setTimeout(() => {
          root.classList.remove('theme-switching');
          resolve(void 0);
        }, config.duration);
      });

    } catch (error) {
      console.error('Theme transition failed:', error);
      document.documentElement.classList.remove('theme-switching');
    } finally {
      this.isTransitioning = false;
      this.notifyListeners(false);
    }
  }

  // Removed complex transition styles methods - using simple CSS classes instead

  // Removed complex timing methods - using simple setTimeout

  /**
   * Check if currently transitioning
   */
  isCurrentlyTransitioning(): boolean {
    return this.isTransitioning;
  }

  /**
   * Subscribe to transition state changes
   */
  subscribe(listener: (isTransitioning: boolean) => void): () => void {
    this.listeners.add(listener);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify listeners of transition state changes
   */
  private notifyListeners(isTransitioning: boolean): void {
    this.listeners.forEach(listener => {
      try {
        listener(isTransitioning);
      } catch (error) {
        console.error('Error in transition listener:', error);
      }
    });
  }

  /**
   * Get available presets
   */
  getAvailablePresets(): (keyof ThemeTransitionPresets)[] {
    return Object.keys(this.presets) as (keyof ThemeTransitionPresets)[];
  }

  /**
   * Export current configuration
   */
  export(): string {
    return JSON.stringify({
      currentPreset: this.currentPreset,
      presets: this.presets
    }, null, 2);
  }

  /**
   * Import configuration
   */
  import(json: string): boolean {
    try {
      const config = JSON.parse(json);
      
      if (config.currentPreset) {
        this.currentPreset = config.currentPreset;
      }
      
      if (config.presets) {
        this.presets = {
          ...this.presets,
          ...config.presets
        };
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import theme transition config:', error);
      return false;
    }
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.currentPreset = 'smooth';
    this.presets = { ...DEFAULT_TRANSITION_PRESETS };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.listeners.clear();
  }
}

// Singleton instance
export const themeTransitionManager = new ThemeTransitionManager();

// Utility functions
export const executeThemeTransition = (
  themeChangeCallback: () => void,
  preset?: keyof ThemeTransitionPresets
) => themeTransitionManager.executeTransition(themeChangeCallback, preset);

export const setThemeTransitionPreset = (preset: keyof ThemeTransitionPresets) => 
  themeTransitionManager.setPreset(preset);

export const isThemeTransitioning = () => themeTransitionManager.isCurrentlyTransitioning();

export const getThemeTransitionPresets = () => themeTransitionManager.getAvailablePresets();