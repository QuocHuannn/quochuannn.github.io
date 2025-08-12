export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  category: 'web' | 'mobile' | 'desktop' | 'api';
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "NTC - Educational LMS Platform",
    description: "A comprehensive learning management system for educational institutions",
    longDescription: "Freelance project to build an educational LMS platform with comprehensive learning management features. Developed both frontend and backend components with modern technologies, implementing RESTful APIs, admin interfaces, and optimized user experience for educational content delivery.",
    technologies: ["Go (Gin)", "Docker", "MySQL", "Event-driven architecture", "GitHub Actions CI/CD", "RabbitMQ", "Nginx", "React", "TypeScript", "CSS Keyframes", "Framer Motion", "MUI", "Toastify"],
    features: [
      "Learning management system with course creation",
      "RESTful API architecture with Go Gin framework",
      "Admin interface for content management",
      "Event-driven architecture with RabbitMQ",
      "CI/CD pipeline with GitHub Actions",
      "Responsive frontend with React and TypeScript",
      "Modern UI animations with Framer Motion",
      "Containerized deployment with Docker"
    ],
    githubUrl: "https://github.com/QuocHuannn/ntc-lms",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=educational%20learning%20management%20system%20interface%20with%20course%20dashboard%20modern%20clean%20design&image_size=landscape_16_9",
    status: "in-progress",
    startDate: "2025-05",
    category: "web"
  },
  {
    id: "project-2",
    title: "ElroyDevops - DevOps Practice Platform",
    description: "Personal DevOps project for learning and practicing modern DevOps technologies",
    longDescription: "A comprehensive DevOps practice project implementing microservices architecture with Kubernetes orchestration, CI/CD pipelines, and monitoring solutions. Built to demonstrate proficiency in modern DevOps practices and cloud-native technologies.",
    technologies: ["ReactJS", "Java Spring Boot", "MariaDB", "Docker", "Microservice", "Kubernetes", "Jenkins", "Zabbix", "GitLab", "Ubuntu"],
    features: [
      "Microservices architecture with Spring Boot",
      "Kubernetes orchestration and deployment",
      "CI/CD pipeline implementation with Jenkins",
      "System monitoring with Zabbix",
      "GitLab integration for version control",
      "Docker containerization for all services",
      "Ubuntu-based virtual machine setup",
      "Frontend dashboard with ReactJS"
    ],
    githubUrl: "https://github.com/QuocHuannn/elroy-devops",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=devops%20dashboard%20with%20kubernetes%20monitoring%20charts%20microservices%20architecture%20diagram&image_size=landscape_16_9",
    status: "completed",
    startDate: "2025-04",
    endDate: "2025-06",
    category: "api"
  },
  {
    id: "project-3",
    title: "Distributed System Architecture",
    description: "Graduate project implementing distributed system patterns and algorithms",
    longDescription: "Practice and final project for graduate scheme focusing on distributed system architecture. Implemented advanced distributed computing concepts including TCP/IP socket communication, gRPC services, consistent hashing, and two-phase commit protocol for distributed transactions.",
    technologies: ["Go (Golang)", "TCP/IP sockets", "gRPC", "Message Queue patterns", "Publisher/Subscriber", "Consistent Hashing", "Two-Phase Commit (2PC)"],
    features: [
      "TCP/IP socket communication implementation",
      "gRPC service architecture",
      "Message queue patterns with Publisher/Subscriber",
      "Consistent hashing algorithm for data distribution",
      "Two-Phase Commit (2PC) protocol implementation",
      "Distributed transaction management",
      "Fault-tolerant system design",
      "Performance optimization for distributed workloads"
    ],
    githubUrl: "https://github.com/QuocHuannn/distributed-system",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=distributed%20system%20architecture%20diagram%20with%20nodes%20connections%20data%20flow%20technical%20illustration&image_size=landscape_16_9",
    status: "completed",
    startDate: "2025-01",
    endDate: "2025-04",
    category: "api"
  },
  {
    id: "project-4",
    title: "Go to Work - Train Ticket Sales",
    description: "Comprehensive train ticket booking system with modern backend architecture",
    longDescription: "Personal project developing a train ticket sales website with comprehensive backend system. Implemented database migrations, caching with Redis, message queuing with Kafka, and server-side rendering with HTML templates. Built with Go and modern backend practices.",
    technologies: ["Golang (Gin framework)", "MySQL", "GORM", "Goose", "Redis", "Kafka", "HTML templates", "Docker", "Makefile"],
    features: [
      "Train ticket booking and management system",
      "Database migrations with Goose",
      "Redis caching for improved performance",
      "Kafka message queuing for async processing",
      "Server-side rendering with HTML templates",
      "RESTful API with Gin framework",
      "Docker containerization",
      "Automated build process with Makefile"
    ],
    githubUrl: "https://github.com/QuocHuannn/go-to-work",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=train%20ticket%20booking%20system%20interface%20with%20schedule%20seat%20selection%20modern%20design&image_size=landscape_16_9",
    status: "completed",
    startDate: "2024-12",
    endDate: "2025-04",
    category: "web"
  },
  {
    id: "project-5",
    title: "NestProject - Recruitment System",
    description: "Modular backend system for recruitment, user management, and enterprise platforms",
    longDescription: "A comprehensive modular backend system built with NestJS for recruitment, user management, and enterprise platforms. Features JWT-based authentication, Mongoose data modeling, Swagger API documentation, and advanced backend architecture patterns.",
    technologies: ["NestJS", "TypeScript", "MongoDB (Mongoose)", "JWT Auth", "Swagger", "EJS"],
    features: [
      "Modular backend architecture with NestJS",
      "JWT-based authentication system",
      "MongoDB integration with Mongoose ODM",
      "Comprehensive API documentation with Swagger",
      "Soft delete functionality",
      "Environment-based configuration",
      "Seed data generation",
      "Centralized error handling",
      "EJS templating for server-side rendering"
    ],
    githubUrl: "https://github.com/QuocHuannn/nest-project",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=recruitment%20system%20dashboard%20with%20candidate%20profiles%20job%20listings%20modern%20interface&image_size=landscape_16_9",
    status: "completed",
    startDate: "2024-09",
    endDate: "2025-03",
    category: "api"
  },
  {
    id: "project-6",
    title: "AceSQL - Student Management with AI",
    description: "College graduation project: Student management system with AI-generated SQL questions",
    longDescription: "College graduation project developed by a team of 5 developers. A comprehensive student management website featuring AI-generated SQL questions using Hugging Face. Includes secure authentication, real-time analytics, dynamic email notifications, and advanced backend architecture.",
    technologies: ["Node.js", "Express.js", "Sequelize", "Passport.js", "JWT", "bcrypt", "Socket.io", "Nodemailer", "EJS", "PostgreSQL/MySQL", "Hugging Face"],
    features: [
      "Student management system with comprehensive features",
      "AI-generated SQL questions using Hugging Face",
      "Secure authentication with Passport.js and JWT",
      "Password hashing with bcrypt",
      "Real-time features with Socket.io",
      "Dynamic email notifications with Nodemailer",
      "Custom middleware implementation",
      "Real-time analytics and chart generation",
      "EJS templating for dynamic content",
      "Multi-database support (PostgreSQL/MySQL)"
    ],
    githubUrl: "https://github.com/QuocHuannn/ace-sql",
    imageUrl: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=student%20management%20system%20with%20ai%20sql%20questions%20dashboard%20analytics%20charts&image_size=landscape_16_9",
    status: "completed",
    startDate: "2024-02",
    endDate: "2024-06",
    category: "web"
  }
];

export const getProjectsByCategory = (category: Project['category']) => {
  return projects.filter(project => project.category === category);
};

export const getProjectsByStatus = (status: Project['status']) => {
  return projects.filter(project => project.status === status);
};

export const getFeaturedProjects = () => {
  return projects.filter(project => project.status === 'completed').slice(0, 3);
};