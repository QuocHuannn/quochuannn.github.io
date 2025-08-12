export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  phone?: string;
  location: string;
  avatar: string;
}

export const personalInfo: PersonalInfo = {
  name: "Truong Quoc Huan",
  title: "Fullstack Developer",
  bio: "A self-motivated fullstack developer with experience in microservices, DevOps, and cloud (AWS, Azure). Skilled in Go, JavaScript (NestJS, ExpressJS), Docker, and PostgreSQL. Eager to learn and contribute to real-world systems.",
  email: "truonghuan0709@gmail.com",
  github: "https://github.com/QuocHuannn",
  linkedin: "https://linkedin.com/in/truong-quoc-huan",
  phone: "+84 335 597 676",
  location: "Ho Chi Minh City, Viet Nam",
  avatar: "/images/avatar-new.jpg"
};