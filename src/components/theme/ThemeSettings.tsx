import React, { useState, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useAnimationPreferences } from '../../hooks/useAnimationPreferences';
import { useThemePresets } from '../../hooks/useThemePresets';
import { useThemeTransitions } from '../../hooks/useThemeTransitions';
import { Settings, Palette, Download, Upload, RotateCcw } from 'lucide-react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { Theme } from '../../hooks/useTheme';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface ThemeSettingsProps {
  className?: string;
  showAdvancedOptions?: boolean;
  compact?: boolean;
}

const themeOptions = [
  { value: 'light' as Theme, label: 'Light', icon: '☀️' },
  { value: 'dark' as Theme, label: 'Dark', icon: '🌙' }
];

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  className = '',
  showAdvancedOptions = true,
  compact = false
}) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const { preferences, updatePreferences, exportPreferences, importPreferences } = useUserPreferences();
  const { preferences: animationPreferences, setPreferences: updateAnimationPreferences } = useAnimationPreferences();
  const { presets, currentPreset, applyPreset } = useThemePresets();
  const { executeTransition } = useThemeTransitions();

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');

  const handleThemeChange = useCallback(async (newTheme: Theme) => {
    await executeTransition(async () => {
      setTheme(newTheme);
    });
  }, [setTheme, executeTransition]);

  const handleAnimationToggle = useCallback((key: string, value: boolean | object) => {
    updateAnimationPreferences({
      [key]: value
    });
  }, [updateAnimationPreferences]);

  const handlePresetChange = useCallback(async (presetId: string) => {
    await executeTransition(async () => {
      await applyPreset(presetId);
    });
  }, [applyPreset, executeTransition]);

  const handleExportPreferences = useCallback(() => {
    const exported = exportPreferences();
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-preferences-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportPreferences]);

  const handleImportPreferences = useCallback(async () => {
    try {
      const data = JSON.parse(importData);
      await executeTransition(async () => {
        await importPreferences(data);
      });
      setImportData('');
      setIsImporting(false);
    } catch (error) {
      console.error('Failed to import preferences:', error);
      alert('Invalid preferences data. Please check the format and try again.');
    }
  }, [importData, importPreferences, executeTransition]);

  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
        setIsImporting(true);
      };
      reader.readAsText(file);
    }
  }, []);

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Compact Theme Selector */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                theme === option.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              style={theme !== option.value ? { backgroundColor: 'var(--color-bg-primary)' } : undefined}
              title={option.label}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        {showAdvancedOptions && (
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Open Theme Customizer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                theme === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium text-sm">{option.label}</div>
              {theme === option.value && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active</div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Current: {actualTheme === 'light' ? '☀️ Light' : '🌙 Dark'} mode
        </div>
      </div>

      {/* Animation Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Animations</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Enable Animations</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Turn on/off all animations</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={animationPreferences.globalAnimationsEnabled}
                onChange={(e) => handleAnimationToggle('globalAnimationsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" style={{'--tw-after-bg': 'var(--color-bg-primary, white)', '--tw-after-border': 'var(--color-border-primary, white)'} as React.CSSProperties}></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Respect Reduced Motion</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Follow system accessibility preferences</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={animationPreferences.respectReducedMotion}
                onChange={(e) => handleAnimationToggle('respectReducedMotion', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" style={{'--tw-after-bg': 'var(--color-bg-primary, white)', '--tw-after-border': 'var(--color-border-primary, white)'} as React.CSSProperties}></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Theme Transitions</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Smooth transitions when switching themes</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={animationPreferences.themeTransition.enabled}
                onChange={(e) => handleAnimationToggle('themeTransition', {
                  ...animationPreferences.themeTransition,
                  enabled: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" style={{'--tw-after-bg': 'var(--color-bg-primary, white)', '--tw-after-border': 'var(--color-border-primary, white)'} as React.CSSProperties}></div>
            </label>
          </div>
        </div>
      </div>

      {/* Theme Presets */}
      {showAdvancedOptions && presets.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Theme Presets</h3>
          <div className="space-y-2">
            {presets.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  currentPreset?.id === preset.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{preset.description}</div>
              </button>
            ))}
            {presets.length > 3 && (
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="w-full p-3 text-center text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-dashed border-blue-300 dark:border-blue-700 transition-colors"
              >
                View all presets ({presets.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Advanced Options */}
      {showAdvancedOptions && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Advanced</h3>
          <div className="space-y-3">
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Theme Customizer</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Customize colors, typography, and more</div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={handleExportPreferences}
                className="flex-1 p-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Export Settings
              </button>
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <div className="p-3 text-sm font-medium text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  Import Settings
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-xl shadow-2xl w-full max-w-md p-6" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <h3 className="text-lg font-semibold mb-4">Import Theme Settings</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your theme settings JSON here..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleImportPreferences}
                disabled={!importData.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setIsImporting(false);
                  setImportData('');
                }}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Customizer */}
      <ThemeCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
};

export default ThemeSettings;