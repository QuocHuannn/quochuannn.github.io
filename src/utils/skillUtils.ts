export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  icon?: string;
  description?: string;
}

import { skills } from '../data/skills';

export const getSkillsByCategory = (categoryName: string) => {
  const categoryMap: { [key: string]: string } = {
    "Frontend Development": "frontend",
    "Backend Development": "backend",
    "Database": "database",
    "Tools & Technologies": "tools"
  };
  
  const categoryKey = categoryMap[categoryName];
  if (!categoryKey) {
    console.warn(`Category not found: ${categoryName}`);
    return [];
  }
  
  const filteredSkills = skills.filter(skill => skill.category === categoryKey);
  
  // Debug logging for Database category
  if (categoryName === 'Database') {
    console.log('🔍 Database Debug Info in getSkillsByCategory:');
    console.log('Category name:', categoryName);
    console.log('Category key:', categoryKey);
    console.log('Skills found:', filteredSkills.length);
    console.log('Skills list:', filteredSkills.map(s => s.name));
    console.log('All database skills in data:', skills.filter(s => s.category === 'database'));
  }
  
  return filteredSkills;
};

export const getSkillLevelColor = (level: string): string => {
  switch (level) {
    case 'Expert':
      return 'bg-emerald-500 dark:bg-emerald-400';
    case 'Advanced':
      return 'bg-blue-500 dark:bg-blue-400';
    case 'Intermediate':
      return 'bg-amber-500 dark:bg-amber-400';
    case 'Beginner':
      return 'bg-slate-500 dark:bg-slate-400';
    default:
      return 'bg-slate-400 dark:bg-slate-300';
  }
};

export const getSkillLevelText = (level: string): string => {
  return level;
};

export const sortSkillsByLevel = (skills: Skill[]): Skill[] => {
  const levelOrder = { 'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1 };
  return skills.sort((a, b) => (levelOrder[a.level] || 0) - (levelOrder[b.level] || 0));
};