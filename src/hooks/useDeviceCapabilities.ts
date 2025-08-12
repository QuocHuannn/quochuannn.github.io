import { useMemo } from 'react';


export function useDeviceCapabilities() {
  const capabilities = useMemo(() => {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTablet: /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768,
      isDesktop: window.innerWidth >= 1024,
      supportsTouch: 'ontouchstart' in window,
      devicePixelRatio: window.devicePixelRatio || 1
    };
  }, []);

  const adaptiveQuality = useMemo(() => {
    return {
      quality: capabilities.isMobile ? 'low' : 'high',
      enableAnimations: !capabilities.isMobile,
      enableParallax: !capabilities.isMobile
    };
  }, [capabilities]);

  const performanceRecommendations = useMemo(() => {
    return {
      reduceAnimations: capabilities.isMobile,
      enableLazyLoading: true,
      optimizeImages: capabilities.isMobile
    };
  }, [capabilities]);

  const supportsFeature = (feature: string) => {
    switch (feature) {
      case 'touch':
        return capabilities.supportsTouch;
      case 'mobile':
        return capabilities.isMobile;
      default:
        return false;
    }
  };

  return {
    capabilities,
    adaptiveQuality,
    performanceRecommendations,
    supportsFeature,
    isMobile: capabilities.isMobile,
    isTablet: capabilities.isTablet,
    isDesktop: capabilities.isDesktop,
    supportsTouch: capabilities.supportsTouch,
    devicePixelRatio: capabilities.devicePixelRatio
  };
}