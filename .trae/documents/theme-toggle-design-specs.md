# Theme Toggle Component - Design Specifications

## 1. Visual Design System

### 1.1 Design Tokens

```css
/* Size Variants */
--toggle-size-sm: 40px;
--toggle-size-md: 56px;
--toggle-size-lg: 64px;

/* Colors - Light Mode */
--toggle-bg-light: rgba(255, 255, 255, 0.95);
--toggle-border-light: rgba(229, 231, 235, 0.8);
--toggle-icon-light: #374151;
--toggle-shadow-light: 0 8px 32px rgba(0, 0, 0, 0.12);
--toggle-glow-light: rgba(59, 130, 246, 0.3);

/* Colors - Dark Mode */
--toggle-bg-dark: rgba(31, 41, 55, 0.95);
--toggle-border-dark: rgba(75, 85, 99, 0.8);
--toggle-icon-dark: #F9FAFB;
--toggle-shadow-dark: 0 8px 32px rgba(0, 0, 0, 0.3);
--toggle-glow-dark: rgba(251, 191, 36, 0.3);

/* Animation Timings */
--toggle-transition-fast: 150ms;
--toggle-transition-normal: 250ms;
--toggle-transition-slow: 350ms;

/* Effects */
--toggle-backdrop-blur: blur(12px);
--toggle-border-radius: 16px;
--toggle-hover-scale: 1.05;
--toggle-active-scale: 0.95;
```

### 1.2 Component Variants

#### Floating Variant (Default)
```css
.theme-toggle-floating {
  position: fixed;
  backdrop-filter: var(--toggle-backdrop-blur);
  background: var(--toggle-bg);
  border: 1px solid var(--toggle-border);
  box-shadow: var(--toggle-shadow);
  border-radius: var(--toggle-border-radius);
}
```

#### Inline Variant
```css
.theme-toggle-inline {
  position: relative;
  background: transparent;
  border: 1px solid var(--toggle-border);
  backdrop-filter: none;
}
```

#### Minimal Variant
```css
.theme-toggle-minimal {
  background: transparent;
  border: none;
  box-shadow: none;
}
```

## 2. Animation Specifications

### 2.1 Icon Transition Animation

```typescript
// Framer Motion variants
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
```

### 2.2 Button State Animations

```typescript
const buttonVariants = {
  idle: {
    scale: 1,
    boxShadow: "var(--toggle-shadow)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "var(--toggle-shadow), 0 0 20px var(--toggle-glow)",
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
```

### 2.3 Ripple Effect

```typescript
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
```

## 3. Accessibility Specifications

### 3.1 ARIA Attributes

```typescript
interface AccessibilityProps {
  'aria-label': string; // "Toggle dark mode" | "Toggle light mode"
  'aria-pressed': boolean; // true when dark mode is active
  'role': 'switch';
  'aria-describedby'?: string; // Optional description
  'tabIndex': 0;
}
```

### 3.2 Keyboard Navigation

```typescript
const keyboardHandlers = {
  onKeyDown: (event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggleTheme();
    }
  },
  onFocus: () => {
    // Add focus ring
    setFocused(true);
  },
  onBlur: () => {
    // Remove focus ring
    setFocused(false);
  }
};
```

### 3.3 Screen Reader Support

```typescript
const announceThemeChange = (isDark: boolean) => {
  const message = isDark 
    ? "Switched to dark mode" 
    : "Switched to light mode";
  
  // Create live region announcement
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
```

## 4. Responsive Design

### 4.1 Breakpoint Behavior

```css
/* Mobile First Approach */
.theme-toggle {
  width: var(--toggle-size-md);
  height: var(--toggle-size-md);
}

/* Tablet */
@media (min-width: 768px) {
  .theme-toggle {
    width: var(--toggle-size-lg);
    height: var(--toggle-size-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .theme-toggle:hover {
    transform: scale(var(--toggle-hover-scale));
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-toggle * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.2 Touch Optimization

```css
/* Touch targets */
@media (pointer: coarse) {
  .theme-toggle {
    min-width: 44px;
    min-height: 44px;
    padding: 8px;
  }
}

/* Hover states only for devices that support hover */
@media (hover: hover) {
  .theme-toggle:hover {
    transform: scale(var(--toggle-hover-scale));
  }
}
```

## 5. Component Implementation

### 5.1 TypeScript Interface

```typescript
interface ThemeToggleProps {
  /** Position of the toggle button */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Visual variant */
  variant?: 'floating' | 'inline' | 'minimal';
  
  /** Show text label */
  showLabel?: boolean;
  
  /** Custom label text */
  label?: {
    light: string;
    dark: string;
  };
  
  /** Additional CSS classes */
  className?: string;
  
  /** Custom styles for custom positioning */
  style?: React.CSSProperties;
  
  /** Callback when theme changes */
  onThemeChange?: (isDark: boolean) => void;
  
  /** Disable the toggle */
  disabled?: boolean;
  
  /** Custom icons */
  icons?: {
    light: React.ReactNode;
    dark: React.ReactNode;
  };
  
  /** Animation preferences */
  animations?: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
}
```

### 5.2 State Management

```typescript
interface ThemeToggleState {
  isHovered: boolean;
  isFocused: boolean;
  isSwitching: boolean;
  rippleKey: number;
}

const useThemeToggleState = () => {
  const [state, setState] = useState<ThemeToggleState>({
    isHovered: false,
    isFocused: false,
    isSwitching: false,
    rippleKey: 0
  });
  
  const { isDarkMode, toggleTheme } = useTheme();
  
  const handleToggle = useCallback(async () => {
    setState(prev => ({ ...prev, isSwitching: true, rippleKey: prev.rippleKey + 1 }));
    
    await toggleTheme();
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isSwitching: false }));
    }, 300);
  }, [toggleTheme]);
  
  return {
    ...state,
    isDarkMode,
    handleToggle,
    setState
  };
};
```

## 6. Performance Optimizations

### 6.1 Memoization Strategy

```typescript
const ThemeToggle = React.memo<ThemeToggleProps>(({ 
  position = 'bottom-left',
  size = 'md',
  variant = 'floating',
  ...props 
}) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.position === nextProps.position &&
    prevProps.size === nextProps.size &&
    prevProps.variant === nextProps.variant &&
    prevProps.disabled === nextProps.disabled
  );
});
```

### 6.2 Animation Performance

```typescript
// Use transform instead of changing layout properties
const optimizedAnimations = {
  scale: true,        // ✅ GPU accelerated
  rotate: true,       // ✅ GPU accelerated
  opacity: true,      // ✅ GPU accelerated
  width: false,       // ❌ Causes layout
  height: false,      // ❌ Causes layout
  margin: false,      // ❌ Causes layout
};

// Preload animations
const preloadAnimations = () => {
  const element = document.createElement('div');
  element.style.transform = 'scale(1.05) rotate(180deg)';
  element.style.opacity = '0';
  document.body.appendChild(element);
  requestAnimationFrame(() => {
    document.body.removeChild(element);
  });
};
```

## 7. Testing Specifications

### 7.1 Visual Regression Tests

```typescript
const visualTests = [
  'default-light-mode',
  'default-dark-mode',
  'hover-state',
  'focus-state',
  'disabled-state',
  'small-size',
  'large-size',
  'inline-variant',
  'minimal-variant',
  'with-label',
  'mobile-view',
  'tablet-view',
  'desktop-view'
];
```

### 7.2 Accessibility Tests

```typescript
const a11yTests = [
  'keyboard-navigation',
  'screen-reader-announcements',
  'focus-management',
  'aria-attributes',
  'color-contrast',
  'reduced-motion',
  'high-contrast-mode'
];
```

### 7.3 Performance Tests

```typescript
const performanceTests = [
  'animation-frame-rate',
  'render-time',
  'memory-usage',
  'bundle-size-impact',
  'interaction-latency'
];
```

## 8. Browser Compatibility

### 8.1 Feature Support Matrix

| Feature | Chrome | Firefox | Safari | Edge | Notes |
|---------|--------|---------|--------|------|
| Backdrop Filter | 76+ | 103+ | 9+ | 79+ | Fallback: solid background |
| CSS Custom Properties | 49+ | 31+ | 9.1+ | 16+ | Full support |
| Framer Motion | ✅ | ✅ | ✅ | ✅ | Library handles compatibility |
| Touch Events | ✅ | ✅ | ✅ | ✅ | Native support |
| Prefers Reduced Motion | 74+ | 63+ | 10.1+ | 79+ | Graceful degradation |

### 8.2 Fallback Strategies

```css
/* Backdrop filter fallback */
.theme-toggle {
  background: rgba(255, 255, 255, 0.95);
}

@supports (backdrop-filter: blur(12px)) {
  .theme-toggle {
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.8);
  }
}

/* Custom properties fallback */
.theme-toggle {
  border-radius: 16px; /* fallback */
  border-radius: var(--toggle-border-radius, 16px);
}
```

## 9. Implementation Checklist

### 9.1 Development Phase

- [ ] Create base component structure
- [ ] Implement size variants
- [ ] Add visual variants
- [ ] Implement animations
- [ ] Add accessibility features
- [ ] Create responsive styles
- [ ] Add TypeScript types
- [ ] Implement state management
- [ ] Add performance optimizations
- [ ] Create fallbacks

### 9.2 Testing Phase

- [ ] Unit tests
- [ ] Integration tests
- [ ] Accessibility tests
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Cross-browser tests
- [ ] Mobile device tests

### 9.3 Documentation Phase

- [ ] Component API documentation
- [ ] Usage examples
- [ ] Accessibility guidelines
- [ ] Performance best practices
- [ ] Migration guide
- [ ] Troubleshooting guide

---

**Design System Version:** 1.0
**Last Updated:** Current Date
**Status:** Ready for Implementation