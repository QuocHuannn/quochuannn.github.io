export const profile = {
  name: "Truong Quoc Huan",
  title: "Fullstack Developer",
  description:
    "Passionate Fullstack Developer with expertise in modern web technologies including React, Node.js, and cloud platforms. Building scalable web applications and delivering high-quality software solutions.",
  email: "truonghuan0709@gmail.com",
  location: "Ho Chi Minh City, Vietnam",
  avatar: "/images/ava-dlat.jpg",
  social: {
    github: "https://github.com/QuocHuannn",
    linkedin: "https://linkedin.com/in/quochuannn",
  },
}

export interface SkillItem {
  name: string
  /** Devicon slug for CDN icon, or null if no icon available */
  icon: string | null
}

export interface SkillCategory {
  title: string
  color: string
  items: SkillItem[]
}

export const skills: SkillCategory[] = [
  {
    title: "3D & Creative",
    color: "accent-cyan",
    items: [
      { name: "Blender", icon: "blender" },
      { name: "Three.js", icon: "threejs" },
      { name: "WebGL", icon: null },
      { name: "React Three Fiber", icon: "react" },
      { name: "GSAP", icon: null },
      { name: "Shader", icon: null },
    ],
  },
  {
    title: "Frontend",
    color: "accent-blue",
    items: [
      { name: "React", icon: "react" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind", icon: "tailwindcss" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Vue.js", icon: "vuejs" },
      { name: "Framer Motion", icon: null },
      { name: "SCSS", icon: "sass" },
    ],
  },
  {
    title: "Backend",
    color: "accent-green",
    items: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Python", icon: "python" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "NestJS", icon: "nestjs" },
      { name: "Django", icon: "django" },
      { name: "GraphQL", icon: "graphql" },
      { name: "MySQL", icon: "mysql" },
      { name: "Express.js", icon: "express" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "Nginx", icon: "nginx" },
      { name: "SSL", icon: null },
    ],
  },
  {
    title: "Tools",
    color: "accent-purple",
    items: [
      { name: "Git", icon: "git" },
      { name: "Docker", icon: "docker" },
      { name: "Figma", icon: "figma" },
      { name: "Linux", icon: "linux" },
      { name: "AWS", icon: "amazonwebservices" },
      { name: "Cloudflare", icon: "cloudflare" },
      { name: "Firebase", icon: "firebase" },
      { name: "Supabase", icon: "supabase" },
      { name: "CI/CD", icon: null },
      { name: "Jira", icon: "jira" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
]

export const projects = [
  {
    title: "3D Portfolio Website",
    description:
      "Interactive cyberpunk-themed portfolio built with Three.js and React Three Fiber.",
    techStack: ["Three.js", "React", "TypeScript", "Tailwind"],
    liveUrl: "https://quochuannn.github.io",
    githubUrl: "https://github.com/QuocHuannn/quochuannn.github.io",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce app with product management, cart, and payment integration.",
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Real-time Chat App",
    description:
      "WebSocket-based chat application with rooms, typing indicators, and file sharing.",
    techStack: ["React", "Socket.io", "Express", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Task Management Dashboard",
    description:
      "Kanban-style project management tool with drag-and-drop and team collaboration.",
    techStack: ["Vue.js", "Django", "Redis", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
  },
]

