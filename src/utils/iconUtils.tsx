import React from 'react';
import {
  Code,
  Database,
  Globe,
  Smartphone,
  Server,
  Wrench,
  Palette,
  BarChart3,
  Shield,
  Cloud,
  GitBranch,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Settings,
  Terminal,
  FileCode,
  Layers,
  Box
} from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  // Frontend
  'javascript': Code,
  'react': Code,
  'typescript': FileCode,
  'html': Globe,
  'css': Palette,
  'vue': Code,
  'angular': Code,
  'svelte': Code,
  'nextjs': Code,
  'nuxt': Code,
  
  // Backend
  'nodejs': Server,
  'python': Code,
  'java': Code,
  'csharp': Code,
  'php': Server,
  'ruby': Code,
  'go': Code,
  'rust': Code,
  'express': Server,
  'fastapi': Server,
  'django': Server,
  'spring': Server,
  'laravel': Server,
  
  // Database
  'postgresql': Database,
  'mysql': Database,
  'mongodb': Database,
  'redis': Database,
  'oracle': Database,
  'sqlite': Database,
  'firebase': Database,
  'supabase': Database,
  
  // Mobile
  'reactnative': Smartphone,
  'flutter': Smartphone,
  'ionic': Smartphone,
  'xamarin': Smartphone,
  'swift': Smartphone,
  'kotlin': Smartphone,
  
  // Tools & Technologies
  'docker': Box,
  'kubernetes': Layers,
  'aws': Cloud,
  'azure': Cloud,
  'gcp': Cloud,
  'git': GitBranch,
  'github': GitBranch,
  'gitlab': GitBranch,
  'jenkins': Settings,
  'webpack': Wrench,
  'vite': Wrench,
  'babel': Wrench,
  'eslint': Shield,
  'prettier': Palette,
  
  // Analytics & Monitoring
  'googleanalytics': BarChart3,
  'mixpanel': BarChart3,
  'amplitude': BarChart3,
  'sentry': Shield,
  'datadog': Monitor,
  
  // Default icons
  'default': Code,
  'frontend': Globe,
  'backend': Server,
  'database': Database,
  'mobile': Smartphone,
  'tools': Wrench,
  'analytics': BarChart3,
  'security': Shield,
  'cloud': Cloud
};

export const renderIcon = (iconName: string | undefined, className?: string) => {
  if (!iconName || typeof iconName !== 'string') {
    const IconComponent = iconMap['default'];
    return <IconComponent className={className || 'w-5 h-5'} />;
  }
  
  const normalizedName = iconName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const IconComponent = iconMap[normalizedName] || iconMap['default'];
  
  return <IconComponent className={className || 'w-5 h-5'} />;
};

export const getIconByCategory = (category: string) => {
  const normalizedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '');
  return iconMap[normalizedCategory] || iconMap['default'];
};