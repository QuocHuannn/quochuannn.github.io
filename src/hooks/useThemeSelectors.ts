import { useMemo } from 'react';
import { useTheme } from './useTheme';
import type { Theme } from './useTheme';

/**
 * Hook để chỉ subscribe vào theme value, không bao gồm các functions
 * Giúp tránh re-render khi theme functions thay đổi reference
 */
export const useThemeValue = (): Theme => {
  const { theme } = useTheme();
  return theme;
};

/**
 * Hook để chỉ subscribe vào actual theme (resolved theme)
 * Hữu ích cho components chỉ cần biết theme hiện tại đang được áp dụng
 */
export const useActualTheme = (): 'light' | 'dark' => {
  const { actualTheme } = useTheme();
  return actualTheme;
};

/**
 * Hook để check xem có đang ở dark mode không
 * Optimized cho components chỉ cần boolean check
 */
export const useIsDarkMode = (): boolean => {
  const actualTheme = useActualTheme();
  return useMemo(() => actualTheme === 'dark', [actualTheme]);
};

/**
 * Hook để check xem có đang ở light mode không
 * Optimized cho components chỉ cần boolean check
 */
export const useIsLightMode = (): boolean => {
  const actualTheme = useActualTheme();
  return useMemo(() => actualTheme === 'light', [actualTheme]);
};



/**
 * Hook để lấy theme display name
 * Memoized để tránh re-computation
 */
export const useThemeDisplayName = (): string => {
  const { theme } = useTheme();
  
  return useMemo(() => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      default: return 'Light';
    }
  }, [theme]);
};

/**
 * Hook để lấy theme toggle function
 * Separated để components chỉ cần toggle function không bị re-render khi theme value thay đổi
 */
export const useThemeToggle = () => {
  const { toggleTheme } = useTheme();
  return toggleTheme;
};

/**
 * Hook để lấy set theme function
 * Separated để components chỉ cần set function không bị re-render khi theme value thay đổi
 */
export const useSetTheme = () => {
  const { setTheme } = useTheme();
  return setTheme;
};

/**
 * Hook để lấy theme CSS class name
 * Hữu ích cho conditional styling
 */
export const useThemeClassName = (): string => {
  const actualTheme = useActualTheme();
  return useMemo(() => `theme-${actualTheme}`, [actualTheme]);
};

/**
 * Hook để lấy theme-specific values
 * Generic hook cho việc select values dựa trên theme
 */
export const useThemeSpecificValue = <T>(lightValue: T, darkValue: T): T => {
  const isDark = useIsDarkMode();
  return useMemo(() => isDark ? darkValue : lightValue, [isDark, lightValue, darkValue]);
};

/**
 * Hook để lấy theme state cho debugging
 * Chỉ sử dụng trong development
 */
export const useThemeDebug = () => {
  const context = useTheme();
  
  return useMemo(() => ({
    theme: context.theme,
    actualTheme: context.actualTheme,
    isDarkMode: context.actualTheme === 'dark',
    isLightMode: context.actualTheme === 'light'
  }), [context.theme, context.actualTheme]);
};