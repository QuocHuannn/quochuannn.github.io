/**
 * Consolidated Navigation Manager
 *
 * Replaces both Layout navigation và SmoothScrollNavigation
 * Target: <200 lines, performance-optimized
 */

import React, { useState, useEffect, useRef, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ScrollManager from './ScrollManager';
import { addHapticFeedback, getMobileCapabilities } from '../../utils/mobileOptimization';
import { useScreenReader } from '../../hooks/useAccessibility';

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

// Optimized Intersection Observer configuration
const OBSERVER_CONFIG = {
  rootMargin: '0px 0px -20% 0px',
  threshold: [0, 0.5] // Reduced from [0, 0.25, 0.5, 0.75, 1]
};

const NavigationManager: React.FC = () => {
  const [state, dispatch] = useReducer(navigationReducer, {
    activeSection: '',
    isVisible: false,
    isMobileMenuOpen: false,
    scrollProgress: 0,
  });

  const { announce } = useScreenReader();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const scrollManager = useRef<ScrollManager | null>(null);

  // Enhanced smooth scroll
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Haptic feedback
    const capabilities = getMobileCapabilities();
    if (capabilities.hasTouch) {
      addHapticFeedback('medium');
    }

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Screen reader announcement
    const sectionLabel = NAVIGATION_ITEMS.find(item => item.id === sectionId)?.label || sectionId;
    announce(`Navigated to ${sectionLabel} section`);

    // Close mobile menu
    if (state.isMobileMenuOpen) {
      addHapticFeedback('light');
      dispatch({ type: 'TOGGLE_MOBILE_MENU' });
    }
  };

  // Single scroll listener setup
  useEffect(() => {
    scrollManager.current = ScrollManager.getInstance();

    const unsubscribe = scrollManager.current.subscribe((scrollY: number) => {
      // Update visibility
      dispatch({ type: 'SET_VISIBILITY', payload: scrollY > 100 });

      // Update scroll progress
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      dispatch({ type: 'SET_SCROLL_PROGRESS', payload: progress });
    });

    return unsubscribe;
  }, []);

  // Optimized Intersection Observer
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let activeId = '';
      let maxRatio = 0;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          activeId = entry.target.id;
        }
      });

      if (activeId && activeId !== state.activeSection) {
        dispatch({ type: 'SET_ACTIVE_SECTION', payload: activeId });
      }
    };

    const observer = new IntersectionObserver(observerCallback, OBSERVER_CONFIG);

    NAVIGATION_ITEMS.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [state.activeSection]);

  // Keyboard navigation
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
      {/* Fixed Header Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-cream-50/80 backdrop-blur-md border-b border-cream-200 theme-transition-colors"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="text-xl font-bold text-cream-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
            >
              QH
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-sm font-medium theme-transition-colors relative ${
                    state.activeSection === item.id
                      ? 'text-blue-600'
                      : 'text-cream-700 hover:text-cream-900'
                  }`}
                >
                  {item.label}
                  {state.activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      layoutId="activeIndicator"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg bg-cream-100 text-cream-700 theme-transition-colors hover-scale"
              onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
              whileTap={{ scale: 0.95 }}
            >
              {state.isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-fast"
          style={{ width: `${state.scrollProgress}%` }}
        />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {state.isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
            />

            {/* Menu Panel */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-full bg-cream-50 shadow-xl theme-transition-colors"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="pt-20 px-6">
                {NAVIGATION_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left py-3 px-4 text-lg font-medium rounded-lg theme-transition-colors hover-lift ${
                      state.activeSection === item.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-cream-700 hover:bg-cream-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationManager;