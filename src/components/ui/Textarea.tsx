import React, { forwardRef, useState, useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  showCharCount?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((
  {
    label,
    error,
    fullWidth = false,
    showCharCount = false,
    resize = 'vertical',
    maxLength,
    value,
    onChange,
    helperText,
    className = '',
    id,
    ...props
  },
  ref
) => {
  const textareaId = useId();
  const errorId = useId();
  const helperTextId = useId();
  const charCountId = useId();
  const finalId = id || textareaId;
  const [charCount, setCharCount] = useState(0);
  
  const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200';
  const resizeClasses = {
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y'
  };
  
  const textareaClasses = `
    ${baseClasses}
    ${resizeClasses[resize]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  const textareaStyles: React.CSSProperties = {
    borderColor: error ? 'var(--color-destructive)' : 'var(--color-border)',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text-primary)',
    '--tw-ring-color': error ? 'var(--color-destructive)' : 'var(--color-primary)'
  } as React.CSSProperties;
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    if (onChange) {
      onChange(e);
    }
  };
  
  React.useEffect(() => {
    if (typeof value === 'string') {
      setCharCount(value.length);
    }
  }, [value]);
  
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
      
      <textarea
        ref={ref}
        id={finalId}
        className={textareaClasses}
        style={textareaStyles}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[
          error ? errorId : null,
          helperText ? helperTextId : null,
          showCharCount && maxLength ? charCountId : null
        ].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      
      <div className="flex justify-between items-center mt-1">
        {error && (
          <p 
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm"
            style={{ color: 'var(--color-destructive)' }}
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            id={helperTextId}
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {helperText}
          </p>
        )}
        
        {showCharCount && maxLength && (
          <p 
            id={charCountId}
            className="text-sm ml-auto"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label={`Character count: ${charCount} of ${maxLength}`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';