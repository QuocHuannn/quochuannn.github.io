// React Hook for Theme Transitions
// Provides easy integration of theme transition animations in React components

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  themeTransitionManager,
  ThemeTransitionPresets,
  ThemeTransitionConfig,
  executeThemeTransition,
  setThemeTransitionPreset,
  isThemeTransitioning,
  getThemeTransitionPresets
} from '../utils/themeTransitions';
import { useAnimationPreferences } from './useAnimationPreferences';

export interface UseThemeTransitionsOptions {
  defaultPreset?: keyof ThemeTransitionPresets;
  respectReducedMotion?: boolean;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export interface UseThemeTransitionsReturn {
  // State
  isTransitioning: boolean;
  currentPreset: keyof ThemeTransitionPresets;
  availablePresets: (keyof ThemeTransitionPresets)[];
  
  // Actions
  executeTransition: (themeChangeCallback: () => void, preset?: keyof ThemeTransitionPresets) => Promise<void>;
  setPreset: (preset: keyof ThemeTransitionPresets) => void;
  updatePreset: (preset: keyof ThemeTransitionPresets, config: Partial<ThemeTransitionConfig>) => void;
  
  // Utilities
  getPresetConfig: (preset: keyof ThemeTransitionPresets) => ThemeTransitionConfig;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
  resetConfig: () => void;
}

/**
 * Main hook for theme transitions
 */
export function useThemeTransitions(options: UseThemeTransitionsOptions = {}): UseThemeTransitionsReturn {
  const {
    defaultPreset = 'smooth',
    respectReducedMotion = true,
    onTransitionStart,
    onTransitionEnd
  } = options;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<keyof ThemeTransitionPresets>(defaultPreset);
  const [availablePresets] = useState<(keyof ThemeTransitionPresets)[]>(getThemeTransitionPresets());
  
  const { shouldAnimate } = useAnimationPreferences();
  const callbacksRef = useRef({ onTransitionStart, onTransitionEnd });
  
  // Update callbacks ref
  useEffect(() => {
    callbacksRef.current = { onTransitionStart, onTransitionEnd };
  }, [onTransitionStart, onTransitionEnd]);

  // Set default preset on mount
  useEffect(() => {
    setThemeTransitionPreset(defaultPreset);
    setCurrentPreset(defaultPreset);
  }, [defaultPreset]);

  // Subscribe to transition state changes
  useEffect(() => {
    const unsubscribe = themeTransitionManager.subscribe((transitioning) => {
      setIsTransitioning(transitioning);
      
      if (transitioning && callbacksRef.current.onTransitionStart) {
        callbacksRef.current.onTransitionStart();
      } else if (!transitioning && callbacksRef.current.onTransitionEnd) {
        callbacksRef.current.onTransitionEnd();
      }
    });

    return unsubscribe;
  }, []);

  // Execute theme transition
  const executeTransition = useCallback(async (
    themeChangeCallback: () => void,
    preset?: keyof ThemeTransitionPresets
  ) => {
    // Check if animations should be disabled
    if (respectReducedMotion && !shouldAnimate) {
      themeChangeCallback();
      return;
    }

    await executeThemeTransition(themeChangeCallback, preset);
  }, [respectReducedMotion, shouldAnimate]);

  // Set transition preset
  const setPreset = useCallback((preset: keyof ThemeTransitionPresets) => {
    setThemeTransitionPreset(preset);
    setCurrentPreset(preset);
  }, []);

  // Update preset configuration
  const updatePreset = useCallback((
    preset: keyof ThemeTransitionPresets,
    config: Partial<ThemeTransitionConfig>
  ) => {
    themeTransitionManager.updatePreset(preset, config);
  }, []);

  // Get preset configuration
  const getPresetConfig = useCallback((preset: keyof ThemeTransitionPresets) => {
    return themeTransitionManager.getPreset(preset);
  }, []);

  // Export configuration
  const exportConfig = useCallback(() => {
    return themeTransitionManager.export();
  }, []);

  // Import configuration
  const importConfig = useCallback((json: string) => {
    const success = themeTransitionManager.import(json);
    if (success) {
      setCurrentPreset(themeTransitionManager.getCurrentPreset());
    }
    return success;
  }, []);

  // Reset configuration
  const resetConfig = useCallback(() => {
    themeTransitionManager.reset();
    setCurrentPreset('smooth');
  }, []);

  return {
    // State
    isTransitioning,
    currentPreset,
    availablePresets,
    
    // Actions
    executeTransition,
    setPreset,
    updatePreset,
    
    // Utilities
    getPresetConfig,
    exportConfig,
    importConfig,
    resetConfig
  };
}

/**
 * Hook for simple theme transition execution
 */
export function useThemeTransition(preset?: keyof ThemeTransitionPresets) {
  const { executeTransition, isTransitioning } = useThemeTransitions();
  
  const transition = useCallback((themeChangeCallback: () => void) => {
    return executeTransition(themeChangeCallback, preset);
  }, [executeTransition, preset]);
  
  return { transition, isTransitioning };
}

/**
 * Hook for transition state only
 */
export function useThemeTransitionState() {
  const [isTransitioning, setIsTransitioning] = useState(isThemeTransitioning());
  
  useEffect(() => {
    const unsubscribe = themeTransitionManager.subscribe(setIsTransitioning);
    return unsubscribe;
  }, []);
  
  return isTransitioning;
}

/**
 * Hook for preset management
 */
export function useThemeTransitionPresets() {
  const [currentPreset, setCurrentPreset] = useState<keyof ThemeTransitionPresets>(
    themeTransitionManager.getCurrentPreset()
  );
  const [availablePresets] = useState<(keyof ThemeTransitionPresets)[]>(
    getThemeTransitionPresets()
  );
  
  const setPreset = useCallback((preset: keyof ThemeTransitionPresets) => {
    setThemeTransitionPreset(preset);
    setCurrentPreset(preset);
  }, []);
  
  const getPresetConfig = useCallback((preset: keyof ThemeTransitionPresets) => {
    return themeTransitionManager.getPreset(preset);
  }, []);
  
  const updatePreset = useCallback((
    preset: keyof ThemeTransitionPresets,
    config: Partial<ThemeTransitionConfig>
  ) => {
    themeTransitionManager.updatePreset(preset, config);
  }, []);
  
  return {
    currentPreset,
    availablePresets,
    setPreset,
    getPresetConfig,
    updatePreset
  };
}

/**
 * Hook for custom transition effects
 */
export function useCustomThemeTransition(
  customConfig: Partial<ThemeTransitionConfig>,
  presetName: string = 'custom'
) {
  const { executeTransition, updatePreset } = useThemeTransitions();
  
  // Update custom preset with provided config
  useEffect(() => {
    updatePreset(presetName as keyof ThemeTransitionPresets, customConfig);
  }, [customConfig, presetName, updatePreset]);
  
  const transition = useCallback((themeChangeCallback: () => void) => {
    return executeTransition(themeChangeCallback, presetName as keyof ThemeTransitionPresets);
  }, [executeTransition, presetName]);
  
  return { transition };
}

/**
 * Hook for transition with element targeting
 */
export function useElementThemeTransition(elementRef: React.RefObject<HTMLElement>) {
  const { executeTransition } = useThemeTransitions();
  
  const transitionElement = useCallback(async (
    themeChangeCallback: () => void,
    preset?: keyof ThemeTransitionPresets
  ) => {
    if (!elementRef.current) {
      await executeTransition(themeChangeCallback, preset);
      return;
    }
    
    // Add specific transition class to element
    const element = elementRef.current;
    element.classList.add('theme-transition-target');
    
    try {
      await executeTransition(themeChangeCallback, preset);
    } finally {
      element.classList.remove('theme-transition-target');
    }
  }, [executeTransition, elementRef]);
  
  return { transitionElement };
}

/**
 * Hook for transition with callback queue
 */
export function useThemeTransitionQueue() {
  const { executeTransition, isTransitioning } = useThemeTransitions();
  const queueRef = useRef<Array<() => Promise<void>>>([]);
  const [queueLength, setQueueLength] = useState(0);
  
  const addToQueue = useCallback((themeChangeCallback: () => void, preset?: keyof ThemeTransitionPresets) => {
    const transitionPromise = () => executeTransition(themeChangeCallback, preset);
    queueRef.current.push(transitionPromise);
    setQueueLength(queueRef.current.length);
    
    // Process queue if not currently transitioning
    if (!isTransitioning && queueRef.current.length === 1) {
      processQueue();
    }
  }, [executeTransition, isTransitioning]);
  
  const processQueue = useCallback(async () => {
    while (queueRef.current.length > 0) {
      const nextTransition = queueRef.current.shift();
      if (nextTransition) {
        await nextTransition();
        setQueueLength(queueRef.current.length);
      }
    }
  }, []);
  
  const clearQueue = useCallback(() => {
    queueRef.current = [];
    setQueueLength(0);
  }, []);
  
  return {
    addToQueue,
    clearQueue,
    queueLength,
    isProcessing: isTransitioning
  };
}

/**
 * Hook for transition performance monitoring
 */
export function useThemeTransitionPerformance() {
  const [metrics, setMetrics] = useState<{
    lastTransitionDuration: number;
    averageTransitionDuration: number;
    transitionCount: number;
    failedTransitions: number;
  }>({ 
    lastTransitionDuration: 0,
    averageTransitionDuration: 0,
    transitionCount: 0,
    failedTransitions: 0
  });
  
  const startTimeRef = useRef<number>(0);
  const durationsRef = useRef<number[]>([]);
  
  useEffect(() => {
    const unsubscribe = themeTransitionManager.subscribe((isTransitioning) => {
      if (isTransitioning) {
        startTimeRef.current = performance.now();
      } else {
        const duration = performance.now() - startTimeRef.current;
        durationsRef.current.push(duration);
        
        // Keep only last 10 measurements
        if (durationsRef.current.length > 10) {
          durationsRef.current.shift();
        }
        
        const average = durationsRef.current.reduce((a, b) => a + b, 0) / durationsRef.current.length;
        
        setMetrics(prev => ({
          lastTransitionDuration: duration,
          averageTransitionDuration: average,
          transitionCount: prev.transitionCount + 1,
          failedTransitions: prev.failedTransitions
        }));
      }
    });
    
    return unsubscribe;
  }, []);
  
  const resetMetrics = useCallback(() => {
    setMetrics({
      lastTransitionDuration: 0,
      averageTransitionDuration: 0,
      transitionCount: 0,
      failedTransitions: 0
    });
    durationsRef.current = [];
  }, []);
  
  return { metrics, resetMetrics };
}