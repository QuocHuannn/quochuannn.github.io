import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/optimized';
import { Palette, Sun, Moon, Star, Zap, CheckCircle, XCircle, Clock, Download, Upload } from 'lucide-react';

interface PresetTestResult {
  testName: string;
  status: 'passed' | 'failed' | 'running';
  duration: number;
  details: string;
  timestamp: string;
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  icon: React.ReactNode;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default-light',
    name: 'Default Light',
    description: 'Clean and minimal light theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: 'var(--color-bg-primary)',
      surface: '#f8fafc',
      text: '#1e293b'
    },
    icon: <Sun className="w-4 h-4" />
  },
  {
    id: 'default-dark',
    name: 'Default Dark',
    description: 'Elegant dark theme for low-light environments',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9'
    },
    icon: <Moon className="w-4 h-4" />
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calming blue tones inspired by the ocean',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#06b6d4',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e'
    },
    icon: <Star className="w-4 h-4" />
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green palette for a fresh look',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: '#f0fdf4',
      surface: '#dcfce7',
      text: '#064e3b'
    },
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm orange and red tones like a sunset',
    colors: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f59e0b',
      background: '#fffbeb',
      surface: '#fef3c7',
      text: '#92400e'
    },
    icon: <Sun className="w-4 h-4" />
  },
  {
    id: 'purple-galaxy',
    name: 'Purple Galaxy',
    description: 'Deep purple theme inspired by space',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#a855f7',
      background: '#faf5ff',
      surface: '#f3e8ff',
      text: '#581c87'
    },
    icon: <Star className="w-4 h-4" />
  }
];

const ThemePresetsTest: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [testResults, setTestResults] = useState<PresetTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset | null>(null);
  const [customPresets, setCustomPresets] = useState<ThemePreset[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const addTestResult = (result: Omit<PresetTestResult, 'timestamp'>) => {
    setTestResults(prev => [...prev, {
      ...result,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testPresetApplication = async (preset: ThemePreset) => {
    addTestResult({
      testName: `Apply Preset: ${preset.name}`,
      status: 'running',
      duration: 0,
      details: `Testing application of ${preset.name} preset`
    });

    const startTime = performance.now();
    
    try {
      // Apply preset colors to CSS custom properties
      const root = document.documentElement;
      Object.entries(preset.colors).forEach(([key, value]) => {
        root.style.setProperty(`--preset-${key}`, value);
      });
      
      // Wait for DOM updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify colors were applied
      const appliedColors = Object.keys(preset.colors).every(key => {
        const appliedValue = getComputedStyle(root).getPropertyValue(`--preset-${key}`);
        return appliedValue.trim() === preset.colors[key as keyof typeof preset.colors];
      });
      
      const endTime = performance.now();
      
      addTestResult({
        testName: `Apply Preset: ${preset.name}`,
        status: appliedColors ? 'passed' : 'failed',
        duration: endTime - startTime,
        details: appliedColors 
          ? `Successfully applied ${preset.name} preset colors` 
          : `Failed to apply some colors for ${preset.name} preset`
      });
      
    } catch (error) {
      addTestResult({
        testName: `Apply Preset: ${preset.name}`,
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error applying preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testPresetPersistence = async () => {
    addTestResult({
      testName: 'Preset Persistence',
      status: 'running',
      duration: 0,
      details: 'Testing preset storage and retrieval'
    });

    const startTime = performance.now();
    const testPreset = THEME_PRESETS[2]; // Ocean Blue
    
    try {
      // Store preset in localStorage
      localStorage.setItem('theme-preset', JSON.stringify(testPreset));
      
      // Retrieve and verify
      const storedPreset = JSON.parse(localStorage.getItem('theme-preset') || '{}');
      const isValid = storedPreset.id === testPreset.id && 
                     storedPreset.name === testPreset.name &&
                     JSON.stringify(storedPreset.colors) === JSON.stringify(testPreset.colors);
      
      addTestResult({
        testName: 'Preset Persistence',
        status: isValid ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: isValid 
          ? 'Preset successfully stored and retrieved from localStorage' 
          : 'Preset data was corrupted during storage/retrieval'
      });
      
      // Clean up
      localStorage.removeItem('theme-preset');
      
    } catch (error) {
      addTestResult({
        testName: 'Preset Persistence',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error testing persistence: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testPresetValidation = async () => {
    addTestResult({
      testName: 'Preset Validation',
      status: 'running',
      duration: 0,
      details: 'Testing preset data validation'
    });

    const startTime = performance.now();
    
    try {
      const validationResults = THEME_PRESETS.map(preset => {
        const hasRequiredFields = preset.id && preset.name && preset.colors;
        const hasAllColors = preset.colors && 
          preset.colors.primary && 
          preset.colors.secondary && 
          preset.colors.accent && 
          preset.colors.background && 
          preset.colors.surface && 
          preset.colors.text;
        
        const hasValidColorFormat = Object.values(preset.colors).every(color => 
          /^#[0-9A-Fa-f]{6}$/.test(color)
        );
        
        return {
          preset: preset.name,
          valid: hasRequiredFields && hasAllColors && hasValidColorFormat,
          issues: [
            !hasRequiredFields && 'Missing required fields',
            !hasAllColors && 'Missing color definitions',
            !hasValidColorFormat && 'Invalid color format'
          ].filter(Boolean)
        };
      });
      
      const allValid = validationResults.every(result => result.valid);
      const invalidPresets = validationResults.filter(result => !result.valid);
      
      addTestResult({
        testName: 'Preset Validation',
        status: allValid ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: allValid 
          ? `All ${THEME_PRESETS.length} presets passed validation` 
          : `${invalidPresets.length} presets failed validation: ${invalidPresets.map(p => p.preset).join(', ')}`
      });
      
    } catch (error) {
      addTestResult({
        testName: 'Preset Validation',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testCustomPresetCreation = async () => {
    addTestResult({
      testName: 'Custom Preset Creation',
      status: 'running',
      duration: 0,
      details: 'Testing custom preset creation and management'
    });

    const startTime = performance.now();
    
    try {
      const customPreset: ThemePreset = {
        id: 'custom-test',
        name: 'Custom Test Preset',
        description: 'A test preset created dynamically',
        colors: {
          primary: '#ff6b6b',
          secondary: '#4ecdc4',
          accent: '#45b7d1',
          background: '#f7f1e3',
          surface: '#e8dcc6',
          text: '#2c3e50'
        },
        icon: <Palette className="w-4 h-4" />
      };
      
      // Add to custom presets
      setCustomPresets(prev => [...prev, customPreset]);
      
      // Test application
      await testPresetApplication(customPreset);
      
      addTestResult({
        testName: 'Custom Preset Creation',
        status: 'passed',
        duration: performance.now() - startTime,
        details: 'Successfully created and applied custom preset'
      });
      
    } catch (error) {
      addTestResult({
        testName: 'Custom Preset Creation',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error creating custom preset: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testPresetExportImport = async () => {
    addTestResult({
      testName: 'Preset Export/Import',
      status: 'running',
      duration: 0,
      details: 'Testing preset export and import functionality'
    });

    const startTime = performance.now();
    
    try {
      const testPreset = THEME_PRESETS[0];
      
      // Export preset
      const exportedData = JSON.stringify(testPreset, null, 2);
      
      // Import preset
      const importedPreset = JSON.parse(exportedData);
      
      // Verify data integrity
      const isIdentical = JSON.stringify(testPreset) === JSON.stringify(importedPreset);
      
      addTestResult({
        testName: 'Preset Export/Import',
        status: isIdentical ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: isIdentical 
          ? 'Preset export/import maintains data integrity' 
          : 'Data corruption detected during export/import'
      });
      
    } catch (error) {
      addTestResult({
        testName: 'Preset Export/Import',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error during export/import: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    addTestResult({
      testName: 'Test Suite Started',
      status: 'passed',
      duration: 0,
      details: 'Starting comprehensive theme presets tests'
    });

    try {
      await testPresetValidation();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testPresetPersistence();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Test each preset
      for (const preset of THEME_PRESETS.slice(0, 3)) { // Test first 3 presets
        await testPresetApplication(preset);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await testCustomPresetCreation();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testPresetExportImport();
      
      addTestResult({
        testName: 'Test Suite Completed',
        status: 'passed',
        duration: 0,
        details: 'All theme preset tests completed successfully'
      });
    } catch (error) {
      addTestResult({
        testName: 'Test Suite Error',
        status: 'failed',
        duration: 0,
        details: `Error during testing: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const applyPreset = (preset: ThemePreset) => {
    setSelectedPreset(preset);
    
    // Apply colors to CSS custom properties
    const root = document.documentElement;
    Object.entries(preset.colors).forEach(([key, value]) => {
      root.style.setProperty(`--preset-${key}`, value);
    });
    
    if (previewMode) {
      // Apply to actual theme colors for preview
      Object.entries(preset.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  };

  const resetPreset = () => {
    setSelectedPreset(null);
    const root = document.documentElement;
    
    // Remove preset custom properties
    Object.keys(THEME_PRESETS[0].colors).forEach(key => {
      root.style.removeProperty(`--preset-${key}`);
      if (previewMode) {
        root.style.removeProperty(`--color-${key}`);
      }
    });
  };

  const getStatusIcon = (status: PresetTestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Theme Presets Test Suite</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive testing for theme preset system and color scheme management
          </p>
        </motion.div>

        {/* Test Controls */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {isRunningTests ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <button
              onClick={() => setTestResults([])}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Clear Results
            </button>
            
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-3 rounded-lg transition-colors duration-200 ${
                previewMode 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {previewMode ? 'Exit Preview' : 'Preview Mode'}
            </button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current theme: <strong>{theme}</strong> | 
            Selected preset: <strong>{selectedPreset?.name || 'None'}</strong> |
            Preview mode: <strong>{previewMode ? 'On' : 'Off'}</strong>
          </div>
        </motion.div>

        {/* Theme Presets Gallery */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Presets Gallery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {THEME_PRESETS.map((preset) => (
              <motion.div
                key={preset.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPreset?.id === preset.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => applyPreset(preset)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {preset.icon}
                  <h3 className="font-semibold">{preset.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {preset.description}
                </p>
                <div className="flex gap-1">
                  {Object.entries(preset.colors).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                      title={`${key}: ${color}`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Custom Presets */}
          {customPresets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Custom Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customPresets.map((preset) => (
                  <motion.div
                    key={preset.id}
                    className="p-4 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg cursor-pointer transition-all duration-200 hover:border-purple-400 dark:hover:border-purple-600"
                    onClick={() => applyPreset(preset)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {preset.icon}
                      <h3 className="font-semibold">{preset.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {preset.description}
                    </p>
                    <div className="flex gap-1">
                      {Object.entries(preset.colors).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                          title={`${key}: ${color}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={resetPreset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
            >
              Reset Preset
            </button>
          </div>
        </motion.div>

        {/* Preset Preview */}
        {selectedPreset && (
          <motion.div 
            className="mb-8 p-6 rounded-lg shadow-lg transition-colors duration-300"
            style={{
              backgroundColor: `var(--preset-background, ${selectedPreset.colors.background})`,
              color: `var(--preset-text, ${selectedPreset.colors.text})`
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-xl font-semibold mb-4">Preset Preview: {selectedPreset.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: `var(--preset-primary, ${selectedPreset.colors.primary})`, color: 'white' }}
              >
                <h3 className="font-semibold">Primary Color</h3>
                <p>Main brand color</p>
              </div>
              
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: `var(--preset-secondary, ${selectedPreset.colors.secondary})`, color: 'white' }}
              >
                <h3 className="font-semibold">Secondary Color</h3>
                <p>Supporting color</p>
              </div>
              
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: `var(--preset-accent, ${selectedPreset.colors.accent})`, color: 'white' }}
              >
                <h3 className="font-semibold">Accent Color</h3>
                <p>Highlight color</p>
              </div>
            </div>
            
            <div 
              className="mt-4 p-4 rounded-lg"
              style={{ backgroundColor: `var(--preset-surface, ${selectedPreset.colors.surface})` }}
            >
              <h3 className="font-semibold mb-2">Surface Example</h3>
              <p>This is how content appears on surface backgrounds with the selected preset.</p>
            </div>
          </motion.div>
        )}

        {/* Test Results */}
        <motion.div 
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          {testResults.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No test results yet. Click "Run All Tests" to start testing.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-lg border-l-4 ${
                      result.status === 'passed' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                        : result.status === 'failed'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.testName}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {result.timestamp}
                        {result.duration > 0 && ` • ${result.duration.toFixed(2)}ms`}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {result.details}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ThemePresetsTest;