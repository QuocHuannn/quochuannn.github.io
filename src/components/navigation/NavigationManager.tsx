/**
 * Consolidated Navigation Manager
 * 
 * Single navigation component thay thế Layout và SmoothScrollNavigation
 * Target: <200 lines, single scroll listener, optimized performance
 */

import React, { useEffect, useRef, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ScrollManager from './ScrollManager';
import { addHapticFeedback, getMobileCapabilities } from '../../utils/mobileOptimization';
import { useScreenReader } from '../../hooks/useAccessibility';
import OptimizedThemeToggle from '../theme/OptimizedThemeToggle';

interface NavigationItem {
  id: string;
  label: string;
}

interface NavigationState {
  activeSection: string;
  isVisible: boolean;
  isMobileMenuOpen: boolean;
  scrollProgress: number;
}

type NavigationAction =
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'SET_VISIBILITY'; payload: boolean }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_SCROLL_PROGRESS'; payload: number };

const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_VISIBILITY':
      return { ...state, isVisible: action.payload };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case 'SET_SCROLL_PROGRESS':
      return { ...state, scrollProgress: action.payload };
    default:
      return state;
  }
};

const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const OBSERVER_CONFIG = { rootMargin: '0px 0px -20% 0px', threshold: [0, 0.5] };

const NavigationManager: React.FC = () => {
  const [state, dispatch] = useReducer(navigationReducer, {
    activeSection: '',
    isVisible: false,
    isMobileMenuOpen: false,
    scrollProgress: 0,
  });

  const { announce } = useScreenReader();
  const scrollManager = useRef<ScrollManager | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    if (getMobileCapabilities().hasTouch) {
      addHapticFeedback('medium');
    }

    const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

    const sectionLabel = NAVIGATION_ITEMS.find(item => item.id === sectionId)?.label || sectionId;
    announce(`Navigated to ${sectionLabel} section`);

    if (state.isMobileMenuOpen) {
      addHapticFeedback('light');
      dispatch({ type: 'TOGGLE_MOBILE_MENU' });
    }
  };

  useEffect(() => {
    scrollManager.current = ScrollManager.getInstance();

    const unsubscribe = scrollManager.current.subscribe((scrollY: number) => {
      dispatch({ type: 'SET_VISIBILITY', payload: scrollY > 100 });

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      dispatch({ type: 'SET_SCROLL_PROGRESS', payload: progress });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let activeId = '';
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          activeId = entry.target.id;
        }
      });

      if (activeId && activeId !== state.activeSection) {
        dispatch({ type: 'SET_ACTIVE_SECTION', payload: activeId });
      }
    }, OBSERVER_CONFIG);

    NAVIGATION_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [state.activeSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isMobileMenuOpen) {
        dispatch({ type: 'TOGGLE_MOBILE_MENU' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b theme-transition-colors"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          borderColor: 'var(--color-border-primary)',
          opacity: 0.8
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="text-xl font-bold theme-transition-colors"
              style={{ color: 'var(--color-text-primary)' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
            >
              QH
            </motion.div>

            <div className="hidden md:flex items-center space-x-6">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = state.activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 text-sm font-medium theme-transition-colors relative ${
                      isActive ? '' : 'hover:opacity-80'
                    }`}
                    style={{
                      color: isActive
                        ? 'var(--color-accent-primary)'
                        : 'var(--color-text-secondary)'
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: 'var(--color-accent-primary)' }}
                        layoutId="activeIndicator"
                      />
                    )}
                  </button>
                );
              })}
              <OptimizedThemeToggle />
            </div>

            <div className="flex md:hidden items-center gap-2">
              <OptimizedThemeToggle />
              <motion.button
                className="p-2 rounded-lg theme-transition-colors hover-scale"
                style={{
                  backgroundColor: 'var(--color-surface-secondary)',
                  color: 'var(--color-text-secondary)'
                }}
                onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
                whileTap={{ scale: 0.95 }}
              >
                {state.isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 h-0.5 transition-fast"
          style={{
            width: `${state.scrollProgress}%`,
            backgroundColor: 'var(--color-accent-primary)'
          }}
        />
      </motion.nav>

      <AnimatePresence>
        {state.isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
            />

            <motion.div
              className="absolute top-0 right-0 w-64 h-full shadow-xl theme-transition-colors"
              style={{ backgroundColor: 'var(--color-bg-primary)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="pt-20 px-6">
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = state.activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left py-3 px-4 text-lg font-medium rounded-lg theme-transition-colors hover-lift ${
                        isActive ? '' : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? 'var(--color-primary-alpha)'
                          : 'transparent',
                        color: isActive
                          ? 'var(--color-accent-primary)'
                          : 'var(--color-text-secondary)'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationManager;