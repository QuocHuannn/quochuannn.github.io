import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = ''
}) => {
  const { scrollYProgress } = useScroll();
  
  const getTransform = () => {
    const offset = speed * 100;
    
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [0, -offset]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [0, offset]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [0, -offset]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [0, offset]);
      default:
        return useTransform(scrollYProgress, [0, 1], [0, -offset]);
    }
  };
  
  const transform = getTransform();
  
  const getStyle = () => {
    if (direction === 'left' || direction === 'right') {
      return { x: transform };
    }
    return { y: transform };
  };
  
  return (
    <motion.div
      className={className}
      style={getStyle()}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxContainer;