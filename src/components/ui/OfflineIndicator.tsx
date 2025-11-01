import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './Button';

interface OfflineIndicatorProps {
  showWhenOnline?: boolean;
  position?: 'top' | 'bottom';
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showWhenOnline = false,
  position = 'top',
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  const shouldShow = !isOnline || (showWhenOnline && showNotification);

  if (!shouldShow) return null;

  const positionClasses = {
    top: 'top-4',
    bottom: 'bottom-4'
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          className={`fixed left-1/2 transform -translate-x-1/2 ${positionClasses[position]} z-50 ${className}`}
        >
          <div className={`
            px-4 py-3 rounded-lg shadow-lg backdrop-blur-lg border
            ${isOnline 
              ? 'bg-green-500/90 border-green-400/50 text-white' 
              : 'bg-red-500/90 border-red-400/50 text-white'
            }
          `}>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {isOnline ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <WifiOff className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {isOnline ? 'Back online!' : 'You\'re offline'}
                </p>
                <p className="text-xs opacity-90">
                  {isOnline 
                    ? 'Your connection has been restored' 
                    : 'Some features may not be available'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Offline banner component
interface OfflineBannerProps {
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  onRetry,
  showRetryButton = true
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-yellow-500/90 backdrop-blur-lg border-b border-yellow-400/50"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-900" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                You're currently offline
              </p>
              <p className="text-xs text-yellow-800">
                Some features may not work properly until you reconnect
              </p>
            </div>
          </div>
          {showRetryButton && onRetry && (
            <Button
              onClick={onRetry}
              variant="secondary"
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Hook for online status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Offline-first data fetching hook
export const useOfflineFirst = <T,>({
  key,
  fetcher,
  fallbackData
}: {
  key: string;
  fetcher: () => Promise<T>;
  fallbackData?: T;
}) => {
  const [data, setData] = useState<T | undefined>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from cache first
        const cachedData = localStorage.getItem(`cache_${key}`);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setData(parsed.data);
          
          // If we have cached data and we're offline, use it
          if (!isOnline) {
            setLoading(false);
            return;
          }
        }

        // If online, try to fetch fresh data
        if (isOnline) {
          const freshData = await fetcher();
          setData(freshData);
          
          // Cache the fresh data
          localStorage.setItem(`cache_${key}`, JSON.stringify({
            data: freshData,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        setError(err as Error);
        
        // If fetch fails and we have cached data, use it
        const cachedData = localStorage.getItem(`cache_${key}`);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setData(parsed.data);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, isOnline]);

  const refetch = () => {
    if (isOnline) {
      setLoading(true);
      setError(null);
      // Re-run the effect
      const loadData = async () => {
        try {
          const freshData = await fetcher();
          setData(freshData);
          localStorage.setItem(`cache_${key}`, JSON.stringify({
            data: freshData,
            timestamp: Date.now()
          }));
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  };

  return { data, loading, error, refetch, isOnline };
};

export default OfflineIndicator;