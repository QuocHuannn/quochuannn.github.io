import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Prevent infinite error loops and crash cascade
    if (this.state.hasError) {
      console.warn('ErrorBoundary: Preventing error cascade');
      return;
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Special handling for inspector errors - these are often non-critical
    if (this.isInspectorError(error)) {
      console.warn('Inspector-related error detected, attempting graceful recovery:', error.message);
      
      // Try to clear React DevTools references if they exist
      try {
        if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot;
          delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount;
        }
      } catch (cleanupError) {
        console.warn('Failed to cleanup React DevTools references:', cleanupError);
      }
    }
    
    // Report error to analytics in production (but not for inspector errors)
    if (import.meta.env.PROD && !this.isInspectorError(error)) {
      this.reportError(error, errorInfo);
    }

    // Log detailed error information in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Boundary Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.log('Error Type Detection:');
      console.log('- Error Type: General Application Error');
      console.log('- Is Inspector Error:', this.isInspectorError(error));
      console.groupEnd();
    }
  }

  // Error reporting method
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Skip reporting for inspector errors as they're usually non-critical
      if (this.isInspectorError(error)) {
        return;
      }

      // Google Analytics error tracking
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          custom_parameters: {
            error_type: 'general',
            component_stack: errorInfo.componentStack
          }
        });
      }

      // Custom error reporting service (replace with your service)
      if (typeof fetch !== 'undefined') {
        fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            errorType: 'general'
          })
        }).catch(() => {
          // Silently handle error reporting failures
        });
      }
    } catch (reportingError) {
      // Silently handle reporting errors
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  // Enhanced error detection methods


  private isInspectorError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    const errorStack = error.stack?.toLowerCase() || '';
    
    return (
      errorMessage.includes('inspector') ||
      errorMessage.includes('devtools') ||
      errorMessage.includes('__react_devtools') ||
      errorMessage.includes('cannot read properties of undefined') && errorMessage.includes('inspector') ||
      errorMessage.includes('fiber') && errorMessage.includes('undefined') ||
      errorMessage.includes('reading \'inspector\'') ||
      errorStack.includes('inspector') ||
      errorStack.includes('devtools') ||
      errorStack.includes('__react_devtools') ||
      errorStack.includes('fiberprovidermixin') ||
      errorStack.includes('canvaswrapper')
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error } = this.state;

      const isInspectorError = error ? this.isInspectorError(error) : false;

      // Special handling for inspector errors - minimal UI disruption
      if (isInspectorError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-lg shadow-lg p-6 text-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Developer Tools Issue
                </h2>
                <p className="text-gray-600 mb-4">
                  A minor issue with React DevTools was detected. The app should work normally after refreshing.
                </p>
                {import.meta.env.DEV && (
                  <div className="text-left bg-blue-50 p-3 rounded text-sm mb-4">
                    <p className="font-medium text-blue-800">Development Note:</p>
                    <p className="text-blue-700 text-xs mt-1">
                      This is typically caused by React DevTools inspector conflicts and is non-critical.
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh App
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        );
      }



      // General error fallback
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-lg shadow-lg p-6 text-center" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              {import.meta.env.DEV && error && (
                <details className="text-left bg-gray-50 p-3 rounded text-sm mb-4">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 text-xs overflow-auto">{error.message}</pre>
                  {error.stack && (
                    <pre className="mt-2 text-xs overflow-auto text-gray-500">{error.stack}</pre>
                  )}
                </details>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={this.handleRetry}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default ErrorBoundary;