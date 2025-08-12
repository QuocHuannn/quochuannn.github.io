// Theme Presets System
// Provides multiple color schemes and customization options

import { setCSSCustomProperties } from './themeUtils';

export interface ColorScheme {
  name: string;
  displayName: string;
  description: string;
  colors: {
    // Primary colors
    primary: string;
    primaryForeground: string;
    primaryHover: string;
    primaryActive: string;
    
    // Secondary colors
    secondary: string;
    secondaryForeground: string;
    secondaryHover: string;
    secondaryActive: string;
    
    // Accent colors
    accent: string;
    accentForeground: string;
    accentHover: string;
    accentActive: string;
    
    // Background colors
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    backgroundHover: string;
    
    // Foreground colors
    foreground: string;
    foregroundSecondary: string;
    foregroundMuted: string;
    foregroundDisabled: string;
    
    // Border colors
    border: string;
    borderSecondary: string;
    borderHover: string;
    borderFocus: string;
    
    // Status colors
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    error: string;
    errorForeground: string;
    info: string;
    infoForeground: string;
    
    // Special colors
    shadow: string;
    overlay: string;
    highlight: string;
    selection: string;
  };
  
  // Typography settings
  typography?: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  
  // Spacing settings
  spacing?: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  
  // Border radius settings
  borderRadius?: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  // Animation settings
  animations?: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

export interface ThemePreset {
  id: string;
  name: string;
  displayName: string;
  description: string;
  author?: string;
  version?: string;
  tags?: string[];
  light: ColorScheme;
  dark: ColorScheme;
  isBuiltIn: boolean;
  isCustom: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Built-in color schemes
const DEFAULT_LIGHT_COLORS = {
  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  primaryHover: '#2563eb',
  primaryActive: '#1d4ed8',
  
  secondary: '#6b7280',
  secondaryForeground: '#ffffff',
  secondaryHover: '#4b5563',
  secondaryActive: '#374151',
  
  accent: '#8b5cf6',
  accentForeground: '#ffffff',
  accentHover: '#7c3aed',
  accentActive: '#6d28d9',
  
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#f1f5f9',
  backgroundHover: '#e2e8f0',
  
  foreground: '#0f172a',
  foregroundSecondary: '#334155',
  foregroundMuted: '#64748b',
  foregroundDisabled: '#94a3b8',
  
  border: '#e2e8f0',
  borderSecondary: '#cbd5e1',
  borderHover: '#94a3b8',
  borderFocus: '#3b82f6',
  
  success: '#10b981',
  successForeground: '#ffffff',
  warning: '#f59e0b',
  warningForeground: '#ffffff',
  error: '#ef4444',
  errorForeground: '#ffffff',
  info: '#06b6d4',
  infoForeground: '#ffffff',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  highlight: '#fef3c7',
  selection: '#dbeafe'
};

const DEFAULT_DARK_COLORS = {
  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  primaryHover: '#60a5fa',
  primaryActive: '#93c5fd',
  
  secondary: '#6b7280',
  secondaryForeground: '#ffffff',
  secondaryHover: '#9ca3af',
  secondaryActive: '#d1d5db',
  
  accent: '#8b5cf6',
  accentForeground: '#ffffff',
  accentHover: '#a78bfa',
  accentActive: '#c4b5fd',
  
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  backgroundTertiary: '#334155',
  backgroundHover: '#475569',
  
  foreground: '#f8fafc',
  foregroundSecondary: '#e2e8f0',
  foregroundMuted: '#94a3b8',
  foregroundDisabled: '#64748b',
  
  border: '#334155',
  borderSecondary: '#475569',
  borderHover: '#64748b',
  borderFocus: '#3b82f6',
  
  success: '#10b981',
  successForeground: '#ffffff',
  warning: '#f59e0b',
  warningForeground: '#ffffff',
  error: '#ef4444',
  errorForeground: '#ffffff',
  info: '#06b6d4',
  infoForeground: '#ffffff',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  highlight: '#451a03',
  selection: '#1e3a8a'
};

const DEFAULT_TYPOGRAPHY = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
};

const DEFAULT_SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem'
};

const DEFAULT_BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px'
};

const DEFAULT_ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Built-in theme presets
const BUILT_IN_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'default',
    displayName: 'Default',
    description: 'Clean and modern default theme',
    author: 'System',
    version: '1.0.0',
    tags: ['default', 'modern', 'clean'],
    light: {
      name: 'default-light',
      displayName: 'Default Light',
      description: 'Default light color scheme',
      colors: DEFAULT_LIGHT_COLORS,
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    dark: {
      name: 'default-dark',
      displayName: 'Default Dark',
      description: 'Default dark color scheme',
      colors: DEFAULT_DARK_COLORS,
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    isBuiltIn: true,
    isCustom: false
  },
  
  {
    id: 'ocean',
    name: 'ocean',
    displayName: 'Ocean',
    description: 'Cool blue ocean-inspired theme',
    author: 'System',
    version: '1.0.0',
    tags: ['blue', 'ocean', 'cool'],
    light: {
      name: 'ocean-light',
      displayName: 'Ocean Light',
      description: 'Light ocean color scheme',
      colors: {
        ...DEFAULT_LIGHT_COLORS,
        primary: '#0ea5e9',
        primaryHover: '#0284c7',
        primaryActive: '#0369a1',
        accent: '#06b6d4',
        accentHover: '#0891b2',
        accentActive: '#0e7490',
        background: '#f0f9ff',
        backgroundSecondary: '#e0f2fe',
        backgroundTertiary: '#bae6fd'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    dark: {
      name: 'ocean-dark',
      displayName: 'Ocean Dark',
      description: 'Dark ocean color scheme',
      colors: {
        ...DEFAULT_DARK_COLORS,
        primary: '#0ea5e9',
        primaryHover: '#38bdf8',
        primaryActive: '#7dd3fc',
        accent: '#06b6d4',
        accentHover: '#22d3ee',
        accentActive: '#67e8f9',
        background: '#0c1821',
        backgroundSecondary: '#164e63',
        backgroundTertiary: '#0e7490'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    isBuiltIn: true,
    isCustom: false
  },
  
  {
    id: 'forest',
    name: 'forest',
    displayName: 'Forest',
    description: 'Natural green forest theme',
    author: 'System',
    version: '1.0.0',
    tags: ['green', 'forest', 'nature'],
    light: {
      name: 'forest-light',
      displayName: 'Forest Light',
      description: 'Light forest color scheme',
      colors: {
        ...DEFAULT_LIGHT_COLORS,
        primary: '#059669',
        primaryHover: '#047857',
        primaryActive: '#065f46',
        accent: '#10b981',
        accentHover: '#059669',
        accentActive: '#047857',
        background: '#f0fdf4',
        backgroundSecondary: '#dcfce7',
        backgroundTertiary: '#bbf7d0'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    dark: {
      name: 'forest-dark',
      displayName: 'Forest Dark',
      description: 'Dark forest color scheme',
      colors: {
        ...DEFAULT_DARK_COLORS,
        primary: '#059669',
        primaryHover: '#10b981',
        primaryActive: '#34d399',
        accent: '#10b981',
        accentHover: '#34d399',
        accentActive: '#6ee7b7',
        background: '#0f1b0f',
        backgroundSecondary: '#14532d',
        backgroundTertiary: '#166534'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    isBuiltIn: true,
    isCustom: false
  },
  
  {
    id: 'sunset',
    name: 'sunset',
    displayName: 'Sunset',
    description: 'Warm orange and pink sunset theme',
    author: 'System',
    version: '1.0.0',
    tags: ['orange', 'pink', 'warm', 'sunset'],
    light: {
      name: 'sunset-light',
      displayName: 'Sunset Light',
      description: 'Light sunset color scheme',
      colors: {
        ...DEFAULT_LIGHT_COLORS,
        primary: '#ea580c',
        primaryHover: '#dc2626',
        primaryActive: '#b91c1c',
        accent: '#ec4899',
        accentHover: '#db2777',
        accentActive: '#be185d',
        background: '#fff7ed',
        backgroundSecondary: '#fed7aa',
        backgroundTertiary: '#fdba74'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    dark: {
      name: 'sunset-dark',
      displayName: 'Sunset Dark',
      description: 'Dark sunset color scheme',
      colors: {
        ...DEFAULT_DARK_COLORS,
        primary: '#ea580c',
        primaryHover: '#fb923c',
        primaryActive: '#fdba74',
        accent: '#ec4899',
        accentHover: '#f472b6',
        accentActive: '#f9a8d4',
        background: '#1c1917',
        backgroundSecondary: '#78350f',
        backgroundTertiary: '#92400e'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    isBuiltIn: true,
    isCustom: false
  },
  
  {
    id: 'midnight',
    name: 'midnight',
    displayName: 'Midnight',
    description: 'Deep purple midnight theme',
    author: 'System',
    version: '1.0.0',
    tags: ['purple', 'midnight', 'dark'],
    light: {
      name: 'midnight-light',
      displayName: 'Midnight Light',
      description: 'Light midnight color scheme',
      colors: {
        ...DEFAULT_LIGHT_COLORS,
        primary: '#7c3aed',
        primaryHover: '#6d28d9',
        primaryActive: '#5b21b6',
        accent: '#a855f7',
        accentHover: '#9333ea',
        accentActive: '#7e22ce',
        background: '#faf5ff',
        backgroundSecondary: '#f3e8ff',
        backgroundTertiary: '#e9d5ff'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    dark: {
      name: 'midnight-dark',
      displayName: 'Midnight Dark',
      description: 'Dark midnight color scheme',
      colors: {
        ...DEFAULT_DARK_COLORS,
        primary: '#7c3aed',
        primaryHover: '#8b5cf6',
        primaryActive: '#a78bfa',
        accent: '#a855f7',
        accentHover: '#c084fc',
        accentActive: '#d8b4fe',
        background: '#1e1b4b',
        backgroundSecondary: '#312e81',
        backgroundTertiary: '#3730a3'
      },
      typography: DEFAULT_TYPOGRAPHY,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      animations: DEFAULT_ANIMATIONS
    },
    isBuiltIn: true,
    isCustom: false
  }
];

export class ThemePresetsManager {
  private presets: Map<string, ThemePreset> = new Map();
  private currentPresetId: string = 'default';
  private listeners: Set<(presets: ThemePreset[], currentId: string) => void> = new Set();
  private storageKey = 'theme-presets';
  private currentPresetKey = 'current-theme-preset';

  constructor() {
    this.initializePresets();
    this.loadFromStorage();
  }

  /**
   * Initialize with built-in presets
   */
  private initializePresets(): void {
    BUILT_IN_PRESETS.forEach(preset => {
      this.presets.set(preset.id, preset);
    });
  }

  /**
   * Load presets from storage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const customPresets: ThemePreset[] = JSON.parse(stored);
        customPresets.forEach(preset => {
          if (preset.isCustom) {
            this.presets.set(preset.id, preset);
          }
        });
      }

      const currentId = localStorage.getItem(this.currentPresetKey);
      if (currentId && this.presets.has(currentId)) {
        this.currentPresetId = currentId;
      }
    } catch (error) {
      console.error('Failed to load theme presets from storage:', error);
    }
  }

  /**
   * Save custom presets to storage
   */
  private saveToStorage(): void {
    try {
      const customPresets = Array.from(this.presets.values()).filter(p => p.isCustom);
      localStorage.setItem(this.storageKey, JSON.stringify(customPresets));
      localStorage.setItem(this.currentPresetKey, this.currentPresetId);
    } catch (error) {
      console.error('Failed to save theme presets to storage:', error);
    }
  }

  /**
   * Get all presets
   */
  getAllPresets(): ThemePreset[] {
    return Array.from(this.presets.values());
  }

  /**
   * Get built-in presets only
   */
  getBuiltInPresets(): ThemePreset[] {
    return Array.from(this.presets.values()).filter(p => p.isBuiltIn);
  }

  /**
   * Get custom presets only
   */
  getCustomPresets(): ThemePreset[] {
    return Array.from(this.presets.values()).filter(p => p.isCustom);
  }

  /**
   * Get preset by ID
   */
  getPreset(id: string): ThemePreset | undefined {
    return this.presets.get(id);
  }

  /**
   * Get current preset
   */
  getCurrentPreset(): ThemePreset | undefined {
    return this.presets.get(this.currentPresetId);
  }

  /**
   * Get current preset ID
   */
  getCurrentPresetId(): string {
    return this.currentPresetId;
  }

  /**
   * Set current preset
   */
  setCurrentPreset(id: string): boolean {
    if (!this.presets.has(id)) {
      return false;
    }

    this.currentPresetId = id;
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  /**
   * Add custom preset
   */
  addPreset(preset: Omit<ThemePreset, 'isBuiltIn' | 'isCustom' | 'createdAt' | 'updatedAt'>): boolean {
    if (this.presets.has(preset.id)) {
      return false;
    }

    const newPreset: ThemePreset = {
      ...preset,
      isBuiltIn: false,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.presets.set(preset.id, newPreset);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  /**
   * Update preset
   */
  updatePreset(id: string, updates: Partial<ThemePreset>): boolean {
    const preset = this.presets.get(id);
    if (!preset || preset.isBuiltIn) {
      return false;
    }

    const updatedPreset: ThemePreset = {
      ...preset,
      ...updates,
      id, // Ensure ID doesn't change
      isBuiltIn: preset.isBuiltIn, // Ensure built-in status doesn't change
      updatedAt: new Date()
    };

    this.presets.set(id, updatedPreset);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  /**
   * Delete preset
   */
  deletePreset(id: string): boolean {
    const preset = this.presets.get(id);
    if (!preset || preset.isBuiltIn) {
      return false;
    }

    this.presets.delete(id);
    
    // If deleted preset was current, switch to default
    if (this.currentPresetId === id) {
      this.currentPresetId = 'default';
    }

    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  /**
   * Duplicate preset
   */
  duplicatePreset(id: string, newId: string, newName?: string): boolean {
    const preset = this.presets.get(id);
    if (!preset || this.presets.has(newId)) {
      return false;
    }

    const duplicatedPreset: ThemePreset = {
      ...preset,
      id: newId,
      name: newName || `${preset.name}-copy`,
      displayName: newName || `${preset.displayName} Copy`,
      isBuiltIn: false,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.presets.set(newId, duplicatedPreset);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  /**
   * Search presets
   */
  searchPresets(query: string, tags?: string[]): ThemePreset[] {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.presets.values()).filter(preset => {
      const matchesQuery = !query || 
        preset.name.toLowerCase().includes(lowerQuery) ||
        preset.displayName.toLowerCase().includes(lowerQuery) ||
        preset.description.toLowerCase().includes(lowerQuery) ||
        preset.author?.toLowerCase().includes(lowerQuery);
      
      const matchesTags = !tags || tags.length === 0 ||
        tags.some(tag => preset.tags?.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  }

  /**
   * Get all available tags
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    
    Array.from(this.presets.values()).forEach(preset => {
      preset.tags?.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags).sort();
  }

  /**
   * Export preset
   */
  exportPreset(id: string): string | null {
    const preset = this.presets.get(id);
    if (!preset) {
      return null;
    }

    return JSON.stringify(preset, null, 2);
  }

  /**
   * Import preset
   */
  importPreset(json: string, overwrite = false): boolean {
    try {
      const preset: ThemePreset = JSON.parse(json);
      
      // Validate preset structure
      if (!this.validatePreset(preset)) {
        return false;
      }

      // Check if preset already exists
      if (this.presets.has(preset.id) && !overwrite) {
        return false;
      }

      // Mark as custom
      preset.isCustom = true;
      preset.isBuiltIn = false;
      preset.updatedAt = new Date();
      
      if (!preset.createdAt) {
        preset.createdAt = new Date();
      }

      this.presets.set(preset.id, preset);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to import preset:', error);
      return false;
    }
  }

  /**
   * Validate preset structure
   */
  private validatePreset(preset: any): preset is ThemePreset {
    return (
      typeof preset === 'object' &&
      typeof preset.id === 'string' &&
      typeof preset.name === 'string' &&
      typeof preset.displayName === 'string' &&
      typeof preset.description === 'string' &&
      typeof preset.light === 'object' &&
      typeof preset.dark === 'object' &&
      typeof preset.light.colors === 'object' &&
      typeof preset.dark.colors === 'object'
    );
  }

  /**
   * Apply preset to CSS variables (batched)
   */
  applyPreset(id: string, mode: 'light' | 'dark'): boolean {
    const preset = this.presets.get(id);
    if (!preset) {
      return false;
    }

    const scheme = mode === 'light' ? preset.light : preset.dark;
    const properties: Record<string, string> = {};

    // Apply color variables
    Object.entries(scheme.colors).forEach(([key, value]) => {
      const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      properties[cssVar] = value;
    });

    // Apply typography variables
    if (scheme.typography) {
      properties['--font-family'] = scheme.typography.fontFamily;
      
      Object.entries(scheme.typography.fontSize).forEach(([key, value]) => {
        properties[`--font-size-${key}`] = value;
      });
      
      Object.entries(scheme.typography.fontWeight).forEach(([key, value]) => {
        properties[`--font-weight-${key}`] = value;
      });
      
      Object.entries(scheme.typography.lineHeight).forEach(([key, value]) => {
        properties[`--line-height-${key}`] = value;
      });
    }

    // Apply spacing variables
    if (scheme.spacing) {
      Object.entries(scheme.spacing).forEach(([key, value]) => {
        properties[`--spacing-${key}`] = value;
      });
    }

    // Apply border radius variables
    if (scheme.borderRadius) {
      Object.entries(scheme.borderRadius).forEach(([key, value]) => {
        properties[`--border-radius-${key}`] = value;
      });
    }

    // Apply animation variables
    if (scheme.animations) {
      Object.entries(scheme.animations.duration).forEach(([key, value]) => {
        properties[`--animation-duration-${key}`] = value;
      });
      
      Object.entries(scheme.animations.easing).forEach(([key, value]) => {
        properties[`--animation-easing-${key}`] = value;
      });
    }

    // Batch apply all properties
    setCSSCustomProperties(properties);

    return true;
  }

  /**
   * Subscribe to preset changes
   */
  subscribe(listener: (presets: ThemePreset[], currentId: string) => void): () => void {
    this.listeners.add(listener);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify listeners of changes
   */
  private notifyListeners(): void {
    const presets = this.getAllPresets();
    this.listeners.forEach(listener => {
      try {
        listener(presets, this.currentPresetId);
      } catch (error) {
        console.error('Error in preset listener:', error);
      }
    });
  }

  /**
   * Reset to default presets
   */
  reset(): void {
    // Clear custom presets
    Array.from(this.presets.keys()).forEach(id => {
      const preset = this.presets.get(id);
      if (preset?.isCustom) {
        this.presets.delete(id);
      }
    });

    this.currentPresetId = 'default';
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; available: number; customPresets: number } {
    const customPresets = this.getCustomPresets();
    const used = JSON.stringify(customPresets).length;
    const available = 5 * 1024 * 1024; // Assume 5MB localStorage limit
    
    return {
      used,
      available,
      customPresets: customPresets.length
    };
  }
}

// Singleton instance
export const themePresetsManager = new ThemePresetsManager();

// Utility functions
export const getAllThemePresets = () => themePresetsManager.getAllPresets();
export const getCurrentThemePreset = () => themePresetsManager.getCurrentPreset();
export const setCurrentThemePreset = (id: string) => themePresetsManager.setCurrentPreset(id);
export const applyThemePreset = (id: string, mode: 'light' | 'dark') => 
  themePresetsManager.applyPreset(id, mode);