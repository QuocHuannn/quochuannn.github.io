import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './theme/ThemeToggle';
import { useThemeClassName } from '../hooks/useThemeClassName';
import { getThemeAwareMotionProps, getOptimizedMotionProps } from '../utils/motionConfig';

interface LayoutProps {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 glass-effect"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="text-2xl font-display font-bold gradient-text"
              {...getThemeAwareMotionProps({
                whileHover: { scale: 1.05 },
                transition: { duration: 0.15, ease: 'easeOut' }
              })}
            >
              Huân Portfolio
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="font-medium transition-colors duration-300"
                  style={{ 
                    color: 'var(--color-text-secondary)'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  {...getThemeAwareMotionProps({
                    whileHover: { scale: 1.1 },
                    whileTap: { scale: 0.95 },
                    initial: { opacity: 0, y: -20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: index * 0.1 + 0.3, duration: 0.15, ease: 'easeOut' }
                  })}
                >
                  {item.label}
                </motion.button>
              ))}
              
              {/* Theme Toggle - After Contact */}
              <ThemeToggle 
                aria-label="Toggle between light and dark theme"
              />
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              {...getThemeAwareMotionProps({
                whileTap: { scale: 0.95 },
                transition: { duration: 0.1, ease: 'easeOut' }
              })}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Scroll to Top Button - Positioned on right side following UI/UX standards */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)'
        }}
        onClick={() => scrollToSection('hero')}
        {...getThemeAwareMotionProps({
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.9 },
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 1, duration: 0.15, ease: 'easeOut' }
        })}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Layout;