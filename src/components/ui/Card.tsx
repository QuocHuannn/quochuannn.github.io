import React from 'react';
import { motion } from 'framer-motion';
import { useThemeClassName } from '../../hooks/useThemeClassName';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick
}) => {
  const baseClasses = 'rounded-lg transition-all duration-300';
  
  const getVariantStyles = (variant: string) => {
    const styles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      },
      glass: {
        backgroundColor: 'var(--color-surface-glass)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border-glass)',
        boxShadow: 'var(--shadow-md)'
      },
      elevated: {
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-lg)'
      },
      bordered: {
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderWidth: '2px'
      }
    };
    return styles[variant] || styles.default;
  };

  const variantClasses = {
    default: 'border transition-colors',
    glass: 'backdrop-blur-sm border transition-colors',
    elevated: 'transition-shadow hover:shadow-xl',
    bordered: 'border-2 transition-colors'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`;
  const variantStyle = getVariantStyles(variant);
  
  const MotionComponent = motion.div;
  
  return (
    <MotionComponent
      className={combinedClasses}
      style={variantStyle}
      onClick={onClick}
      {...getThemeAwareMotionProps({
        whileHover: hover ? { y: -4, scale: 1.02 } : undefined,
        whileTap: clickable ? { scale: 0.98 } : undefined,
        transition: { duration: 0.15, ease: 'easeOut' }
      })}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </MotionComponent>
  );
};

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`border-b pb-3 mb-4 ${className}`}
      style={{
        borderBottomColor: 'var(--color-border)',
        color: 'var(--color-text-primary)'
      }}
    >
      {children}
    </div>
  );
};

// Card Title Component
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className = '', 
  as: Component = 'h3' 
}) => {
  const baseClasses = 'font-semibold';
  const sizeClasses = {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-xl',
    h4: 'text-lg',
    h5: 'text-base',
    h6: 'text-sm'
  };
  
  return (
    <Component 
      className={`${baseClasses} ${sizeClasses[Component]} ${className}`}
      style={{
        color: 'var(--color-text-primary)'
      }}
    >
      {children}
    </Component>
  );
};

// Card Description Component
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p 
      className={`text-sm mt-1 ${className}`}
      style={{
        color: 'var(--color-text-secondary)'
      }}
    >
      {children}
    </p>
  );
};

// Card Content Component
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={className}
      style={{
        color: 'var(--color-text-secondary)'
      }}
    >
      {children}
    </div>
  );
};

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`border-t pt-3 mt-4 ${className}`}
      style={{
        borderTopColor: 'var(--color-border)',
        color: 'var(--color-text-secondary)'
      }}
    >
      {children}
    </div>
  );
};

export default Card;