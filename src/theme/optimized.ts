// Optimized Theme Exports
// This file provides tree-shakable exports for better bundle optimization

// Core theme functionality (always included in bundle)
export { useTheme } from '../hooks/useTheme';
export { useThemeClassName } from '../hooks/useThemeClassName';
export { ThemeProvider } from '../components/theme/ThemeProvider';

// Lazy-loaded theme selectors
export const useActualTheme = () => import('../hooks/useThemeSelectors').then(m => m.useActualTheme);
export const useIsDarkMode = () => import('../hooks/useThemeSelectors').then(m => m.useIsDarkMode);
export const useIsLightMode = () => import('../hooks/useThemeSelectors').then(m => m.useIsLightMode);
export const useThemeValue = () => import('../hooks/useThemeSelectors').then(m => m.useThemeValue);
export const useThemeToggle = () => import('../hooks/useThemeSelectors').then(m => m.useThemeToggle);
export const useSetTheme = () => import('../hooks/useThemeSelectors').then(m => m.useSetTheme);
export const useThemeDisplayName = () => import('../hooks/useThemeSelectors').then(m => m.useThemeDisplayName);
export const useThemeSpecificValue = () => import('../hooks/useThemeSelectors').then(m => m.useThemeSpecificValue);
export const useThemeDebug = () => import('../hooks/useThemeSelectors').then(m => m.useThemeDebug);

// Lazy-loaded theme components
export const ThemeToggle = () => import('../components/theme/ThemeToggle');
export const ThemeAwareComponent = () => import('../components/theme/ThemeAwareComponent');
export const ThemePerformanceDemo = () => import('../components/theme/ThemePerformanceDemo');
export const LazyThemeComponents = () => import('../components/theme/LazyThemeComponents');

// Lazy-loaded theme utilities
export const lazyThemeUtils = () => import('../utils/themeUtils');
export const themeUtils = () => import('../utils/themeUtils');
export const themeBundleOptimizer = () => import('../utils/themeBundleOptimizer');
export const themeChunkSplitter = () => import('../utils/themeChunkSplitter');

// Theme transitions and motion presets will be added when available

// Lazy-loaded system hooks
export const useReducedMotion = () => import('../hooks/useReducedMotion').then(m => m.useReducedMotion);

// Bundle optimization utilities
export const loadThemeModule = async <T extends object>(loader: () => Promise<{ default: T } | T>): Promise<T> => {
  const module = await loader();
  return ('default' in module ? module.default : module) as T;
};

export const loadThemeHook = async <T extends (...args: any[]) => any>(
  loader: () => Promise<T>
): Promise<T> => {
  return await loader();
};

// Preload strategies
export const preloadCriticalTheme = async () => {
  // Preload only the most critical theme functionality
  const [themeSelectors] = await Promise.all([
    import('../hooks/useThemeSelectors')
  ]);
  
  return {
    useActualTheme: themeSelectors.useActualTheme,
    useIsDarkMode: themeSelectors.useIsDarkMode,
    useThemeToggle: themeSelectors.useThemeToggle
  };
};

export const preloadThemeComponents = async () => {
  // Preload theme components when needed
  const [ThemeToggleModule, themeUtilsModule] = await Promise.all([
    import('../components/theme/ThemeToggle'),
    import('../utils/themeUtils')
  ]);
  
  return {
    ThemeToggle: ThemeToggleModule.default,
    themeUtils: themeUtilsModule
  };
};

export const preloadAdvancedTheme = async () => {
  // Preload advanced theme functionality
  const [LazyThemeComponentsModule, bundleOptimizerModule, chunkSplitterModule] = await Promise.all([
    import('../components/theme/LazyThemeComponents'),
    import('../utils/themeBundleOptimizer'),
    import('../utils/themeChunkSplitter')
  ]);
  
  return {
    LazyThemeComponents: LazyThemeComponentsModule,
    bundleOptimizer: bundleOptimizerModule,
    chunkSplitter: chunkSplitterModule
  };
};

// Theme module registry for dynamic loading
const themeModuleRegistry = {
  // Hooks
  'hooks/useThemeSelectors': () => import('../hooks/useThemeSelectors'),
  'hooks/useReducedMotion': () => import('../hooks/useReducedMotion'),
  
  // Components
  'components/ThemeToggle': () => import('../components/theme/ThemeToggle'),
  'components/ThemeAwareComponent': () => import('../components/theme/ThemeAwareComponent'),
  'components/ThemePerformanceDemo': () => import('../components/theme/ThemePerformanceDemo'),
  'components/LazyThemeComponents': () => import('../components/theme/LazyThemeComponents'),
  
  // Utils
  'utils/themeUtils': () => import('../utils/themeUtils'),
  'utils/themeBundleOptimizer': () => import('../utils/themeBundleOptimizer'),
  'utils/themeChunkSplitter': () => import('../utils/themeChunkSplitter')
} as const;

export type ThemeModuleKey = keyof typeof themeModuleRegistry;

export const loadThemeModuleByKey = async <T = any>(key: ThemeModuleKey): Promise<T> => {
  const loader = themeModuleRegistry[key];
  if (!loader) {
    throw new Error(`Theme module '${key}' not found in registry`);
  }
  return await loader() as T;
};

// Export registry for external use
export { themeModuleRegistry };

// Default export for convenience
export default {
  // Core
  useTheme: () => import('../hooks/useTheme').then(m => m.useTheme),
  useThemeClassName: () => import('../hooks/useThemeClassName').then(m => m.useThemeClassName),
  ThemeProvider: () => import('../components/theme/ThemeProvider').then(m => m.ThemeProvider),
  
  // Lazy loaders
  loadModule: loadThemeModuleByKey,
  preload: {
    critical: preloadCriticalTheme,
    components: preloadThemeComponents,
    advanced: preloadAdvancedTheme
  },
  
  // Registry
  registry: themeModuleRegistry
};