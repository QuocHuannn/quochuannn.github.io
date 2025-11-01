import React, { useState, useEffect, useCallback } from 'react';
import { useThemePresets } from '../../hooks/useThemePresets';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useAnimationPreferences } from '../../hooks/useAnimationPreferences';
import { useThemeTransitions } from '../../hooks/useThemeTransitions';
import { ColorScheme, ThemePreset } from '../../utils/themePresets';
import { AnimationConfig, AnimationPreferences } from '../../utils/animationPreferences';
import { setCSSCustomProperties } from '../../utils/themeUtils';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface CustomColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface CustomTypography {
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
}

interface CustomSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

interface CustomBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const defaultColorPalette: CustomColorPalette = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  accent: '#8b5cf6',
  background: 'var(--color-bg-primary)',
  surface: '#f9fafb',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

const defaultTypography: CustomTypography = {
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

const defaultSpacing: CustomSpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem'
};

const defaultBorderRadius: CustomBorderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px'
};

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const { presets, currentPreset, addPreset, updatePreset, deletePreset } = useThemePresets();
  const { preferences, updatePreferences } = useUserPreferences();
  const { preferences: animationPreferences, setPreferences: updateAnimationPreferences } = useAnimationPreferences();
  const { executeTransition } = useThemeTransitions();

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'animations' | 'presets'>('colors');
  const [customColors, setCustomColors] = useState<CustomColorPalette>(defaultColorPalette);
  const [customTypography, setCustomTypography] = useState<CustomTypography>(defaultTypography);
  const [customSpacing, setCustomSpacing] = useState<CustomSpacing>(defaultSpacing);
  const [customBorderRadius, setCustomBorderRadius] = useState<CustomBorderRadius>(defaultBorderRadius);
  const [presetName, setPresetName] = useState('');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);

  // Load current customizations from preferences
  useEffect(() => {
    // Custom properties are handled separately from UI preferences
    // if (preferences.ui?.customColors) {
    //   setCustomColors({ ...defaultColorPalette, ...preferences.ui.customColors });
    // }
    // if (preferences.ui?.customTypography) {
    //   setCustomTypography({ ...defaultTypography, ...preferences.ui.customTypography });
    // }
    // if (preferences.ui?.customSpacing) {
    //   setCustomSpacing({ ...defaultSpacing, ...preferences.ui.customSpacing });
    // }
    // if (preferences.ui?.customBorderRadius) {
    //   setCustomBorderRadius({ ...defaultBorderRadius, ...preferences.ui.customBorderRadius });
    // }
  }, [preferences]);

  const handleColorChange = useCallback((colorKey: keyof CustomColorPalette, value: string) => {
    const newColors = { ...customColors, [colorKey]: value };
    setCustomColors(newColors);
    
    // Apply changes immediately
    // Store custom colors in theme preferences instead of UI preferences
    // updatePreferences({
    //   ui: {
    //     ...preferences.ui,
    //     customColors: newColors
    //   }
    // });
    
    // Apply to CSS variables
    applyCustomColors(newColors);
  }, [customColors, preferences.ui, updatePreferences]);

  const handleTypographyChange = useCallback((category: keyof CustomTypography, key: string, value: string | number) => {
    const currentCategory = customTypography[category];
    if (typeof currentCategory === 'object' && currentCategory !== null) {
        const newTypography = {
        ...customTypography,
        [category]: {
          ...currentCategory,
          [key]: value
        }
      };
      setCustomTypography(newTypography);
      
      // Store custom typography in theme preferences instead of UI preferences
      // updatePreferences({
      //   ui: {
      //     ...preferences.ui,
      //     customTypography: newTypography
      //   }
      // });
      
      applyCustomTypography(newTypography);
    }
  }, [customTypography, preferences.ui, updatePreferences]);

  const handleSpacingChange = useCallback((key: keyof CustomSpacing, value: string) => {
    const newSpacing = { ...customSpacing, [key]: value };
    setCustomSpacing(newSpacing);
    
    // Store custom spacing in theme preferences instead of UI preferences
    // updatePreferences({
    //   ui: {
    //     ...preferences.ui,
    //     customSpacing: newSpacing
    //   }
    // });
    
    applyCustomSpacing(newSpacing);
  }, [customSpacing, preferences.ui, updatePreferences]);

  const handleBorderRadiusChange = useCallback((key: keyof CustomBorderRadius, value: string) => {
    const newBorderRadius = { ...customBorderRadius, [key]: value };
    setCustomBorderRadius(newBorderRadius);
    
    // Store custom border radius in theme preferences instead of UI preferences
    // updatePreferences({
    //   ui: {
    //     ...preferences.ui,
    //     customBorderRadius: newBorderRadius
    //   }
    // });
    
    applyCustomBorderRadius(newBorderRadius);
  }, [customBorderRadius, preferences.ui, updatePreferences]);

  const handleAnimationChange = useCallback((key: keyof AnimationPreferences, value: any) => {
    updateAnimationPreferences({
      [key]: value
    });
  }, [updateAnimationPreferences]);

  const handleCreatePreset = useCallback(async () => {
    if (!presetName.trim()) return;
    
    const newPreset: Omit<ThemePreset, 'isBuiltIn' | 'isCustom' | 'createdAt' | 'updatedAt'> = {
      id: `custom-${Date.now()}`,
      name: presetName,
      displayName: presetName,
      description: `Custom preset created on ${new Date().toLocaleDateString()}`,
      author: 'User',
      version: '1.0.0',
      tags: ['custom'],
      light: {
        name: 'custom-light',
        displayName: 'Custom Light',
        description: 'Custom light theme',
        colors: {
            primary: customColors.primary,
            primaryForeground: 'var(--color-text-on-primary)',
            primaryHover: customColors.primary,
            primaryActive: customColors.primary,
            secondary: customColors.secondary,
            secondaryForeground: 'var(--color-text-on-secondary)',
            secondaryHover: customColors.secondary,
            secondaryActive: customColors.secondary,
            accent: customColors.accent,
            accentForeground: 'var(--color-text-on-accent)',
            accentHover: customColors.accent,
            accentActive: customColors.accent,
            background: customColors.background,
            backgroundSecondary: customColors.surface,
            backgroundTertiary: customColors.surface,
            backgroundHover: customColors.surface,
            foreground: customColors.text,
            foregroundSecondary: customColors.textSecondary,
            foregroundMuted: customColors.textSecondary,
            foregroundDisabled: customColors.textSecondary,
            border: customColors.border,
            borderSecondary: customColors.border,
            borderHover: customColors.border,
            borderFocus: customColors.primary,
            success: customColors.success,
            successForeground: 'var(--color-text-on-success)',
            warning: customColors.warning,
            warningForeground: 'var(--color-text-on-warning)',
            error: customColors.error,
            errorForeground: 'var(--color-text-on-error)',
            info: customColors.primary,
            infoForeground: 'var(--color-text-on-info)',
            shadow: 'rgba(0, 0, 0, 0.1)',
            overlay: 'rgba(0, 0, 0, 0.5)',
            highlight: '#fef3c7',
            selection: '#dbeafe'
        },
        typography: customTypography,
        spacing: customSpacing,
        borderRadius: customBorderRadius,
        animations: {
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
        }
      },
      dark: {
        name: 'custom-dark',
        displayName: 'Custom Dark',
        description: 'Custom dark theme',
        colors: {
            primary: customColors.primary,
            primaryForeground: 'var(--color-text-on-primary)',
            primaryHover: customColors.primary,
            primaryActive: customColors.primary,
            secondary: customColors.secondary,
            secondaryForeground: 'var(--color-text-on-secondary)',
            secondaryHover: customColors.secondary,
            secondaryActive: customColors.secondary,
            accent: customColors.accent,
            accentForeground: 'var(--color-text-on-accent)',
            accentHover: customColors.accent,
            accentActive: customColors.accent,
            background: '#1f2937',
            backgroundSecondary: '#374151',
            backgroundTertiary: '#4b5563',
            backgroundHover: '#6b7280',
            foreground: '#f9fafb',
            foregroundSecondary: '#d1d5db',
            foregroundMuted: '#9ca3af',
            foregroundDisabled: '#6b7280',
            border: '#4b5563',
            borderSecondary: '#6b7280',
            borderHover: '#9ca3af',
            borderFocus: customColors.primary,
            success: customColors.success,
            successForeground: 'var(--color-text-on-success)',
            warning: customColors.warning,
            warningForeground: 'var(--color-text-on-warning)',
            error: customColors.error,
            errorForeground: 'var(--color-text-on-error)',
            info: customColors.primary,
            infoForeground: 'var(--color-text-on-info)',
            shadow: 'rgba(0, 0, 0, 0.3)',
            overlay: 'rgba(0, 0, 0, 0.7)',
            highlight: '#374151',
            selection: '#1e40af'
        },
        typography: customTypography,
        spacing: customSpacing,
        borderRadius: customBorderRadius,
        animations: {
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
        }
      }
    };
    
    await executeTransition(async () => {
      await addPreset(newPreset);
    });
    
    setPresetName('');
    setIsCreatingPreset(false);
  }, [presetName, customColors, customTypography, customSpacing, customBorderRadius, animationPreferences, addPreset, executeTransition]);

  const handleResetToDefaults = useCallback(async () => {
    await executeTransition(async () => {
      setCustomColors(defaultColorPalette);
      setCustomTypography(defaultTypography);
      setCustomSpacing(defaultSpacing);
      setCustomBorderRadius(defaultBorderRadius);
      
      // Reset preferences - custom properties are handled separately
      // updatePreferences({
      //   ui: {
      //     ...preferences.ui,
      //     customColors: defaultColorPalette,
      //     customTypography: defaultTypography,
      //     customSpacing: defaultSpacing,
      //     customBorderRadius: defaultBorderRadius
      //   }
      // });
      
      // Apply defaults to CSS
      applyCustomColors(defaultColorPalette);
      applyCustomTypography(defaultTypography);
      applyCustomSpacing(defaultSpacing);
      applyCustomBorderRadius(defaultBorderRadius);
    });
  }, [preferences.ui, updatePreferences, executeTransition]);

  // Helper functions to apply custom styles to CSS variables (batched)
  const applyCustomColors = (colors: CustomColorPalette) => {
    const properties: Record<string, string> = {};
    Object.entries(colors).forEach(([key, value]) => {
      properties[`--color-custom-${key}`] = value;
    });
    setCSSCustomProperties(properties);
  };

  const applyCustomTypography = (typography: CustomTypography) => {
    const properties: Record<string, string> = {
      '--font-family-custom': typography.fontFamily
    };
    
    Object.entries(typography.fontSize).forEach(([key, value]) => {
      properties[`--font-size-custom-${key}`] = value;
    });
    
    Object.entries(typography.fontWeight).forEach(([key, value]) => {
      properties[`--font-weight-custom-${key}`] = value.toString();
    });
    
    Object.entries(typography.lineHeight).forEach(([key, value]) => {
      properties[`--line-height-custom-${key}`] = value;
    });
    
    setCSSCustomProperties(properties);
  };

  const applyCustomSpacing = (spacing: CustomSpacing) => {
    const properties: Record<string, string> = {};
    Object.entries(spacing).forEach(([key, value]) => {
      properties[`--spacing-custom-${key}`] = value;
    });
    setCSSCustomProperties(properties);
  };

  const applyCustomBorderRadius = (borderRadius: CustomBorderRadius) => {
    const properties: Record<string, string> = {};
    Object.entries(borderRadius).forEach(([key, value]) => {
      properties[`--border-radius-custom-${key}`] = value;
    });
    setCSSCustomProperties(properties);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}>
      <div className="rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Customizer</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(['colors', 'typography', 'spacing', 'animations', 'presets'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Custom Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof CustomColorPalette, e.target.value)}
                        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof CustomColorPalette, e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Typography Settings</h3>
              
              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium mb-2">Font Family</label>
                <input
                  type="text"
                  value={customTypography.fontFamily}
                  onChange={(e) => handleTypographyChange('fontFamily', '', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Font Sizes */}
              <div>
                <h4 className="font-medium mb-3">Font Sizes</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(customTypography.fontSize).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleTypographyChange('fontSize', key, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Weights */}
              <div>
                <h4 className="font-medium mb-3">Font Weights</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(customTypography.fontWeight).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleTypographyChange('fontWeight', key, parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        min="100"
                        max="900"
                        step="100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spacing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Spacing &amp; Layout</h3>
              
              {/* Spacing */}
              <div>
                <h4 className="font-medium mb-3">Spacing Scale</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(customSpacing).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSpacingChange(key as keyof CustomSpacing, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <h4 className="font-medium mb-3">Border Radius</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(customBorderRadius).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleBorderRadiusChange(key as keyof CustomBorderRadius, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'animations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Animation Settings</h3>
              
              {/* Global Animation Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Animations</label>
                <input
                  type="checkbox"
                  checked={animationPreferences.globalAnimationsEnabled}
                  onChange={(e) => handleAnimationChange('globalAnimationsEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Respect Reduced Motion */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Respect Reduced Motion</label>
                <input
                  type="checkbox"
                  checked={animationPreferences.respectReducedMotion}
                  onChange={(e) => handleAnimationChange('respectReducedMotion', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Theme Transition Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">Theme Transition Duration (ms)</label>
                <input
                  type="number"
                  value={animationPreferences.themeTransition.duration}
                  onChange={(e) => handleAnimationChange('themeTransition', {
                    ...animationPreferences.themeTransition,
                    duration: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="0"
                  max="2000"
                  step="50"
                />
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Theme Presets</h3>
                <button
                  onClick={() => setIsCreatingPreset(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Preset
                </button>
              </div>

              {/* Create Preset Form */}
              {isCreatingPreset && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Preset name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCreatePreset}
                        disabled={!presetName.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Preset
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingPreset(false);
                          setPresetName('');
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preset List */}
              <div className="grid gap-4">
                {presets.map((preset) => (
                  <div key={preset.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{preset.name}</h4>
                        <p className="text-sm text-gray-600">{preset.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updatePreset(preset.id, preset)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Apply
                        </button>
                        {preset.isCustom && (
                          <button
                            onClick={() => deletePreset(preset.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;