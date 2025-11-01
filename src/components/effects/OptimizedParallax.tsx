/**
 * Optimized Parallax Component
 *
 * Performance improvements:
 * - CSS-based parallax for simple cases
 * - Disabled on mobile devices
 * - Uses central ScrollManager
 * - Minimal re-renders
 */

import React, { useEffect, useRef, useState } from 'react';
import ScrollManager from '../navigation/ScrollManager';

interface OptimizedParallaxProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down'; // Simplified - only vertical
  className?: string;
  disableOnMobile?: boolean;
}

const OptimizedParallax: React.FC<OptimizedParallaxProps> = ({
  children,
  speed = 0.2,
  direction = 'up',
  className = '',
  disableOnMobile = true
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Skip parallax on mobile if disabled
    if (disableOnMobile && isMobile) {
      return;
    }

    const scrollManager = ScrollManager.getInstance();
    const element = elementRef.current;

    if (!element) return;

    const updateParallax = (scrollY: number) => {
      const elementTop = element.offsetTop;
      const windowHeight = window.innerHeight;

      // Only calculate if element is in or near viewport
      if (scrollY + windowHeight > elementTop - 200 && scrollY < elementTop + element.offsetHeight + 200) {
        const multiplier = direction === 'down' ? 1 : -1;
        const parallaxOffset = (scrollY - elementTop) * speed * multiplier;
        setOffset(parallaxOffset);
      }
    };

    const unsubscribe = scrollManager.subscribe(updateParallax);

    return () => {
      unsubscribe();
    };
  }, [speed, direction, isMobile, disableOnMobile]);

  // Skip parallax on mobile
  if (disableOnMobile && isMobile) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className={`${className} parallax-element`}
      style={{
        transform: `translate3d(0, ${offset}px, 0)`,
      }}
    >
      {children}
    </div>
  );
};

export default OptimizedParallax;