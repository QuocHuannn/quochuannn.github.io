# Design System - Portfolio Website Trương Quốc Huân

## 1. Color Palette

### 1.1 Primary Colors (Cream White Theme)

```css
:root {
  /* Base Colors */
  --color-primary: #FAF7F0;      /* Cream White */
  --color-secondary: #F5F1E8;    /* Soft Beige */
  --color-tertiary: #F0EBE3;     /* Light Beige */
  --color-background: #FEFCF8;   /* Off White */
  
  /* Text Colors */
  --color-text-primary: #2C2C2C;    /* Dark Gray */
  --color-text-secondary: #5A5A5A;  /* Medium Gray */
  --color-text-muted: #8A8A8A;      /* Light Gray */
  
  /* Border & Divider */
  --color-border: #E8E3DB;        /* Subtle Border */
  --color-divider: #DDD6CC;       /* Section Divider */
}
```

### 1.2 Dynamic Accent Colors

```css
:root {
  /* Dynamic Accent System */
  --color-accent-blue: #4A90E2;     /* Primary Blue */
  --color-accent-green: #7ED321;    /* Success Green */
  --color-accent-purple: #9013FE;   /* Creative Purple */
  --color-accent-orange: #FF9500;   /* Energy Orange */
  --color-accent-pink: #FF6B9D;     /* Playful Pink */
  
  /* Gradient Combinations */
  --gradient-primary: linear-gradient(135deg, #4A90E2 0%, #9013FE 100%);
  --gradient-secondary: linear-gradient(135deg, #7ED321 0%, #4A90E2 100%);
  --gradient-tertiary: linear-gradient(135deg, #FF9500 0%, #FF6B9D 100%);
  
  /* Hover States */
  --color-accent-blue-hover: #3A7BC8;
  --color-accent-green-hover: #6BB91A;
  --color-accent-purple-hover: #7A0FE4;
}
```

### 1.3 Semantic Colors

```css
:root {
  /* Status Colors */
  --color-success: #7ED321;
  --color-warning: #FF9500;
  --color-error: #FF4757;
  --color-info: #4A90E2;
  
  /* Interactive States */
  --color-hover: rgba(74, 144, 226, 0.1);
  --color-active: rgba(74, 144, 226, 0.2);
  --color-focus: rgba(74, 144, 226, 0.3);
  --color-disabled: #C4C4C4;
}
```

## 2. Typography System

### 2.1 Font Families

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
}
```

### 2.2 Typography Scale

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
  --text-7xl: 4.5rem;     /* 72px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### 2.3 Typography Components

```typescript
// Heading Styles
interface HeadingStyles {
  h1: {
    fontSize: 'var(--text-6xl)';
    fontFamily: 'var(--font-heading)';
    fontWeight: 'var(--font-bold)';
    lineHeight: 'var(--leading-tight)';
    letterSpacing: '-0.025em';
  };
  h2: {
    fontSize: 'var(--text-4xl)';
    fontFamily: 'var(--font-heading)';
    fontWeight: 'var(--font-semibold)';
    lineHeight: 'var(--leading-tight)';
  };
  h3: {
    fontSize: 'var(--text-2xl)';
    fontFamily: 'var(--font-heading)';
    fontWeight: 'var(--font-medium)';
    lineHeight: 'var(--leading-snug)';
  };
}

// Body Text Styles
interface BodyStyles {
  large: {
    fontSize: 'var(--text-lg)';
    fontFamily: 'var(--font-primary)';
    lineHeight: 'var(--leading-relaxed)';
  };
  base: {
    fontSize: 'var(--text-base)';
    fontFamily: 'var(--font-primary)';
    lineHeight: 'var(--leading-normal)';
  };
  small: {
    fontSize: 'var(--text-sm)';
    fontFamily: 'var(--font-primary)';
    lineHeight: 'var(--leading-normal)';
  };
}
```

## 3. Spacing System

### 3.1 Spacing Scale

```css
:root {
  /* Spacing Scale (based on 4px) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
  
  /* Section Spacing */
  --section-padding-y: var(--space-20);
  --section-padding-x: var(--space-6);
  --container-max-width: 1200px;
}
```

## 4. Component Library

### 4.1 Button Components

```typescript
interface ButtonVariants {
  primary: {
    background: 'var(--gradient-primary)';
    color: 'white';
    border: 'none';
    borderRadius: '8px';
    padding: 'var(--space-3) var(--space-6)';
    fontSize: 'var(--text-base)';
    fontWeight: 'var(--font-medium)';
    transition: 'all 0.3s ease';
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)';
  };
  
  secondary: {
    background: 'transparent';
    color: 'var(--color-accent-blue)';
    border: '2px solid var(--color-accent-blue)';
    borderRadius: '8px';
    padding: 'var(--space-3) var(--space-6)';
    transition: 'all 0.3s ease';
  };
  
  ghost: {
    background: 'transparent';
    color: 'var(--color-text-primary)';
    border: 'none';
    padding: 'var(--space-2) var(--space-4)';
    borderRadius: '6px';
    transition: 'all 0.3s ease';
  };
}
```

### 4.2 Card Components

```typescript
interface CardStyles {
  base: {
    background: 'var(--color-background)';
    borderRadius: '12px';
    padding: 'var(--space-6)';
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)';
    border: '1px solid var(--color-border)';
    transition: 'all 0.3s ease';
  };
  
  elevated: {
    background: 'var(--color-background)';
    borderRadius: '16px';
    padding: 'var(--space-8)';
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)';
    border: '1px solid var(--color-border)';
    backdropFilter: 'blur(10px)';
  };
  
  interactive: {
    cursor: 'pointer';
    transform: 'translateY(0)';
    transition: 'all 0.3s ease';
    '&:hover': {
      transform: 'translateY(-4px)';
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)';
    };
  };
}
```

## 5. Animation System

### 5.1 Transition Presets

```css
:root {
  /* Duration */
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --duration-slower: 0.75s;
  
  /* Easing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 5.2 Animation Utilities

```typescript
// Framer Motion Variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5, ease: "backOut" }
};
```

## 6. Three.js Design Specifications

### 6.1 3D Color Palette

```typescript
interface ThreeJSColors {
  // Material Colors (matching 2D theme)
  primary: '#FAF7F0';     // Cream white materials
  secondary: '#F5F1E8';   // Soft beige accents
  accent: '#4A90E2';      // Blue highlights
  
  // Lighting Colors
  ambientLight: '#FFFFFF';
  directionalLight: '#FFEAA7';
  pointLight: '#74B9FF';
  
  // Particle Colors
  particles: ['#4A90E2', '#7ED321', '#9013FE', '#FF9500'];
}
```

### 6.2 Geometric Shapes Configuration

```typescript
interface ShapeConfig {
  sphere: {
    radius: 1;
    widthSegments: 32;
    heightSegments: 32;
    material: {
      color: '#FAF7F0';
      metalness: 0.1;
      roughness: 0.2;
      transparent: true;
      opacity: 0.8;
    };
  };
  
  cube: {
    size: [1, 1, 1];
    material: {
      color: '#4A90E2';
      metalness: 0.3;
      roughness: 0.4;
      wireframe: false;
    };
  };
  
  torus: {
    radius: 1;
    tube: 0.3;
    radialSegments: 16;
    tubularSegments: 100;
    material: {
      color: '#9013FE';
      metalness: 0.5;
      roughness: 0.1;
      emissive: '#9013FE';
      emissiveIntensity: 0.1;
    };
  };
}
```

### 6.3 Animation Patterns

```typescript
interface AnimationPatterns {
  floating: {
    y: { duration: 2, repeat: Infinity, repeatType: 'reverse' };
    amplitude: 0.5;
  };
  
  rotation: {
    x: { duration: 10, repeat: Infinity, ease: 'linear' };
    y: { duration: 15, repeat: Infinity, ease: 'linear' };
    z: { duration: 20, repeat: Infinity, ease: 'linear' };
  };
  
  pulse: {
    scale: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    };
    range: [0.8, 1.2];
  };
}
```

## 7. Responsive Design System

### 7.1 Breakpoints

```css
:root {
  /* Breakpoints */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}

/* Media Query Mixins */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### 7.2 Responsive Typography

```css
/* Fluid Typography */
.heading-hero {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: clamp(1.2, 1.2, 1.1);
}

.heading-section {
  font-size: clamp(1.875rem, 3vw, 2.25rem);
}

.text-body {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
}
```

### 7.3 Mobile-Specific Adjustments

```typescript
interface MobileAdjustments {
  // Reduced 3D complexity
  threejs: {
    particleCount: 50; // vs 200 on desktop
    geometryDetail: 'low';
    shadowsEnabled: false;
    antialiasing: false;
  };
  
  // Touch-friendly interactions
  touch: {
    minTouchTarget: '44px';
    swipeThreshold: 50;
    tapDelay: 300;
  };
  
  // Performance optimizations
  performance: {
    reducedMotion: true;
    lazyLoadImages: true;
    deferNonCritical: true;
  };
}
```

## 8. Accessibility Guidelines

### 8.1 Color Contrast

```css
/* WCAG AA Compliant Ratios */
:root {
  --contrast-normal: 4.5:1;  /* Normal text */
  --contrast-large: 3:1;     /* Large text (18px+) */
  --contrast-ui: 3:1;        /* UI components */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-background: #FFFFFF;
    --color-accent-blue: #0066CC;
  }
}
```

### 8.2 Motion Preferences

```css
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Disable 3D animations */
  .three-canvas {
    display: none;
  }
  
  .three-fallback {
    display: block;
  }
}
```

## 9. Implementation Guidelines

### 9.1 CSS Custom Properties Usage

```css
/* Component Example */
.button {
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  transition: all var(--duration-normal) var(--ease-out);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.4);
}
```

### 9.2 Component Composition

```typescript
// Design Token Integration
interface DesignTokens {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  animations: typeof animations;
  breakpoints: typeof breakpoints;
}

// Theme Provider Setup
const theme: DesignTokens = {
  colors,
  typography,
  spacing,
  animations,
  breakpoints
};
```