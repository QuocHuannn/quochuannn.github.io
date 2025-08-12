import React, { Suspense, ComponentType, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  minHeight?: string;
  showSpinner?: boolean;
  delay?: number;
}

interface LazyWrapperProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  props?: Record<string, any>;
  fallback?: ReactNode;
  className?: string;
  minHeight?: string;
  showSpinner?: boolean;
  delay?: number;
}

// Default loading component
const DefaultFallback: React.FC<{ minHeight?: string; showSpinner?: boolean }> = ({ 
  minHeight = '200px', 
  showSpinner = true 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`flex items-center justify-center bg-gray-50/50 rounded-lg`}
    style={{ minHeight }}
  >
    {showSpinner && (
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-blue-500" />
        </motion.div>
        <p className="text-sm text-gray-500">Loading component...</p>
      </div>
    )}
  </motion.div>
);

// Skeleton loading component
const SkeletonLoader: React.FC<{ className?: string; minHeight?: string }> = ({ 
  className = '', 
  minHeight = '200px' 
}) => (
  <div className={`animate-pulse ${className}`} style={{ minHeight }}>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyComponent Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[200px] bg-red-50 rounded-lg border border-red-200">
            <div className="text-center text-red-600">
              <p className="font-medium">Failed to load component</p>
              <p className="text-sm mt-1">Please try refreshing the page</p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Main LazyComponent wrapper
const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback,
  className = '',
  minHeight = '200px',
  showSpinner = true,
  delay = 0
}) => {
  const [shouldRender, setShouldRender] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldRender(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) {
    return fallback || <DefaultFallback minHeight={minHeight} showSpinner={showSpinner} />;
  }

  return (
    <LazyErrorBoundary fallback={fallback}>
      <Suspense 
        fallback={
          fallback || <DefaultFallback minHeight={minHeight} showSpinner={showSpinner} />
        }
      >
        <div className={className}>
          {children}
        </div>
      </Suspense>
    </LazyErrorBoundary>
  );
};

// HOC for creating lazy components
const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallbackComponent?: ReactNode,
  options?: {
    minHeight?: string;
    showSpinner?: boolean;
    delay?: number;
  }
) => {
  const LazyLoadedComponent = React.lazy(importFunc);
  
  return React.forwardRef<any, P>((props, ref) => (
    <LazyComponent
      fallback={fallbackComponent}
      minHeight={options?.minHeight}
      showSpinner={options?.showSpinner}
      delay={options?.delay}
    >
      <LazyLoadedComponent {...props} ref={ref} />
    </LazyComponent>
  ));
};

// Utility function for creating lazy components with custom loading
const createLazyComponent = ({
  component,
  props = {},
  fallback,
  className = '',
  minHeight = '200px',
  showSpinner = true,
  delay = 0
}: LazyWrapperProps) => {
  const LazyLoadedComponent = React.lazy(component);
  
  return (
    <LazyComponent
      fallback={fallback}
      className={className}
      minHeight={minHeight}
      showSpinner={showSpinner}
      delay={delay}
    >
      <LazyLoadedComponent {...props} />
    </LazyComponent>
  );
};

export default LazyComponent;
export { withLazyLoading, createLazyComponent, SkeletonLoader, DefaultFallback };