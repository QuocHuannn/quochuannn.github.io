import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const getColorStyles = (color: 'primary' | 'secondary' | 'white' | 'gray'): React.CSSProperties => {
  switch (color) {
    case 'primary':
      return { color: 'var(--color-primary)' };
    case 'secondary':
      return { color: 'var(--color-secondary)' };
    case 'white':
      return { color: 'var(--color-background)' };
    case 'gray':
      return { color: 'var(--color-text-muted)' };
    default:
      return { color: 'var(--color-primary)' };
  }
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  className = ''
}) => {
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        className={sizeClasses[size]}
        style={getColorStyles(color)}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm font-medium"
          style={getColorStyles(color)}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
        style={{ backgroundColor: 'var(--color-overlay)' }}
      >
        <div 
          className="backdrop-blur-lg rounded-2xl p-8 border"
          style={{ 
            backgroundColor: 'var(--color-surface-glass)',
            borderColor: 'var(--color-border-glass)'
          }}
        >
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Skeleton loader component
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = false,
  animate = true
}) => {
  const baseClasses = '';
  const animationClasses = animate ? 'animate-pulse' : '';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${animationClasses} ${roundedClasses} ${className}`}
      style={{
        ...style,
        backgroundColor: 'var(--color-surface-muted)'
      }}
    />
  );
};

// Page loading component
interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, var(--color-background-dark), var(--color-primary-dark), var(--color-secondary-dark))'
      }}
    >
      <div className="text-center">
        <LoadingSpinner size="xl" color="white" text={message} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-hover)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Button loading state
interface ButtonLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  size = 'sm',
  color = 'white'
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={sizeClasses[size]}
      style={getColorStyles(color)}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
};

// Card skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div 
      className="backdrop-blur-lg rounded-2xl p-6 border"
      style={{
        backgroundColor: 'var(--color-surface-glass)',
        borderColor: 'var(--color-border-glass)'
      }}
    >
      <Skeleton height={200} className="mb-4" />
      <Skeleton height={24} className="mb-2" />
      <Skeleton height={16} width="80%" className="mb-4" />
      <div className="flex space-x-2">
        <Skeleton height={32} width={80} rounded />
        <Skeleton height={32} width={80} rounded />
      </div>
    </div>
  );
};

export default LoadingSpinner;