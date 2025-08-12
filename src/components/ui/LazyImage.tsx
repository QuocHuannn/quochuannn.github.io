import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
  quality?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  blurDataURL,
  width,
  height,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  sizes,
  srcSet,
  priority = false,
  quality = 75
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading === 'eager' || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, threshold, rootMargin, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const PlaceholderComponent = () => (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width, 
        height,
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-muted)'
      }}
    >
      {placeholder ? (
        <img 
          src={placeholder} 
          alt={alt}
          className="w-full h-full object-cover filter blur-sm"
        />
      ) : (
        <ImageIcon className="w-8 h-8" />
      )}
    </div>
  );

  const ErrorComponent = () => (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width, 
        height,
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-muted)'
      }}
    >
      <div className="text-center">
        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Failed to load image</p>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {hasError ? (
        <ErrorComponent />
      ) : (
        <>
          {/* Placeholder/Blur background */}
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isLoaded ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10"
            >
              {blurDataURL ? (
                <img
                  src={blurDataURL}
                  alt={alt}
                  className="w-full h-full object-cover filter blur-sm scale-110"
                  aria-hidden="true"
                />
              ) : (
                <PlaceholderComponent />
              )}
            </motion.div>
          )}

          {/* Main image */}
          {isInView && (
            <motion.img
              ref={imgRef}
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              srcSet={srcSet}
              className={`w-full h-full transition-opacity duration-300 ${
                objectFit === 'cover' ? 'object-cover' :
                objectFit === 'contain' ? 'object-contain' :
                objectFit === 'fill' ? 'object-fill' :
                objectFit === 'none' ? 'object-none' :
                'object-scale-down'
              }`}
              onLoad={handleLoad}
              onError={handleError}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
            />
          )}


        </>
      )}
    </div>
  );
};

export default LazyImage;