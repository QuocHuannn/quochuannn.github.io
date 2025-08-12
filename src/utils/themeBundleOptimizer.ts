// Theme Bundle Optimizer
// Optimizes theme imports and enables better tree-shaking

// Core theme exports (always included)
export const coreThemeExports = {
  // Essential hooks
  useTheme: () => import('../hooks/useTheme').then(m => ({ useTheme: m.useTheme })),
  useActualTheme: () => import('../hooks/useThemeSelectors').then(m => ({ useActualTheme: m.useActualTheme })),
  useThemeClassName: () => import('../hooks/useThemeClassName').then(m => ({ useThemeClassName: m.useThemeClassName })),
  
  // Essential components
  ThemeProvider: () => import('../components/theme/ThemeProvider').then(m => ({ ThemeProvider: m.ThemeProvider })),
} as const;

// Optional theme exports (lazy loaded)
export const optionalThemeExports = {
  // Theme selectors
  useIsDarkMode: () => import('../hooks/useThemeSelectors').then(m => ({ useIsDarkMode: m.useIsDarkMode })),
  useIsLightMode: () => import('../hooks/useThemeSelectors').then(m => ({ useIsLightMode: m.useIsLightMode })),
  useThemeValue: () => import('../hooks/useThemeSelectors').then(m => ({ useThemeValue: m.useThemeValue })),
  useThemeToggle: () => import('../hooks/useThemeSelectors').then(m => ({ useThemeToggle: m.useThemeToggle })),
  useSetTheme: () => import('../hooks/useThemeSelectors').then(m => ({ useSetTheme: m.useSetTheme })),
  useThemeDisplayName: () => import('../hooks/useThemeSelectors').then(m => ({ useThemeDisplayName: m.useThemeDisplayName })),
  useThemeSpecificValue: () => import('../hooks/useThemeSelectors').then(m => ({ useThemeSpecificValue: m.useThemeSpecificValue })),
  useThemeDebug: () => import('../hooks/useThemeSelectors').then(m => ({ useThemeDebug: m.useThemeDebug })),
  
  // Theme components
  ThemeToggle: () => import('../components/theme/ThemeToggle').then(m => ({ default: m.default })),
  ThemeAwareComponent: () => import('../components/theme/ThemeAwareComponent').then(m => ({ default: m.default })),
  ThemePerformanceDemo: () => import('../components/theme/ThemePerformanceDemo').then(m => ({ default: m.default })),
  
  // Theme utilities
  getThemeStyles: () => import('../utils/themeUtils').then(m => ({ getThemeStyles: m.getThemeStyles })),
  getTransitionStyles: () => import('../utils/themeUtils').then(m => ({ getTransitionStyles: m.getTransitionStyles })),
  getHoverStyles: () => import('../utils/themeUtils').then(m => ({ getHoverStyles: m.getHoverStyles })),
  getFocusStyles: () => import('../utils/themeUtils').then(m => ({ getFocusStyles: m.getFocusStyles })),
  buttonThemeUtils: () => import('../utils/themeUtils').then(m => ({ buttonThemeUtils: m.buttonThemeUtils })),
  cardThemeUtils: () => import('../utils/themeUtils').then(m => ({ cardThemeUtils: m.cardThemeUtils })),
  // themeExport will be added when available
  
  // System hooks
  useReducedMotion: () => import('../hooks/useReducedMotion').then(m => ({ useReducedMotion: m.useReducedMotion })),
} as const;

// Theme import optimizer
export class ThemeImportOptimizer {
  private static instance: ThemeImportOptimizer;
  private importCache = new Map<string, Promise<any>>();
  private loadedModules = new Set<string>();

  static getInstance(): ThemeImportOptimizer {
    if (!ThemeImportOptimizer.instance) {
      ThemeImportOptimizer.instance = new ThemeImportOptimizer();
    }
    return ThemeImportOptimizer.instance;
  }

  // Optimized import function
  async importThemeModule<T = any>(moduleName: keyof typeof optionalThemeExports): Promise<T> {
    if (this.importCache.has(moduleName)) {
      return this.importCache.get(moduleName)!;
    }

    const importPromise = optionalThemeExports[moduleName]();
    this.importCache.set(moduleName, importPromise);

    try {
      const module = await importPromise;
      this.loadedModules.add(moduleName);
      return module as T;
    } catch (error) {
      this.importCache.delete(moduleName);
      throw error;
    }
  }

  // Batch import multiple modules
  async importThemeModules(moduleNames: (keyof typeof optionalThemeExports)[]): Promise<Record<string, any>> {
    const imports = moduleNames.map(async (name) => {
      const module = await this.importThemeModule(name);
      return { [name]: module };
    });

    const results = await Promise.all(imports);
    return results.reduce((acc, result) => ({ ...acc, ...result }), {});
  }

  // Preload commonly used modules
  async preloadCommonModules(): Promise<void> {
    const commonModules: (keyof typeof optionalThemeExports)[] = [
      'useIsDarkMode',
      'useIsLightMode',
      'useThemeToggle',
      'getThemeStyles'
    ];

    await this.importThemeModules(commonModules);
  }

  // Get loading statistics
  getStats() {
    return {
      cached: this.importCache.size,
      loaded: this.loadedModules.size,
      total: Object.keys(optionalThemeExports).length
    };
  }

  // Clear cache
  clearCache(): void {
    this.importCache.clear();
    this.loadedModules.clear();
  }
}

// Tree-shaking optimized exports
export const createOptimizedThemeExport = (exports: string[]) => {
  return exports.reduce((acc, exportName) => {
    if (exportName in optionalThemeExports) {
      acc[exportName] = optionalThemeExports[exportName as keyof typeof optionalThemeExports];
    }
    return acc;
  }, {} as Record<string, () => Promise<any>>);
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  const optimizer = ThemeImportOptimizer.getInstance();
  const stats = optimizer.getStats();
  
  return {
    ...stats,
    coreModules: Object.keys(coreThemeExports).length,
    optionalModules: Object.keys(optionalThemeExports).length,
    loadingPercentage: Math.round((stats.loaded / stats.total) * 100),
    recommendations: generateOptimizationRecommendations(stats)
  };
};

// Generate optimization recommendations
const generateOptimizationRecommendations = (stats: { cached: number; loaded: number; total: number }) => {
  const recommendations: string[] = [];
  
  if (stats.loaded > stats.total * 0.8) {
    recommendations.push('Consider splitting theme functionality into smaller chunks');
  }
  
  if (stats.cached > stats.loaded * 1.5) {
    recommendations.push('Some modules are cached but not used - consider lazy loading');
  }
  
  if (stats.loaded < 5) {
    recommendations.push('Good job! Theme bundle is well optimized');
  }
  
  return recommendations;
};

// Utility functions
export const preloadThemeModules = async (modules: (keyof typeof optionalThemeExports)[]) => {
  const optimizer = ThemeImportOptimizer.getInstance();
  return optimizer.importThemeModules(modules);
};

export const getThemeModule = async <T = any>(moduleName: keyof typeof optionalThemeExports): Promise<T> => {
  const optimizer = ThemeImportOptimizer.getInstance();
  return optimizer.importThemeModule<T>(moduleName);
};

export const preloadCommonThemeModules = async () => {
  const optimizer = ThemeImportOptimizer.getInstance();
  return optimizer.preloadCommonModules();
};

// Export singleton instance
export const themeImportOptimizer = ThemeImportOptimizer.getInstance();

// Optimized theme barrel export
export const optimizedThemeExports = {
  // Core (always available)
  ...coreThemeExports,
  
  // Optional (lazy loaded)
  lazy: optionalThemeExports,
  
  // Utilities
  optimizer: themeImportOptimizer,
  preload: preloadThemeModules,
  getModule: getThemeModule,
  analyze: analyzeBundleSize
};