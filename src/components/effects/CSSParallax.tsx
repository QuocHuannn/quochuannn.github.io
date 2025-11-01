/**
 * CSS-Only Parallax Component
 *
 * Ultra-lightweight parallax using pure CSS
 * No JavaScript, no scroll listeners
 * Best for background elements
 */

import React from 'react';

interface CSSParallaxProps {
  children: React.ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}

const CSSParallax: React.FC<CSSParallaxProps> = ({
  children,
  speed = 'medium',
  className = ''
}) => {
  const speedMap = {
    slow: '0.1',
    medium: '0.3',
    fast: '0.5'
  };

  return (
    <div
      className={`parallax-element ${className}`}
      style={{
        transform: 'translateZ(0)', // Force GPU layer
        // @ts-ignore - CSS custom property
        '--parallax-speed': speedMap[speed]
      }}
      data-speed={speed}
    >
      {children}
    </div>
  );
};

export default CSSParallax;