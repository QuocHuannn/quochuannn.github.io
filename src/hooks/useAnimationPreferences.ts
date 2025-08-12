import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AnimationPreferences, 
  AnimationConfig,
  AnimationPreferencesManager,
  animationPreferences as defaultManager 
} from '../utils/animationPreferences';

export interface UseAnimationPreferencesOptions {
  manager?: AnimationPreferencesManager;
  syncOnMount?: boolean;
  enableRealTimeSync?: boolean;
  applyCSSProperties?: boolean;
}

export interface UseAnimationPreferencesReturn {
  preferences: AnimationPreferences;
  setPreferences: (prefs: Partial<AnimationPreferences>) => void;
  updateAnimationConfig: (
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
    config: Partial<AnimationConfig>
  ) => void;
  setCustomPreset: (name: string, config: AnimationConfig) => void;
  removeCustomPreset: (name: string) => void;
  getEffectiveConfig: (
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
  ) => AnimationConfig;
  getCustomPreset: (name: string) => AnimationConfig | null;
  shouldAnimate: (type?: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>) => boolean;
  getCSSTransition: (
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
    property?: string
  ) => string;
  getCSSAnimationDuration: (
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
  ) => string;
  reducedMotion: boolean;
  reset: () => void;
  export: () => string;
  import: (json: string) => boolean;
}

/**
 * Hook để quản lý animation preferences
 */
export const useAnimationPreferences = (
  options: UseAnimationPreferencesOptions = {}
): UseAnimationPreferencesReturn => {
  const {
    manager = defaultManager,
    syncOnMount = true,
    enableRealTimeSync = true,
    applyCSSProperties = true
  } = options;

  const [preferences, setPreferencesState] = useState<AnimationPreferences>(() => {
    if (syncOnMount) {
      return manager.getPreferences();
    }
    return {
      globalAnimationsEnabled: true,
      respectReducedMotion: true,
      themeTransition: { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', enabled: true },
      pageTransition: { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', enabled: true },
      componentTransition: { duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', enabled: true },
      hoverAnimations: { duration: 150, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', enabled: true },
      clickAnimations: { duration: 100, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', enabled: true },
      loadingAnimations: { duration: 1000, easing: 'linear', enabled: true },
      progressAnimations: { duration: 500, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', enabled: true },
      scrollAnimations: { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', enabled: true },
      parallaxAnimations: { duration: 0, easing: 'linear', enabled: true },
      customPresets: {}
    };
  });

  const [reducedMotion, setReducedMotion] = useState(() => manager.getReducedMotionPreference());
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const reducedMotionUnsubscribeRef = useRef<(() => void) | null>(null);

  // Load preferences on mount if not synced initially
  useEffect(() => {
    if (!syncOnMount) {
      const prefs = manager.getPreferences();
      setPreferencesState(prefs);
    }
  }, [manager, syncOnMount]);

  // Subscribe to preference changes
  useEffect(() => {
    if (!enableRealTimeSync) return;

    const handlePreferencesChange = (newPreferences: AnimationPreferences) => {
      setPreferencesState(newPreferences);
    };

    unsubscribeRef.current = manager.subscribe(handlePreferencesChange);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [manager, enableRealTimeSync]);

  // Subscribe to reduced motion changes
  useEffect(() => {
    if (!enableRealTimeSync) return;

    const handleReducedMotionChange = (newReducedMotion: boolean) => {
      setReducedMotion(newReducedMotion);
    };

    reducedMotionUnsubscribeRef.current = manager.subscribeToReducedMotion(handleReducedMotionChange);

    return () => {
      if (reducedMotionUnsubscribeRef.current) {
        reducedMotionUnsubscribeRef.current();
        reducedMotionUnsubscribeRef.current = null;
      }
    };
  }, [manager, enableRealTimeSync]);

  // Apply CSS properties on mount and when preferences change
  useEffect(() => {
    if (applyCSSProperties) {
      manager.applyCSSCustomProperties();
    }
  }, [manager, preferences, applyCSSProperties]);

  const setPreferences = useCallback((prefs: Partial<AnimationPreferences>) => {
    manager.setPreferences(prefs);
  }, [manager]);

  const updateAnimationConfig = useCallback((
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
    config: Partial<AnimationConfig>
  ) => {
    manager.updateAnimationConfig(type, config);
  }, [manager]);

  const setCustomPreset = useCallback((name: string, config: AnimationConfig) => {
    manager.setCustomPreset(name, config);
  }, [manager]);

  const removeCustomPreset = useCallback((name: string) => {
    manager.removeCustomPreset(name);
  }, [manager]);

  const getEffectiveConfig = useCallback((
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
  ) => {
    return manager.getEffectiveConfig(type);
  }, [manager]);

  const getCustomPreset = useCallback((name: string) => {
    return manager.getCustomPreset(name);
  }, [manager]);

  const shouldAnimate = useCallback((type?: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>) => {
    return manager.shouldAnimate(type);
  }, [manager]);

  const getCSSTransition = useCallback((
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
    property: string = 'all'
  ) => {
    return manager.getCSSTransition(type, property);
  }, [manager]);

  const getCSSAnimationDuration = useCallback((
    type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
  ) => {
    return manager.getCSSAnimationDuration(type);
  }, [manager]);

  const reset = useCallback(() => {
    manager.reset();
  }, [manager]);

  const exportPreferences = useCallback(() => {
    return manager.export();
  }, [manager]);

  const importPreferences = useCallback((json: string) => {
    return manager.import(json);
  }, [manager]);

  return {
    preferences,
    setPreferences,
    updateAnimationConfig,
    setCustomPreset,
    removeCustomPreset,
    getEffectiveConfig,
    getCustomPreset,
    shouldAnimate,
    getCSSTransition,
    getCSSAnimationDuration,
    reducedMotion,
    reset,
    export: exportPreferences,
    import: importPreferences
  };
};

/**
 * Hook đơn giản để chỉ check xem có nên animate không
 */
export const useShouldAnimate = (
  type?: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
): boolean => {
  const { shouldAnimate } = useAnimationPreferences({ 
    syncOnMount: false, 
    enableRealTimeSync: false,
    applyCSSProperties: false
  });
  
  return shouldAnimate(type);
};

/**
 * Hook để lấy CSS transition cho specific animation type
 */
export const useCSSTransition = (
  type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
  property: string = 'all'
): string => {
  const { getCSSTransition } = useAnimationPreferences({ 
    syncOnMount: false, 
    enableRealTimeSync: false,
    applyCSSProperties: false
  });
  
  return getCSSTransition(type, property);
};

/**
 * Hook để theo dõi reduced motion preference
 */
export const useReducedMotion = (): boolean => {
  const { reducedMotion } = useAnimationPreferences({ 
    syncOnMount: false, 
    enableRealTimeSync: true,
    applyCSSProperties: false
  });
  
  return reducedMotion;
};

/**
 * Hook để lấy animation config cho specific type
 */
export const useAnimationConfig = (
  type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>
): AnimationConfig => {
  const { getEffectiveConfig } = useAnimationPreferences({ 
    syncOnMount: false, 
    enableRealTimeSync: true,
    applyCSSProperties: false
  });
  
  return getEffectiveConfig(type);
};

/**
 * Hook để quản lý custom animation presets
 */
export const useCustomAnimationPresets = () => {
  const { 
    preferences, 
    setCustomPreset, 
    removeCustomPreset, 
    getCustomPreset 
  } = useAnimationPreferences();
  
  return {
    presets: preferences.customPresets,
    setPreset: setCustomPreset,
    removePreset: removeCustomPreset,
    getPreset: getCustomPreset
  };
};

/**
 * Hook để tạo animated style object
 */
export const useAnimatedStyle = (
  type: keyof Omit<AnimationPreferences, 'globalAnimationsEnabled' | 'respectReducedMotion' | 'customPresets'>,
  properties: string[] = ['all']
) => {
  const { getCSSTransition, shouldAnimate } = useAnimationPreferences({ 
    syncOnMount: false, 
    enableRealTimeSync: true,
    applyCSSProperties: false
  });
  
  const animate = shouldAnimate(type);
  
  return {
    transition: animate ? properties.map(prop => getCSSTransition(type, prop)).join(', ') : 'none',
    willChange: animate ? properties.join(', ') : 'auto'
  };
};