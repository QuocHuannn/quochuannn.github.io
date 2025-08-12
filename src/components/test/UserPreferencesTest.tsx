import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useAnimationPreferences } from '../../hooks/useAnimationPreferences';
import { 
  User, 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Save,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface PreferenceTestResult {
  testName: string;
  status: 'passed' | 'failed' | 'running';
  duration: number;
  details: string;
  timestamp: string;
}

const UserPreferencesTest: React.FC = () => {
  const {
    themePreferences,
    animationPreferences,
    uiPreferences,
    updateThemePreferences,
    updateAnimationPreferences,
    updateUIPreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
    error
  } = useUserPreferences();
  
  const { shouldAnimate } = useAnimationPreferences();
  const [testResults, setTestResults] = useState<PreferenceTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [exportedData, setExportedData] = useState<string>('');
  const [importData, setImportData] = useState<string>('');
  const [showExportData, setShowExportData] = useState(false);
  const [backupPreferences, setBackupPreferences] = useState<any>(null);

  const addTestResult = (result: Omit<PreferenceTestResult, 'timestamp'>) => {
    setTestResults(prev => [...prev, {
      ...result,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Backup current preferences before testing
  useEffect(() => {
    if (!backupPreferences) {
      setBackupPreferences({
        theme: { ...themePreferences },
        animation: { ...animationPreferences },
        ui: { ...uiPreferences }
      });
    }
  }, [themePreferences, animationPreferences, uiPreferences, backupPreferences]);

  const testThemePreferencesUpdate = async () => {
    addTestResult({
      testName: 'Theme Preferences Update',
      status: 'running',
      duration: 0,
      details: 'Testing theme preferences modification'
    });

    const startTime = performance.now();
    const originalTheme = themePreferences.theme;
    
    try {
      // Update theme preference
      const newTheme = originalTheme === 'light' ? 'dark' : 'light';
      updateThemePreferences({ theme: newTheme });
      
      // Wait for update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if update was successful
      const success = themePreferences.theme === newTheme;
      
      addTestResult({
        testName: 'Theme Preferences Update',
        status: success ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: success 
          ? `Successfully updated theme from ${originalTheme} to ${newTheme}` 
          : `Failed to update theme preference`
      });
      
      // Restore original theme
      updateThemePreferences({ theme: originalTheme });
      
    } catch (error) {
      addTestResult({
        testName: 'Theme Preferences Update',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error updating theme preferences: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testAnimationPreferencesUpdate = async () => {
    addTestResult({
      testName: 'Animation Preferences Update',
      status: 'running',
      duration: 0,
      details: 'Testing animation preferences modification'
    });

    const startTime = performance.now();
    const originalEnabled = animationPreferences.globalAnimationsEnabled;
    
    try {
      // Toggle animation preferences
      updateAnimationPreferences({ globalAnimationsEnabled: !originalEnabled });
      
      // Wait for update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if update was successful
      const success = animationPreferences.globalAnimationsEnabled === !originalEnabled;
      
      addTestResult({
        testName: 'Animation Preferences Update',
        status: success ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: success 
          ? `Successfully toggled animations from ${originalEnabled} to ${!originalEnabled}` 
          : `Failed to update animation preference`
      });
      
      // Restore original setting
      updateAnimationPreferences({ globalAnimationsEnabled: originalEnabled });
      
    } catch (error) {
      addTestResult({
        testName: 'Animation Preferences Update',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error updating animation preferences: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testAccessibilityPreferencesUpdate = async () => {
    addTestResult({
      testName: 'Accessibility Preferences Update',
      status: 'running',
      duration: 0,
      details: 'Testing accessibility preferences modification'
    });

    const startTime = performance.now();
    const originalHighContrast = uiPreferences.accessibility.highContrast;
    
    try {
      // Toggle high contrast
      updateUIPreferences({ 
        accessibility: { 
          ...uiPreferences.accessibility, 
          highContrast: !originalHighContrast 
        } 
      });
      
      // Wait for update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if update was successful
      const success = uiPreferences.accessibility.highContrast === !originalHighContrast;
      
      addTestResult({
        testName: 'Accessibility Preferences Update',
        status: success ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: success 
          ? `Successfully toggled high contrast from ${originalHighContrast} to ${!originalHighContrast}` 
          : `Failed to update accessibility preference`
      });
      
      // Restore original setting
      updateUIPreferences({ 
        accessibility: { 
          ...uiPreferences.accessibility, 
          highContrast: originalHighContrast 
        } 
      });
      
    } catch (error) {
      addTestResult({
        testName: 'Accessibility Preferences Update',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error updating accessibility preferences: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testPreferencesExport = async () => {
    addTestResult({
      testName: 'Preferences Export',
      status: 'running',
      duration: 0,
      details: 'Testing preferences export functionality'
    });

    const startTime = performance.now();
    
    try {
      const exported = exportPreferences();
      setExportedData(exported);
      
      // Validate exported data
      const parsed = JSON.parse(exported);
      const hasRequiredFields = parsed.theme && parsed.animation && parsed.accessibility;
      const hasValidStructure = 
        typeof parsed.theme === 'object' &&
        typeof parsed.animation === 'object' &&
        typeof parsed.accessibility === 'object';
      
      const success = hasRequiredFields && hasValidStructure;
      
      addTestResult({
        testName: 'Preferences Export',
        status: success ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: success 
          ? `Successfully exported preferences (${exported.length} characters)` 
          : `Export failed validation - missing required fields or invalid structure`
      });
      
    } catch (error) {
      addTestResult({
        testName: 'Preferences Export',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error exporting preferences: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testPreferencesImport = async () => {
    addTestResult({
      testName: 'Preferences Import',
      status: 'running',
      duration: 0,
      details: 'Testing preferences import functionality'
    });

    const startTime = performance.now();
    
    try {
      // Create test data
      const testData = {
        theme: {
          theme: 'dark',
          autoSwitch: false,
          systemSync: true
        },
        animation: {
          globalAnimationsEnabled: false,
          respectReducedMotion: true,
          performanceMode: true
        },
        accessibility: {
          highContrast: true,
          reducedMotion: true,
          screenReaderOptimizations: true
        }
      };
      
      const testJson = JSON.stringify(testData, null, 2);
      
      // Import test data
      const success = importPreferences(testJson);
      
      if (success) {
        // Wait for import to take effect
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Verify import
        const importWorked = 
          themePreferences.theme === testData.theme.theme &&
          animationPreferences.globalAnimationsEnabled === testData.animation.globalAnimationsEnabled &&
          uiPreferences.accessibility.highContrast === testData.accessibility.highContrast;
        
        addTestResult({
          testName: 'Preferences Import',
          status: importWorked ? 'passed' : 'failed',
          duration: performance.now() - startTime,
          details: importWorked 
            ? 'Successfully imported and applied test preferences' 
            : 'Import succeeded but preferences were not applied correctly'
        });
      } else {
        addTestResult({
          testName: 'Preferences Import',
          status: 'failed',
          duration: performance.now() - startTime,
          details: 'Import function returned false - invalid data format'
        });
      }
      
    } catch (error) {
      addTestResult({
        testName: 'Preferences Import',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error importing preferences: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testPreferencesPersistence = async () => {
    addTestResult({
      testName: 'Preferences Persistence',
      status: 'running',
      duration: 0,
      details: 'Testing preferences storage and retrieval'
    });

    const startTime = performance.now();
    
    try {
      // Update a preference
      const originalTheme = themePreferences.theme;
      const newTheme = originalTheme === 'light' ? 'dark' : 'light';
      updateThemePreferences({ theme: newTheme });
      
      // Wait for storage
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check localStorage
      const storedData = localStorage.getItem('user-preferences');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const isPersisted = parsed.theme && parsed.theme.theme === newTheme;
        
        addTestResult({
          testName: 'Preferences Persistence',
          status: isPersisted ? 'passed' : 'failed',
          duration: performance.now() - startTime,
          details: isPersisted 
            ? 'Preferences successfully persisted to localStorage' 
            : 'Preferences not found in localStorage or incorrect data'
        });
      } else {
        addTestResult({
          testName: 'Preferences Persistence',
          status: 'failed',
          duration: performance.now() - startTime,
          details: 'No preferences data found in localStorage'
        });
      }
      
      // Restore original theme
      updateThemePreferences({ theme: originalTheme });
      
    } catch (error) {
      addTestResult({
        testName: 'Preferences Persistence',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error testing persistence: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const testPreferencesReset = async () => {
    addTestResult({
      testName: 'Preferences Reset',
      status: 'running',
      duration: 0,
      details: 'Testing preferences reset functionality'
    });

    const startTime = performance.now();
    
    try {
      // Modify some preferences first
      updateThemePreferences({ theme: 'dark' });
      updateAnimationPreferences({ globalAnimationsEnabled: false });
      updateUIPreferences({ 
        accessibility: { 
          ...uiPreferences.accessibility, 
          highContrast: true 
        } 
      });
      
      // Wait for changes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reset all preferences
      resetPreferences();
      
      // Wait for reset
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check if reset worked (assuming defaults)
      const isReset = 
        themePreferences.theme === 'light' &&
        animationPreferences.globalAnimationsEnabled === true &&
        uiPreferences.accessibility.highContrast === false;
      
      addTestResult({
        testName: 'Preferences Reset',
        status: isReset ? 'passed' : 'failed',
        duration: performance.now() - startTime,
        details: isReset 
          ? 'Successfully reset all preferences to defaults' 
          : 'Reset failed - some preferences not restored to defaults'
      });
      
    } catch (error) {
      addTestResult({
        testName: 'Preferences Reset',
        status: 'failed',
        duration: performance.now() - startTime,
        details: `Error testing reset: ${error instanceof Error ? error.message : 'Unknown error'}`
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
      details: 'Starting comprehensive user preferences tests'
    });

    try {
      await testThemePreferencesUpdate();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testAnimationPreferencesUpdate();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testAccessibilityPreferencesUpdate();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testPreferencesExport();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testPreferencesImport();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testPreferencesPersistence();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testPreferencesReset();
      
      addTestResult({
        testName: 'Test Suite Completed',
        status: 'passed',
        duration: 0,
        details: 'All user preferences tests completed successfully'
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
      
      // Restore backup preferences
      if (backupPreferences) {
        updateThemePreferences(backupPreferences.theme);
        updateAnimationPreferences(backupPreferences.animation);
        updateUIPreferences({ 
          accessibility: backupPreferences.ui.accessibility 
        });
      }
    }
  };

  const handleExport = () => {
    const exported = exportPreferences();
    setExportedData(exported);
    setShowExportData(true);
  };

  const handleImport = () => {
    if (importData.trim()) {
      const success = importPreferences(importData);
      if (success) {
        addTestResult({
          testName: 'Manual Import',
          status: 'passed',
          duration: 0,
          details: 'Successfully imported preferences from manual input'
        });
        setImportData('');
      } else {
        addTestResult({
          testName: 'Manual Import',
          status: 'failed',
          duration: 0,
          details: 'Failed to import preferences - invalid JSON format'
        });
      }
    }
  };

  const getStatusIcon = (status: PreferenceTestResult['status']) => {
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
          <h1 className="text-3xl font-bold mb-2">User Preferences Test Suite</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive testing for user preference management and import/export functionality
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300">Error: {error}</p>
            </div>
          )}
        </motion.div>

        {/* Current Preferences Display */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Current Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Theme Preferences</h3>
              <ul className="text-sm space-y-1">
                <li>Theme: <strong>{themePreferences.theme}</strong></li>
                <li>Animations Enabled: <strong>{themePreferences.animationsEnabled ? 'Yes' : 'No'}</strong></li>
                <li>Reduced Motion: <strong>{themePreferences.reducedMotion ? 'Yes' : 'No'}</strong></li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Animation Preferences</h3>
              <ul className="text-sm space-y-1">
                <li>Global Animations: <strong>{animationPreferences.globalAnimationsEnabled ? 'Yes' : 'No'}</strong></li>
                <li>Respect Reduced Motion: <strong>{animationPreferences.respectReducedMotion ? 'Yes' : 'No'}</strong></li>
                <li>Theme Transition Duration: <strong>{animationPreferences.themeTransition.duration}ms</strong></li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Accessibility Preferences</h3>
              <ul className="text-sm space-y-1">
                <li>High Contrast: <strong>{uiPreferences.accessibility.highContrast ? 'Yes' : 'No'}</strong></li>
                <li>Reduced Motion: <strong>{uiPreferences.accessibility.reducedMotion ? 'Yes' : 'No'}</strong></li>
                <li>Screen Reader: <strong>{uiPreferences.accessibility.screenReader ? 'Yes' : 'No'}</strong></li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Test Controls */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {isRunningTests ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <button
              onClick={() => setTestResults([])}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Results
            </button>
            
            <button
              onClick={resetPreferences}
              className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Preferences
            </button>
          </div>
        </motion.div>

        {/* Import/Export Controls */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4">Import/Export Controls</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Section */}
            <div>
              <h3 className="font-semibold mb-2">Export Preferences</h3>
              <button
                onClick={handleExport}
                className="mb-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Current Preferences
              </button>
              
              {exportedData && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setShowExportData(!showExportData)}
                      className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      {showExportData ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showExportData ? 'Hide' : 'Show'} Export Data
                    </button>
                  </div>
                  
                  {showExportData && (
                    <textarea
                      value={exportedData}
                      readOnly
                      className="w-full h-32 p-2 border rounded text-xs font-mono bg-gray-50 dark:bg-gray-700"
                      placeholder="Exported preferences will appear here..."
                    />
                  )}
                </div>
              )}
            </div>
            
            {/* Import Section */}
            <div>
              <h3 className="font-semibold mb-2">Import Preferences</h3>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="w-full h-32 p-2 border rounded text-xs font-mono mb-3 bg-white dark:bg-gray-700"
                placeholder="Paste preferences JSON here..."
              />
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Preferences
              </button>
            </div>
          </div>
        </motion.div>

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

export default UserPreferencesTest;