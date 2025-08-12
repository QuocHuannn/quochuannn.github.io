import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: options.triggerOnce !== false
  });

  return { 
    ref, 
    inView
  };
};

// Animation variants for different section types
export const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateY: -10,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: 'easeOut'
    }
  }
};

export const parallaxVariants = {
  hidden: {
    opacity: 0,
    y: 100
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: 'easeOut'
    }
  }
};