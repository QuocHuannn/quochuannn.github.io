// React Hook for Theme Presets
// Provides easy integration of theme presets system in React components

import { useCallback, useEffect, useState } from 'react';
import {
  themePresetsManager,
  ThemePreset,
  ColorScheme,
  getAllThemePresets,
  getCurrentThemePreset,
  setCurrentThemePreset,
  applyThemePreset
} from '../utils/themePresets';
import { useTheme } from './useTheme';

export interface UseThemePresetsOptions {
  autoApply?: boolean;
  syncWithTheme?: boolean;
  onPresetChange?: (preset: ThemePreset) => void;
  onError?: (error: Error) => void;
}

export interface UseThemePresetsReturn {
  // State
  presets: ThemePreset[];
  currentPreset: ThemePreset | undefined;
  currentPresetId: string;
  builtInPresets: ThemePreset[];
  customPresets: ThemePreset[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPreset: (id: string) => Promise<boolean>;
  addPreset: (preset: Omit<ThemePreset, 'isBuiltIn' | 'isCustom' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updatePreset: (id: string, updates: Partial<ThemePreset>) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  duplicatePreset: (id: string, newId: string, newName?: string) => Promise<boolean>;
  
  // Search and filter
  searchPresets: (query: string, tags?: string[]) => ThemePreset[];
  getAllTags: () => string[];
  
  // Import/Export
  exportPreset: (id: string) => string | null;
  importPreset: (json: string, overwrite?: boolean) => Promise<boolean>;
  
  // Utilities
  applyPreset: (id: string) => Promise<boolean>;
  resetPresets: () => Promise<void>;
  getStorageInfo: () => { used: number; available: number; customPresets: number };
}

/**
 * Main hook for theme presets management
 */
export function useThemePresets(options: UseThemePresetsOptions = {}): UseThemePresetsReturn {
  const {
    autoApply = true,
    syncWithTheme = true,
    onPresetChange,
    onError
  } = options;

  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [currentPresetId, setCurrentPresetId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { actualTheme } = useTheme();
  
  // Initialize presets
  useEffect(() => {
    try {
      const allPresets = getAllThemePresets();
      const current = getCurrentThemePreset();
      
      setPresets(allPresets);
      setCurrentPresetId(current?.id || 'default');
      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load presets');
      setError(error.message);
      onError?.(error);
      setIsLoading(false);
    }
  }, [onError]);

  // Subscribe to preset changes
  useEffect(() => {
    const unsubscribe = themePresetsManager.subscribe((updatedPresets, currentId) => {
      setPresets(updatedPresets);
      setCurrentPresetId(currentId);
      
      const currentPreset = updatedPresets.find(p => p.id === currentId);
      if (currentPreset && onPresetChange) {
        onPresetChange(currentPreset);
      }
    });

    return unsubscribe;
  }, [onPresetChange]);

  // Auto-apply preset when theme changes
  useEffect(() => {
    if (autoApply && syncWithTheme && currentPresetId && actualTheme) {
      applyThemePreset(currentPresetId, actualTheme);
    }
  }, [autoApply, syncWithTheme, currentPresetId, actualTheme]);

  // Derived state
  const currentPreset = presets.find(p => p.id === currentPresetId);
  const builtInPresets = presets.filter(p => p.isBuiltIn);
  const customPresets = presets.filter(p => p.isCustom);

  // Set current preset
  const setPreset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = setCurrentThemePreset(id);
      
      if (success && autoApply && actualTheme) {
        applyThemePreset(id, actualTheme);
      }
      
      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to set preset');
      setError(error.message);
      onError?.(error);
      return false;
    }
  }, [autoApply, actualTheme, onError]);

  // Add new preset
  const addPreset = useCallback(async (
    preset: Omit<ThemePreset, 'isBuiltIn' | 'isCustom' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    try {
      setError(null);
      return themePresetsManager.addPreset(preset);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add preset');
      setError(error.message);
      onError?.(error);
      return false;
    }
  }, [onError]);

  // Update preset
  const updatePreset = useCallback(async (
    id: string,
    updates: Partial<ThemePreset>
  ): Promise<boolean> => {
    try {
      setError(null);
      return themePresetsManager.updatePreset(id, updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update preset');
      setError(error.message);
      onError?.(error);
      return false;
    }
  }, [onError]);

  // Delete preset
  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      return themePresetsManager.deletePreset(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete preset');
      setError(error.message);
      onError?.(error);
      return false;
    }
  }, [onError]);

  // Duplicate preset
  const duplicatePreset = useCallback(async (
    id: string,
    newId: string,
    newName?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      return themePresetsManager.duplicatePreset(id, newId, newName);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to duplicate preset');
      setError(error.message);
      onError?.(error);
      return false;
    }
  }, [onError]);

  // Search presets
  const searchPresets = useCallback((query: string, tags?: string[]): ThemePreset[] => {
    return themePresetsManager.searchPresets(query, tags);
  }, []);

  // Get all tags
  const getAllTags = useCallback((): string[] => {
    return themePresetsManager.getAllTags();
  }, []);

  // Export preset
  const exportPreset = useCallback((id: string): string | null => {
    return themePresetsManager.exportPreset(id);
  }, []);

  // Import preset
  const importPreset = useCallback(async (
    json: string,
    overwrite = false
  ): Promise<boolean> => {
    try {
      setError(null);
      return themePresetsManager.importPreset(json, overwrite);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to import preset');
      setError(error.message);
      onError?.(error);
      return false;
    }
  }, [onError]);

  // Apply preset manually
  const applyPreset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      if (!actualTheme) {
        throw new Error('Theme not available');
      }
      
      return applyThemePreset(id, actualTheme);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to apply preset');
      setError(error.message);
      onError?.(error);
      return false;
    }
  }, [actualTheme, onError]);

  // Reset presets
  const resetPresets = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      themePresetsManager.reset();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset presets');
      setError(error.message);
      onError?.(error);
    }
  }, [onError]);

  // Get storage info
  const getStorageInfo = useCallback(() => {
    return themePresetsManager.getStorageInfo();
  }, []);

  return {
    // State
    presets,
    currentPreset,
    currentPresetId,
    builtInPresets,
    customPresets,
    isLoading,
    error,
    
    // Actions
    setPreset,
    addPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    
    // Search and filter
    searchPresets,
    getAllTags,
    
    // Import/Export
    exportPreset,
    importPreset,
    
    // Utilities
    applyPreset,
    resetPresets,
    getStorageInfo
  };
}

/**
 * Hook for preset selection only
 */
export function useThemePresetSelection() {
  const { presets, currentPreset, currentPresetId, setPreset, isLoading } = useThemePresets({
    autoApply: true,
    syncWithTheme: true
  });
  
  return {
    presets,
    currentPreset,
    currentPresetId,
    setPreset,
    isLoading
  };
}

/**
 * Hook for current preset info only
 */
export function useCurrentThemePreset() {
  const { currentPreset, currentPresetId, isLoading } = useThemePresets();
  const { actualTheme } = useTheme();
  
  const currentScheme: ColorScheme | undefined = currentPreset && actualTheme
    ? currentPreset[actualTheme]
    : undefined;
  
  return {
    preset: currentPreset,
    presetId: currentPresetId,
    scheme: currentScheme,
    isLoading
  };
}

/**
 * Hook for preset management (CRUD operations)
 */
export function useThemePresetManagement() {
  const {
    customPresets,
    addPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    exportPreset,
    importPreset,
    resetPresets,
    getStorageInfo,
    error
  } = useThemePresets({ autoApply: false });
  
  return {
    customPresets,
    addPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    exportPreset,
    importPreset,
    resetPresets,
    getStorageInfo,
    error
  };
}

/**
 * Hook for preset search and filtering
 */
export function useThemePresetSearch() {
  const { presets, searchPresets, getAllTags } = useThemePresets();
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const filteredPresets = query || selectedTags.length > 0
    ? searchPresets(query, selectedTags.length > 0 ? selectedTags : undefined)
    : presets;
  
  const availableTags = getAllTags();
  
  const addTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev : [...prev, tag]);
  }, []);
  
  const removeTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  }, []);
  
  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);
  
  const clearSearch = useCallback(() => {
    setQuery('');
    setSelectedTags([]);
  }, []);
  
  return {
    query,
    setQuery,
    selectedTags,
    addTag,
    removeTag,
    clearTags,
    clearSearch,
    filteredPresets,
    availableTags,
    hasFilters: query.length > 0 || selectedTags.length > 0
  };
}

/**
 * Hook for preset color scheme access
 */
export function useThemePresetColors(presetId?: string) {
  const { currentPreset } = useThemePresets();
  const { actualTheme } = useTheme();
  
  const preset = presetId 
    ? themePresetsManager.getPreset(presetId)
    : currentPreset;
  
  const scheme = preset && actualTheme ? preset[actualTheme] : undefined;
  const colors = scheme?.colors;
  
  const getColor = useCallback((colorKey: keyof ColorScheme['colors']) => {
    return colors?.[colorKey];
  }, [colors]);
  
  const getCSSVariable = useCallback((colorKey: keyof ColorScheme['colors']) => {
    const cssVar = `--color-${colorKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    return `var(${cssVar})`;
  }, []);
  
  return {
    preset,
    scheme,
    colors,
    getColor,
    getCSSVariable
  };
}

/**
 * Hook for preset validation
 */
export function useThemePresetValidation() {
  const validatePresetStructure = useCallback((preset: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!preset || typeof preset !== 'object') {
      errors.push('Preset must be an object');
      return { isValid: false, errors };
    }
    
    // Required fields
    const requiredFields = ['id', 'name', 'displayName', 'description', 'light', 'dark'];
    requiredFields.forEach(field => {
      if (!preset[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    // Validate color schemes
    ['light', 'dark'].forEach(mode => {
      const scheme = preset[mode];
      if (scheme && typeof scheme === 'object') {
        if (!scheme.colors || typeof scheme.colors !== 'object') {
          errors.push(`Missing or invalid colors in ${mode} scheme`);
        } else {
          // Check for required color properties
          const requiredColors = ['primary', 'background', 'foreground'];
          requiredColors.forEach(color => {
            if (!scheme.colors[color]) {
              errors.push(`Missing required color '${color}' in ${mode} scheme`);
            }
          });
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);
  
  const validatePresetId = useCallback((id: string): { isValid: boolean; error?: string } => {
    if (!id || typeof id !== 'string') {
      return { isValid: false, error: 'ID must be a non-empty string' };
    }
    
    if (!/^[a-z0-9-_]+$/.test(id)) {
      return { isValid: false, error: 'ID can only contain lowercase letters, numbers, hyphens, and underscores' };
    }
    
    if (themePresetsManager.getPreset(id)) {
      return { isValid: false, error: 'A preset with this ID already exists' };
    }
    
    return { isValid: true };
  }, []);
  
  return {
    validatePresetStructure,
    validatePresetId
  };
}