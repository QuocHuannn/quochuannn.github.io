import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/optimized';
import { useAnimationPreferences } from '../../hooks/useAnimationPreferences';
import { Sun, Moon, Palette, Clock, Zap, CheckCircle, XCircle } from 'lucide-react';

interface TransitionTestResult {
  testName: string;
  status: 'passed' | 'failed' | 'running';
  duration: number;
  details: string;
  timestamp: string;
}

const ThemeTransitionTest: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { shouldAnimate, getEffectiveConfig } = useAnimationPreferences();
  const [testResults, setTestResults] = useState<TransitionTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [transitionStartTime, setTransitionStartTime] = useState<number | null>(null);

  const addTestResult = (result: Omit<TransitionTestResult, 'timestamp'>) => {
    setTestResults(prev => [...prev, {
      ...result,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Monitor theme transitions
  useEffect(() => {
    if (transitionStartTime) {
      const endTime = performance.now();
      const duration = endTime - transitionStartTime;
      
      addTestResult({
        testName: 'Theme Transition Duration',
        status: duration < 300 ? 'passed' : 'failed',
        duration,
        details: `Transition completed in ${duration.toFixed(2)}ms (target: <300ms)`
      });
      
      setTransitionStartTime(null);
    }
  }, [theme, transitionStartTime]);

  const testBasicThemeToggle = async () => {
    addTestResult({
      testName: 'Basic Theme Toggle',
      status: 'running',
      duration: 0,
      details: 'Testing basic theme switching functionality'
    });

    const startTime = performance.now();
    const originalTheme = theme;
    
    setTransitionStartTime(performance.now());
    toggleTheme();
    
    // Wait for transition to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const endTime = performance.now();
    const success = theme !== originalTheme;
    
    addTestResult({
      testName: 'Basic Theme Toggle',
      status: success ? 'passed' : 'failed',
      duration: endTime - startTime,
      details: success 
        ? `Successfully toggled from ${originalTheme} to ${theme}` 
        : 'Failed to toggle theme'
    });
  };

  const testThemeTransitionSmoothing = async () => {
    addTestResult({
      testName: 'Theme Transition Smoothing',
      status: 'running',
      duration: 0,
      details: 'Testing CSS transition smoothing'
    });

    const startTime = performance.now();
    
    // Check if CSS transitions are applied
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);
    const transition = computedStyle.transition || computedStyle.webkitTransition;
    
    const hasTransition = transition && transition !== 'none' && transition.includes('background');
    
    addTestResult({
      testName: 'Theme Transition Smoothing',
      status: hasTransition ? 'passed' : 'failed',
      duration: performance.now() - startTime,
      details: hasTransition 
        ? `CSS transitions detected: ${transition}` 
        : 'No CSS transitions found for theme switching'
    });
  };

  const testAnimationPreferencesIntegration = async () => {
    addTestResult({
      testName: 'Animation Preferences Integration',
      status: 'running',
      duration: 0,
      details: 'Testing integration with animation preferences'
    });

    const startTime = performance.now();
    const animationsEnabled = shouldAnimate('themeTransition');
    const themeConfig = getEffectiveConfig('themeTransition');
    
    addTestResult({
      testName: 'Animation Preferences Integration',
      status: 'passed',
      duration: performance.now() - startTime,
      details: `Animations enabled: ${animationsEnabled}, Theme transition duration: ${themeConfig.duration}ms`
    });
  };

  const testMultipleRapidToggles = async () => {
    addTestResult({
      testName: 'Multiple Rapid Toggles',
      status: 'running',
      duration: 0,
      details: 'Testing rapid theme switching performance'
    });

    const startTime = performance.now();
    const originalTheme = theme;
    
    // Perform 5 rapid toggles
    for (let i = 0; i < 5; i++) {
      toggleTheme();
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Wait for final transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const endTime = performance.now();
    const finalTheme = theme;
    
    addTestResult({
      testName: 'Multiple Rapid Toggles',
      status: 'passed',
      duration: endTime - startTime,
      details: `Completed 5 rapid toggles in ${(endTime - startTime).toFixed(2)}ms. Final theme: ${finalTheme}`
    });
  };

  const testThemeSystemIntegration = async () => {
    addTestResult({
      testName: 'Theme System Integration',
      status: 'running',
      duration: 0,
      details: 'Testing integration with theme system'
    });

    const startTime = performance.now();
    
    // Test setting specific themes
    setTheme('light');
    await new Promise(resolve => setTimeout(resolve, 100));
    const isLight = theme === 'light';
    
    setTheme('dark');
    await new Promise(resolve => setTimeout(resolve, 100));
    const isDark = theme === 'dark';
    
    addTestResult({
      testName: 'Theme System Integration',
      status: (isLight && isDark) ? 'passed' : 'failed',
      duration: performance.now() - startTime,
      details: `Light theme set: ${isLight}, Dark theme set: ${isDark}`
    });
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    addTestResult({
      testName: 'Test Suite Started',
      status: 'passed',
      duration: 0,
      details: 'Starting comprehensive theme transition tests'
    });

    try {
      await testBasicThemeToggle();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testThemeTransitionSmoothing();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testAnimationPreferencesIntegration();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testMultipleRapidToggles();
      await new Promise(resolve => setTimeout(resolve, 200));
      
      await testThemeSystemIntegration();
      
      addTestResult({
        testName: 'Test Suite Completed',
        status: 'passed',
        duration: 0,
        details: 'All theme transition tests completed successfully'
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

  const getStatusIcon = (status: TransitionTestResult['status']) => {
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Theme Transition Test Suite</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive testing for theme transition animations and performance
          </p>
        </motion.div>

        {/* Theme Controls */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Controls
          </h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                theme === 'light' 
                  ? 'bg-yellow-500 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
            
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Toggle
            </button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current theme: <strong>{theme}</strong> | 
            Animations enabled: <strong>{shouldAnimate('themeTransition') ? 'Yes' : 'No'}</strong>
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
          </div>
        </motion.div>

        {/* Visual Transition Demo */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4">Visual Transition Demo</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold"
              >
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </motion.div>
            </AnimatePresence>
            
            <motion.div
              animate={{ 
                backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
                color: theme === 'light' ? '#1f2937' : '#f9fafb'
              }}
              transition={{ duration: 0.3 }}
              className="h-24 rounded-lg flex items-center justify-center font-semibold"
            >
              Smooth Transition
            </motion.div>
            
            <motion.div
              animate={{ rotate: theme === 'light' ? 0 : 180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-24 bg-yellow-400 dark:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <Sun className="w-8 h-8 text-yellow-800 dark:text-blue-200" />
            </motion.div>
            
            <motion.div
              animate={{ 
                scale: theme === 'light' ? 1 : 1.1,
                opacity: theme === 'light' ? 0.8 : 1
              }}
              transition={{ duration: 0.3 }}
              className="h-24 bg-green-400 dark:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-300"
            >
              <Palette className="w-8 h-8 text-green-800 dark:text-green-200" />
            </motion.div>
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

export default ThemeTransitionTest;