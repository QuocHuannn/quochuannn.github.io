import React, { useEffect, useState, createContext, useContext } from 'react';
import { preloadCriticalTheme, preloadThemeComponents, preloadAdvancedTheme } from '../../theme/optimized';
import { themeImportOptimizer } from '../../utils/themeBundleOptimizer';

// Preloader context
interface ThemePreloaderContextType {
  isLoading: boolean;
  loadedModules: string[];
  error: string | null;
  preloadModule: (moduleName: string) => Promise<void>;
  preloadBatch: (moduleNames: string[]) => Promise<void>;
}

const ThemePreloaderContext = createContext<ThemePreloaderContextType | null>(null);

// Hook to use theme preloader
export const useThemePreloader = () => {
  const context = useContext(ThemePreloaderContext);
  if (!context) {
    throw new Error('useThemePreloader must be used within ThemePreloader');
  }
  return context;
};

// Preloader strategies
export type PreloadStrategy = 'critical' | 'components' | 'advanced' | 'all' | 'none';

interface ThemePreloaderProps {
  children: React.ReactNode;
  strategy?: PreloadStrategy;
  preloadOnIdle?: boolean;
  preloadOnHover?: boolean;
  customModules?: string[];
  onPreloadComplete?: (loadedModules: string[]) => void;
  onError?: (error: Error) => void;
}

export const ThemePreloader: React.FC<ThemePreloaderProps> = ({
  children,
  strategy = 'critical',
  preloadOnIdle = true,
  preloadOnHover = false,
  customModules = [],
  onPreloadComplete,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedModules, setLoadedModules] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Preload individual module
  const preloadModule = async (moduleName: string) => {
    try {
      setIsLoading(true);
      await themeImportOptimizer.importThemeModule(moduleName as any);
      setLoadedModules(prev => [...prev, moduleName]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to preload module';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Preload batch of modules
  const preloadBatch = async (moduleNames: string[]) => {
    try {
      setIsLoading(true);
      await themeImportOptimizer.importThemeModules(moduleNames as any);
      setLoadedModules(prev => [...prev, ...moduleNames]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to preload modules';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Execute preload strategy
  const executePreloadStrategy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let loadedCount = 0;
      
      switch (strategy) {
        case 'critical':
          await preloadCriticalTheme();
          loadedCount = 3; // useActualTheme, useIsDarkMode, useThemeToggle
          break;
          
        case 'components':
          await preloadCriticalTheme();
          await preloadThemeComponents();
          loadedCount = 5; // critical + ThemeToggle, themeUtils
          break;
          
        case 'advanced':
          await preloadCriticalTheme();
          await preloadThemeComponents();
          await preloadAdvancedTheme();
          loadedCount = 8; // all modules
          break;
          
        case 'all':
          await Promise.all([
            preloadCriticalTheme(),
            preloadThemeComponents(),
            preloadAdvancedTheme(),
            themeImportOptimizer.preloadCommonModules()
          ]);
          loadedCount = 12; // all available modules
          break;
          
        case 'none':
        default:
          // No preloading
          break;
      }
      
      // Load custom modules if specified
      if (customModules.length > 0) {
        await preloadBatch(customModules);
        loadedCount += customModules.length;
      }
      
      const moduleNames = Array.from({ length: loadedCount }, (_, i) => `module-${i}`);
      setLoadedModules(moduleNames);
      onPreloadComplete?.(moduleNames);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Preload strategy failed';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Preload on idle using requestIdleCallback
  useEffect(() => {
    if (!preloadOnIdle || strategy === 'none') return;
    
    const preloadOnIdleCallback = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          executePreloadStrategy();
        }, { timeout: 5000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(executePreloadStrategy, 100);
      }
    };
    
    preloadOnIdleCallback();
  }, [strategy, preloadOnIdle]);

  // Preload on hover events
  useEffect(() => {
    if (!preloadOnHover || strategy === 'none') return;
    
    const handleMouseEnter = () => {
      if (loadedModules.length === 0) {
        executePreloadStrategy();
      }
    };
    
    // Add hover listeners to theme-related elements
    const themeElements = document.querySelectorAll('[data-theme-trigger]');
    themeElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter, { once: true });
    });
    
    return () => {
      themeElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
      });
    };
  }, [preloadOnHover, loadedModules.length]);

  const contextValue: ThemePreloaderContextType = {
    isLoading,
    loadedModules,
    error,
    preloadModule,
    preloadBatch
  };

  return (
    <ThemePreloaderContext.Provider value={contextValue}>
      {children}
    </ThemePreloaderContext.Provider>
  );
};

// HOC for components that need theme preloading
export const withThemePreloader = <P extends object>(
  Component: React.ComponentType<P>,
  preloadOptions?: Partial<ThemePreloaderProps>
) => {
  const WrappedComponent = (props: P) => (
    <ThemePreloader {...preloadOptions}>
      <Component {...props} />
    </ThemePreloader>
  );
  
  WrappedComponent.displayName = `withThemePreloader(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Preloader status component
export const ThemePreloaderStatus: React.FC<{ showDetails?: boolean }> = ({ showDetails = false }) => {
  const { isLoading, loadedModules, error } = useThemePreloader();
  
  if (!showDetails && !isLoading && !error) return null;
  
  return (
    <div className="theme-preloader-status" data-testid="theme-preloader-status">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          Loading theme modules...
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          Theme preload error: {error}
        </div>
      )}
      
      {showDetails && !isLoading && (
        <div className="text-xs text-muted-foreground">
          Loaded {loadedModules.length} theme modules
        </div>
      )}
    </div>
  );
};

export default ThemePreloader;