// Core Theme Components (always loaded)
export { ThemeProvider } from './ThemeProvider';

// Lazy-loaded Theme Components for better code splitting
export const ThemeToggle = () => import('./ThemeToggle');
export const ThemeAwareComponent = () => import('./ThemeAwareComponent');
export const ThemePerformanceDemo = () => import('./ThemePerformanceDemo');
export const LazyThemeComponents = () => import('./LazyThemeComponents');

// Theme Types
export type { ThemeToggleVariant, ThemeToggleSize } from './ThemeToggle';

// Core theme hooks (always available)
export { useTheme } from '../../hooks/useTheme';
export { useThemeClassName } from '../../hooks/useThemeClassName';

// Lazy-loaded theme hooks for better tree-shaking
export const useThemeSelectors = () => import('../../hooks/useThemeSelectors');
export const useReducedMotion = () => import('../../hooks/useReducedMotion');

// Convenience functions for loading specific hooks
export const useActualTheme = async () => {
  const { useActualTheme } = await import('../../hooks/useThemeSelectors');
  return useActualTheme;
};

export const useIsDarkMode = async () => {
  const { useIsDarkMode } = await import('../../hooks/useThemeSelectors');
  return useIsDarkMode;
};

export const useThemeToggle = async () => {
  const { useThemeToggle } = await import('../../hooks/useThemeSelectors');
  return useThemeToggle;
};

// Re-export types
export type { Theme, ThemeContextType } from '../../hooks/useTheme';

// Bundle optimization utilities
export const preloadThemeComponents = async () => {
  const [ThemeToggleModule, ThemeAwareModule] = await Promise.all([
    import('./ThemeToggle'),
    import('./ThemeAwareComponent')
  ]);
  
  return {
    ThemeToggle: ThemeToggleModule.default,
    ThemeAwareComponent: ThemeAwareModule.default
  };
};

export const preloadThemeHooks = async () => {
  const selectorsModule = await import('../../hooks/useThemeSelectors');
  
  return {
    ...selectorsModule
  };
};

// Legacy exports for backward compatibility (deprecated)
// @deprecated Use lazy loading functions instead
export const legacyExports = {
  ThemeToggle: () => import('./ThemeToggle').then(m => m.default),
  ThemeAwareComponent: () => import('./ThemeAwareComponent').then(m => m.default),
  ThemePerformanceDemo: () => import('./ThemePerformanceDemo').then(m => m.default)
};