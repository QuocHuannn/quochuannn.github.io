// Theme variant definitions
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OUTLINE: 'outline',
  GHOST: 'ghost',
  DESTRUCTIVE: 'destructive'
} as const;

export const CARD_VARIANTS = {
  DEFAULT: 'default',
  GLASS: 'glass',
  ELEVATED: 'elevated',
  BORDERED: 'bordered'
} as const;

export const TEXT_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  MUTED: 'muted',
  ACCENT: 'accent',
  DESTRUCTIVE: 'destructive'
} as const;

export const SIZE_VARIANTS = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
} as const;

export const PADDING_VARIANTS = {
  NONE: 'none',
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
} as const;

// CSS Custom Properties mapping
export const CSS_VARIABLES = {
  // Colors
  COLORS: {
    BACKGROUND: '--color-background',
    SURFACE: '--color-surface',
    SURFACE_SECONDARY: '--color-surface-secondary',
    SURFACE_GLASS: '--color-surface-glass',
    SURFACE_HOVER: '--color-surface-hover',
    
    PRIMARY: '--color-primary',
    PRIMARY_FOREGROUND: '--color-primary-foreground',
    PRIMARY_HOVER: '--color-primary-hover',
    PRIMARY_ALPHA: '--color-primary-alpha',
    
    SECONDARY: '--color-secondary',
    SECONDARY_FOREGROUND: '--color-secondary-foreground',
    SECONDARY_HOVER: '--color-secondary-hover',
    
    DESTRUCTIVE: '--color-destructive',
    DESTRUCTIVE_FOREGROUND: '--color-destructive-foreground',
    DESTRUCTIVE_HOVER: '--color-destructive-hover',
    
    TEXT_PRIMARY: '--color-text-primary',
    TEXT_SECONDARY: '--color-text-secondary',
    TEXT_MUTED: '--color-text-muted',
    
    BORDER: '--color-border',
    BORDER_HOVER: '--color-border-hover',
    BORDER_GLASS: '--color-border-glass'
  },
  
  // Shadows
  SHADOWS: {
    SM: '--shadow-sm',
    MD: '--shadow-md',
    LG: '--shadow-lg',
    XL: '--shadow-xl'
  },
  
  // Spacing
  SPACING: {
    XS: '--spacing-xs',
    SM: '--spacing-sm',
    MD: '--spacing-md',
    LG: '--spacing-lg',
    XL: '--spacing-xl'
  },
  
  // Border Radius
  RADIUS: {
    SM: '--radius-sm',
    MD: '--radius-md',
    LG: '--radius-lg',
    FULL: '--radius-full'
  },
  
  // Typography
  TYPOGRAPHY: {
    FONT_SIZE_SM: '--font-size-sm',
    FONT_SIZE_MD: '--font-size-md',
    FONT_SIZE_LG: '--font-size-lg',
    FONT_SIZE_XL: '--font-size-xl',
    
    FONT_WEIGHT_NORMAL: '--font-weight-normal',
    FONT_WEIGHT_MEDIUM: '--font-weight-medium',
    FONT_WEIGHT_SEMIBOLD: '--font-weight-semibold',
    FONT_WEIGHT_BOLD: '--font-weight-bold',
    
    LINE_HEIGHT_TIGHT: '--line-height-tight',
    LINE_HEIGHT_NORMAL: '--line-height-normal',
    LINE_HEIGHT_RELAXED: '--line-height-relaxed'
  }
} as const;

// Component size mappings
export const COMPONENT_SIZES = {
  BUTTON: {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: 'var(--font-size-sm)',
      borderRadius: 'var(--radius-sm)'
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: 'var(--font-size-md)',
      borderRadius: 'var(--radius-md)'
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: 'var(--font-size-lg)',
      borderRadius: 'var(--radius-md)'
    }
  },
  
  CARD: {
    none: {
      padding: '0'
    },
    sm: {
      padding: 'var(--spacing-sm)'
    },
    md: {
      padding: 'var(--spacing-md)'
    },
    lg: {
      padding: 'var(--spacing-lg)'
    }
  }
} as const;

// Animation constants
export const ANIMATIONS = {
  DURATION: {
    FAST: '0.15s',
    NORMAL: '0.2s',
    SLOW: '0.3s'
  },
  
  EASING: {
    EASE_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
} as const;

// Theme validation arrays
export const VALID_BUTTON_VARIANTS = Object.values(BUTTON_VARIANTS);
export const VALID_CARD_VARIANTS = Object.values(CARD_VARIANTS);
export const VALID_TEXT_VARIANTS = Object.values(TEXT_VARIANTS);
export const VALID_SIZE_VARIANTS = Object.values(SIZE_VARIANTS);
export const VALID_PADDING_VARIANTS = Object.values(PADDING_VARIANTS);

// Default values
export const DEFAULTS = {
  BUTTON: {
    VARIANT: BUTTON_VARIANTS.PRIMARY,
    SIZE: SIZE_VARIANTS.MD
  },
  
  CARD: {
    VARIANT: CARD_VARIANTS.DEFAULT,
    PADDING: PADDING_VARIANTS.MD
  },
  
  TEXT: {
    VARIANT: TEXT_VARIANTS.PRIMARY
  }
} as const;

// Theme breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;

// Z-index scale
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
} as const;