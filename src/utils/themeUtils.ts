import { CSSProperties } from 'react';

// Theme utility types
export interface ThemeVariant {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  boxShadow?: string;
  [key: string]: string | undefined;
}

export interface ThemeVariants {
  [key: string]: ThemeVariant;
}

// Common theme patterns
export const commonThemePatterns = {
  // Surface patterns
  surface: {
    primary: {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-border)'
    },
    secondary: {
      backgroundColor: 'var(--color-surface-secondary)',
      color: 'var(--color-text-secondary)',
      borderColor: 'var(--color-border)'
    },
    glass: {
      backgroundColor: 'var(--color-surface-glass)',
      backdropFilter: 'blur(12px)',
      borderColor: 'var(--color-border-glass)',
      boxShadow: 'var(--shadow-md)'
    },
    elevated: {
      backgroundColor: 'var(--color-surface)',
      boxShadow: 'var(--shadow-lg)',
      borderColor: 'var(--color-border)'
    }
  },

  // Interactive patterns
  interactive: {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-primary-foreground)',
      borderColor: 'transparent'
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-secondary-foreground)',
      borderColor: 'var(--color-border)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--color-border)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      borderColor: 'transparent'
    },
    destructive: {
      backgroundColor: 'var(--color-destructive)',
      color: 'var(--color-destructive-foreground)',
      borderColor: 'transparent'
    }
  },

  // Text patterns
  text: {
    primary: {
      color: 'var(--color-text-primary)'
    },
    secondary: {
      color: 'var(--color-text-secondary)'
    },
    muted: {
      color: 'var(--color-text-muted)'
    },
    accent: {
      color: 'var(--color-primary)'
    },
    destructive: {
      color: 'var(--color-destructive)'
    }
  },

  // Shadow patterns
  shadow: {
    sm: {
      boxShadow: 'var(--shadow-sm)'
    },
    md: {
      boxShadow: 'var(--shadow-md)'
    },
    lg: {
      boxShadow: 'var(--shadow-lg)'
    },
    xl: {
      boxShadow: 'var(--shadow-xl)'
    }
  }
};

// Utility functions
export const getThemeStyles = (
  pattern: keyof typeof commonThemePatterns,
  variant: string
): CSSProperties => {
  const patternStyles = commonThemePatterns[pattern] as ThemeVariants;
  return patternStyles[variant] || {};
};

export const combineThemeStyles = (...styles: CSSProperties[]): CSSProperties => {
  return styles.reduce((combined, style) => ({ ...combined, ...style }), {});
};

// Hover state utilities
export const getHoverStyles = (variant: string): CSSProperties => {
  const hoverStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary-hover)'
    },
    secondary: {
      backgroundColor: 'var(--color-secondary-hover)'
    },
    outline: {
      backgroundColor: 'var(--color-surface-hover)',
      borderColor: 'var(--color-border-hover)'
    },
    ghost: {
      backgroundColor: 'var(--color-surface-hover)'
    },
    destructive: {
      backgroundColor: 'var(--color-destructive-hover)'
    },
    surface: {
      boxShadow: 'var(--shadow-md)'
    },
    elevated: {
      boxShadow: 'var(--shadow-xl)'
    }
  };
  
  return hoverStyles[variant] || {};
};

// Focus state utilities
export const getFocusStyles = (): CSSProperties => {
  return {
    outline: 'none',
    boxShadow: '0 0 0 2px var(--color-primary), 0 0 0 4px var(--color-primary-alpha)'
  };
};

// Animation utilities
export const getTransitionStyles = (properties: string[] = ['all']): CSSProperties => {
  return {
    transition: properties.map(prop => `${prop} 0.2s cubic-bezier(0.4, 0, 0.2, 1)`).join(', ')
  };
};

// Component-specific theme utilities
export const buttonThemeUtils = {
  getVariantStyles: (variant: string) => getThemeStyles('interactive', variant),
  getHoverStyles,
  getFocusStyles,
  getTransitionStyles: () => getTransitionStyles(['background-color', 'color', 'border-color', 'box-shadow'])
};

export const cardThemeUtils = {
  getVariantStyles: (variant: string) => getThemeStyles('surface', variant),
  getHoverStyles: (variant: string) => {
    if (variant === 'glass' || variant === 'elevated') {
      return { boxShadow: 'var(--shadow-xl)' };
    }
    return { boxShadow: 'var(--shadow-md)' };
  },
  getTransitionStyles: () => getTransitionStyles(['background-color', 'border-color', 'box-shadow'])
};

export const textThemeUtils = {
  getVariantStyles: (variant: string) => getThemeStyles('text', variant),
  getTransitionStyles: () => getTransitionStyles(['color'])
};

// Theme-aware event handlers
export const createThemeAwareHandlers = (variant: string, originalStyles: CSSProperties) => {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const hoverStyles = getHoverStyles(variant);
      Object.assign(e.currentTarget.style, hoverStyles);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      Object.assign(e.currentTarget.style, originalStyles);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      const focusStyles = getFocusStyles();
      Object.assign(e.currentTarget.style, focusStyles);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      e.currentTarget.style.boxShadow = originalStyles.boxShadow || '';
    }
  };
};

// CSS custom properties helpers with batching
let pendingCSSUpdates: Map<string, string> = new Map();
let updateScheduled = false;

const flushCSSUpdates = () => {
  if (pendingCSSUpdates.size === 0) return;
  
  const root = document.documentElement;
  pendingCSSUpdates.forEach((value, property) => {
    root.style.setProperty(property, value);
  });
  
  pendingCSSUpdates.clear();
  updateScheduled = false;
};

export const setCSSCustomProperty = (property: string, value: string) => {
  pendingCSSUpdates.set(property, value);
  
  if (!updateScheduled) {
    updateScheduled = true;
    requestAnimationFrame(flushCSSUpdates);
  }
};

export const setCSSCustomProperties = (properties: Record<string, string>) => {
  Object.entries(properties).forEach(([property, value]) => {
    pendingCSSUpdates.set(property, value);
  });
  
  if (!updateScheduled) {
    updateScheduled = true;
    requestAnimationFrame(flushCSSUpdates);
  }
};

export const getCSSCustomProperty = (property: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
};

// Force immediate CSS update (use sparingly)
export const flushCSSUpdatesSync = () => {
  if (updateScheduled) {
    flushCSSUpdates();
  }
};

// Theme validation utilities
export const validateThemeVariant = (variant: string, allowedVariants: string[]): boolean => {
  return allowedVariants.includes(variant);
};

export const getValidVariant = (variant: string, allowedVariants: string[], fallback: string): string => {
  return validateThemeVariant(variant, allowedVariants) ? variant : fallback;
};