/**
 * Image optimization utilities for better performance
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  blur?: boolean;
}

/**
 * Generate optimized image URL with query parameters
 */
export const optimizeImageUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  const { width, height, quality = 75, format, blur } = options;
  
  // If it's already an external optimized URL, return as is
  if (src.includes('trae-api-sg.mchost.guru') || src.startsWith('http')) {
    return src;
  }
  
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality !== 75) params.set('q', quality.toString());
  if (format) params.set('f', format);
  if (blur) params.set('blur', '10');
  
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
};

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (
  src: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920],
  format?: 'webp' | 'avif' | 'jpeg'
): string => {
  return widths
    .map(width => {
      const optimizedSrc = optimizeImageUrl(src, { width, format });
      return `${optimizedSrc} ${width}w`;
    })
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (breakpoints: { [key: string]: string } = {}) => {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
    ...breakpoints
  };
  
  const sizeEntries = Object.entries(defaultBreakpoints);
  const mediaQueries = sizeEntries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
  const fallback = sizeEntries[sizeEntries.length - 1][1];
  
  return [...mediaQueries, fallback].join(', ');
};

/**
 * Create blur data URL for placeholder
 */
export const createBlurDataURL = (width = 10, height = 10): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a simple gradient blur placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

/**
 * Check if browser supports modern image formats
 */
export const checkImageFormatSupport = (): {
  webp: boolean;
  avif: boolean;
} => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return {
    webp: canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0,
    avif: canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  };
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalFormat = (): 'avif' | 'webp' | 'jpeg' => {
  const support = checkImageFormatSupport();
  
  if (support.avif) return 'avif';
  if (support.webp) return 'webp';
  return 'jpeg';
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, options: ImageOptimizationOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const optimizedSrc = optimizeImageUrl(src, options);
    
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = optimizedSrc;
  });
};

/**
 * Batch preload multiple images
 */
export const preloadImages = async (
  sources: Array<{ src: string; options?: ImageOptimizationOptions }>
): Promise<void> => {
  const promises = sources.map(({ src, options }) => preloadImage(src, options));
  await Promise.allSettled(promises);
};