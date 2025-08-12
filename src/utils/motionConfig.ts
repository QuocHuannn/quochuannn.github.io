// Motion configuration utility to prevent conflicts with CSS transitions
import { MotionProps } from 'framer-motion';

// Global flag to control Framer Motion animations
let motionEnabled = true;
let reducedMotionEnabled = false;

// Check for reduced motion preference
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotionEnabled = mediaQuery.matches;
  
  mediaQuery.addEventListener('change', (e) => {
    reducedMotionEnabled = e.matches;
  });
}

/**
 * Disable Framer Motion animations globally
 */
export const disableMotion = () => {
  motionEnabled = false;
};

/**
 * Enable Framer Motion animations globally
 */
export const enableMotion = () => {
  motionEnabled = true;
};

/**
 * Check if motion should be enabled
 */
export const shouldUseMotion = (): boolean => {
  return motionEnabled && !reducedMotionEnabled;
};

/**
 * Get optimized motion props that respect performance settings
 */
export const getOptimizedMotionProps = (props: MotionProps): MotionProps => {
  if (!shouldUseMotion()) {
    // Return props without animations
    const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
    return rest;
  }
  
  // Optimize transition settings for performance
  const optimizedProps: MotionProps = {
    ...props,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      ...props.transition
    }
  };
  
  return optimizedProps;
};

/**
 * Simplified motion variants for better performance
 */
export const optimizedVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeOut' as const }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2, ease: 'easeOut' as const }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: 'easeOut' as const }
  }
};

/**
 * Create motion props with conflict prevention
 */
export const createMotionProps = (variant: keyof typeof optimizedVariants): MotionProps => {
  if (!shouldUseMotion()) {
    return {};
  }
  
  return optimizedVariants[variant];
};

/**
 * Disable motion during theme transitions to prevent conflicts
 */
let themeTransitioning = false;

export const setThemeTransitioning = (transitioning: boolean) => {
  themeTransitioning = transitioning;
};

export const isThemeTransitioning = () => themeTransitioning;

/**
 * Get motion props that respect theme transition state
 */
export const getThemeAwareMotionProps = (props: MotionProps): MotionProps => {
  if (themeTransitioning || !shouldUseMotion()) {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
    return rest;
  }
  
  return getOptimizedMotionProps(props);
};

/**
 * Performance-optimized hover props
 */
export const optimizedHoverProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.1, ease: 'easeOut' }
};

/**
 * Get hover props that respect performance settings
 */
export const getOptimizedHoverProps = () => {
  if (!shouldUseMotion()) {
    return {};
  }
  
  return optimizedHoverProps;
};