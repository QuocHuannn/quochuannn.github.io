import { SkillCategory, Experience, Project, ContactInfo } from '../types';

// Personal Information
export const PERSONAL_INFO = {
  name: 'Trương Quốc Huân',
  title: 'Fullstack Developer',
  description: 'Passionate Fullstack Developer with expertise in modern web technologies including React, Node.js, and cloud platforms. Experienced in building scalable web applications and delivering high-quality software solutions.',
  email: 'truonghuan0709@gmail.com',
  phone: '0335597676',
  location: 'Ho Chi Minh City, Vietnam',
  avatar: '/images/ava-dlat.JPG'
};

// Navigation Items
export const NAVIGATION_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

// Skills Data
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend',
    color: 'accent-blue',
    skills: [
      { name: 'React/Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 88 },
  { name: 'CSS/SCSS', level: 85 },
      { name: 'Framer Motion', level: 80 },
      { name: 'Vue.js', level: 78 },
    ]
  },
  {
    title: 'Backend',
    color: 'accent-green',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'MongoDB', level: 82 },
      { name: 'Express.js', level: 88 },
      { name: 'FastAPI', level: 75 },
    ]
  },
  {
    title: 'Tools & Others',
    color: 'accent-purple',
    skills: [
      { name: 'Git/GitHub', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Figma', level: 85 },
      { name: 'Linux', level: 80 },
      { name: 'CI/CD', level: 72 },
    ]
  },
];

// Experience Data
export const EXPERIENCES: Experience[] = [
  {
    title: 'Senior Full-Stack Developer',
    company: 'Tech Innovation Co.',
    period: '2023 - Present',
    description: 'Led development of modern web applications using React, Node.js, and cloud technologies. Mentored junior developers and implemented best practices for code quality and performance.',
    technologies: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker'],
    color: 'accent-blue'
  },
  {
    title: 'Frontend Developer',
    company: 'Creative Digital Agency',
    period: '2021 - 2023',
    description: 'Developed responsive web applications and collaborated with design teams to create engaging user experiences. Specialized in React ecosystem and modern CSS frameworks.',
    technologies: ['Vue.js', 'JavaScript', 'SCSS', 'Figma', 'Webpack', 'Jest'],
    color: 'accent-green'
  },
  {
    title: 'Junior Developer',
    company: 'StartupXYZ',
    period: '2020 - 2021',
    description: 'Started career building web applications and learning modern development practices. Contributed to multiple projects and gained experience in full-stack development.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap'],
    color: 'accent-purple'
  },
];

// Projects Data
export const PROJECTS: Project[] = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with modern UI/UX, payment integration, and admin dashboard. Features include product management, order tracking, and analytics.',
    image: '/api/placeholder/400/300',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    color: 'accent-blue'
  },
  {
    title: 'Modern Portfolio Website',
    description: 'Interactive portfolio with modern animations and responsive design. Features smooth scrolling, dynamic effects, and immersive user experiences.',
    image: '/api/placeholder/400/300',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'TypeScript', 'Vite'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    color: 'accent-purple'
  },
  {
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates and team features. Includes drag-and-drop functionality, notifications, and progress tracking.',
    image: '/api/placeholder/400/300',
    technologies: ['Vue.js', 'Express', 'Socket.io', 'MongoDB', 'JWT'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    color: 'accent-green'
  },
  {
    title: 'AI Chat Application',
    description: 'Modern chat application with AI integration and real-time messaging. Features include smart responses, file sharing, and conversation history.',
    image: '/api/placeholder/400/300',
    technologies: ['Next.js', 'OpenAI', 'Prisma', 'WebSocket', 'Tailwind'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    color: 'accent-orange'
  },
  {
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for data visualization with charts, graphs, and real-time updates. Built for business intelligence and analytics.',
    image: '/api/placeholder/400/300',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    color: 'accent-teal'
  },
  {
    title: 'Mobile-First PWA',
    description: 'Progressive Web Application with offline capabilities and native-like experience. Features push notifications and background sync.',
    image: '/api/placeholder/400/300',
    technologies: ['React', 'PWA', 'Service Workers', 'IndexedDB', 'Workbox'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    color: 'accent-pink'
  },
];

// Social Links
export const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/truong-quoc-huan',
    icon: 'linkedin'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/QuocHuannn',
    icon: 'github'
  },
  {
    name: 'Email',
    url: 'mailto:truonghuan0709@gmail.com',
    icon: 'email'
  },
];

// Contact Information with Icons (will be replaced with actual icons in components)
export const CONTACT_INFO = [
  {
    title: 'Email',
    value: PERSONAL_INFO.email,
    color: 'accent-blue'
  },
  {
    title: 'Phone',
    value: PERSONAL_INFO.phone,
    color: 'accent-green'
  },
  {
    title: 'Location',
    value: PERSONAL_INFO.location,
    color: 'accent-purple'
  },
];