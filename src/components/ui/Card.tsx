/**
 * Card Component - Design System
 * 
 * Reusable card container with variants and interactive states
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'glass';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Variant styles with CSS variables
    const getVariantStyles = (variant: CardVariant): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {
        borderStyle: 'solid',
        transition: 'all 200ms',
      };

      switch (variant) {
        case 'default':
          return {
            ...baseStyle,
            backgroundColor: 'var(--color-bg-primary)',
            borderWidth: '1px',
            borderColor: 'var(--color-border-primary)',
            boxShadow: 'var(--shadow-sm)',
          };
        case 'elevated':
          return {
            ...baseStyle,
            backgroundColor: 'var(--color-bg-primary)',
            borderWidth: '1px',
            borderColor: 'transparent',
            boxShadow: 'var(--shadow-lg)',
          };
        case 'outlined':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderWidth: '2px',
            borderColor: 'var(--color-border-secondary)',
          };
        case 'ghost':
          return {
            ...baseStyle,
            backgroundColor: 'var(--color-surface-secondary)',
            borderWidth: '1px',
            borderColor: 'transparent',
          };
        case 'glass':
          return {
            ...baseStyle,
            backgroundColor: 'var(--glass-bg)',
            borderWidth: '1px',
            borderColor: 'var(--glass-border)',
            backdropFilter: 'blur(12px)',
          };
        default:
          return baseStyle;
      }
    };

    const variantClassNames = {
      default: 'shadow-sm',
      elevated: 'hover:shadow-xl',
      outlined: '',
      ghost: '',
      glass: 'backdrop-blur-md',
    };

    // Padding styles
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-10',
    };

    // Hover styles
    const hoverStyles = hoverable
      ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-1'
      : '';

    // Clickable styles
    const clickableStyles = clickable
      ? 'cursor-pointer active:scale-[0.98]'
      : '';

    // Combined class names
    const cardClasses = `
      rounded-xl
      theme-transition-colors
      ${variantClassNames[variant]}
      ${paddingStyles[padding]}
      ${hoverStyles}
      ${clickableStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Motion props for interactive cards
    const motionProps = (hoverable || clickable)
      ? getThemeAwareMotionProps({
          whileHover: { y: -4 },
          whileTap: clickable ? { scale: 0.98 } : {},
          transition: { duration: 0.2, ease: 'easeOut' },
        })
      : {};

    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        style={getVariantStyles(variant)}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Subcomponents for better composition
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 
    className={`text-xl font-bold theme-transition-colors ${className}`}
    style={{ color: 'var(--color-text-primary)' }}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <p 
    className={`text-sm theme-transition-colors mt-1 ${className}`}
    style={{ color: 'var(--color-text-secondary)' }}
  >
    {children}
  </p>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div 
    className={`mt-4 pt-4 border-t theme-transition-colors ${className}`}
    style={{ borderColor: 'var(--color-border-primary)' }}
  >
    {children}
  </div>
);

export default Card;
