/**
 * Centralized Scroll Manager
 *
 * Single scroll listener để replace multiple scroll listeners
 * Performance-optimized với requestAnimationFrame
 */

type ScrollCallback = (scrollY: number) => void;

class ScrollManager {
  private static instance: ScrollManager;
  private listeners: Set<ScrollCallback> = new Set();
  private rafId: number | null = null;
  private lastScrollY = 0;

  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  static getInstance(): ScrollManager {
    if (!ScrollManager.instance) {
      ScrollManager.instance = new ScrollManager();
    }
    return ScrollManager.instance;
  }

  private handleScroll = () => {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Only fire callbacks if scroll position actually changed
      if (scrollY !== this.lastScrollY) {
        this.listeners.forEach(callback => callback(scrollY));
        this.lastScrollY = scrollY;
      }

      this.rafId = null;
    });
  };

  subscribe(callback: ScrollCallback): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    this.listeners.clear();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

export default ScrollManager;