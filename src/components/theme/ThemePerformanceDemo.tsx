import React, { memo, useState, useCallback } from 'react';
import { 
  useIsDarkMode, 
  useThemeValue,
  useThemeToggle,
  useThemeDisplayName,
  useThemeClassName,
  useThemeSpecificValue
} from '../../hooks/useThemeSelectors';

// Component chỉ subscribe vào dark mode boolean
const DarkModeIndicator = memo(() => {
  const isDark = useIsDarkMode();
  const [renderCount, setRenderCount] = useState(0);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  return (
    <div className={`p-2 rounded ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="text-sm font-medium">
        {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </div>
      <div className="text-xs opacity-60">
        Renders: {renderCount}
      </div>
    </div>
  );
});

// Component chỉ subscribe vào theme display name
const ThemeNameDisplay = memo(() => {
  const themeName = useThemeDisplayName();
  const [renderCount, setRenderCount] = useState(0);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  return (
    <div className="p-2 rounded border">
      <div className="text-sm font-medium">
        Current: {themeName}
      </div>
      <div className="text-xs opacity-60">
        Renders: {renderCount}
      </div>
    </div>
  );
});

// Component chỉ có toggle function, không subscribe vào theme value
const ThemeToggleButton = memo(() => {
  const toggleTheme = useThemeToggle();
  const [renderCount, setRenderCount] = useState(0);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  return (
    <div className="p-2">
      <button 
        onClick={toggleTheme}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Toggle Theme
      </button>
      <div className="text-xs opacity-60 mt-1">
        Renders: {renderCount}
      </div>
    </div>
  );
});

// Component sử dụng theme-specific values
const ThemedBox = memo(() => {
  const themeClassName = useThemeClassName();
  const backgroundColor = useThemeSpecificValue('var(--color-bg-primary)', 'var(--color-bg-primary)');
  const textColor = useThemeSpecificValue('var(--color-text-primary)', 'var(--color-text-primary)');
  const [renderCount, setRenderCount] = useState(0);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  return (
    <div 
      className={`p-3 rounded border transition-colors ${themeClassName}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="text-sm font-medium">
        Themed Box
      </div>
      <div className="text-xs opacity-60">
        Renders: {renderCount}
      </div>
    </div>
  );
});

// Component không sử dụng theme - should never re-render
const StaticComponent = memo(() => {
  const [renderCount, setRenderCount] = useState(0);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  return (
    <div className="p-2 bg-gray-50 rounded border">
      <div className="text-sm font-medium">
        Static Component
      </div>
      <div className="text-xs opacity-60">
        Renders: {renderCount} (should stay at 1)
      </div>
    </div>
  );
});

// Main demo component
const ThemePerformanceDemo = memo(() => {
  const [localState, setLocalState] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  
  const incrementLocal = useCallback(() => {
    setLocalState(prev => prev + 1);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Theme Performance Demo</h2>
        <p className="text-gray-600 mb-4">
          This demo shows how different components re-render when theme changes.
          Components should only re-render when their specific theme dependencies change.
        </p>
        <div className="text-sm opacity-60">
          Demo Container Renders: {renderCount}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DarkModeIndicator />
        <ThemeNameDisplay />
        <ThemeToggleButton />
        <ThemedBox />
        <StaticComponent />
        
        <div className="p-2 border rounded">
          <button 
            onClick={incrementLocal}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mb-2"
          >
            Local State: {localState}
          </button>
          <div className="text-xs opacity-60">
            Click to test local re-renders
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Performance Notes:</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>DarkModeIndicator only re-renders when light/dark changes</li>
          <li>ThemeNameDisplay re-renders when theme name changes</li>
          <li>ThemeToggleButton should never re-render (only has toggle function)</li>
          <li>ThemedBox re-renders when actual theme changes</li>
          <li>StaticComponent should never re-render after initial mount</li>
          <li>Local state changes should not affect theme-related components</li>
        </ul>
      </div>
    </div>
  );
});

DarkModeIndicator.displayName = 'DarkModeIndicator';
ThemeNameDisplay.displayName = 'ThemeNameDisplay';
ThemeToggleButton.displayName = 'ThemeToggleButton';
ThemedBox.displayName = 'ThemedBox';
StaticComponent.displayName = 'StaticComponent';
ThemePerformanceDemo.displayName = 'ThemePerformanceDemo';

export default ThemePerformanceDemo;