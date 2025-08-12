# Theme Toggle Implementation Guide

## 1. Tạo Component ThemeToggle Mới

### 1.1 Tạo File Component

**File:** `src/components/theme/ThemeToggle.tsx`

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { trackThemeChange } from '../analytics/GoogleAnalytics';

interface ThemeToggleProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'floating' | 'inline' | 'minimal';
  showLabel?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onThemeChange?: (isDark: boolean) => void;
  disabled?: boolean;
}

interface ThemeToggleState {
  isHovered: boolean;
  isFocused: boolean;
  isSwitching: boolean;
  rippleKey: number;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  position = 'bottom-left',
  size = 'md',
  variant = 'floating',
  showLabel = false,
  className = '',
  style,
  onThemeChange,
  disabled = false
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [state, setState] = useState<ThemeToggleState>({
    isHovered: false,
    isFocused: false,
    isSwitching: false,
    rippleKey: 0
  });

  // Size configurations
  const sizeConfig = {
    sm: { size: 40, iconSize: 16, fontSize: 'text-xs' },
    md: { size: 56, iconSize: 20, fontSize: 'text-sm' },
    lg: { size: 64, iconSize: 24, fontSize: 'text-base' }
  };

  const currentSize = sizeConfig[size];

  // Position classes
  const positionClasses = {
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6'
  };

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses = 'relative overflow-hidden transition-all duration-200 focus:outline-none select-none';
    
    switch (variant) {
      case 'floating':
        return `${baseClasses} bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 shadow-lg hover:shadow-xl rounded-2xl`;
      case 'inline':
        return `${baseClasses} bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700`;
      case 'minimal':
        return `${baseClasses} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl`;
      default:
        return baseClasses;
    }
  };

  // Animation variants
  const buttonVariants = {
    idle: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const iconVariants = {
    sun: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.3
      }
    },
    moon: {
      rotate: 180,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.3
      }
    },
    switching: {
      rotate: 90,
      scale: 0.8,
      opacity: 0.6,
      transition: {
        duration: 0.15
      }
    }
  };

  const rippleVariants = {
    hidden: {
      scale: 0,
      opacity: 0.6
    },
    visible: {
      scale: 2,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Handle theme toggle
  const handleToggle = useCallback(async () => {
    if (disabled) return;
    
    setState(prev => ({ 
      ...prev, 
      isSwitching: true, 
      rippleKey: prev.rippleKey + 1 
    }));
    
    try {
      await toggleTheme();
      
      // Analytics tracking
      trackThemeChange(isDarkMode ? 'light' : 'dark');
      
      // Callback
      onThemeChange?.(!isDarkMode);
      
      // Screen reader announcement
      announceThemeChange(!isDarkMode);
      
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    } finally {
      setTimeout(() => {
        setState(prev => ({ ...prev, isSwitching: false }));
      }, 300);
    }
  }, [disabled, toggleTheme, isDarkMode, onThemeChange]);

  // Screen reader announcement
  const announceThemeChange = (isDark: boolean) => {
    const message = isDark 
      ? "Switched to dark mode" 
      : "Switched to light mode";
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Keyboard handling
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleToggle();
    }
  };

  // Get current icon and label
  const getCurrentIcon = () => {
    if (state.isSwitching) {
      return isDarkMode ? <Moon size={currentSize.iconSize} /> : <Sun size={currentSize.iconSize} />;
    }
    return isDarkMode ? <Sun size={currentSize.iconSize} /> : <Moon size={currentSize.iconSize} />;
  };

  const getCurrentLabel = () => {
    return isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
  };

  const getCurrentTitle = () => {
    return isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  };

  // Focus ring classes
  const focusClasses = state.isFocused 
    ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' 
    : '';

  // Disabled classes
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  // Glow effect for floating variant
  const glowEffect = variant === 'floating' && state.isHovered && !disabled
    ? isDarkMode 
      ? 'shadow-[0_0_20px_rgba(251,191,36,0.3)]'
      : 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    : '';

  return (
    <div 
      className={`
        ${position !== 'custom' ? `fixed ${positionClasses[position]} z-30` : ''}
        ${className}
      `}
      style={position === 'custom' ? style : undefined}
    >
      <motion.button
        className={`
          ${getVariantClasses()}
          ${focusClasses}
          ${disabledClasses}
          ${glowEffect}
          flex items-center justify-center
          text-gray-800 dark:text-white
        `}
        style={{
          width: currentSize.size,
          height: currentSize.size
        }}
        variants={buttonVariants}
        initial="idle"
        animate={state.isHovered ? "hover" : "idle"}
        whileTap={!disabled ? "tap" : "idle"}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setState(prev => ({ ...prev, isHovered: true }))}
        onMouseLeave={() => setState(prev => ({ ...prev, isHovered: false }))}
        onFocus={() => setState(prev => ({ ...prev, isFocused: true }))}
        onBlur={() => setState(prev => ({ ...prev, isFocused: false }))}
        aria-label={getCurrentLabel()}
        aria-pressed={isDarkMode}
        role="switch"
        title={getCurrentTitle()}
        tabIndex={0}
        disabled={disabled}
      >
        {/* Ripple Effect */}
        <AnimatePresence>
          {state.rippleKey > 0 && (
            <motion.div
              key={state.rippleKey}
              className="absolute inset-0 rounded-full bg-current opacity-20"
              variants={rippleVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          variants={iconVariants}
          animate={state.isSwitching ? "switching" : (isDarkMode ? "moon" : "sun")}
          className="relative z-10"
        >
          {getCurrentIcon()}
        </motion.div>

        {/* Label (if enabled) */}
        {showLabel && (
          <motion.span
            className={`ml-2 font-medium ${currentSize.fontSize}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {isDarkMode ? 'Dark' : 'Light'}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default React.memo(ThemeToggle);
```

### 1.2 Tạo Hook Tối ưu (Optional)

**File:** `src/hooks/useThemeToggle.ts`

```typescript
import { useState, useCallback } from 'react';
import { useTheme } from './useTheme';

interface UseThemeToggleOptions {
  onToggle?: (isDark: boolean) => void;
  enableAnalytics?: boolean;
}

export const useThemeToggle = (options: UseThemeToggleOptions = {}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isToggling, setIsToggling] = useState(false);
  
  const handleToggle = useCallback(async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    
    try {
      await toggleTheme();
      options.onToggle?.(!isDarkMode);
      
      if (options.enableAnalytics) {
        // Track theme change
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'theme_toggle', {
            event_category: 'UI',
            event_label: isDarkMode ? 'light' : 'dark'
          });
        }
      }
    } catch (error) {
      console.error('Theme toggle failed:', error);
    } finally {
      setTimeout(() => setIsToggling(false), 300);
    }
  }, [isDarkMode, toggleTheme, isToggling, options]);
  
  return {
    isDarkMode,
    isToggling,
    handleToggle
  };
};
```

## 2. Cập nhật Export trong DynamicColorTheme.tsx

### 2.1 Thêm Export Mới

```typescript
// Thêm vào cuối file src/components/theme/DynamicColorTheme.tsx
export { default as ThemeToggle } from './ThemeToggle';
```

### 2.2 Hoặc Tạo Index File

**File:** `src/components/theme/index.ts`

```typescript
export { ThemeProvider, ThemeSwitcher } from './DynamicColorTheme';
export { default as ThemeToggle } from './ThemeToggle';
export type { ThemeMode, ColorScheme, ThemeConfig } from '../../contexts/ThemeContext';
```

## 3. Cập nhật App.tsx

### 3.1 Thay thế ThemeSwitcher

```typescript
// Trong src/App.tsx

// Thay đổi import
import { ThemeProvider } from './components/theme/DynamicColorTheme';
import ThemeToggle from './components/theme/ThemeToggle';

// Hoặc nếu sử dụng index file
// import { ThemeProvider, ThemeToggle } from './components/theme';

// Trong component App
export default function App() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Error handling logic
  };

  const handleThemeChange = (isDark: boolean) => {
    // Optional: Custom logic khi theme thay đổi
    console.log(`Theme changed to: ${isDark ? 'dark' : 'light'}`);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <HelmetProvider>
        <ThemeProvider>
          {/* Thay thế ThemeSwitcher cũ bằng ThemeToggle mới */}
          <ThemeToggle 
            position="bottom-left"
            size="md"
            variant="floating"
            onThemeChange={handleThemeChange}
          />
          <Router>
            <Suspense fallback={<PageLoading message="Loading portfolio..." />}>
              <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
```

## 4. Tạo CSS Utilities (Optional)

### 4.1 Thêm Custom CSS

**File:** `src/styles/theme-toggle.css`

```css
/* Theme Toggle Custom Styles */
.theme-toggle-glow-light {
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 0 20px rgba(59, 130, 246, 0.3);
}

.theme-toggle-glow-dark {
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(251, 191, 36, 0.3);
}

/* Backdrop blur fallback */
.theme-toggle-backdrop {
  background: rgba(255, 255, 255, 0.95);
}

@supports (backdrop-filter: blur(12px)) {
  .theme-toggle-backdrop {
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.8);
  }
  
  .dark .theme-toggle-backdrop {
    background: rgba(31, 41, 55, 0.8);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-toggle * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .theme-toggle {
    border: 2px solid currentColor;
  }
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 4.2 Import CSS

```typescript
// Trong src/main.tsx hoặc src/App.tsx
import './styles/theme-toggle.css';
```

## 5. Tạo Tests

### 5.1 Unit Tests

**File:** `src/components/theme/__tests__/ThemeToggle.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../DynamicColorTheme';
import ThemeToggle from '../ThemeToggle';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => children
}));

// Mock analytics
jest.mock('../../analytics/GoogleAnalytics', () => ({
  trackThemeChange: jest.fn()
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label');
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    await user.click(button);
    
    // Verify theme toggle logic
    expect(button).toHaveAttribute('aria-pressed');
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('switch');
    button.focus();
    
    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-pressed');
    
    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-pressed');
  });

  it('calls onThemeChange callback', async () => {
    const onThemeChange = jest.fn();
    const user = userEvent.setup();
    
    renderWithTheme(
      <ThemeToggle onThemeChange={onThemeChange} />
    );
    
    const button = screen.getByRole('switch');
    await user.click(button);
    
    await waitFor(() => {
      expect(onThemeChange).toHaveBeenCalled();
    });
  });

  it('respects disabled prop', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle disabled />);
    
    const button = screen.getByRole('switch');
    expect(button).toBeDisabled();
    
    await user.click(button);
    // Verify no theme change occurred
  });

  it('applies correct size classes', () => {
    const { rerender } = renderWithTheme(<ThemeToggle size="sm" />);
    let button = screen.getByRole('switch');
    expect(button).toHaveStyle({ width: '40px', height: '40px' });
    
    rerender(
      <ThemeProvider>
        <ThemeToggle size="lg" />
      </ThemeProvider>
    );
    button = screen.getByRole('switch');
    expect(button).toHaveStyle({ width: '64px', height: '64px' });
  });

  it('shows label when enabled', () => {
    renderWithTheme(<ThemeToggle showLabel />);
    
    expect(screen.getByText(/light|dark/i)).toBeInTheDocument();
  });

  it('applies custom positioning', () => {
    const customStyle = { top: '20px', right: '20px' };
    renderWithTheme(
      <ThemeToggle position="custom" style={customStyle} />
    );
    
    const container = screen.getByRole('switch').parentElement;
    expect(container).toHaveStyle(customStyle);
  });
});
```

### 5.2 Integration Tests

**File:** `src/components/theme/__tests__/ThemeToggle.integration.test.tsx`

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../../App';

describe('ThemeToggle Integration', () => {
  it('integrates correctly with App', () => {
    render(<App />);
    
    const themeToggle = screen.getByRole('switch');
    expect(themeToggle).toBeInTheDocument();
  });

  it('persists theme preference', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const themeToggle = screen.getByRole('switch');
    await user.click(themeToggle);
    
    // Verify localStorage
    expect(localStorage.getItem('theme-mode')).toBeTruthy();
  });

  it('respects system preference', () => {
    // Mock system preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(<App />);
    
    const themeToggle = screen.getByRole('switch');
    expect(themeToggle).toHaveAttribute('aria-pressed', 'true');
  });
});
```

## 6. Cập nhật Package.json Scripts

### 6.1 Thêm Test Scripts

```json
{
  "scripts": {
    "test:theme": "npm test -- --testPathPattern=theme",
    "test:theme:watch": "npm test -- --testPathPattern=theme --watch",
    "test:theme:coverage": "npm test -- --testPathPattern=theme --coverage"
  }
}
```

## 7. Cleanup và Migration

### 7.1 Xóa Component Cũ (Sau khi test)

```typescript
// Trong src/components/theme/DynamicColorTheme.tsx
// Comment hoặc xóa ThemeSwitcher component (dòng 221-263)

/*
// Simple Theme Switcher Component - DEPRECATED
interface ThemeSwitcherProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  // ... old implementation
});
*/
```

### 7.2 Cập nhật Imports

```bash
# Tìm và thay thế tất cả ThemeSwitcher imports
# Sử dụng VS Code Find & Replace hoặc command line
grep -r "ThemeSwitcher" src/ --include="*.tsx" --include="*.ts"
```

## 8. Performance Monitoring

### 8.1 Thêm Performance Tracking

```typescript
// Trong ThemeToggle component
const trackPerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: 'theme_toggle_duration',
          value: Math.round(duration)
        });
      }
    };
  }
  return () => {};
};

// Sử dụng trong handleToggle
const handleToggle = useCallback(async () => {
  const endTracking = trackPerformance();
  
  // ... toggle logic
  
  endTracking();
}, []);
```

## 9. Documentation Updates

### 9.1 Cập nhật README

```markdown
## Theme System

The portfolio uses a custom theme system with the following components:

- `ThemeProvider`: Manages theme state and preferences
- `ThemeToggle`: Modern theme switcher with animations
- `useTheme`: Hook for accessing theme context

### Usage

```tsx
import { ThemeToggle } from './components/theme';

// Basic usage
<ThemeToggle />

// With customization
<ThemeToggle 
  position="top-right"
  size="lg"
  variant="minimal"
  showLabel
/>
```

### Features

- ✅ Smooth animations with Framer Motion
- ✅ Full accessibility support
- ✅ Responsive design
- ✅ System preference detection
- ✅ Local storage persistence
- ✅ Analytics integration
- ✅ Multiple variants and sizes
```

## 10. Deployment Checklist

### 10.1 Pre-deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Accessibility audit passed
- [ ] Performance metrics acceptable
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed
- [ ] Analytics tracking verified

### 10.2 Post-deployment

- [ ] Monitor error rates
- [ ] Check analytics data
- [ ] Verify theme persistence
- [ ] Test on production environment
- [ ] Gather user feedback

---

**Implementation Time:** 2-3 hours
**Testing Time:** 1-2 hours
**Total Effort:** 3-5 hours