import React, { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    leftIcon,
    rightIcon,
    fullWidth = false,
    helperText,
    className = '',
    id,
    ...props
  },
  ref
) => {
  const inputId = useId();
  const errorId = useId();
  const helperTextId = useId();
  const finalId = id || inputId;
  const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200';
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  const inputClasses = `
    ${baseClasses}
    ${iconPadding}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const inputStyles: React.CSSProperties = {
    borderColor: error ? 'var(--color-destructive)' : 'var(--color-border)',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text-primary)',
    '--tw-ring-color': error ? 'var(--color-destructive)' : 'var(--color-primary)'
  } as React.CSSProperties;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={finalId}
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
          {props.required && <span className="ml-1" style={{ color: 'var(--color-destructive)' }} aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span style={{ color: 'var(--color-text-muted)' }}>{leftIcon}</span>
          </div>
        )}
        
        <motion.input
          ref={ref}
          id={finalId}
          className={inputClasses}
          style={inputStyles}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileFocus={{ scale: 1.02 }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[
            error ? errorId : null,
            helperText ? helperTextId : null
          ].filter(Boolean).join(' ') || undefined}
          {...(props as any)}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span style={{ color: 'var(--color-text-muted)' }}>{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-1 text-sm"
          style={{ color: 'var(--color-destructive)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p
          id={helperTextId}
          className="mt-1 text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;