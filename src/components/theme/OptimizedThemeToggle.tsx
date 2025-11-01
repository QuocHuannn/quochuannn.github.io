/**
 * Optimized Theme Toggle
 *
 * Simplified from 394 lines to <100 lines
 * - Removed complex ripple effects
 * - Removed debouncing (50ms response time)
 * - Simple toggle switch design
 * - Performance-first approach
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface OptimizedThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const OptimizedThemeToggle: React.FC<OptimizedThemeToggleProps> = ({
  className = '',
  showLabel = false
}) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);

    // Announce to screen readers
    const message = `Theme changed to ${newTheme} mode`;
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center gap-2 p-2 rounded-lg
        theme-transition-colors
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]
        hover:opacity-80
        ${className}
      `}
      style={{
        backgroundColor: 'var(--color-surface-secondary)',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Icon with smooth transition */}
      <div className="relative w-5 h-5">
        <Sun
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-200
            ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `}
          style={{ color: 'var(--color-warning)' }}
        />
        <Moon
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-200
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          `}
          style={{ color: 'var(--color-accent-primary)' }}
        />
      </div>

      {/* Optional Label */}
      {showLabel && (
        <span 
          className="text-sm font-medium theme-transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

export default OptimizedThemeToggle;