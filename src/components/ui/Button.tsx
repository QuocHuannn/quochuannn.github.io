/**
 * Button Component - Design System
 * 
 * Reusable, accessible button with multiple variants
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Variant styles with CSS variables
    const getVariantStyles = (variant: ButtonVariant): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {
        borderWidth: '2px',
        borderStyle: 'solid',
        transition: 'all 150ms',
      };

      switch (variant) {
        case 'primary':
          return {
            ...baseStyle,
            backgroundColor: 'var(--color-accent-primary)',
            color: 'var(--color-text-inverse)',
            borderColor: 'var(--color-accent-primary)',
          };
        case 'secondary':
          return {
            ...baseStyle,
            backgroundColor: 'var(--color-surface-secondary)',
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-primary)',
          };
        case 'outline':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-secondary)',
          };
        case 'ghost':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            color: 'var(--color-text-primary)',
            borderColor: 'transparent',
          };
        case 'danger':
          return {
            ...baseStyle,
            backgroundColor: 'var(--color-error)',
            color: 'var(--color-text-inverse)',
            borderColor: 'var(--color-error)',
          };
        default:
          return baseStyle;
      }
    };

    const variantClassNames = {
      primary: 'hover:opacity-90 active:opacity-80 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
      outline: 'hover:bg-[var(--color-hover-overlay)] active:bg-[var(--color-active-overlay)] disabled:opacity-50 disabled:cursor-not-allowed',
      ghost: 'hover:bg-[var(--color-hover-overlay)] active:bg-[var(--color-active-overlay)] disabled:opacity-50 disabled:cursor-not-allowed',
      danger: 'hover:opacity-90 active:opacity-80 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-xl',
      xl: 'px-8 py-4 text-xl rounded-2xl',
    };

    // Combined class names
    const buttonClasses = `
      inline-flex items-center justify-center gap-2
      font-semibold
      theme-transition-colors
      focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-2
      ${variantClassNames[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Motion props
    const motionProps = getThemeAwareMotionProps({
      whileHover: disabled || isLoading ? {} : { scale: 1.02, y: -2 },
      whileTap: disabled || isLoading ? {} : { scale: 0.98 },
      transition: { duration: 0.15, ease: 'easeOut' },
    });

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        style={getVariantStyles(variant)}
        disabled={disabled || isLoading}
        {...motionProps}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
