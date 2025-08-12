import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { PageLoading } from './LoadingSpinner';

interface LazySectionProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
  [key: string]: any;
}

const LazySection: React.FC<LazySectionProps> = ({ 
  component, 
  fallback, 
  className = '',
  id,
  'aria-labelledby': ariaLabelledBy,
  ...props 
}) => {
  const LazyComponent = lazy(component);
  
  const defaultFallback = (
    <motion.div 
      className={`min-h-[200px] flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageLoading message="Loading section..." />
    </motion.div>
  );
  
  return (
    <section 
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={className}
    >
      <Suspense fallback={fallback || defaultFallback}>
        <LazyComponent {...props} />
      </Suspense>
    </section>
  );
};

export default LazySection;

// Helper function to create lazy section components
export const createLazySection = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  return (props: any) => (
    <LazySection component={importFn} {...props} />
  );
};

// Pre-configured lazy sections
export const LazyAboutSection = createLazySection(() => import('../sections/AboutSection'));
export const LazySkillsSection = createLazySection(() => import('../sections/SkillsSection'));
export const LazyExperienceSection = createLazySection(() => import('../sections/ExperienceSection'));
export const LazyProjectsSection = createLazySection(() => import('../sections/ProjectsSection'));
export const LazyContactSection = createLazySection(() => import('../sections/ContactSection'));