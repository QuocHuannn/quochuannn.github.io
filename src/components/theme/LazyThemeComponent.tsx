import React, { Suspense, ComponentType, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useThemeClassName } from '../../hooks/useThemeClassName';
import { getThemeStyles } from '../../utils/themeUtils';

interface LazyThemeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  minHeight?: string;
  showSpinner?: boolean;
  delay?: number;
  themeAware?: boolean;
}

interface LazyThemeWrapperProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  props?: Record<string, any>;
  fallback?: ReactNode;
  className?: string;
  minHeight?: string;
  showSpinner?: boolean;
  delay?: number;
  themeAware?: boolean;
}

// Theme-aware loading component
const ThemeAwareFallback: React.FC<{ 
  minHeight?: string; 
  showSpinner?: boolean;
  themeAware?: boolean;
}> = ({ 
  minHeight = '200px', 
  showSpinner = true,
  themeAware = true
}) => {
  const themeClassName = useThemeClassName();
  const { actualTheme } = useTheme();
  
  const containerStyles = themeAware ? {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border)'
  } : {};

  const spinnerColor = actualTheme === 'dark' ? 'text-blue-400' : 'text-blue-500';
  const textColor = actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-center rounded-lg border ${themeClassName}`}
      style={{ minHeight, ...containerStyles }}
    >
      {showSpinner && (
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className={`w-8 h-8 ${spinnerColor}`} />
          </motion.div>
          <p className={`text-sm ${textColor}`}>Loading theme component...</p>
        </div>
      )}
    </motion.div>
  );
};

// Theme-aware skeleton loader
const ThemeAwareSkeleton: React.FC<{ 
  className?: string; 
  minHeight?: string;
  themeAware?: boolean;
}> = ({ 
  className = '', 
  minHeight = '200px',
  themeAware = true
}) => {
  const themeClassName = useThemeClassName();
  const { actualTheme } = useTheme();
  
  const skeletonBg = actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const containerStyles = themeAware ? {
    backgroundColor: 'var(--color-surface)',
    borderColor: 'var(--color-border)'
  } : {};

  return (
    <div 
      className={`animate-pulse rounded-lg border p-4 ${themeClassName} ${className}`} 
      style={{ minHeight, ...containerStyles }}
    >
      <div className="space-y-4">
        <div className={`h-4 ${skeletonBg} rounded w-3/4`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-1/2`}></div>
        <div className={`h-32 ${skeletonBg} rounded`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-2/3`}></div>
      </div>
    </div>
  );
};

// Error boundary for theme components
class ThemeErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode; themeAware?: boolean },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode; themeAware?: boolean }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyThemeComponent Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ThemeAwareFallback 
            minHeight="200px" 
            showSpinner={false}
            themeAware={this.props.themeAware}
          />
        )
      );
    }

    return this.props.children;
  }
}

// Main LazyThemeComponent wrapper
const LazyThemeComponent: React.FC<LazyThemeComponentProps> = ({
  children,
  fallback,
  className = '',
  minHeight = '200px',
  showSpinner = true,
  delay = 0,
  themeAware = true
}) => {
  const [shouldRender, setShouldRender] = React.useState(delay === 0);
  const themeClassName = useThemeClassName();

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldRender(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) {
    return fallback || (
      <ThemeAwareFallback 
        minHeight={minHeight} 
        showSpinner={showSpinner}
        themeAware={themeAware}
      />
    );
  }

  return (
    <ThemeErrorBoundary fallback={fallback} themeAware={themeAware}>
      <Suspense 
        fallback={
          fallback || (
            <ThemeAwareFallback 
              minHeight={minHeight} 
              showSpinner={showSpinner}
              themeAware={themeAware}
            />
          )
        }
      >
        <div className={`${themeAware ? themeClassName : ''} ${className}`}>
          {children}
        </div>
      </Suspense>
    </ThemeErrorBoundary>
  );
};

// HOC for creating lazy theme components
const withLazyThemeLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallbackComponent?: ReactNode,
  options?: {
    minHeight?: string;
    showSpinner?: boolean;
    delay?: number;
    themeAware?: boolean;
  }
) => {
  const LazyLoadedComponent = React.lazy(importFunc);
  
  return React.forwardRef<any, P>((props, ref) => (
    <LazyThemeComponent
      fallback={fallbackComponent}
      minHeight={options?.minHeight}
      showSpinner={options?.showSpinner}
      delay={options?.delay}
      themeAware={options?.themeAware}
    >
      <LazyLoadedComponent {...props} ref={ref} />
    </LazyThemeComponent>
  ));
};

// Utility function for creating lazy theme components
const createLazyThemeComponent = ({
  component,
  props = {},
  fallback,
  className = '',
  minHeight = '200px',
  showSpinner = true,
  delay = 0,
  themeAware = true
}: LazyThemeWrapperProps) => {
  const LazyLoadedComponent = React.lazy(component);
  
  return (
    <LazyThemeComponent
      fallback={fallback}
      className={className}
      minHeight={minHeight}
      showSpinner={showSpinner}
      delay={delay}
      themeAware={themeAware}
    >
      <LazyLoadedComponent {...props} />
    </LazyThemeComponent>
  );
};

// Pre-configured lazy theme components
export const LazyThemeToggle = withLazyThemeLoading(
  () => import('./ThemeToggle'),
  <ThemeAwareFallback minHeight="40px" showSpinner={false} />,
  { minHeight: '40px', themeAware: true }
);

export const LazyThemePerformanceDemo = withLazyThemeLoading(
  () => import('./ThemePerformanceDemo'),
  <ThemeAwareSkeleton minHeight="300px" />,
  { minHeight: '300px', themeAware: true, delay: 100 }
);

export const LazyThemeAwareComponent = withLazyThemeLoading(
  () => import('./ThemeAwareComponent'),
  <ThemeAwareSkeleton minHeight="200px" />,
  { minHeight: '200px', themeAware: true }
);

export default LazyThemeComponent;
export { 
  withLazyThemeLoading, 
  createLazyThemeComponent, 
  ThemeAwareSkeleton, 
  ThemeAwareFallback 
};