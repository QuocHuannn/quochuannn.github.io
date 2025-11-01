import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projects, getFeaturedProjects } from '../../data/projects';
import { ExternalLink, Github, Star, Calendar } from 'lucide-react';
import LazyImage from '../ui/LazyImage';
import { generateSrcSet, generateSizes, getOptimalFormat } from '../../utils/imageOptimization';
import { useThemeClassName } from '../../hooks/useThemeSelectors';
import Container from '../ui/Container';
import Card from '../ui/Card';
import Button from '../ui/Button';

const getColorClass = (index: number) => {
  const colors = ['blue', 'green', 'purple', 'orange'];
  return colors[index % colors.length] as 'blue' | 'purple' | 'green' | 'orange' | 'pink';
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'completed': return { color: 'var(--color-success)', backgroundColor: 'var(--color-success-muted)' };
    case 'in-progress': return { color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-muted)' };
    case 'planned': return { color: 'var(--color-warning)', backgroundColor: 'var(--color-warning-muted)' };
    default: return { color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)' };
  }
};

const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [displayProjects, setDisplayProjects] = useState(getFeaturedProjects());
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const themeClassName = useThemeClassName();
  
  const categories = ['all', 'web', 'mobile', 'desktop', 'api'];
  
  const handleFilterChange = (category: string) => {
    setFilter(category);
    if (category === 'all') {
      setDisplayProjects(getFeaturedProjects());
    } else {
      setDisplayProjects(projects.filter(project => project.category === category));
    }
  };

  const backgroundStyles = {
    background: `
      linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 25%, var(--color-surface-secondary) 100%),
      radial-gradient(circle at 20% 80%, var(--color-surface-glass) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, var(--color-primary-alpha) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, var(--color-secondary-alpha) 0%, transparent 50%)
    `
  };

  return (
    <section id="projects" className={`section-container ${themeClassName}`} style={{
      ...backgroundStyles,
      color: 'var(--color-text-primary)'
    }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(var(--color-text-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Floating Elements */}
        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-blue-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400/20 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <Container size="xl" padding="lg" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 id="projects-heading" className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6" style={{
            backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Featured Projects</h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{
            color: 'var(--color-text-secondary)'
          }}>
            A showcase of my recent work and creative projects that demonstrate my skills and passion for development.
          </p>
        </motion.div>
        
        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8 md:mb-12"
        >
          <div className="flex flex-wrap gap-2 p-2 backdrop-blur-sm rounded-full max-w-full overflow-x-auto scrollbar-hide" style={{
            backgroundColor: 'var(--color-surface-glass)'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap"
                style={{
                  ...(filter === category ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-foreground)',
                    boxShadow: 'var(--shadow-lg)'
                  } : {
                    color: 'var(--color-text-secondary)'
                  })
                }}
                onMouseEnter={(e) => {
                  if (filter !== category) {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== category) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayProjects.map((project, index) => {
            const colorClass = getColorClass(index);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card variant="glass" padding="none" hoverable className="h-full flex flex-col overflow-hidden">
                  {project.imageUrl && (
                    <div className="relative overflow-hidden">
                      <LazyImage
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        srcSet={generateSrcSet(project.imageUrl, [320, 640, 768], getOptimalFormat())}
                        sizes={generateSizes({
                          '(max-width: 640px)': '100vw',
                          '(max-width: 1024px)': '50vw'
                        })}
                        width={400}
                        height={192}
                        quality={80}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3" style={{
                      color: 'var(--color-text-primary)'
                    }}>{project.title}</h3>
                    <p className="mb-4 text-sm md:text-base line-clamp-3 flex-grow leading-relaxed" style={{
                      color: 'var(--color-text-secondary)'
                    }}>{project.description}</p>
                    
                    {/* Technologies Section with better alignment */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 justify-start items-center min-h-[2rem]">
                          {project.technologies.slice(0, 3).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 text-xs rounded-full font-medium"
                              style={{
                                backgroundColor: 'var(--color-primary-muted)',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-primary-light)'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-3 py-1 text-xs rounded-full font-medium" style={{
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-text-muted)',
                              border: '1px solid var(--color-border)'
                            }}>
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action buttons with consistent alignment */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-base rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-2 hover:opacity-90 active:opacity-80 shadow-md hover:shadow-lg flex-1 sm:flex-none text-center"
                          style={{
                            backgroundColor: 'var(--color-accent-primary)',
                            color: 'var(--color-text-inverse)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderColor: 'var(--color-accent-primary)'
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </motion.a>
                      )}
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-base rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-2 hover:bg-[var(--color-hover-overlay)] active:bg-[var(--color-active-overlay)] flex-1 sm:flex-none text-center"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-primary)',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderColor: 'var(--color-border-secondary)'
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Github className="w-4 h-4" />
                          <span>Source Code</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>

            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="primary" size="lg">
            View All Projects
          </Button>
        </motion.div>
      </Container>
    </section>
  );
};

export default ProjectsSection;