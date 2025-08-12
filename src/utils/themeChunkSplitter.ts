import React, { ComponentType } from 'react';

// Theme chunk types
export type ThemeChunkType = 
  | 'core'           // Essential theme functionality
  | 'components'     // Theme-aware components
  | 'utilities'      // Theme utility functions
  | 'animations'     // Theme-related animations
  | 'performance'    // Performance monitoring
  | 'advanced';      // Advanced theme features

// Theme chunk configuration
export interface ThemeChunkConfig {
  type: ThemeChunkType;
  priority: 'high' | 'medium' | 'low';
  preload?: boolean;
  dependencies?: ThemeChunkType[];
}

// Theme chunk registry
const themeChunkRegistry = new Map<string, ThemeChunkConfig>();

// Register theme chunks
export const registerThemeChunk = (name: string, config: ThemeChunkConfig) => {
  themeChunkRegistry.set(name, config);
};

// Get theme chunk config
export const getThemeChunkConfig = (name: string): ThemeChunkConfig | undefined => {
  return themeChunkRegistry.get(name);
};

// Theme chunk loaders
export const themeChunkLoaders = {
  // Core theme functionality (always loaded)
  core: {
    themeProvider: () => import('../components/theme/ThemeProvider'),
    useTheme: () => import('../hooks/useTheme'),
    themeSelectors: () => import('../hooks/useThemeSelectors'),
    themeClassName: () => import('../hooks/useThemeClassName')
  },

  // Theme components (lazy loaded)
  components: {
    themeToggle: () => import('../components/theme/ThemeToggle'),
    themeAware: () => import('../components/theme/ThemeAwareComponent'),
    themePerformance: () => import('../components/theme/ThemePerformanceDemo')
  },

  // Theme utilities (lazy loaded)
  utilities: {
    themeUtils: () => import('./themeUtils')
  },

  // Theme animations (lazy loaded)
  animations: {
    // Animation utilities will be added when available
  },

  // Performance monitoring (lazy loaded)
  performance: {
    // Performance utilities will be added when available
  },

  // Advanced features (lazy loaded)
  advanced: {
    // Advanced features will be added when available
  }
};

// Register default theme chunks
registerThemeChunk('themeProvider', { type: 'core', priority: 'high', preload: true });
registerThemeChunk('useTheme', { type: 'core', priority: 'high', preload: true });
registerThemeChunk('themeSelectors', { type: 'core', priority: 'high', preload: true });
registerThemeChunk('themeClassName', { type: 'core', priority: 'high', preload: true });

registerThemeChunk('themeToggle', { type: 'components', priority: 'medium', dependencies: ['core'] });
registerThemeChunk('themeAwareComponent', { type: 'components', priority: 'medium', dependencies: ['core'] });
registerThemeChunk('lazyThemeComponents', { type: 'components', priority: 'low', dependencies: ['core'] });

registerThemeChunk('themeUtils', { type: 'utilities', priority: 'medium', dependencies: ['core'] });
registerThemeChunk('colorUtils', { type: 'utilities', priority: 'low' });
registerThemeChunk('cssVariables', { type: 'utilities', priority: 'low' });

registerThemeChunk('themeTransitions', { type: 'animations', priority: 'low', dependencies: ['utilities'] });
registerThemeChunk('motionPresets', { type: 'animations', priority: 'low' });

registerThemeChunk('themePerformanceDemo', { type: 'performance', priority: 'low', dependencies: ['core'] });
registerThemeChunk('performanceMonitor', { type: 'performance', priority: 'low' });

registerThemeChunk('themeCustomizer', { type: 'advanced', priority: 'low', dependencies: ['core', 'utilities'] });
registerThemeChunk('themeExport', { type: 'advanced', priority: 'low', dependencies: ['utilities'] });

// Theme chunk preloader
export class ThemeChunkPreloader {
  private static instance: ThemeChunkPreloader;
  private loadedChunks = new Set<string>();
  private loadingChunks = new Map<string, Promise<any>>();

  static getInstance(): ThemeChunkPreloader {
    if (!ThemeChunkPreloader.instance) {
      ThemeChunkPreloader.instance = new ThemeChunkPreloader();
    }
    return ThemeChunkPreloader.instance;
  }

  // Preload high priority chunks
  async preloadCriticalChunks(): Promise<void> {
    const criticalChunks = Array.from(themeChunkRegistry.entries())
      .filter(([_, config]) => config.priority === 'high' && config.preload)
      .map(([name]) => name);

    await Promise.all(criticalChunks.map(chunk => this.loadChunk(chunk)));
  }

  // Load a specific chunk
  async loadChunk(chunkName: string): Promise<any> {
    if (this.loadedChunks.has(chunkName)) {
      return Promise.resolve();
    }

    if (this.loadingChunks.has(chunkName)) {
      return this.loadingChunks.get(chunkName);
    }

    const config = getThemeChunkConfig(chunkName);
    if (!config) {
      console.warn(`Theme chunk '${chunkName}' not found in registry`);
      return Promise.resolve();
    }

    // Load dependencies first
    if (config.dependencies) {
      await Promise.all(
        config.dependencies.map(dep => this.loadChunksByType(dep))
      );
    }

    // Load the chunk
    const loadPromise = this.loadChunkByName(chunkName);
    this.loadingChunks.set(chunkName, loadPromise);

    try {
      const result = await loadPromise;
      this.loadedChunks.add(chunkName);
      this.loadingChunks.delete(chunkName);
      return result;
    } catch (error) {
      this.loadingChunks.delete(chunkName);
      console.error(`Failed to load theme chunk '${chunkName}':`, error);
      throw error;
    }
  }

  // Load chunks by type
  async loadChunksByType(type: ThemeChunkType): Promise<void> {
    const chunks = Array.from(themeChunkRegistry.entries())
      .filter(([_, config]) => config.type === type)
      .map(([name]) => name);

    await Promise.all(chunks.map(chunk => this.loadChunk(chunk)));
  }

  // Load chunk by name from loaders
  private async loadChunkByName(chunkName: string): Promise<any> {
    // Find the chunk in loaders
    for (const [category, loaders] of Object.entries(themeChunkLoaders)) {
      if (chunkName in loaders) {
        const loader = (loaders as any)[chunkName];
        return await loader();
      }
    }
    
    throw new Error(`Chunk loader not found for '${chunkName}'`);
  }

  // Get loading status
  getLoadingStatus(): {
    loaded: string[];
    loading: string[];
    total: number;
  } {
    return {
      loaded: Array.from(this.loadedChunks),
      loading: Array.from(this.loadingChunks.keys()),
      total: themeChunkRegistry.size
    };
  }

  // Clear cache
  clearCache(): void {
    this.loadedChunks.clear();
    this.loadingChunks.clear();
  }
}

// Utility functions
export const preloadThemeChunks = async (chunks: string[]): Promise<void> => {
  const preloader = ThemeChunkPreloader.getInstance();
  await Promise.all(chunks.map(chunk => preloader.loadChunk(chunk)));
};

export const preloadThemeChunksByType = async (type: ThemeChunkType): Promise<void> => {
  const preloader = ThemeChunkPreloader.getInstance();
  await preloader.loadChunksByType(type);
};

export const getThemeLoadingStatus = () => {
  const preloader = ThemeChunkPreloader.getInstance();
  return preloader.getLoadingStatus();
};

// HOC for chunk-aware components
export const withThemeChunkLoading = <P extends object>(
  chunkNames: string[],
  fallback?: ComponentType<any>
) => {
  return (WrappedComponent: ComponentType<P>) => {
    return React.forwardRef<any, P>((props, ref) => {
      const [chunksLoaded, setChunksLoaded] = React.useState(false);
      const [error, setError] = React.useState<Error | null>(null);

      React.useEffect(() => {
        const loadChunks = async () => {
          try {
            await preloadThemeChunks(chunkNames);
            setChunksLoaded(true);
          } catch (err) {
            setError(err as Error);
          }
        };

        loadChunks();
      }, []);

      if (error) {
        console.error('Failed to load theme chunks:', error);
        return fallback ? React.createElement(fallback) : null;
      }

      if (!chunksLoaded) {
        return fallback ? React.createElement(fallback) : null;
      }

      return React.createElement(WrappedComponent, { ...props, ref } as any);
    });
  };
};

// Export singleton instance
export const themeChunkPreloader = ThemeChunkPreloader.getInstance();