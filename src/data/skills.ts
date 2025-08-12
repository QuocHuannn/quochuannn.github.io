import React from 'react';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiMui,
  SiCss3,
  SiFramer,
  SiGo,
  SiNestjs,
  SiExpress,
  SiNodedotjs,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiOracle,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiJenkins,
  SiAmazon,
  SiNginx,
  SiApache,
  SiTrpc,
  SiRabbitmq,
  SiApachekafka,
  SiPrometheus
} from 'react-icons/si';
import {
  Code2,
  Database,
  Server,
  Settings
} from 'lucide-react';

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  icon?: React.ReactNode;
}

export const skills: Skill[] = [
  // Frontend
  {
    name: "React",
    level: 85,
    category: "frontend",
    icon: React.createElement(SiReact)
  },
  {
    name: "TypeScript",
    level: 85,
    category: "frontend",
    icon: React.createElement(SiTypescript)
  },
  {
    name: "JavaScript",
    level: 90,
    category: "frontend",
    icon: React.createElement(SiJavascript)
  },
  {
    name: "Material-UI (MUI)",
    level: 80,
    category: "frontend",
    icon: React.createElement(SiMui)
  },
  {
    name: "CSS Keyframes",
    level: 75,
    category: "frontend",
    icon: React.createElement(SiCss3)
  },
  {
    name: "Framer Motion",
    level: 70,
    category: "frontend",
    icon: React.createElement(SiFramer)
  },
  
  // Backend
  {
    name: "Go (Golang)",
    level: 85,
    category: "backend",
    icon: React.createElement(SiGo)
  },
  {
    name: "Gin Framework",
    level: 80,
    category: "backend",
    icon: React.createElement(SiGo)
  },
  {
    name: "NestJS",
    level: 85,
    category: "backend",
    icon: React.createElement(SiNestjs)
  },
  {
    name: "Express.js",
    level: 85,
    category: "backend",
    icon: React.createElement(SiExpress)
  },
  {
    name: "Node.js",
    level: 80,
    category: "backend",
    icon: React.createElement(SiNodedotjs)
  },
  
  // Database
  {
    name: "PostgreSQL",
    level: 85,
    category: "database",
    icon: React.createElement(SiPostgresql)
  },
  {
    name: "MySQL",
    level: 85,
    category: "database",
    icon: React.createElement(SiMysql)
  },
  {
    name: "MongoDB",
    level: 80,
    category: "database",
    icon: React.createElement(SiMongodb)
  },
  {
    name: "Oracle",
    level: 70,
    category: "database",
    icon: React.createElement(SiOracle)
  },
  {
    name: "Redis",
    level: 75,
    category: "database",
    icon: React.createElement(SiRedis)
  },
  
  // Tools
  {
    name: "Docker",
    level: 85,
    category: "tools",
    icon: React.createElement(SiDocker)
  },
  {
    name: "Kubernetes",
    level: 75,
    category: "tools",
    icon: React.createElement(SiKubernetes)
  },
  {
    name: "GitHub Actions",
    level: 80,
    category: "tools",
    icon: React.createElement(SiGithubactions)
  },
  {
    name: "Jenkins",
    level: 75,
    category: "tools",
    icon: React.createElement(SiJenkins)
  },
  {
    name: "AWS",
    level: 75,
    category: "tools",
    icon: React.createElement(SiAmazon)
  },
  {
    name: "Azure",
    level: 70,
    category: "tools",
    icon: React.createElement(Server)
  },
  {
    name: "Nginx",
    level: 75,
    category: "tools",
    icon: React.createElement(SiNginx)
  },
  {
    name: "Apache",
    level: 70,
    category: "tools",
    icon: React.createElement(SiApache)
  },
  {
    name: "tRPC",
    level: 75,
    category: "tools",
    icon: React.createElement(SiTrpc)
  },
  {
    name: "RabbitMQ",
    level: 70,
    category: "tools",
    icon: React.createElement(SiRabbitmq)
  },
  {
    name: "Kafka",
    level: 70,
    category: "tools",
    icon: React.createElement(SiApachekafka)
  },
  {
    name: "Prometheus",
    level: 65,
    category: "tools",
    icon: React.createElement(SiPrometheus)
  }
];

export interface SkillCategory {
  name: string;
  color: string;
  icon: React.ReactNode;
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend Development",
    color: "accent-blue",
    icon: React.createElement(Code2, { size: 24 })
  },
  {
    name: "Backend Development",
    color: "accent-green",
    icon: React.createElement(Server, { size: 24 })
  },
  {
    name: "Database",
    color: "accent-purple",
    icon: React.createElement(Database, { size: 24 })
  },
  {
    name: "Tools & Technologies",
    color: "accent-orange",
    icon: React.createElement(Settings, { size: 24 })
  }
];

// getSkillsByCategory function moved to utils/skillUtils.ts