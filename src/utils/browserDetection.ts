/**
 * Browser and device detection utilities for cross-browser compatibility
 */

export interface BrowserInfo {
  name: string;
  version: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebP: boolean;
  supportsAvif: boolean;
  supportsBackdropFilter: boolean;
  supportsGrid: boolean;
  supportsCustomProperties: boolean;
}

/**
 * Detect current browser information
 */
export function getBrowserInfo(): BrowserInfo {
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isEdge = /Edg/.test(userAgent);
  const isIE = /Trident/.test(userAgent);
  
  let browserName = 'Unknown';
  let browserVersion = '0';
  
  if (isChrome) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : '0';
  } else if (isFirefox) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : '0';
  } else if (isSafari) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    browserVersion = match ? match[1] : '0';
  } else if (isEdge) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    browserVersion = match ? match[1] : '0';
  } else if (isIE) {
    browserName = 'Internet Explorer';
    const match = userAgent.match(/rv:(\d+)/);
    browserVersion = match ? match[1] : '0';
  }
  
  const isMobile = /Mobi|Android/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  return {
    name: browserName,
    version: browserVersion,
    isMobile,
    isTablet,
    isDesktop,
    supportsWebP: checkWebPSupport(),
    supportsAvif: checkAvifSupport(),
    supportsBackdropFilter: checkBackdropFilterSupport(),
    supportsGrid: checkGridSupport(),
    supportsCustomProperties: checkCustomPropertiesSupport()
  };
}

/**
 * Check WebP support
 */
function checkWebPSupport(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Check AVIF support
 */
function checkAvifSupport(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  try {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    return false;
  }
}

/**
 * Check backdrop-filter support
 */
function checkBackdropFilterSupport(): boolean {
  return CSS.supports('backdrop-filter', 'blur(1px)') || 
         CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
}

/**
 * Check CSS Grid support
 */
function checkGridSupport(): boolean {
  return CSS.supports('display', 'grid');
}

/**
 * Check CSS Custom Properties support
 */
function checkCustomPropertiesSupport(): boolean {
  return CSS.supports('--css', 'variables');
}

/**
 * Apply browser-specific optimizations
 */
export function applyBrowserOptimizations(): void {
  const browserInfo = getBrowserInfo();
  const html = document.documentElement;
  
  // Add browser-specific classes
  html.classList.add(`browser-${browserInfo.name.toLowerCase()}`);
  html.classList.add(`version-${browserInfo.version}`);
  
  if (browserInfo.isMobile) {
    html.classList.add('is-mobile');
  }
  
  if (browserInfo.isTablet) {
    html.classList.add('is-tablet');
  }
  
  if (browserInfo.isDesktop) {
    html.classList.add('is-desktop');
  }
  
  // Feature detection classes
  if (!browserInfo.supportsWebP) {
    html.classList.add('no-webp');
  }
  
  if (!browserInfo.supportsBackdropFilter) {
    html.classList.add('no-backdrop-filter');
  }
  
  if (!browserInfo.supportsGrid) {
    html.classList.add('no-grid');
  }
  
  if (!browserInfo.supportsCustomProperties) {
    html.classList.add('no-custom-properties');
  }
  
  // Safari-specific fixes
  if (browserInfo.name === 'Safari') {
    // Fix for Safari's viewport height issue
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  }
  
  // Firefox-specific optimizations
  if (browserInfo.name === 'Firefox') {
    // Enable hardware acceleration for better performance
    html.style.transform = 'translateZ(0)';
  }
  
  // Mobile-specific optimizations
  if (browserInfo.isMobile) {
    // Disable zoom on input focus for iOS
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
    
    // Add touch-action optimization
    document.body.style.touchAction = 'manipulation';
  }
}

/**
 * Performance monitoring for different browsers
 */
export function monitorPerformance(): void {
  if ('performance' in window) {
    const browserInfo = getBrowserInfo();
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          browser: browserInfo.name,
          version: browserInfo.version,
          device: browserInfo.isMobile ? 'mobile' : browserInfo.isTablet ? 'tablet' : 'desktop',
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        };
        
        // Store in localStorage for debugging
        localStorage.setItem('performance-metrics', JSON.stringify(metrics));
      }, 0);
    });
  }
}

/**
 * Check if current browser needs polyfills
 */
export function needsPolyfills(): string[] {
  const browserInfo = getBrowserInfo();
  const polyfills: string[] = [];
  
  if (!browserInfo.supportsCustomProperties) {
    polyfills.push('css-custom-properties');
  }
  
  if (!browserInfo.supportsGrid) {
    polyfills.push('css-grid');
  }
  
  if (!browserInfo.supportsBackdropFilter) {
    polyfills.push('backdrop-filter');
  }
  
  // IE specific polyfills
  if (browserInfo.name === 'Internet Explorer') {
    polyfills.push('intersection-observer', 'resize-observer', 'fetch');
  }
  
  return polyfills;
}