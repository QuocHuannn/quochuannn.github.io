import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useThemeClassName } from '../../hooks/useThemeClassName';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outline?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  outline = false,
  removable = false,
  onRemove,
  className = '',
  icon
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-200';
  
  const getVariantStyles = (variant: string, outline: boolean) => {
    const styles: React.CSSProperties = {};
    
    switch (variant) {
      case 'default':
        if (outline) {
          styles.borderColor = 'var(--color-border)';
          styles.color = 'var(--color-text-secondary)';
          styles.backgroundColor = 'transparent';
        } else {
          styles.backgroundColor = 'var(--color-surface)';
          styles.color = 'var(--color-text-primary)';
        }
        break;
      case 'primary':
        if (outline) {
          styles.borderColor = 'var(--color-primary)';
          styles.color = 'var(--color-primary)';
          styles.backgroundColor = 'transparent';
        } else {
          styles.backgroundColor = 'var(--color-primary)';
          styles.color = 'var(--color-primary-foreground)';
        }
        break;
      case 'secondary':
        if (outline) {
          styles.borderColor = 'var(--color-secondary)';
          styles.color = 'var(--color-secondary)';
          styles.backgroundColor = 'transparent';
        } else {
          styles.backgroundColor = 'var(--color-secondary)';
          styles.color = 'var(--color-secondary-foreground)';
        }
        break;
      case 'success':
        if (outline) {
          styles.borderColor = 'var(--color-success)';
          styles.color = 'var(--color-success)';
          styles.backgroundColor = 'transparent';
        } else {
          styles.backgroundColor = 'var(--color-success-muted)';
          styles.color = 'var(--color-success)';
        }
        break;
      case 'warning':
        if (outline) {
          styles.borderColor = 'var(--color-warning)';
          styles.color = 'var(--color-warning)';
          styles.backgroundColor = 'transparent';
        } else {
          styles.backgroundColor = 'var(--color-warning-muted)';
          styles.color = 'var(--color-warning)';
        }
        break;
      case 'danger':
        if (outline) {
          styles.borderColor = 'var(--color-destructive)';
          styles.color = 'var(--color-destructive)';
          styles.backgroundColor = 'transparent';
        } else {
          styles.backgroundColor = 'var(--color-destructive-muted)';
          styles.color = 'var(--color-destructive)';
        }
        break;
      case 'info':
        if (outline) {
          styles.borderColor = 'var(--color-primary)';
          styles.color = 'var(--color-primary)';
          styles.backgroundColor = 'transparent';
        } else {
          styles.backgroundColor = 'var(--color-primary-muted)';
          styles.color = 'var(--color-primary)';
        }
        break;
    }
    
    return styles;
  };
  
  const variantStyles = getVariantStyles(variant, outline);
  const baseClassesOnly = outline ? 'border' : '';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2'
  };
  
  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  
  const combinedClasses = `${baseClasses} ${baseClassesOnly} ${sizeClasses[size]} ${roundedClass} ${className}`;
  
  return (
    <motion.span
      className={combinedClasses}
      style={variantStyles}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      {...getThemeAwareMotionProps({
        whileHover: { scale: 1.05 },
        transition: { duration: 0.1, ease: 'easeOut' }
      })}
    >
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 flex-shrink-0 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          type="button"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </motion.span>
  );
};

export default Badge;