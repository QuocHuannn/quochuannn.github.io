/**
 * Container Component - Design System
 * 
 * Responsive container with consistent max-width and padding
 */

import React from 'react';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

export interface ContainerProps {
  size?: ContainerSize;
  padding?: ContainerPadding;
  center?: boolean;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
}

const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  padding = 'md',
  center = true,
  children,
  className = '',
  as: Component = 'div',
}) => {
  // Max-width styles based on size
  const sizeStyles = {
    sm: 'max-w-2xl',    // 672px
    md: 'max-w-4xl',    // 896px
    lg: 'max-w-6xl',    // 1152px
    xl: 'max-w-7xl',    // 1280px
    full: 'max-w-full',
  };

  // Padding styles
  const paddingStyles = {
    none: 'px-0',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };

  // Center styles
  const centerStyles = center ? 'mx-auto' : '';

  // Combined class names
  const containerClasses = `
    w-full
    ${sizeStyles[size]}
    ${paddingStyles[padding]}
    ${centerStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component className={containerClasses}>
      {children}
    </Component>
  );
};

export default Container;
