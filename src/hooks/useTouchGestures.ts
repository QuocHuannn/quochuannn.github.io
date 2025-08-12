import { useRef, useCallback, useEffect } from 'react';


interface TouchPoint {
  x: number;
  y: number;
  id: number;
}

interface GestureState {
  isActive: boolean;
  startDistance: number;
  startAngle: number;
  currentDistance: number;
  currentAngle: number;
  center: { x: number; y: number };
  velocity: { x: number; y: number };
  lastTimestamp: number;
}

interface TouchGestureCallbacks {
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onRotate?: (angle: number, center: { x: number; y: number }) => void;
  onPan?: (delta: { x: number; y: number }, velocity: { x: number; y: number }) => void;
  onTap?: (position: { x: number; y: number }) => void;
  onDoubleTap?: (position: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
}

interface TouchGestureOptions {
  enablePinch?: boolean;
  enableRotation?: boolean;
  enablePan?: boolean;
  enableTap?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
  pinchThreshold?: number;
  rotationThreshold?: number;
  panThreshold?: number;
  tapTimeout?: number;
  doubleTapTimeout?: number;
  longPressTimeout?: number;
  preventDefault?: boolean;
}

const DEFAULT_OPTIONS: Required<TouchGestureOptions> = {
  enablePinch: true,
  enableRotation: true,
  enablePan: true,
  enableTap: true,
  enableDoubleTap: true,
  enableLongPress: true,
  pinchThreshold: 10,
  rotationThreshold: 5,
  panThreshold: 5,
  tapTimeout: 200,
  doubleTapTimeout: 300,
  longPressTimeout: 500,
  preventDefault: true,
};

export function useTouchGestures(
  callbacks: TouchGestureCallbacks,
  options: TouchGestureOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const gestureState = useRef<GestureState>({
    isActive: false,
    startDistance: 0,
    startAngle: 0,
    currentDistance: 0,
    currentAngle: 0,
    center: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    lastTimestamp: 0,
  });
  
  const touchPoints = useRef<TouchPoint[]>([]);
  const lastTapTime = useRef<number>(0);
  const lastTapPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const panStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPanPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPanTimestamp = useRef<number>(0);
  
  const deviceCapabilities = { isTouchDevice: 'ontouchstart' in window };
  
  // Helper functions
  const getDistance = (p1: TouchPoint, p2: TouchPoint): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const getAngle = (p1: TouchPoint, p2: TouchPoint): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  };
  
  const getCenter = (points: TouchPoint[]): { x: number; y: number } => {
    const sum = points.reduce(
      (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
      { x: 0, y: 0 }
    );
    return { x: sum.x / points.length, y: sum.y / points.length };
  };
  
  const getTouchPoints = (event: TouchEvent): TouchPoint[] => {
    return Array.from(event.touches).map((touch) => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
    }));
  };
  
  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (opts.preventDefault) {
        event.preventDefault();
      }
      
      touchPoints.current = getTouchPoints(event);
      const now = Date.now();
      
      clearLongPressTimer();
      
      if (touchPoints.current.length === 1) {
        const point = touchPoints.current[0];
        panStartPosition.current = { x: point.x, y: point.y };
        lastPanPosition.current = { x: point.x, y: point.y };
        lastPanTimestamp.current = now;
        
        // Long press detection
        if (opts.enableLongPress && callbacks.onLongPress) {
          longPressTimer.current = setTimeout(() => {
            callbacks.onLongPress!({ x: point.x, y: point.y });
          }, opts.longPressTimeout);
        }
      } else if (touchPoints.current.length === 2) {
        clearLongPressTimer();
        
        const [p1, p2] = touchPoints.current;
        gestureState.current = {
          isActive: true,
          startDistance: getDistance(p1, p2),
          startAngle: getAngle(p1, p2),
          currentDistance: getDistance(p1, p2),
          currentAngle: getAngle(p1, p2),
          center: getCenter(touchPoints.current),
          velocity: { x: 0, y: 0 },
          lastTimestamp: now,
        };
      }
    },
    [opts, callbacks]
  );
  
  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (opts.preventDefault) {
        event.preventDefault();
      }
      
      touchPoints.current = getTouchPoints(event);
      const now = Date.now();
      
      clearLongPressTimer();
      
      if (touchPoints.current.length === 1 && opts.enablePan && callbacks.onPan) {
        const point = touchPoints.current[0];
        const deltaX = point.x - lastPanPosition.current.x;
        const deltaY = point.y - lastPanPosition.current.y;
        const deltaTime = now - lastPanTimestamp.current;
        
        if (Math.abs(deltaX) > opts.panThreshold || Math.abs(deltaY) > opts.panThreshold) {
          const velocity = {
            x: deltaTime > 0 ? deltaX / deltaTime : 0,
            y: deltaTime > 0 ? deltaY / deltaTime : 0,
          };
          
          callbacks.onPan({ x: deltaX, y: deltaY }, velocity);
          
          lastPanPosition.current = { x: point.x, y: point.y };
          lastPanTimestamp.current = now;
        }
      } else if (touchPoints.current.length === 2 && gestureState.current.isActive) {
        const [p1, p2] = touchPoints.current;
        const currentDistance = getDistance(p1, p2);
        const currentAngle = getAngle(p1, p2);
        const center = getCenter(touchPoints.current);
        
        // Pinch gesture
        if (opts.enablePinch && callbacks.onPinch) {
          const scale = currentDistance / gestureState.current.startDistance;
          const distanceDelta = Math.abs(currentDistance - gestureState.current.currentDistance);
          
          if (distanceDelta > opts.pinchThreshold) {
            callbacks.onPinch(scale, center);
          }
        }
        
        // Rotation gesture
        if (opts.enableRotation && callbacks.onRotate) {
          let angleDelta = currentAngle - gestureState.current.startAngle;
          
          // Normalize angle to -180 to 180
          while (angleDelta > 180) angleDelta -= 360;
          while (angleDelta < -180) angleDelta += 360;
          
          if (Math.abs(angleDelta) > opts.rotationThreshold) {
            callbacks.onRotate(angleDelta, center);
          }
        }
        
        gestureState.current.currentDistance = currentDistance;
        gestureState.current.currentAngle = currentAngle;
        gestureState.current.center = center;
      }
    },
    [opts, callbacks]
  );
  
  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (opts.preventDefault) {
        event.preventDefault();
      }
      
      const now = Date.now();
      clearLongPressTimer();
      
      if (touchPoints.current.length === 1 && event.touches.length === 0) {
        const point = touchPoints.current[0];
        const deltaX = point.x - panStartPosition.current.x;
        const deltaY = point.y - panStartPosition.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Tap detection (if movement is minimal)
        if (distance < opts.panThreshold) {
          const timeSinceLastTap = now - lastTapTime.current;
          const distanceFromLastTap = Math.sqrt(
            Math.pow(point.x - lastTapPosition.current.x, 2) +
            Math.pow(point.y - lastTapPosition.current.y, 2)
          );
          
          if (
            opts.enableDoubleTap &&
            callbacks.onDoubleTap &&
            timeSinceLastTap < opts.doubleTapTimeout &&
            distanceFromLastTap < 50
          ) {
            callbacks.onDoubleTap({ x: point.x, y: point.y });
            lastTapTime.current = 0; // Reset to prevent triple tap
          } else if (opts.enableTap && callbacks.onTap) {
            callbacks.onTap({ x: point.x, y: point.y });
            lastTapTime.current = now;
            lastTapPosition.current = { x: point.x, y: point.y };
          }
        }
      }
      
      if (event.touches.length === 0) {
        gestureState.current.isActive = false;
        touchPoints.current = [];
      } else {
        touchPoints.current = getTouchPoints(event);
      }
    },
    [opts, callbacks]
  );
  
  const bindToElement = useCallback(
    (element: HTMLElement | null) => {
      if (!element || !deviceCapabilities.isTouchDevice) return;
      
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: false });
      element.addEventListener('touchcancel', handleTouchEnd, { passive: false });
      
      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchEnd);
        clearLongPressTimer();
      };
    },
    [handleTouchStart, handleTouchMove, handleTouchEnd, deviceCapabilities.isTouchDevice]
  );
  
  return {
    bindToElement,
    isGestureActive: gestureState.current.isActive,
    touchCount: touchPoints.current.length,
    isTouchDevice: deviceCapabilities.isTouchDevice,
  };
}

export default useTouchGestures;