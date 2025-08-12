import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useKeyboardNavigation, useScreenReader } from '../../hooks/useAccessibility';
import { TouchHandler, addHapticFeedback, createTouchButton, getMobileCapabilities } from '../../utils/mobileOptimization';
import { getThemeAwareMotionProps, getOptimizedMotionProps } from '../../utils/motionConfig';

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SmoothScrollNavigationProps {
  items: NavigationItem[];
  showMobileMenu?: boolean;
  className?: string;
}

const SmoothScrollNavigation: React.FC<SmoothScrollNavigationProps> = ({
  items,
  showMobileMenu = true,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showMiniNav, setShowMiniNav] = useState(false);
  
  // Accessibility hooks
  useKeyboardNavigation();
  const { announce } = useScreenReader();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Enhanced smooth scroll with improved haptic feedback
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Enhanced haptic feedback based on device capabilities
      const capabilities = getMobileCapabilities();
      if (capabilities.hasTouch) {
        addHapticFeedback('medium'); // More noticeable feedback for navigation
      }
      
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Announce navigation for screen readers
      const sectionLabel = items.find(item => item.id === sectionId)?.label || sectionId;
      announce(`Navigated to ${sectionLabel} section`);

      // Close mobile menu with haptic feedback
      if (isMobileMenuOpen) {
        addHapticFeedback('light'); // Subtle feedback for menu close
        setIsMobileMenuOpen(false);
      }
    }
  };



  // Calculate progress based on active section
  const calculateSectionProgress = (activeSectionId: string) => {
    const activeIndex = items.findIndex(item => item.id === activeSectionId);
    if (activeIndex === -1) return 0;
    return ((activeIndex + 1) / items.length) * 100;
  };

  // Mini navigation visibility handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 200 && !isMobileMenuOpen;
      setShowMiniNav(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  // Track scroll progress and visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      
      // Show/hide navigation based on scroll position
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update progress when active section changes
  useEffect(() => {
    if (activeSection) {
      const newProgress = calculateSectionProgress(activeSection);
      setScrollProgress(newProgress);
    }
  }, [activeSection, items]);

  // Track active section using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -50% 0px', // Less strict margins for better detection
      threshold: [0, 0.25, 0.5, 0.75, 1] // More granular threshold points
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Create a map of all currently intersecting sections with their ratios
      const intersectingSections = new Map<string, number>();
      
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          intersectingSections.set(entry.target.id, entry.intersectionRatio);
        }
      });
      
      let activeId = '';
      
      if (intersectingSections.size > 0) {
        // Find section with highest intersection ratio
        let maxRatio = 0;
        for (const [sectionId, ratio] of intersectingSections) {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeId = sectionId;
          }
        }
      } else {
        // Fallback: find section closest to viewport center
        const viewportCenter = window.innerHeight / 2;
        let closestDistance = Infinity;
        
        items.forEach(item => {
          const element = document.getElementById(item.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - viewportCenter);
            
            // Only consider sections that are at least partially visible
            if (distance < closestDistance && rect.bottom > -100 && rect.top < window.innerHeight + 100) {
              closestDistance = distance;
              activeId = item.id;
            }
          }
        });
      }
      
      if (activeId && activeId !== activeSection) {
        setActiveSection(activeId);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items, activeSection]);

  // Enhanced keyboard navigation and accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        // Return focus to menu button when closing with Escape
        menuButtonRef.current?.focus();
      }
      
      // Arrow key navigation within mobile menu
      if (isMobileMenuOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const menuItems = document.querySelectorAll('[role="menuitem"]');
        const currentIndex = Array.from(menuItems).findIndex(item => item === document.activeElement);
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        }
        
        (menuItems[nextIndex] as HTMLElement)?.focus();
      }
      
      // Enter or Space to activate menu items
      if (isMobileMenuOpen && (e.key === 'Enter' || e.key === ' ')) {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.getAttribute('role') === 'menuitem') {
          e.preventDefault();
          activeElement.click();
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Focus first menu item when menu opens
      setTimeout(() => {
        const firstMenuItem = document.querySelector('[role="menuitem"]') as HTMLElement;
        firstMenuItem?.focus();
      }, 100);
      
      // Add haptic feedback when menu opens
      const capabilities = getMobileCapabilities();
      if (capabilities.hasTouch) {
        addHapticFeedback('light');
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  // Initialize touch optimizations
  useEffect(() => {
    if (menuButtonRef.current) {
      createTouchButton(menuButtonRef.current, {
        hapticFeedback: true,
        scaleEffect: true,
        rippleEffect: true
      });
    }
  }, []);

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onFocus={() => {
          const capabilities = getMobileCapabilities();
          if (capabilities.hasTouch) {
            addHapticFeedback('light');
          }
        }}
      >
        Skip to main content
      </a>
      
      {/* Desktop Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block ${className}`}
            role="navigation"
            aria-label="Page sections navigation"
            aria-describedby="nav-description"
            id="main-navigation"
          >
            <div className="backdrop-blur-md rounded-full p-2 shadow-lg border" style={{backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)'}}>
              {/* Scroll Progress Indicator */}
              <div className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                   style={{ height: `${scrollProgress}%` }} />
              
              <div className="space-y-2">
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group ${
                      activeSection === item.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={item.label}
                    aria-label={`Navigate to ${item.label} section`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    type="button"
                  >
                    {item.icon || (
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSection === item.id ? 'bg-[var(--color-bg-primary)]' : 'bg-current'
                      }`} />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {item.label}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Tablet Navigation (md breakpoint) */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:block lg:hidden ${className}`}
            role="navigation"
            aria-label="Page sections navigation for tablet"
            aria-describedby="nav-description"
            id="tablet-navigation"
          >
            <div className="backdrop-blur-md rounded-full p-2 shadow-lg border" style={{backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)'}}>
              {/* Scroll Progress Indicator */}
              <div className="absolute left-0 top-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                   style={{ height: `${scrollProgress}%` }} />
              
              <div className="space-y-2">
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group touch-target ${activeSection === item.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={item.label}
                    aria-label={`Navigate to ${item.label} section`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    type="button"
                    style={{ touchAction: 'manipulation', minHeight: '48px', minWidth: '48px' }}
                  >
                    {item.icon || (
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === item.id ? 'bg-[var(--color-bg-primary)]' : 'bg-current'
                      }`} />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {item.label}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mini Navigation for Mobile */}
      <AnimatePresence>
        {showMiniNav && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden"
            role="navigation"
            aria-label="Mini navigation"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-lg">
              {items.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    scrollToSection(item.id);
                    const capabilities = getMobileCapabilities();
                    if (capabilities.hasTouch) {
                      addHapticFeedback('light');
                    }
                  }}
                  className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center text-xs font-medium ${
                    activeSection === item.id
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30 hover:text-white'
                  }`}
                  aria-label={`Go to ${item.label}`}
                >
                  {index + 1}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Menu Button */}
      {showMobileMenu && (
        <AnimatePresence>
          {isVisible && (
            <motion.button
              ref={menuButtonRef}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94],
                rotate: { duration: 0.6, ease: 'backOut' }
              }}
              onClick={() => {
                const capabilities = getMobileCapabilities();
                if (capabilities.hasTouch) {
                  addHapticFeedback('medium'); // Haptic feedback for menu open
                }
                setIsMobileMenuOpen(true);
              }}
              className="fixed bottom-6 right-6 z-40 md:hidden w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center touch-manipulation overflow-hidden group"
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)'
              }}
              whileTap={{ 
                scale: 0.9,
                rotate: -5,
                transition: { duration: 0.1 }
              }}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
              style={{ 
                touchAction: 'manipulation',
                minHeight: '64px',
                minWidth: '64px'
              }}
            >
              {/* Animated background gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              
              {/* Menu icon with enhanced animation */}
              <motion.div
                whileHover={{ rotate: 90 }}
                whileTap={{ rotate: -90 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <Menu className="w-7 h-7" aria-hidden="true" />
              </motion.div>
              
              {/* Enhanced ripple effect */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.2)'}}
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{
                  scale: [0, 1.5],
                  opacity: [0.3, 0]
                }}
                transition={{ duration: 0.4 }}
              />
              
              {/* Pulse effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              aria-describedby="mobile-menu-description"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Enhanced Menu Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  staggerChildren: 0.1
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border min-w-[320px] max-w-[90vw] touch-manipulation bg-gradient-to-br from-white/10 to-white/5"
                role="menu"
                aria-labelledby="mobile-menu-title"
                aria-describedby="mobile-menu-description"
                style={{ 
                  touchAction: 'manipulation',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderColor: 'var(--color-border-primary)'
                }}
            >
              {/* Enhanced Close Button */}
              <motion.button
                initial={{ opacity: 0, rotate: -90, scale: 0 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                onClick={() => {
                  const capabilities = getMobileCapabilities();
                  if (capabilities.hasTouch) {
                    addHapticFeedback('light'); // Subtle haptic feedback for close
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 touch-target"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9, rotate: -90 }}
                aria-label="Close navigation menu"
                type="button"
                style={{ 
                  touchAction: 'manipulation',
                  minHeight: '48px',
                  minWidth: '48px'
                }}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </motion.button>
              
              {/* Hidden title for screen readers */}
              <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
                <p id="mobile-menu-description" className="sr-only">
                  Use arrow keys to navigate between menu items, Enter or Space to select, Escape to close
                </p>
                <p id="nav-description" className="sr-only">
                  Navigate to different sections of the page using these buttons
                </p>
              
              {/* Enhanced Menu Items */}
              <motion.div 
                className="space-y-3 mt-12"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2
                    }
                  }
                }}
              >
                {items.map((item, index) => (
                  <motion.button
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, x: -30, rotateY: -15 },
                      visible: { opacity: 1, x: 0, rotateY: 0 }
                    }}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center space-x-4 p-5 rounded-2xl transition-all duration-300 mobile-nav-link touch-target group relative overflow-hidden ${activeSection === item.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-blue-400/30'
                        : 'text-white/80 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    role="menuitem"
                    aria-label={`Navigate to ${item.label} section`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    type="button"
                    style={{ 
                      touchAction: 'manipulation', 
                      minHeight: '64px',
                      minWidth: '280px'
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {/* Background gradient effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Icon with animation */}
                    {item.icon && (
                      <motion.div 
                        className="w-7 h-7 flex-shrink-0 relative z-10"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.icon}
                      </motion.div>
                    )}
                    
                    {/* Label with enhanced styling */}
                    <span className="font-semibold text-lg relative z-10 flex-grow text-left">{item.label}</span>
                    
                    {/* Active indicator with animation */}
                    {activeSection === item.id && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="ml-auto w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 relative z-10 shadow-lg"
                        whileHover={{ scale: 1.2 }}
                      />
                    )}
                    
                    {/* Hover arrow indicator */}
                    <motion.div
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative z-10"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </>
  );
};

export default SmoothScrollNavigation;