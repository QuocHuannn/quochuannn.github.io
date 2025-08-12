import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ParallaxContainer from './ParallaxContainer';

interface ParallaxBackgroundProps {
  className?: string;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ className = '' }) => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Floating geometric shapes */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-20 left-10 w-32 h-32 opacity-10"
      >
        <div className="w-full h-full bg-gradient-to-br from-accent-blue to-accent-purple rounded-full blur-sm" />
      </motion.div>
      
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute top-40 right-20 w-24 h-24 opacity-15"
      >
        <div className="w-full h-full bg-gradient-to-br from-accent-green to-accent-orange transform rotate-45 blur-sm" />
      </motion.div>
      
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-32 left-1/4 w-40 h-40 opacity-8"
      >
        <div className="w-full h-full bg-gradient-to-br from-accent-purple to-accent-blue rounded-full blur-lg" />
      </motion.div>
      
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-1/2 right-10 w-20 h-20 opacity-12"
      >
        <div className="w-full h-full bg-gradient-to-br from-accent-orange to-accent-green transform rotate-12 blur-sm" />
      </motion.div>
      
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 right-1/3 w-28 h-28 opacity-10"
      >
        <div className="w-full h-full bg-gradient-to-br from-accent-blue to-accent-green rounded-full blur-md" />
      </motion.div>
      
      {/* Gradient overlays */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-accent-blue/5 to-transparent"
      />
      
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-accent-purple/5 to-transparent"
      />
    </div>
  );
};

export default ParallaxBackground;