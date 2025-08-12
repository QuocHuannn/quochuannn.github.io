import { useTheme } from './useTheme';

export const useThemeClassName = () => {
  const { actualTheme } = useTheme();
  
  return {
    theme: actualTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    getThemeClass: (lightClass: string, darkClass: string) => 
      actualTheme === 'dark' ? darkClass : lightClass,
    conditionalClass: (condition: boolean, trueClass: string, falseClass: string = '') =>
      condition ? trueClass : falseClass
  };
};