import React from 'react';
import { motion } from 'framer-motion';
import { experiences, formatDate } from '../../data/experience';
import { Calendar, MapPin, Building } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

const getColorStyles = (index: number) => {
  const colorVariants = [
    { bg: 'var(--color-primary)', text: 'var(--color-primary)', bgLight: 'var(--color-primary-muted)' },
    { bg: 'var(--color-success)', text: 'var(--color-success)', bgLight: 'var(--color-success-muted)' },
    { bg: 'var(--color-accent)', text: 'var(--color-accent)', bgLight: 'var(--color-accent-muted)' },
    { bg: 'var(--color-warning)', text: 'var(--color-warning)', bgLight: 'var(--color-warning-muted)' }
  ];
  return colorVariants[index % colorVariants.length];
};

const ExperienceSection: React.FC = () => {
  const backgroundStyles = {
    background: `
      linear-gradient(135deg, 
        var(--color-background) 0%, 
        var(--color-surface) 25%, 
        var(--color-surface-secondary) 50%, 
        var(--color-surface) 75%, 
        var(--color-background) 100%
      ),
      radial-gradient(circle at 20% 80%, var(--color-surface-glass) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, var(--color-primary-alpha) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, var(--color-secondary-alpha) 0%, transparent 50%)
    `
  };

  const { ref: sectionRef, inView: sectionInView } = useScrollAnimation();
  const { ref: titleRef, inView: titleInView } = useScrollAnimation({ threshold: 0.3 });
  const { ref: timelineRef, inView: timelineInView } = useScrollAnimation({ threshold: 0.1 });

  return (
    <motion.section 
      ref={sectionRef}
      id="experience" 
      className="section-container relative overflow-hidden"
      style={backgroundStyles}
      variants={sectionVariants}
      initial="hidden"
      animate={sectionInView ? "visible" : "hidden"}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(var(--color-text-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '3.5s' }} />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto relative z-10">
        <motion.div
          ref={titleRef}
          variants={itemVariants}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <h2 id="experience-heading" className="gradient-text mb-6">Experience & Education</h2>
          <p className="max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            My professional journey, educational background, and key achievements in software development.
          </p>
        </motion.div>
        
        <motion.div 
          ref={timelineRef}
          className="relative"
          variants={sectionVariants}
          initial="hidden"
          animate={timelineInView ? "visible" : "hidden"}
        >
          {/* Timeline Line */}
          <motion.div 
            className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-gradient-to-b from-accent-blue via-accent-green to-accent-purple h-full rounded-full"
            initial={{ scaleY: 0, originY: 0 }}
            animate={timelineInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          
          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => {
              const colorStyles = getColorStyles(index);
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={exp.id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: isLeft ? -100 : 100,
                      rotateY: isLeft ? -15 : 15,
                      scale: 0.8
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                      scale: 1,
                      transition: {
                        duration: 0.8,
                        delay: index * 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }
                    }
                  }}
                  className={`flex items-center flex-col md:flex-row ${!isLeft ? 'md:flex-row-reverse' : ''}`}
      
                >
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} text-left`}>
                    <div className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 rounded-xl backdrop-blur-sm border" style={{
                      backgroundColor: 'var(--color-surface-glass)',
                      borderColor: 'var(--color-border-glass)'
                    }}>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3" style={{
                        backgroundColor: colorStyles.bgLight,
                        color: colorStyles.text
                      }}>
                        {exp.type === 'work' ? <Building className="w-4 h-4 mr-1" /> : 
                         exp.type === 'education' ? <Calendar className="w-4 h-4 mr-1" /> : 
                         <MapPin className="w-4 h-4 mr-1" />}
                        {exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{exp.title}</h3>
                      <h4 className="text-lg font-medium mb-2" style={{ color: colorStyles.text }}>{exp.company}</h4>
                      
                      <div className="flex items-center mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
                      </div>
                      
                      {exp.location && (
                        <div className="flex items-center mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                      
                      <p className="mb-4 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{exp.description}</p>
                      
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className={`flex flex-wrap gap-2 justify-start ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                          {exp.technologies.map((tech) => (
                            <span 
                              key={tech}
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                backgroundColor: colorStyles.bgLight,
                                color: colorStyles.text
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <motion.div 
                    className="absolute left-4 md:relative md:left-0 w-4 h-4 rounded-full border-4 z-10 shadow-lg transform -translate-x-1/2 md:transform-none"
                    style={{ 
                      backgroundColor: colorStyles.bg,
                      borderColor: 'var(--color-background)' 
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={timelineInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                    {...getThemeAwareMotionProps({
                    whileHover: { scale: 1.3, boxShadow: `0 0 20px ${colorStyles.bg}40` },
                    transition: { duration: 0.15, ease: 'easeOut' }
                  })}
                  />
                  
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ExperienceSection;