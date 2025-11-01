/**
 * Design Tokens Hook
 * 
 * Provides easy access to design tokens in React components
 */

import { useMemo } from 'react';
import { designTokens } from '../constants/design-tokens';

/**
 * Hook to access design tokens with optional responsive calculations
 */
export const useDesignTokens = () => {
  return useMemo(() => designTokens, []);
};

/**
 * Hook to get responsive value based on current screen size
 */
export const useResponsiveValue = <T,>(values: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}) => {
  return useMemo(() => {
    if (typeof window === 'undefined') return values.base;
    
    const width = window.innerWidth;
    
    // 2xl: 1536px+
    if (width >= 1536 && values['2xl'] !== undefined) return values['2xl'];
    // xl: 1280px+
    if (width >= 1280 && values.xl !== undefined) return values.xl;
    // lg: 1024px+
    if (width >= 1024 && values.lg !== undefined) return values.lg;
    // md: 768px+
    if (width >= 768 && values.md !== undefined) return values.md;
    // sm: 640px+
    if (width >= 640 && values.sm !== undefined) return values.sm;
    
    return values.base;
  }, [values]);
};

/**
 * Hook to get spacing value by scale
 */
export const useSpacing = (scale: keyof typeof designTokens.spacing) => {
  return useMemo(() => designTokens.spacing[scale], [scale]);
};

/**
 * Hook to get color value by path
 */
export const useColor = (
  palette: keyof typeof designTokens.colors,
  shade?: number
) => {
  return useMemo(() => {
    const colorPalette = designTokens.colors[palette];
    if (typeof colorPalette === 'object' && shade !== undefined) {
      return (colorPalette as any)[shade];
    }
    return colorPalette;
  }, [palette, shade]);
};

/**
 * Hook to get typography value
 */
export const useTypography = () => {
  return useMemo(() => designTokens.typography, []);
};

/**
 * Hook to get shadow value
 */
export const useShadow = (level: keyof typeof designTokens.shadows) => {
  return useMemo(() => designTokens.shadows[level], [level]);
};

/**
 * Hook to get transition configuration
 */
export const useTransition = (
  duration: keyof typeof designTokens.transitions.duration = 'normal',
  easing: keyof typeof designTokens.transitions.easing = 'easeOut'
) => {
  return useMemo(
    () => ({
      duration: designTokens.transitions.duration[duration],
      easing: designTokens.transitions.easing[easing],
      css: `${designTokens.transitions.duration[duration]} ${designTokens.transitions.easing[easing]}`,
    }),
    [duration, easing]
  );
};

/**
 * Hook to get border radius value
 */
export const useBorderRadius = (size: keyof typeof designTokens.borderRadius) => {
  return useMemo(() => designTokens.borderRadius[size], [size]);
};

/**
 * Hook for creating responsive typography styles
 */
export const useResponsiveTypography = (config: {
  base: keyof typeof designTokens.typography.fontSize;
  sm?: keyof typeof designTokens.typography.fontSize;
  md?: keyof typeof designTokens.typography.fontSize;
  lg?: keyof typeof designTokens.typography.fontSize;
  xl?: keyof typeof designTokens.typography.fontSize;
}) => {
  return useMemo(() => {
    const baseSize = designTokens.typography.fontSize[config.base];
    
    if (typeof window === 'undefined') return baseSize;
    
    const width = window.innerWidth;
    
    if (width >= 1280 && config.xl) {
      return designTokens.typography.fontSize[config.xl];
    }
    if (width >= 1024 && config.lg) {
      return designTokens.typography.fontSize[config.lg];
    }
    if (width >= 768 && config.md) {
      return designTokens.typography.fontSize[config.md];
    }
    if (width >= 640 && config.sm) {
      return designTokens.typography.fontSize[config.sm];
    }
    
    return baseSize;
  }, [config]);
};

export default useDesignTokens;
