import React, { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/optimized';
import ThemePreloader from './components/theme/ThemePreloader';

// Lazy load theme demo for better code splitting
const ThemePerformanceDemo = lazy(() => import('./components/theme/ThemePerformanceDemo'));
const AnimationPreferencesTest = lazy(() => import('./components/test/AnimationPreferencesTest'));
const ThemeTransitionTest = lazy(() => import('./components/test/ThemeTransitionTest'));
const ThemePresetsTest = lazy(() => import('./components/test/ThemePresetsTest'));
const UserPreferencesTest = lazy(() => import('./components/test/UserPreferencesTest'));
const CrossBrowserTest = lazy(() => import('./components/test/CrossBrowserTest'));
const AccessibilityTest = lazy(() => import('./components/test/AccessibilityTest'));
const PerformanceTest = lazy(() => import('./components/test/PerformanceTest'));
const TestIndex = lazy(() => import('./components/test/TestIndex'));

import HeroSection from './components/sections/HeroSection';
import {
  LazyAboutSection,
  LazySkillsSection,
  LazyExperienceSection,
  LazyProjectsSection,
  LazyContactSection
} from './components/ui/LazySection';

import NavigationManager from './components/navigation/NavigationManager';

import SEO from './components/SEO/SEO';
import SkipLinks from './components/accessibility/SkipLinks';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoading } from './components/ui/LoadingSpinner';
import NotFound from './pages/NotFound';
import GoogleAnalytics, { useScrollTracking } from './components/analytics/GoogleAnalytics';
import OfflineIndicator from './components/ui/OfflineIndicator';
import ImagePreloader from './components/ui/ImagePreloader';

// Main Portfolio Component
const Portfolio: React.FC = () => {
  // Enable scroll tracking for analytics
  useScrollTracking();
  
  
  return (
    <>
      {/* SEO Meta Tags */}
      <SEO />
      
      {/* Google Analytics */}
      <GoogleAnalytics 
        trackingId={import.meta.env.VITE_GA_TRACKING_ID}
        enableInDevelopment={false}
      />
      
      {/* Skip Links for Accessibility */}
      <SkipLinks />
      
      {/* Preload Critical Images */}
      <ImagePreloader 
        images={[
          { src: '/images/ava-dlat.JPG', priority: true, width: 256, height: 256 },
          { src: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20web%20development%20project%20showcase&image_size=landscape_4_3', priority: false, width: 400, height: 300 },
          { src: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20software%20development%20workspace&image_size=landscape_4_3', priority: false, width: 400, height: 300 }
        ]}
      />
      
      {/* Offline Indicator */}
      <OfflineIndicator showWhenOnline={true} position="top" />
      
      {/* Consolidated Navigation */}
      <NavigationManager />

      {/* Main Content Layout */}
      <div className="min-h-screen bg-cream-50">
        <main id="main-content" role="main" tabIndex={-1}>
            <section id="hero" aria-labelledby="hero-heading">
            <HeroSection />
          </section>
          <LazyAboutSection 
            id="about" 
            aria-labelledby="about-heading"
          />
          <LazySkillsSection 
            id="skills" 
            aria-labelledby="skills-heading"
          />
          <LazyExperienceSection 
            id="experience" 
            aria-labelledby="experience-heading"
          />
          <LazyProjectsSection 
            id="projects" 
            aria-labelledby="projects-heading"
          />
          <LazyContactSection 
            id="contact" 
            aria-labelledby="contact-heading"
          />
        </main>
      </div>
      

    </>
  );
};

export default function App() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Application Error:', error, errorInfo);
    }
    
    // Report to analytics in production
    if (import.meta.env.PROD && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      <ThemeProvider defaultTheme="light">
        <ThemePreloader 
          strategy="components"
          preloadOnIdle={true}
          preloadOnHover={true}
          onPreloadComplete={(modules) => {
            if (import.meta.env.DEV) {
              console.log('Theme modules preloaded:', modules.length);
            }
          }}
          onError={(error) => {
            if (import.meta.env.DEV) {
              console.warn('Theme preload error:', error);
            }
          }}
        >
          <HelmetProvider>
            <Router>
                <Suspense fallback={<PageLoading message="Loading portfolio..." />}>
                  <Routes>
                    <Route path="/" element={<Portfolio />} />
                    <Route path="/theme-demo" element={<ThemePerformanceDemo />} />
                    <Route path="/animation-test" element={<AnimationPreferencesTest />} />
                    <Route path="/theme-transition-test" element={<ThemeTransitionTest />} />
                    <Route path="/theme-presets-test" element={<ThemePresetsTest />} />
            <Route path="/user-preferences-test" element={<UserPreferencesTest />} />
            <Route path="/cross-browser-test" element={<CrossBrowserTest />} />
            <Route path="/accessibility-test" element={<AccessibilityTest />} />
            <Route path="/performance-test" element={<PerformanceTest />} />
            <Route path="/test-suite" element={<TestIndex />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </Router>
          </HelmetProvider>
        </ThemePreloader>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
