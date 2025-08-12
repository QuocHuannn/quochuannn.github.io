export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  description: string[];
  technologies: string[];
  type: 'work' | 'education' | 'project';
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "Fullstack Developer",
    company: "NTC",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2025-05",
    endDate: "Present",
    description: [
      "Freelance project to build an educational LMS platform",
      "Developed and maintained a learning management system",
      "Built RESTful APIs and implemented admin interfaces",
      "Optimized user experience and collaborated on both frontend and backend development",
      "Worked in a team of 2 developers"
    ],
    technologies: ["Go (Gin)", "Docker", "MySQL", "Event-driven architecture", "GitHub Actions CI/CD", "RabbitMQ", "Nginx", "React", "TypeScript", "CSS Keyframes", "Framer Motion", "MUI", "Toastify"],
    type: "work"
  },
  {
    id: "exp-2",
    title: "DevOps Engineer",
    company: "ElroyDevops",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2025-04",
    endDate: "2025-06",
    description: [
      "Personal project to learn and practice DevOps",
      "System implementation and maintenance",
      "Deployed microservices with Kubernetes",
      "Implemented CI/CD pipeline with Jenkins",
      "Set up monitoring with Zabbix on GitLab server with Ubuntu virtual machine"
    ],
    technologies: ["ReactJS", "Java Spring Boot", "MariaDB", "Docker", "Microservice", "Kubernetes", "Jenkins", "Zabbix", "GitLab", "Ubuntu"],
    type: "project"
  },
  {
    id: "exp-3",
    title: "Developer",
    company: "Distributed System",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2025-01",
    endDate: "2025-04",
    description: [
      "Practice and final project for graduate scheme",
      "Worked in a team of 2 developers",
      "Implemented distributed system architecture",
      "Built TCP/IP socket communication and gRPC services",
      "Applied Consistent Hashing algorithm and Two-Phase Commit (2PC) protocol"
    ],
    technologies: ["Go (Golang)", "TCP/IP sockets", "gRPC", "Message Queue patterns", "Publisher/Subscriber", "Consistent Hashing", "Two-Phase Commit (2PC)"],
    type: "project"
  },
  {
    id: "exp-4",
    title: "Backend Developer",
    company: "Go to Work",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2024-12",
    endDate: "2025-04",
    description: [
      "Personal project to develop a train ticket sales website",
      "Built comprehensive backend system",
      "Implemented database migrations with Goose",
      "Integrated Redis for caching and Kafka for message queuing",
      "Used HTML templates for server-side rendering"
    ],
    technologies: ["Golang (Gin framework)", "MySQL", "GORM", "Goose", "Redis", "Kafka", "HTML templates", "Docker", "Makefile"],
    type: "project"
  },
  {
    id: "exp-5",
    title: "Backend Developer",
    company: "NestProject",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2024-09",
    endDate: "2025-03",
    description: [
      "Modular backend system for recruitment, user management, and enterprise platforms",
      "Built comprehensive backend architecture",
      "Implemented JWT-based authentication and Mongoose data modeling",
      "Created Swagger API documentation and soft delete functionality",
      "Developed environment-based configuration and seed data generation with centralized error handling"
    ],
    technologies: ["NestJS", "TypeScript", "MongoDB (Mongoose)", "JWT Auth", "Swagger", "EJS"],
    type: "project"
  },
  {
    id: "exp-6",
    title: "Backend Developer",
    company: "AceSQL",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2024-02",
    endDate: "2024-06",
    description: [
      "College graduation project: Student management website with AI-generated SQL questions",
      "Worked in a team of 5 developers",
      "Built RESTful APIs with secure authentication and password hashing",
      "Implemented dynamic email notifications and custom middlewares",
      "Developed real-time analytics and chart generation features"
    ],
    technologies: ["Node.js", "Express.js", "Sequelize", "Passport.js", "JWT", "bcrypt", "Socket.io", "Nodemailer", "EJS", "PostgreSQL/MySQL", "Hugging Face"],
    type: "project"
  },
  {
    id: "edu-1",
    title: "Bachelor of Information System",
    company: "VNU - Ho Chi Minh University of Science - HCMUS",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2020-10",
    endDate: "2024-09",
    description: [
      "Graduated with Bachelor of Science in Information System",
      "Completed comprehensive coursework in software engineering and system design",
      "Gained expertise in backend development, databases, and distributed systems",
      "Participated in team projects involving full-stack application development",
      "Developed strong foundation in computer science principles and software architecture"
    ],
    technologies: ["Java", "Python", "JavaScript", "SQL", "Git", "System Design", "Database Management"],
    type: "education"
  }
];

export const getExperiencesByType = (type: Experience['type']) => {
  return experiences.filter(exp => exp.type === type);
};

export const formatDate = (dateString: string) => {
  if (dateString === 'Present') return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};