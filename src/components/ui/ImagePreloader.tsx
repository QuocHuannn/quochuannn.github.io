import React, { useEffect } from 'react';
import { preloadImages } from '../../utils/imageOptimization';

interface ImagePreloaderProps {
  images: Array<{
    src: string;
    priority?: boolean;
    width?: number;
    height?: number;
  }>;
  onComplete?: () => void;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, onComplete }) => {
  useEffect(() => {
    const preloadCriticalImages = async () => {
      try {
        // Separate priority and non-priority images
        const priorityImages = images.filter(img => img.priority);
        const normalImages = images.filter(img => !img.priority);
        
        // Preload priority images first
        if (priorityImages.length > 0) {
          await preloadImages(
            priorityImages.map(img => ({
              src: img.src,
              options: {
                width: img.width,
                height: img.height,
                quality: 90
              }
            }))
          );
        }
        
        // Then preload normal images
        if (normalImages.length > 0) {
          // Use requestIdleCallback if available, otherwise setTimeout
          const schedulePreload = () => {
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                preloadImages(
                  normalImages.map(img => ({
                    src: img.src,
                    options: {
                      width: img.width,
                      height: img.height,
                      quality: 75
                    }
                  }))
                );
              });
            } else {
              setTimeout(() => {
                preloadImages(
                  normalImages.map(img => ({
                    src: img.src,
                    options: {
                      width: img.width,
                      height: img.height,
                      quality: 75
                    }
                  }))
                );
              }, 100);
            }
          };
          
          schedulePreload();
        }
        
        onComplete?.();
      } catch (error) {
        console.warn('Image preloading failed:', error);
        onComplete?.();
      }
    };
    
    preloadCriticalImages();
  }, [images, onComplete]);
  
  return null; // This component doesn't render anything
};

export default ImagePreloader;