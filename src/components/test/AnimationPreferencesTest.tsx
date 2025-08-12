import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { AnimationPreferencesManager } from '../../utils/animationPreferences';

const AnimationPreferencesTest: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [animationPrefs, setAnimationPrefs] = useState(() => {
    const manager = new AnimationPreferencesManager();
    return manager.getPreferences();
  });
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testReducedMotionDetection = () => {
    const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    addTestResult(`System prefers reduced motion: ${systemPreference}`);
    addTestResult(`Hook detects reduced motion: ${prefersReducedMotion}`);
    addTestResult(`Test ${systemPreference === prefersReducedMotion ? 'PASSED' : 'FAILED'}: Reduced motion detection`);
  };

  const testAnimationPreferencesManager = () => {
    const manager = new AnimationPreferencesManager();
    
    // Test getting preferences
    const prefs = manager.getPreferences();
    addTestResult(`Animation preferences loaded: ${JSON.stringify(prefs, null, 2)}`);
    
    // Test updating preferences
    manager.setPreferences({
      globalAnimationsEnabled: false,
      respectReducedMotion: true
    });
    
    const updatedPrefs = manager.getPreferences();
    addTestResult(`Updated preferences: globalAnimationsEnabled = ${updatedPrefs.globalAnimationsEnabled}`);
    
    // Test animation decision logic
    const shouldAnimate = manager.shouldAnimate('themeTransition');
    addTestResult(`Should animate 'themeTransition': ${shouldAnimate}`);
    
    // Reset preferences
    manager.setPreferences({
      globalAnimationsEnabled: true,
      respectReducedMotion: true
    });
    
    setAnimationPrefs(manager.getPreferences());
    addTestResult('Animation preferences manager test completed');
  };

  const testAnimationTypes = () => {
    const manager = new AnimationPreferencesManager();
    const animationTypes = ['themeTransition', 'pageTransition', 'componentTransition', 'hoverAnimations', 'clickAnimations', 'loadingAnimations'];
    
    animationTypes.forEach(type => {
      const shouldAnimate = manager.shouldAnimate(type as any);
      addTestResult(`Animation type '${type}': ${shouldAnimate ? 'ENABLED' : 'DISABLED'}`);
    });
  };

  const testPerformanceMode = () => {
    const manager = new AnimationPreferencesManager();
    
    // Test global animations disabled (performance mode simulation)
    manager.setPreferences({ globalAnimationsEnabled: false });
    const perfPrefs = manager.getPreferences();
    addTestResult(`Global animations disabled: ${!perfPrefs.globalAnimationsEnabled}`);
    
    // Test animation decisions with global animations disabled
    const shouldAnimateComplex = manager.shouldAnimate('scrollAnimations');
    addTestResult(`Complex animation with global disabled: ${shouldAnimateComplex ? 'ALLOWED' : 'BLOCKED'}`);
    
    // Reset
    manager.setPreferences({ globalAnimationsEnabled: true });
    setAnimationPrefs(manager.getPreferences());
  };

  const runAllTests = () => {
    setTestResults([]);
    addTestResult('Starting animation preferences tests...');
    
    setTimeout(() => testReducedMotionDetection(), 100);
    setTimeout(() => testAnimationPreferencesManager(), 200);
    setTimeout(() => testAnimationTypes(), 300);
    setTimeout(() => testPerformanceMode(), 400);
    
    setTimeout(() => addTestResult('All tests completed!'), 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Animation Preferences Test Suite</h2>
      
      {/* System Info */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">System Information</h3>
        <p>Prefers Reduced Motion: <strong>{prefersReducedMotion ? 'Yes' : 'No'}</strong></p>
        <p>Global Animations Enabled: <strong>{animationPrefs.globalAnimationsEnabled ? 'Yes' : 'No'}</strong></p>
        <p>Respect Reduced Motion: <strong>{animationPrefs.respectReducedMotion ? 'Yes' : 'No'}</strong></p>
      </div>

      {/* Test Controls */}
      <div className="mb-6 space-x-4">
        <button
          onClick={runAllTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Run All Tests
        </button>
        <button
          onClick={testReducedMotionDetection}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Test Reduced Motion
        </button>
        <button
          onClick={testAnimationPreferencesManager}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Test Preferences Manager
        </button>
        <button
          onClick={() => setTestResults([])}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Results
        </button>
      </div>

      {/* Animation Demo */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Animation Demo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="w-16 h-16 bg-blue-500 rounded"
            animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-16 h-16 bg-green-500 rounded"
            animate={{ scale: prefersReducedMotion ? 1 : [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="w-16 h-16 bg-red-500 rounded"
            animate={{ y: prefersReducedMotion ? 0 : [-10, 10, -10] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="w-16 h-16 bg-yellow-500 rounded"
            animate={{ opacity: prefersReducedMotion ? 1 : [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {prefersReducedMotion 
            ? 'Animations are disabled due to reduced motion preference' 
            : 'Animations are enabled'}
        </p>
      </div>

      {/* Test Results */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Test Results</h3>
        <div className="max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet. Click 'Run All Tests' to start.</p>
          ) : (
            <pre className="text-sm whitespace-pre-wrap">
              {testResults.join('\n')}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimationPreferencesTest;