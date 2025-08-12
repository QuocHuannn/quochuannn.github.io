import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const getButtonStyles = (variant: keyof typeof buttonVariants) => {
    const styles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-foreground)',
        borderColor: 'transparent',
        boxShadow: 'var(--shadow-md)'
      },
      secondary: {
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-secondary-foreground)',
        borderColor: 'var(--color-border)'
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
        borderColor: 'var(--color-border)'
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
        borderColor: 'transparent'
      },
      destructive: {
        backgroundColor: 'var(--color-destructive)',
        color: 'var(--color-destructive-foreground)',
        borderColor: 'transparent',
        boxShadow: 'var(--shadow-md)'
      }
    };
    return styles[variant] || styles.primary;
  };

  const buttonVariants = {
    primary: 'border-transparent shadow-md hover:shadow-lg transition-all duration-200',
    secondary: 'border transition-all duration-200',
    outline: 'border hover:shadow-sm transition-all duration-200',
    ghost: 'border-transparent hover:shadow-sm transition-all duration-200',
    destructive: 'border-transparent shadow-md hover:shadow-lg transition-all duration-200'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  const isDisabled = disabled || loading;

  const buttonStyle = getButtonStyles(variant);
  
  // Get optimized motion props that respect theme transitions
  const motionProps = getThemeAwareMotionProps({
    whileHover: !isDisabled ? { scale: 1.02 } : {},
    whileTap: !isDisabled ? { scale: 0.98 } : {},
    transition: { duration: 0.1, ease: 'easeOut' }
  });

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${buttonVariants[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        ...buttonStyle,
        '--focus-ring-color': 'var(--color-primary)',
        '--hover-transform': 'scale(1.02)'
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)';
        } else if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        } else if (variant === 'destructive') {
          e.currentTarget.style.backgroundColor = 'var(--color-destructive-hover)';
        }
      }}
      onMouseLeave={(e) => {
        const originalStyle = getButtonStyles(variant);
        e.currentTarget.style.backgroundColor = originalStyle.backgroundColor || '';
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }
      }}
      disabled={isDisabled}
      {...motionProps}
      {...(props as any)}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && leftIcon && leftIcon}
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
      {!loading && rightIcon && rightIcon}
    </motion.button>
  );
};

// Icon Button variant
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <Button
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

// Button Group component
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = ''
}) => {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  return (
    <div className={`inline-flex ${orientationClasses[orientation]} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          let additionalClasses = '';
          
          if (orientation === 'horizontal') {
            if (!isFirst && !isLast) {
              additionalClasses = 'rounded-none border-l-0';
            } else if (isFirst) {
              additionalClasses = 'rounded-r-none';
            } else if (isLast) {
              additionalClasses = 'rounded-l-none border-l-0';
            }
          } else {
            if (!isFirst && !isLast) {
              additionalClasses = 'rounded-none border-t-0';
            } else if (isFirst) {
              additionalClasses = 'rounded-b-none';
            } else if (isLast) {
              additionalClasses = 'rounded-t-none border-t-0';
            }
          }

          return React.cloneElement(child as React.ReactElement<any>, {
            className: `${(child as any).props.className || ''} ${additionalClasses}`.trim()
          });
        }
        return child;
      })}
    </div>
  );
};

export { Button };
export default Button;