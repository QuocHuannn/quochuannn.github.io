import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useScreenReader } from '../../hooks/useAccessibility';
import type { Theme } from '../../hooks/useTheme';

// Check for reduced motion preference
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Debounce utility for performance
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

export type ThemeToggleVariant = 'floating' | 'inline' | 'minimal';
export type ThemeToggleSize = 'sm' | 'md' | 'lg';

interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
  size?: ThemeToggleSize;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: {
    button: 'w-8 h-8 text-sm',
    icon: 'w-4 h-4',
    label: 'text-xs'
  },
  md: {
    button: 'w-10 h-10 text-base',
    icon: 'w-5 h-5',
    label: 'text-sm'
  },
  lg: {
    button: 'w-12 h-12 text-lg',
    icon: 'w-6 h-6',
    label: 'text-base'
  }
};

const variantClasses = {
  floating: {
    container: 'fixed bottom-20 right-6 z-[70]',
    button: 'backdrop-blur-md border shadow-lg hover:shadow-xl'
  },
  inline: {
    container: 'inline-flex',
    button: 'backdrop-blur-sm border'
  },
  minimal: {
    container: 'inline-flex',
    button: 'bg-transparent'
  }
};

const getVariantStyles = (variant: ThemeToggleVariant): React.CSSProperties => {
  switch (variant) {
    case 'floating':
      return {
        backgroundColor: 'var(--color-surface-glass)',
        borderColor: 'var(--color-border-glass)',
      };
    case 'inline':
      return {
        backgroundColor: 'var(--color-surface-muted)',
        borderColor: 'var(--color-border-muted)',
      };
    case 'minimal':
      return {
        backgroundColor: 'transparent',
      };
    default:
      return {};
  }
};

export const ThemeToggle: React.FC<ThemeToggleProps> = React.memo(({
  variant = 'inline',
  size = 'md',
  className = '',
  showLabel = false,
  disabled = false,
  'aria-label': ariaLabel
}) => {
  const { theme, actualTheme, setTheme } = useTheme();
  const { announce } = useScreenReader();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lastThemeChange, setLastThemeChange] = useState<string>('');
  const clickTimeoutRef = useRef<NodeJS.Timeout>();
  const rippleTimeoutRef = useRef<NodeJS.Timeout>();
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const getThemeDisplayName = useCallback((themeValue = theme) => {
    switch (themeValue) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      default: return 'Light';
    }
  }, [theme]);

  // Debounced theme toggle to prevent rapid clicks
  const performThemeToggle = useCallback(
    debounce(() => {
      const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
      
      // Announce theme change with the correct next theme
      const nextDisplayName = getThemeDisplayName(nextTheme);
      const announcement = `Theme switched to ${nextDisplayName.toLowerCase()}`;
      setLastThemeChange(announcement);
      announce(announcement);
    }, 150),
    [theme, setTheme, announce, getThemeDisplayName, setLastThemeChange]
  );

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Clear any existing timeout to prevent double clicks
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    // Enhanced visual feedback with ripple effect
    setIsPressed(true);
    clickTimeoutRef.current = setTimeout(() => setIsPressed(false), 200);

    // Add ripple effect if not reduced motion
    if (!reducedMotion && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      rippleTimeoutRef.current = setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    performThemeToggle();
  }, [disabled, performThemeToggle, reducedMotion]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsPressed(true);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        performThemeToggle();
        break;
      case 'Home':
        e.preventDefault();
        setTheme('light');
        const lightAnnouncement = 'Theme set to light';
        setLastThemeChange(lightAnnouncement);
        announce(lightAnnouncement);
        break;
      case 'End':
        e.preventDefault();
        setTheme('dark');
        const darkAnnouncement = 'Theme set to dark';
        setLastThemeChange(darkAnnouncement);
        announce(darkAnnouncement);
        break;
      case 'Escape':
        e.preventDefault();
        buttonRef.current?.blur();
        break;
    }
  }, [disabled, performThemeToggle, setTheme, setLastThemeChange, announce]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(false);
      performThemeToggle();
    }
  }, [disabled, performThemeToggle]);

  const setSpecificTheme = useCallback((targetTheme: Theme) => {
    if (theme !== targetTheme) {
      // Use the direct setTheme method from context instead of cycling
      setTheme(targetTheme);
      
      const displayName = getThemeDisplayName(targetTheme);
      const announcement = `Theme set to ${displayName.toLowerCase()}`;
      setLastThemeChange(announcement);
      announce(announcement);
    }
  }, [theme, setTheme, getThemeDisplayName, announce, setLastThemeChange]);

  // Memoized icon based on current theme setting
  const Icon = useMemo(() => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      default: return Sun;
    }
  }, [theme]);
  
  // Memoized label for each theme
  const label = useMemo(() => {
    switch (theme) {
      case 'light': return 'Switch to dark mode';
      case 'dark': return 'Switch to light mode';
      default: return 'Switch theme';
    }
  }, [theme]);

  // Memoized theme display name
  const themeDisplayName = useMemo(() => getThemeDisplayName(), [getThemeDisplayName]);

  // Memoized accessibility description
  const accessibilityDescription = useMemo(() => {
    const currentTheme = getThemeDisplayName();
    const nextTheme = theme === 'light' ? 'Dark' : 'Light';
    
    return `Current theme: ${currentTheme}. Press to switch to ${nextTheme}. Use arrow keys to toggle theme, Home for Light, End for Dark, Escape to unfocus.`;
  }, [theme, getThemeDisplayName]);
  
  // Mouse event handlers for hover effects
  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    };
  }, []);
  
  // Update screen reader announcement when theme changes
  useEffect(() => {
    if (lastThemeChange) {
      const timer = setTimeout(() => setLastThemeChange(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastThemeChange]);

  return (
    <div className={`${variantClasses[variant].container} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-describedby={`theme-toggle-description-${theme}`}
        aria-pressed={theme === 'dark'}
        aria-expanded={false}
        aria-haspopup={false}
        role="switch"
        aria-checked={theme === 'dark'}
        tabIndex={disabled ? -1 : 0}
        className={`
          ${sizeClasses[size].button}
          ${variantClasses[variant].button}
          relative overflow-hidden rounded-full
          ${reducedMotion ? 'transition-colors duration-200' : 'transition-all duration-300 ease-out'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
          focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:focus:ring-0
          ${!reducedMotion ? 'hover:scale-105 active:scale-95' : ''}
          ${isPressed && !reducedMotion ? 'scale-95' : ''}
        `}
        style={{
          ...getVariantStyles(variant),
          color: 'var(--color-text-secondary)',
          '--tw-ring-color': 'var(--color-primary-muted)',
          '--tw-ring-offset-color': 'transparent',
          transform: !reducedMotion ? (isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)') : 'none',
          boxShadow: !reducedMotion && isHovered && !disabled ? 
            `0 0 20px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(59, 130, 246, 0.25)'}, 0 4px 12px rgba(0, 0, 0, 0.1)` : 
            undefined,
          filter: !reducedMotion && isHovered && !disabled ? 'brightness(1.1)' : undefined
        } as React.CSSProperties}
      >
        {/* Icon with enhanced rotation animation */}
        <div
          className={`flex items-center justify-center ${
            reducedMotion ? 'transition-none' : 'transition-all duration-500 ease-out'
          }`}
          style={{
            transform: `rotate(${
              theme === 'dark' ? '180deg' : '0deg'
            }) ${!reducedMotion && isHovered ? 'scale(1.1)' : 'scale(1)'}`,
            filter: !reducedMotion && theme === 'dark' ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' : 
                   !reducedMotion && theme === 'light' ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' : 'none'
          }}
        >
          <Icon 
            className={`${sizeClasses[size].icon} ${!reducedMotion ? 'transition-all duration-300' : ''}`}
            style={{
              color: !reducedMotion && isHovered ? 
                (theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'var(--color-primary)') : 
                'currentColor'
            }}
          />
        </div>

        {/* Ripple effects */}
        {!reducedMotion && ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(59, 130, 246, 0.3)',
              animationDuration: '0.6s',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)'
            }}
          />
        ))}

        {/* Screen reader announcements */}
        <span 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
          role="status"
        >
          {lastThemeChange}
        </span>
        
        {/* Hidden description for screen readers */}
        <span 
          id={`theme-toggle-description-${theme}`}
          className="sr-only"
        >
          {accessibilityDescription}
        </span>
      </button>

      {/* Optional label */}
      {showLabel && (
        <span
          className={`ml-2 ${sizeClasses[size].label} transition-opacity duration-200`}
          style={{ color: 'var(--color-text-muted)' }}
        >
          {themeDisplayName}
        </span>
      )}
    </div>
  );
});

// Add display name for debugging
ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;