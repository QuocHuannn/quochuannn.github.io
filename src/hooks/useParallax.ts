import { useEffect, useState } from 'react';
import { useTransform, useScroll, MotionValue } from 'framer-motion';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: number;
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up', offset = 0 } = options;
  const { scrollY } = useScroll();
  
  const transform = useTransform(
    scrollY,
    [0, 1000],
    direction === 'up' 
      ? [offset, offset - (1000 * speed)]
      : direction === 'down'
      ? [offset, offset + (1000 * speed)]
      : direction === 'left'
      ? [offset, offset - (1000 * speed)]
      : [offset, offset + (1000 * speed)]
  );
  
  return transform;
};

export const useParallaxElement = (element: HTMLElement | null, speed: number = 0.5) => {
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const { scrollY } = useScroll();
  
  useEffect(() => {
    if (!element) return;
    
    const onResize = () => {
      setElementTop(element.offsetTop);
      setClientHeight(window.innerHeight);
    };
    
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [element]);
  
  const y = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + element?.offsetHeight || 0],
    [0, -(element?.offsetHeight || 0) * speed]
  );
  
  return y;
};

export const useMouseParallax = (strength: number = 0.1) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * strength;
      const y = (e.clientY - window.innerHeight / 2) * strength;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);
  
  return mousePosition;
};

export const createParallaxVariants = (speed: number = 0.5) => {
  return {
    initial: { y: 0 },
    animate: { 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 30
      }
    },
    parallax: {
      y: (scrollY: MotionValue<number>) => {
        return useTransform(scrollY, [0, 1000], [0, -1000 * speed]);
      }
    }
  };
};