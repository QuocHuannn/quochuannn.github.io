import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ 
  children, 
  className = '', 
  offset = 50 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: offset, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxContainer;