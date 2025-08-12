/**
 * Mobile optimization utilities for touch interactions and performance
 */

export interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  duration: number;
  velocity: number;
}

export interface SwipeOptions {
  threshold?: number;
  velocity?: number;
  preventDefaultTouchmoveEvent?: boolean;
  deltaXThreshold?: number;
  deltaYThreshold?: number;
}

/**
 * Enhanced touch event handler for better mobile interactions
 */
export class TouchHandler {
  private element: HTMLElement;
  private startTouch: Touch | null = null;
  private startTime: number = 0;
  private options: SwipeOptions;
  
  constructor(element: HTMLElement, options: SwipeOptions = {}) {
    this.element = element;
    this.options = {
      threshold: 50,
      velocity: 0.3,
      preventDefaultTouchmoveEvent: false,
      deltaXThreshold: 30,
      deltaYThreshold: 30,
      ...options
    };
    
    this.init();
  }
  
  private init(): void {
    // Optimize touch events
    this.element.style.touchAction = 'manipulation';
    this.element.style.userSelect = 'none';
    (this.element.style as any).webkitUserSelect = 'none';
    (this.element.style as any).webkitTapHighlightColor = 'transparent';
    
    // Add passive event listeners for better performance
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { 
      passive: !this.options.preventDefaultTouchmoveEvent 
    });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }
  
  private handleTouchStart(e: TouchEvent): void {
    this.startTouch = e.touches[0];
    this.startTime = Date.now();
    
    // Add visual feedback
    this.element.style.transform = 'scale(0.98)';
    this.element.style.transition = 'transform 0.1s ease';
  }
  
  private handleTouchMove(e: TouchEvent): void {
    if (this.options.preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  }
  
  private handleTouchEnd(e: TouchEvent): void {
    if (!this.startTouch) return;
    
    const endTouch = e.changedTouches[0];
    const endTime = Date.now();
    
    const gesture: TouchGesture = {
      startX: this.startTouch.clientX,
      startY: this.startTouch.clientY,
      endX: endTouch.clientX,
      endY: endTouch.clientY,
      deltaX: endTouch.clientX - this.startTouch.clientX,
      deltaY: endTouch.clientY - this.startTouch.clientY,
      duration: endTime - this.startTime,
      velocity: 0
    };
    
    const distance = Math.sqrt(gesture.deltaX ** 2 + gesture.deltaY ** 2);
    gesture.velocity = distance / gesture.duration;
    
    // Reset visual feedback
    this.element.style.transform = '';
    this.element.style.transition = 'transform 0.2s ease';
    
    // Dispatch custom events based on gesture
    this.processGesture(gesture);
    
    this.startTouch = null;
  }
  
  private processGesture(gesture: TouchGesture): void {
    const { deltaX, deltaY, velocity } = gesture;
    const { threshold, velocity: minVelocity, deltaXThreshold, deltaYThreshold } = this.options;
    
    // Swipe detection
    if (Math.abs(deltaX) > threshold! && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.dispatchCustomEvent('swiperight', gesture);
      } else {
        this.dispatchCustomEvent('swipeleft', gesture);
      }
    } else if (Math.abs(deltaY) > threshold! && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        this.dispatchCustomEvent('swipedown', gesture);
      } else {
        this.dispatchCustomEvent('swipeup', gesture);
      }
    }
    
    // Tap detection
    if (Math.abs(deltaX) < deltaXThreshold! && Math.abs(deltaY) < deltaYThreshold!) {
      this.dispatchCustomEvent('tap', gesture);
    }
    
    // Long press detection (handled separately)
    if (gesture.duration > 500 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.dispatchCustomEvent('longpress', gesture);
    }
  }
  
  private dispatchCustomEvent(eventName: string, gesture: TouchGesture): void {
    const event = new CustomEvent(eventName, {
      detail: gesture,
      bubbles: true,
      cancelable: true
    });
    
    this.element.dispatchEvent(event);
  }
  
  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }
}

/**
 * Optimize mobile viewport and prevent zoom
 */
export function optimizeMobileViewport(): void {
  // Set viewport meta tag
  let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  
  // Add mobile-specific CSS custom properties
  const root = document.documentElement;
  
  // Fix for iOS viewport height issue
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    root.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100); // Delay for orientation change
  });
  
  // Prevent double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

/**
 * Add haptic feedback for supported devices
 */
export function addHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    
    navigator.vibrate(patterns[type]);
  }
}

/**
 * Optimize scroll performance for mobile
 */
export function optimizeScrollPerformance(): void {
  // Add momentum scrolling for iOS
  const scrollElements = document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto');
  
  scrollElements.forEach(element => {
    const el = element as HTMLElement;
    (el.style as any).webkitOverflowScrolling = 'touch';
    el.style.overscrollBehavior = 'contain';
  });
  
  // Optimize scroll events with throttling
  let ticking = false;
  
  const optimizedScrollHandler = (callback: () => void) => {
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    };
  };
  
  // Apply to window scroll
  window.addEventListener('scroll', optimizedScrollHandler(() => {
    // Custom scroll logic here
  }), { passive: true });
}

/**
 * Detect mobile device capabilities
 */
export function getMobileCapabilities() {
  return {
    hasTouch: 'ontouchstart' in window,
    hasHover: window.matchMedia('(hover: hover)').matches,
    hasPointer: window.matchMedia('(pointer: fine)').matches,
    supportsPassive: (() => {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: () => {
            supportsPassive = true;
            return true;
          }
        });
        window.addEventListener('testPassive', () => {}, opts);
        window.removeEventListener('testPassive', () => {}, opts);
      } catch (e) {}
      return supportsPassive;
    })(),
    devicePixelRatio: window.devicePixelRatio || 1,
    screenSize: {
      width: window.screen.width,
      height: window.screen.height
    },
    viewportSize: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
}

/**
 * Initialize all mobile optimizations
 */
export function initMobileOptimizations(): void {
  // Only run on mobile devices
  if (window.innerWidth <= 768 || 'ontouchstart' in window) {
    optimizeMobileViewport();
    optimizeScrollPerformance();
    
    // Add mobile-specific classes
    document.documentElement.classList.add('mobile-optimized');
    
    // Mobile capabilities available via getMobileCapabilities() if needed
  }
}

/**
 * Create touch-optimized button component
 */
export function createTouchButton(element: HTMLElement, options: {
  hapticFeedback?: boolean;
  scaleEffect?: boolean;
  rippleEffect?: boolean;
} = {}): void {
  const { hapticFeedback = true, scaleEffect = true, rippleEffect = false } = options;
  
  // Add touch styles
  element.style.cursor = 'pointer';
  element.style.userSelect = 'none';
  (element.style as any).webkitUserSelect = 'none';
  (element.style as any).webkitTapHighlightColor = 'transparent';
  
  if (scaleEffect) {
    element.style.transition = 'transform 0.1s ease';
  }
  
  // Touch event handlers
  element.addEventListener('touchstart', (e) => {
    if (hapticFeedback) {
      addHapticFeedback('light');
    }
    
    if (scaleEffect) {
      element.style.transform = 'scale(0.95)';
    }
    
    if (rippleEffect) {
      createRippleEffect(element, e.touches[0]);
    }
  }, { passive: true });
  
  element.addEventListener('touchend', () => {
    if (scaleEffect) {
      element.style.transform = '';
    }
  }, { passive: true });
  
  element.addEventListener('touchcancel', () => {
    if (scaleEffect) {
      element.style.transform = '';
    }
  }, { passive: true });
}

/**
 * Create ripple effect for touch interactions
 */
function createRippleEffect(element: HTMLElement, touch: Touch): void {
  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  const x = touch.clientX - rect.left - size / 2;
  const y = touch.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
  `;
  
  // Add ripple animation keyframes if not exists
  if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}