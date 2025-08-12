import React, { memo } from 'react';
import { 
  useIsDarkMode, 
  useThemeClassName, 
  useThemeSpecificValue,
  useThemeDisplayName 
} from '../../hooks/useThemeSelectors';

/**
 * Example component demonstrating optimized theme usage
 * Chỉ re-render khi actual theme thay đổi, không phải khi theme functions thay đổi
 */
const ThemeAwareComponent = memo(() => {
  // Chỉ subscribe vào dark mode boolean - tối ưu nhất
  const isDark = useIsDarkMode();
  
  // Lấy CSS class name cho conditional styling
  const themeClassName = useThemeClassName();
  
  // Lấy theme-specific values
  const backgroundColor = useThemeSpecificValue('var(--color-bg-primary)', 'var(--color-bg-primary)');
  const textColor = useThemeSpecificValue('var(--color-text-primary)', 'var(--color-text-primary)');
  const borderColor = useThemeSpecificValue('var(--color-border)', 'var(--color-border)');
  
  // Lấy display name cho UI
  const themeDisplayName = useThemeDisplayName();
  
  return (
    <div 
      className={`p-4 rounded-lg border transition-colors duration-200 ${themeClassName}`}
      style={{
        backgroundColor,
        color: textColor,
        borderColor
      }}
    >
      <h3 className="text-lg font-semibold mb-2">
        Theme Aware Component
      </h3>
      
      <p className="text-sm opacity-75 mb-3">
        Current theme: <span className="font-medium">{themeDisplayName}</span>
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-blue-400' : 'bg-blue-600'
            }`}
          />
          <span className="text-sm">
            {isDark ? 'Dark mode active' : 'Light mode active'}
          </span>
        </div>
        
        <div className="text-xs opacity-60">
          This component only re-renders when the actual theme changes,
          not when theme functions change reference.
        </div>
      </div>
      
      {/* Theme-specific content */}
      {isDark ? (
        <div className="mt-3 p-2 bg-gray-800 rounded text-gray-300 text-xs">
          🌙 Dark mode specific content
        </div>
      ) : (
        <div className="mt-3 p-2 bg-gray-100 rounded text-gray-700 text-xs">
          ☀️ Light mode specific content
        </div>
      )}
    </div>
  );
});

ThemeAwareComponent.displayName = 'ThemeAwareComponent';

export default ThemeAwareComponent;